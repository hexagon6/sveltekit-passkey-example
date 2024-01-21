import { initDB } from '$lib/db.js'

// Create a promise, therefore start execution
const setup = initDB()

export const handle = async ({ event, resolve }) => {
  // Ensure that the promise is resolved before the first request
  // It'll stay resolved for the time being
  const db = await setup
  event.locals['db'] = db
  console.log('hook', event.url.pathname)
  const response = await resolve(event)
  return response
}
