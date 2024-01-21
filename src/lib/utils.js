// FIXME: use crypto instead of Math.random() if it turns out to be too weak randomness source
const getNewChallenge = () => Math.random().toString(36).substring(2)
const convertChallenge = (challenge) => btoa(challenge).replaceAll('=', '')
function uintToString(a) {
  // FIXME: use TextEncoder and TextDecoder to convert from base64url to string and back
  const base64string = btoa(String.fromCharCode(...a))
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const getRegistrationInfo = ({
  credentialPublicKey,
  counter,
  credentialID,
}) => {
  return {
    credentialID: uintToString(credentialID),
    credentialPublicKey: uintToString(credentialPublicKey),
    counter,
  }
}

function base64ToUint8Array(str) {
  // FIXME: use TextEncoder and TextDecoder to convert from base64url to string and back
  str = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  return new Uint8Array(
    Array.prototype.map.call(atob(str), (c) => c.charCodeAt(0)),
  )
}
const getSavedAuthenticatorData = ({
  credentialID,
  credentialPublicKey,
  counter,
}) => ({
  credentialID: base64ToUint8Array(credentialID),
  credentialPublicKey: base64ToUint8Array(credentialPublicKey),
  counter,
})

export {
  getNewChallenge,
  convertChallenge,
  getRegistrationInfo,
  getSavedAuthenticatorData,
}
