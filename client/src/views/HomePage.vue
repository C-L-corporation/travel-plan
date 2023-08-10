<template>
  <div class="page">
    <div class="title">Plan Your Trip Now!</div>
    <div class="login">
      <GoogleLoginButton />
      <!-- <FacebookLoginButton /> -->
    </div>
  </div>
  <img class="airplane" src="/images/airplane.png" />
  <img class="tag" src="/images/tag.png" />
</template>

<script>
import GoogleLoginButton from '../components/GoogleLoginButton.vue'
// import FacebookLoginButton from '../components/FacebookLoginButton.vue'
import authMixin from '../authMixin'

export default {
  components: {
    GoogleLoginButton,
    // FacebookLoginButton
  },
  mixins: [authMixin],
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
  width: 600px;
  height: 200px;
  margin: 40px;
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


@media (max-width: 768px) {
  .page {
    background-image: url('/images/linepaper.png');
    background-position: cover;
    background-size: 100% 350px;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-family: 'Satisfy', cursive;
    font-size: 30px;
    color: #3b342a;
    margin-top: 80px;
  }

  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('/images/contentpaper.png');
    background-position: cover;
    width: 250px;
    height: 120px;
  }

  /* images */
  .airplane {
    position: absolute;
    width: 180px;
    top: 20px;
    left: 40px;
  }

  .tag {
    position: absolute;
    width: 130px;
    top: 180px;
    right: 0px;
  }
}
</style>
