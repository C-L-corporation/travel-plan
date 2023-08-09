<template>
  <div class="user">
    <div>Hello, {{ userName }}!</div>
    <div class="logout" @click="logout">Log out</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  computed: {
    ...mapState('user', ['userName']),
    ...mapGetters('user', ['isLoggedIn'])
  },
  async created() {
    try {
      if (this.$route.path === '/planning') {
        let token = localStorage.getItem('token')
        console.log('1', token)
        if (!token) {
          token = Cookies.get('token')
          console.log('2', token)
        }
        if (token) {
          localStorage.setItem('token', token)
          console.log('3', axios.defaults.headers.common.Authorization)
          axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
          Cookies.remove('token', { path: '/planning' })
          await this.fetchUserName()
        }
      }

    } catch (error) {
      console.error('error occured', error)
    }
  },

  methods: {
    ...mapActions('user', ['fetchUserName', 'logoutUser']),
    logout() {
      this.logoutUser();
      this.$router.push('/')
    }
  },

}
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
  cursor: pointer;
}

.logout:hover {
  color: #3d8994;
}

@media (max-width: 768px) {
  .user {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin: 10px;
    font-family: 'Handlee', cursive;
    font-size: 15px;
    color: #3b342a;
  }
}
</style>
