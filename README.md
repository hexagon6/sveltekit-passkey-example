# svelte-passkey-example

## description

This repository demonstrates usage and implementation of [passkeys](https://passkeys.dev/) with [sveltekit](DEVELOP.md)

## scope

experimentation, prototyping, not meant (yet!) for production usage

## status

This is a prototype at the current state in order to try out passkeys / passwordless login.

Please do not blame me if it does not work on your setup, it might require different settings for fido2Create & fido2Get functions.

This example only works with passkeys. Tested was a Yubico Yubikey 5.
I would like to test more. If you can reproduce it with another (e.g. Nitrokey), let me know by creating an issue.

## inspiration

Thanks to

- https://github.com/OwnID/passkeys/tree/develop
- https://simplewebauthn.dev/

it is possible to do passwordless login with the code provided here.

## TODO:

1. use environment variables for deployment under non-development environments (make rpId & expectedOrigin parameters configurable).
2. add sveltekit-node-adapter
