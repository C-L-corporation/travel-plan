<template>
  <div class="page">
    <div class="title">Plan Your Trip Now!</div>
    <div class="login mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <GoogleLoginButton />
      <FacebookLoginButton />
    </div>
  </div>
  <img class="airplane" src="/images/airplane.png" />
  <img class="tag" src="/images/tag.png" />
</template>

<script>
import GoogleLoginButton from '../components/GoogleLoginButton.vue'
import FacebookLoginButton from '../components/FacebookLoginButton.vue'

export default {
  components: {
    GoogleLoginButton,
    FacebookLoginButton
  }
}
</script>

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
  color: #3b342a;
  margin-top: 150px;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/images/contentpaper.png');
  background-size: cover;
  width: 450px;
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
