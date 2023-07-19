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
          console.log(response.data)
          commit('setUserName', response.data.username)
        })

        .catch((error) => {
          console.error(error)
        })
    }
  }
}

export default user
