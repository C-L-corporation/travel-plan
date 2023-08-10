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
      if (!this.isLoggedIn && axios.defaults.headers.common.Authorization) {
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
        if(!axios.defaults.headers.common.Authorization){
          let token = localStorage.getItem('token');
           if (!token && this.$route.path === '/planning') {
              token = Cookies.get('token');
           }
           if (token) {
              localStorage.setItem('token', token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              Cookies.remove('token', { path: '/planning' });
           }  
        }
        this.checkLogin();
    } catch (error) {
      console.error('Error occurred', error);
    }
  },
  
}