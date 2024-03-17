import { RPID, EXPECTED_ORIGIN } from '$env/static/private'

export const rpId = RPID ?? 'localhost'
export const expectedOrigin = EXPECTED_ORIGIN ?? 'http://localhost:5173'
