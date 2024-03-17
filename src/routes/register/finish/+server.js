import { error } from '@sveltejs/kit'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { getRegistrationInfo } from '$lib/utils.js'
import { expectedOrigin } from '$lib/config.js'

/**
 * @param {any} event
 */
export async function POST(event) {
  const {
    request,
    locals: { db },
  } = event
  const { data: response, username } = await request.json()
  const expectedChallenge = db.challenges.get(username)
  let verification
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
    })
  } catch (err) {
    console.error(err)
    throw error(400, `${err.message}`)
  }
  const { verified, registrationInfo } = verification
  if (verified) {
    const { credentialID, credentialPublicKey, counter } =
      getRegistrationInfo(registrationInfo)
    console.log({ credentialID, credentialPublicKey, counter })
    db.users.set(username, { credentialID, credentialPublicKey, counter }) // rInfo
    // send http 200
    return new Response(JSON.stringify({ ok: true, user: username }))
  }
  throw error(500)
}
