import axios from 'axios'
import Cookies from 'js-cookie'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },

  methods: {
    ...mapActions('user',['fetchUserName']),

    async checkLogin() {
      if (!this.isLoggedIn) {
      await this.fetchUserName()
      }
      if (!this.isLoggedIn) {
        this.$router.push('/');
      } else if (this.$route.path === '/') {
        this.$router.push('/planning');
      }
    }
  },

  created() {
    try {
      let token = localStorage.getItem('token');
      if (!token && this.$route.path === '/planning') {
        token = Cookies.get('token');
      }
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        Cookies.remove('token', { path: '/planning' });
      }
    } catch (error) {
      console.error('Error occurred', error);
    }
    this.checkLogin();
  },
  
}