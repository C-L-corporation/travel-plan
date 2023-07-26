import user from './user'
import data from './data'
import { createStore } from 'vuex'

const store = createStore({
  modules: { user, data }
})

export default store
