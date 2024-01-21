// blatantly copied and adapted from https://dev.to/valeriavg/how-build-a-web-app-in-11-minutes-and-fall-in-love-with-sveltekit-1hof
export const initDB = () => {
  const data = {
    challenges: {},
    users: {},
  }

  const db = {
    challenges: new Map(Object.entries(data.challenges)),
    users: new Map(Object.entries(data.users)),
  }

  return db
}
