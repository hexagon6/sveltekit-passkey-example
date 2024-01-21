<script>
  // FROM: https://www.passkeys.com/guides
  import { fido2Create } from '@ownid/webauthn'

  $: registerStartResponse = undefined
  $: fido2CreateResult = undefined
  $: registerFinishResponse = undefined
  $: progress = 0

  const register = async () => {
    progress = 0
    console.log('getting public key for user', username)
    await fetch('/register/start', {
      method: 'post',
      body: JSON.stringify({ username }),
    })
      .then(async (res) => res.json())
      .then(async (res) => {
        progress = 1
        if (res.message) {
          // FIXME: if we have an error on registration show it to the user
          console.error(res.message)
          registerStartResponse = res.message
          return
        }
        registerStartResponse = res
        const { challenge } = res
        const data = await fido2Create(res, username).catch(console.error)
        progress = 2
        fido2CreateResult = data

        if (!data) {
          console.error('no data from fido2Create.. something went wrong?')
          return
        }
        progress = 3
        const finishBody = JSON.stringify({ ...data, challenge })
        await fetch('/register/finish', {
          method: 'post',
          body: finishBody,
        })
          .then((res) => res.json())
          .then((res) => {
            progress = 4
            if (res.message) {
              console.error(res.message)
              registerFinishResponse = res.message
              return
            }
            progress = 5
            if (res) {
              registerFinishResponse = res
              progress = 6
              alert('Successfully created using webAuthn')
            }
          })
          .catch(console.error)
      })
      .catch(() => console.error)
  }

  let username = ''
</script>

<header />
<main>
  <h2>User Registration with passkey</h2>
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
  <hr />
  <aside>
    <label for="progress">Registration Progress:</label>
    <meter
      id="progress"
      min="0"
      max="6"
      low="2"
      high="4"
      optimum="6"
      value={progress}>at {progress}/6</meter
    >
  </aside>
  <div>
    {#each [['/register/start response:', registerStartResponse], ['fido2Create Result:', fido2CreateResult], ['/register/finish response:', registerFinishResponse]] as [heading, content]}
      <h3>{heading}</h3>
      <section>
        <textarea>{JSON.stringify(content, null, 2)}</textarea>
      </section>
    {/each}
  </div>
</main>

<style>
  textarea {
    width: 90%;
    min-height: 5em;
  }
</style>
