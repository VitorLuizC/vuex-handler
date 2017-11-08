/**
 * Install this plugin on Vuex.Store.
 * @example ```js
 * new Vuex.Store({ plugins: [ handler ], ... })
 * ```
 * @param {Vuex.Store} store 
 */
const install = (store) => {
  const original = store.dispatch

  store.handler = {}

  store.dispatch = (type, ...params) => {
    const action = original.apply(store, [ type, ...params ])
    const { onFailure, onSuccess } = store.handler[type] || store.handler

    action
      .then((result) => Promise.resolve(
        onSuccess
          ? onSuccess(result, type, ...params)
          : result
      ))
      .catch((error) => Promise.resolve(
        onFailure
          ? onFailure(error, type, ...params)
          : Promise.reject(error)
      ))

    return action
  }
}

export default install
