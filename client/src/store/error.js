const error ={
  namespaced: true,

  state(){
    return {
      error: null
    }
  },
  mutations: {
    setError(state, errorMessage) {
      state.error = errorMessage;
    },
    clearError(state) {
      state.error = null;
    },
  },

}

export default error