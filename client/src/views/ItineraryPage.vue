<template>
  <UserNameAndLogout />
  <div class="top">
    <div>{{ userName }}'s</div>
    <img class="line" src="/images/line.png" />
    <div class="subtitle">5 DAYS TRIP</div>
    <div>Tokyo Itinerary</div>
    <img class="airplane" src="/images/airplane.png" />
    <img class="bagcoffee" src="/images/bagcoffee.png" />
  </div>
  <div>
    <TimeLine />
  </div>
</template>

<script>
import axios from 'axios'
import TimeLine from '../components/TimeLine.vue'
import UserNameAndLogout from '../components/UserNameAndLogout.vue'

export default {
  components: { TimeLine, UserNameAndLogout },
  data() {
    return {
      userName: ''
    }
  },
  created() {
    this.fetchUserName()
  },
  methods: {
    fetchUserName() {
      axios
        .get('/api/auth/me')
        .then((response) => {
          this.userName = response.data.username
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}
</script>

<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 150px auto 20px;
  font-family: 'Satisfy', cursive;
  font-size: 50px;
  text-align: center;
  color: #3b342a;
  background-color: #ffffff;
  width: 70%;
}

.subtitle {
  font-family: 'Handlee', cursive;
  font-size: 30px;
}

.line {
  text-align: center;
  height: 20px;
  width: 250px;
}

.airplane {
  position: absolute;
  top: -50px;
  right: 150px;
}
.bagcoffee {
  position: absolute;
  bottom: -300px;
  left: 50px;
  width: 250px;
}
</style>
