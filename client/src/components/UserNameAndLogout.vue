<template>
  <div class="user">
    <div>Hello, {{ userName }}!</div>
    <div class="logout" @click="logout">Log out</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import authMixin from '../authMixin'

export default {
  computed: {
    ...mapState('user', ['userName']),
    ...mapGetters('user', ['isLoggedIn'])
  },
  mixins: [authMixin],
  created() {
    this.checkLogin();
  },

  methods: {
    ...mapActions('user', ['logoutUser']),
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
