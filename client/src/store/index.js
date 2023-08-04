import user from './user'
import data from './data'
import error from './error'
import { createStore } from 'vuex'

const store = createStore({
  modules: { user, data, error }
})

export default store
