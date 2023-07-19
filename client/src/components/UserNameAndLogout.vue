<template>
  <div class="user">
    <div>Hello, {{ userName }}!</div>
    <a class="logout" href="">Log out</a>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user',['userName'])
  },
  created() {
    this.fetchUserName()
  },
  methods: {
    ...mapActions('user', ['fetchUserName'])
  }
}
// import axios from 'axios'

// export default {
//   data() {
//     return {
//       userName: ''
//     }
//   },
//   created() {
//     this.fetchUserName()
//   },
//   methods: {
//     fetchUserName() {
//       axios
//         .get('/api/auth/me')
//         .then((response) => {
//           this.userName = response.data.username
//         })
//         .catch((error) => {
//           console.error(error)
//         })
//     }
//   }
// }
</script>

<style scoped>
.user {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 10px;
  font-family: 'Handlee', cursive;
  font-size: 20px;
  color: #3b342a;
}

.logout {
  color: #b4b17e;
}

.logout:hover {
  color: #3d8994;
}
</style>
