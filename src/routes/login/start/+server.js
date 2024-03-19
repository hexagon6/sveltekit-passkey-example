import { convertChallenge, getNewChallenge } from '$lib/utils'
import { error, json } from '@sveltejs/kit'
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
  console.log(db.users)
  if (!db.users.has(username)) {
    error(404, 'Not Found')
  }

  const challenge = getNewChallenge()

  db.challenges.set(username, convertChallenge(challenge))

  return json({
    challenge,
    rpId,
    allowCredentials: [
      {
        type: 'public-key',
        id: db.users.get(username).credentialID,
        transports: ['internal'],
      },
    ],
    userVerification: 'discouraged',
  })
}
