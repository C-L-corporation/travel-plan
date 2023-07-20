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
    }
  }
}

export default user
