import { error } from '@sveltejs/kit'

/**
 * @param {any} event
 */
export function GET(event) {
  console.log(event)
  //   throw error(404, 'Not Found')
  return new Response(JSON.stringify({ message: 'login start' }))
}
