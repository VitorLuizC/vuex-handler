# Vuex-Handler

Avoid `try/catch` or `.catch(error => ...)` and globally handle successful and
failed actions like the example below.

```js
...

// Here some pretty actions without error handlers
export const actions = {
  [types.USER]: async ({ commit }, payload) => {
    const { data: user } = await axios.get(`/user/${payload.id}`)
    commit(types.USER, user)
  },
  [types.USER_SIGNIN]: async ({ dispatch }, payload) => {
    const { data: id } = await axios.post('/sign-in', payload)
    dispatch(types.USER, { id })
  },
  [types.USER_SIGNON]: async ({ dispatch }, payload) => {
    const { data: user } = await axios.post('/sign-in', payload)
    dispatch(types.USER, user)
  },
  ...
}
```

```js
...

import Vuex from 'vuex'
import handler from 'vuex-handler'

const store = new Vuex.Store({
  mixins: [ handler ],
  modules: { user }
})

// Those handlers are dispatch interceptors that run when it finishes or fail
store.handler = {
  onSuccess (result, type, params, options) {
    // I could use this to show some feedback message based on action type like:
    const messages = {
      [types.USER_SIGNON]: 'Now U\'re an user!',
      [types.USER_SIGNOFF]: 'Sorry :('
    }

    if (messages[type]) {
      store.dispatch(types.NOTIFICATION, messages[type])
    }

    // If your action return some result, you should return it too!
    return result
  },
  onFailure (error, type, params, options) {
    // I can send my errors to a logger like Rollbar
    Rollbar.error(`Action ${type}`, error)
  },

  // Specific handlers overrides global handlers and work exactly like them
  [types.USER_SIGNIN]: {
    onSuccess (result, type, params, options) {
      ...
    },
    onFailure (error, type, params, options) {
      ...
    }
  }
}

export default store
```
