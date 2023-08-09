<script>
import TheFooter from '../src/components/TheFooter.vue'
import ErrorAlert from './components/ErrorAlert.vue'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'


export default {
  components: { TheFooter, ErrorAlert },

  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  methods: {
    ...mapActions('user', ['fetchUserName'])
  },

  created() {


    try {


      let token = localStorage.getItem('token')
      console.log('1', token)
      if (!token && this.$route.path === '/planning') {
        token = Cookies.get('token')
        console.log('2', token)
      }
      if (token) {
        localStorage.setItem('token', token)
        console.log('3', axios.defaults.headers.common.Authorization)
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
        Cookies.remove('token', { path: '/planning' })
      }


    } catch (error) {
      console.error('error occured', error)
    }
  },

  mounted() {
    const checkLoggin = async () => {
      await this.fetchUserName()
      console.log('fetch', this.fetchUserName)
      console.log('isLogg', this.isLoggedIn)
      if (!this.isLoggedIn) {
        this.$router.push('/')
      } else if (this.$route.path === '/') {
        this.$router.push('/planning')
      }
    }
    checkLoggin()

  }

}
</script>

<template>
  <ErrorAlert />
  <router-view></router-view>
  <TheFooter />
</template>
