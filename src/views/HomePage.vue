<template>
  <div class="page">
    <div class="title">Plan Your Trip Now!</div>
    <v-card class="login mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="subtitle">Google Login</div>
      <div class="subtitle">Facebook Login</div>
    </v-card>
    <router-link to="/planning">
      <v-btn class="button">Log In</v-btn>
    </router-link>
  </div>
  <img class="airplane" src="images/airplane.png" />
  <img class="tag" src="images/tag.png" />
</template>

<script></script>

<style scoped>
.page {
  background-image: url('/images/linepaper.png');
  background-position: center;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-family: 'Satisfy', cursive;
  font-size: 80px;
  margin-top: 150px;
}
.login {
  margin: 80px;
}

.subtitle {
  font-family: 'Handlee', cursive;
  font-size: 20px;
}

.airplane {
  position: absolute;
  top: -50px;
  left: 500px;
}

.tag {
  position: absolute;
  width: 400px;
  top: 300px;
  right: 100px;
}
</style>
