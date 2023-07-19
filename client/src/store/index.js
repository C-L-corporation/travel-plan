import user from './user'
import { createStore } from 'vuex'

const store = createStore({
  modules: { user }
})

export default store
