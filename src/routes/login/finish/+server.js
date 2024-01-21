import { error, json } from '@sveltejs/kit'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { getSavedAuthenticatorData } from '$lib/utils.js'

const rpId = 'localhost'
const expectedOrigin = 'http://localhost:5173'

/**
 * @param {{ request: Request; locals: { db: any; }; }} event
 */
export async function POST(event) {
  const {
    request,
    locals: { db },
  } = event
  const { username, data, challenge } = await request.json()
  if (!username) {
    throw error(500, 'No username provided')
  }
  console.log(db.users)
  if (!db.users.has(username)) {
    throw error(404, 'Not Found')
  }

  let verification = { verified: false }
  try {
    const user = db.users.get(username)
    verification = await verifyAuthenticationResponse({
      expectedChallenge: db.challenges.get(username),
      response: data,
      authenticator: getSavedAuthenticatorData(user),
      expectedRPID: rpId,
      expectedOrigin,
      // HINT: https://github.com/MasterKale/SimpleWebAuthn/issues/477#issuecomment-1811639430
      requireUserVerification: false,
    })
  } catch (err) {
    console.error(err)
    throw error(400, err.message)
  }

  const { verified } = verification
  if (verified) {
    return json({ ok: true, user: username })
  }
  throw error(400)
}
