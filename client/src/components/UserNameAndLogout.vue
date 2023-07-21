<template>
  <div class="user">
    <div>Hello, {{ userName }}!</div>
    <div class="logout" @click="logout">Log out</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'

export default {
  computed: {
    ...mapState('user', ['userName'])
  },
  created() {
    this.fetchUserName()
  },
  methods: {
    ...mapActions('user', ['fetchUserName','logoutUser']),
    logout() {
      this.logoutUser;
     
     
    }
  }
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
