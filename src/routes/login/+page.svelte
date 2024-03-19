<script>
  import { fido2Get } from '@ownid/webauthn'
  // FROM: https://www.passkeys.com/guides

  $: loginStartResponse = undefined
  /** @type {import('@ownid/webauthn').IWebAuthnLoginRequest | undefined} **/
  $: fido2GetResult = undefined
  $: loginFinishResponse = undefined
  $: progress = 0
  $: showRegisterLink = false

  // call /login/start to verify public key
  const login = async () => {
    progress = 0
    await fetch('/login/start', {
      method: 'post',
      body: JSON.stringify({ username }),
    })
      .then(async (res) => res.json())
      .then(async (res) => {
        progress = 1
        loginStartResponse = res
        if (res.message) {
          console.error(res.message)
          showRegisterLink = true
          return
        }
        progress = 2
        const { challenge } = res
        console.log(res)
        const data = await fido2Get(res, username)
        console.log(data)
        fido2GetResult = data

        if (!data) {
          console.error('no data from fido2Get.. something went wrong?')
          return
        }
        progress = 3
        const finishBody = JSON.stringify({ ...data, challenge })
        await fetch('/login/finish', {
          method: 'post',
          body: finishBody,
        })
          .then((res) => res.json())
          .then((res) => {
            progress = 4
            loginFinishResponse = res
            if (res.message) {
              console.error(res.message)
              loginFinishResponse = res.message
              return
            }
            progress = 5
            if (res) {
              loginFinishResponse = res
              progress = 6
              loggedInAs = res.user
              alert(
                `Successfully authenticated as ${loggedInAs} using webAuthn`,
              )
            }
          })
          .catch(console.error)
      })
  }

  let username = ''
  let loggedInAs = ''
</script>

<header />
<main>
  <h2>User Login with passkey</h2>
  <form>
    <label for="username">Username:</label>
    <input
      name="username"
      id="loginform.username"
      type="text"
      bind:value={username}
      autocomplete="username webauthn"
    />
    <button on:click={login}>login</button>
  </form>
  {#if showRegisterLink}
    <p>
      <strong>{username}</strong> is not registered here
    </p>
    <a href="/register">Please register a User</a>
  {/if}
  {#if loggedInAs}
    <p>Logged in as {loggedInAs}</p>
  {/if}
  <hr />
  <aside>
    <label for="progress">Login Progress:</label>
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
    {#each [['/finish/start response:', loginFinishResponse], ['fido2Get Result:', fido2GetResult], ['/login/finish response:', loginFinishResponse]] as [heading, content]}
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
