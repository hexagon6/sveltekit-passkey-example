import { convertChallenge, getNewChallenge } from '$lib/utils'
import { error, json } from '@sveltejs/kit'

const rpId = 'localhost'

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
    throw error(500, 'No username provided')
  }
  console.log(db.users)
  if (!db.users.has(username)) {
    throw error(404, 'Not Found')
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
