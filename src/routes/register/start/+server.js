import { error, json } from '@sveltejs/kit'
import { getNewChallenge, convertChallenge } from '$lib/utils.js'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { rpId } from '$lib/config.js'

/**
 * @param {any} event
 */
export async function POST(event) {
  const {
    request,
    locals: { db },
  } = event
  const { username } = await request.json()
  if (!username) {
    error(500, 'No username provided')
  }
  if (db.challenges.has(username)) {
    error(409, `User "${username}" already exists`)
  }

  const challenge = getNewChallenge()
  console.log('challenge:', challenge, typeof challenge)
  const pubKey = await generateRegistrationOptions({
    rpID: rpId,
    rpName: 'webauthn-app',
    userID: username,
    userName: username,
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform', // 'platform',
      // https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
      userVerification: 'preferred', // 'required',
      residentKey: 'required', // 'preferred',
      requireResidentKey: false,
    },
  })

  db.challenges.set(username, convertChallenge(challenge))

  return json({ ...pubKey, challenge })
}
