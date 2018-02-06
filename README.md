# Vuex-Handler

Avoid `try/catch` or `.catch(error => ...)` and globally handle successful and
failed actions.

## Install

- Install using `npm` or `yarn`.

  ```sh
  npm i vuex-handler

  # or using yarn
  yarn add vuex-handler
  ```

- Add to Vuex plugins.

  ```js
  import Vuex from 'vuex'
  import handler from 'vuex-handler'

  const store = new Vuex.Store({
    plugins: [ handler ]
  })
  ```

## Usage

```js
const store = new Vuex.Store({
  plugins: [ handler ],

  ...,

  actions: {
    authenticate: async ({ commit }, payload) => {
      const { email, password } = payload || {}
      const { data: token } = await axios.get('/auth', { email, password })
      return token
    }
  }
}

// This logs all sucessed actions.
store.handler.onSuccess = (result, type, params) => {
  console.log(result) // 'eyJhb...' 'authenticate' { email: '...', password: '...' }
  return result
}

// This logs all failed actions.
store.handler.onFailure = (error, type, params) => {
  console.log(error) // Error 'authenticate' { email: '...', password: '...' }
  throw error
}

// Alerts authenticate errors
// Don't use alerts, please.
store.handler.authenticate.onFailure = (error) => {
  alert('Error on authenticate: ' + error.message)
  return false
}
```

## Real world example

```js
...

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
