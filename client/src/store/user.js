import axios from 'axios'

const user = {
  namespaced: true,

  state() {
    return {
      userName: null
    }
  },
  mutations: {
    setUserName(state, userName) {
      state.userName = userName
    },
    clearUserData(state) {
      state.userName = null
    }
  },

  getters: {
    isLoggedIn(state) {
      return state.userName !== null;
    }
  },
  actions: {
    fetchUserName({ commit, dispatch }) {
      return axios
        .get('/api/auth/me')
        .then((response) => {
          commit('setUserName', response.data.name)
        })
        .catch((error) => {
          // token expired
          if (error.response.status === 401) {
            dispatch('logoutUser')
          }
          console.error(error)
        })
    },
   

    logoutUser({ commit }) {
      axios.defaults.headers.common['Authorization'] = undefined;
      localStorage.clear()
      commit('clearUserData');      
    }
}
}

export default user
