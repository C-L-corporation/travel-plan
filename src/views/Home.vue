<template>
  <div class="page">
    <img class="airplane" src="images/airplane.png" />
    <div class="title">Plan Your Trip Now!</div>
    <v-card class="login mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="subtitle">Google Login</div>
      <div class="subtitle">Facebook Login</div>
    </v-card>
    <router-link to="/planning">
      <v-btn>Log In</v-btn>
    </router-link>
  </div>
</template>

<script></script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
  background-image: url('/images/linepaper.png');
  background-position: center;
  position: relative;
}

.login {
  margin: 80px;
}
.title {
  font-family: 'Satisfy', cursive;
  font-size: 80px;
  margin-top: 150px;
}
.subtitle {
  font-family: 'Handlee', cursive;
  font-size: 20px;
}

.airplane {
  position: absolute;
  top: -200px;
  left: 500px;
}
</style>
