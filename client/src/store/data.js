
const data = {
  namespaced: true,

    state() {
        return {
            selectedData: null
        }
      },

      getters: {
        getSelectedData(state) {
          return state.selectedData;
        }
      },

      mutations: {
        setSelectedData(state, data) {
            state.selectedData = data
            console.log('vuex',data)
          }
      },
     
    
}
export default data;