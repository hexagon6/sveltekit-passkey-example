//inlined from @ownid/webauthn because it broke and no source is available
export function uintToString(uintArray) {
  var encodedString = String.fromCharCode.apply(null, uintArray),
    decodedString = decodeURIComponent(escape(encodedString))
  return decodedString
}
export function utf8ToUint8Array(str) {
  str = btoa(unescape(encodeURIComponent(str)))
  return base64ToUint8Array(str)
}
export function base64ToUint8Array(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  return new Uint8Array(
    Array.prototype.map.call(atob(str), (c) => c.charCodeAt(0)),
  )
}
export function arrayBufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
export function bufferToBase64Url(buffer) {
  const x = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  return x.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
}
export function uint8ArrayToBase64(a) {
  const base64string = btoa(String.fromCharCode(...a))
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
export function ConvertPubKeyToLoginFormat(publicKey) {
  publicKey.allowCredentials[0].id = publicKey.allowCredentials[0].id.replace(
    '=',
    '',
  )
  publicKey.allowCredentials[0].id = base64ToUint8Array(
    publicKey.allowCredentials[0].id,
  )
  publicKey.challenge = utf8ToUint8Array(publicKey.challenge)
  return publicKey
}
export function ConvertPubKeyToRegisterFormat(publicKey) {
  publicKey.challenge = utf8ToUint8Array(publicKey.challenge)
  publicKey.user.id = utf8ToUint8Array(publicKey.user.id)
  return publicKey
}

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
export function fido2Get(publicKey, username) {
  return __awaiter(this, void 0, void 0, function* () {
    publicKey = ConvertPubKeyToLoginFormat(publicKey)
    const credential = yield navigator.credentials.get({ publicKey })
    const { authenticatorData, clientDataJSON, signature } = credential.response
    return {
      username: username,
      data: {
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type,
        id: credential.id,
        response: {
          signature: bufferToBase64Url(signature),
          authenticatorData: bufferToBase64Url(authenticatorData),
          clientDataJSON: bufferToBase64Url(clientDataJSON),
        },
      },
    }
  })
}
export function fido2Create(publicKey, username) {
  return __awaiter(this, void 0, void 0, function* () {
    publicKey = ConvertPubKeyToRegisterFormat(publicKey)
    const credential = yield navigator.credentials.create({ publicKey })
    const { attestationObject, clientDataJSON } = credential.response
    return {
      username,
      data: {
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type,
        id: credential.id,
        response: {
          attestationObject: bufferToBase64Url(attestationObject),
          clientDataJSON: bufferToBase64Url(clientDataJSON),
        },
      },
    }
  })
}
