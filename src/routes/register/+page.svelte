<script>
  // FROM: https://www.passkeys.com/guides
  import { fido2Create } from '@ownid/webauthn'

  $: registerStartResponse = undefined
  $: fido2CreateResult = undefined
  $: registerFinishResponse = undefined

  const register = async () => {
    console.log('getting public key for user', username)
    await fetch('/register/start', {
      method: 'post',
      body: JSON.stringify({ username }),
    })
      .then(async (res) => res.json())
      .then(async (res) => {
        if (res.message) {
          // FIXME: if we have an error on registration show it to the user
          console.error(res.message)
          registerStartResponse = res.message
          return
        }
        registerStartResponse = res
        const { challenge } = res
        const data = await fido2Create(res, username).catch(console.error)
        fido2CreateResult = data

        if (!data) {
          console.error('no data from fido2Create.. something went wrong?')
          return
        }
        const finishBody = JSON.stringify({ ...data, challenge })
        await fetch('/register/finish', {
          method: 'post',
          body: finishBody,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message) {
              console.error(res.message)
              registerFinishResponse = res.message
              return
            }
            if (res) {
              registerFinishResponse = res
              alert('Successfully created using webAuthn')
            }
          })
          .catch(console.error)
      })
      .catch(() => console.error)
  }

  let username = ''
</script>

<form>
  <label for="username">Username:</label>
  <input
    name="username"
    id="loginform.username"
    type="text"
    bind:value={username}
    autocomplete="username webauthn"
  />
  <button on:click={register}>register</button>
</form>
/register/start response:
<textarea>{JSON.stringify(registerStartResponse, null, 2)}</textarea>
fido2Create Result:
<textarea>{JSON.stringify(fido2CreateResult, null, 2)}</textarea>
/register/finish response:
<textarea class="small"
  >{JSON.stringify(registerFinishResponse, null, 2)}</textarea
>

<style>
  textarea {
    width: 90%;
    min-height: 12em;
  }

  textarea.small {
    min-height: 5em;
  }
</style>
