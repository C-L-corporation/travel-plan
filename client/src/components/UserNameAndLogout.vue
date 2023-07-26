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
        const token = Cookies.get('token')
        axios.defaults.headers.common = { Authorization: `bearer ${token}` }
        Cookies.remove('token', { path: '/planning' })
        await this.fetchUserName()
      }

      if (!this.isLoggedIn) {
        this.$router.push('/')
      }
    } catch (error) {
      console.error('error occured', error)
    }
  },

  methods: {
    ...mapActions('user', ['fetchUserName', 'logoutUser']),
    logout() {
      this.logoutUser();
    }
  },
  watch: {
    isLoggedIn(loggedIn) {
      if (!loggedIn) {
        this.$router.push('/')
      }
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
</style>
