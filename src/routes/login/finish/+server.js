import { error, json } from '@sveltejs/kit'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { getSavedAuthenticatorData } from '$lib/utils.js'
import { expectedOrigin, rpId } from '$lib/config.js'

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
    error(500, 'No username provided')
  }
  console.log(db.users)
  if (!db.users.has(username)) {
    error(404, 'Not Found')
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
    error(400, err.message)
  }

  const { verified } = verification
  if (verified) {
    return json({ ok: true, user: username })
  }
  error(400)
}
