import axios from 'axios'

const user = {
  namespaced: true,

  state() {
    return {
      userName: ''
    }
  },
  mutations: {
    setUserName(state, userName) {
      state.userName = userName
    },
    clearUserData(state) {
      state.userName = ''
    }
  },
  actions: {
    fetchUserName({ commit }) {
      return axios
        .get('/api/auth/me')
        .then((response) => {
          commit('setUserName', response.data.name)
        })

        .catch((error) => {
          console.error(error)
        })
    },
    logoutUser({ commit }) {
      axios.defaults.headers.common['Authorization'] = '';
      commit('clearUserData');      
    }
}
}

export default user
