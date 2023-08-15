<template>
  <UserNameAndLogout />
  <div class="top">
    <div>{{ userName }}'s</div>
    <img class="line" src="/images/line.png" />
    <div class="subtitle">{{ selectedData.day }} DAYS TRIP</div>
    <div>{{ selectedData.place }} Itinerary</div>
    <img class="airplane" src="/images/airplane.png" />
    <img class="bagcoffee" src="/images/bagcoffee.png" />
  </div>
  <div>
    <TimeLine />
  </div>
</template>

<script>
import TimeLine from '../components/TimeLine.vue'
import UserNameAndLogout from '../components/UserNameAndLogout.vue'
import { mapState, mapGetters } from 'vuex'
import authMixin from '../authMixin'

export default {
  components: { TimeLine, UserNameAndLogout },
  mixins: [authMixin],
  computed: {
    ...mapState('user', ['userName']),
    ...mapState('data', ['selectedData']),
    ...mapGetters('user', ['isLoggedIn']),
  },
  created() {
    if (!this.isLoggedIn) {
      this.$router.push('/')
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


/* images */
.line {
  text-align: center;
  height: 20px;
  width: 250px;
}

.airplane {
  position: absolute;
  width: 320px;
  top: 20px;
  right: 80px;
}

.bagcoffee {
  position: absolute;
  width: 200px;
  bottom: -200px;
  left: 50px;
}

@media (max-width: 920px) {
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto 10px;
    font-family: 'Satisfy', cursive;
    font-size: 30px;
    text-align: center;
    color: #3b342a;
    background-color: #ffffff;
    width: 70%;
  }

  .subtitle {
    font-family: 'Handlee', cursive;
    font-size: 25px;
  }

  /* images */
  .line {
    text-align: center;
    height: 20px;
    width: 250px;
  }

  .airplane {
    position: absolute;
    top: 25px;
    width: 250px;
  }

  .bagcoffee {
    display: none;
  }
}

@media (max-width: 768px) {
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto 10px;
    font-family: 'Satisfy', cursive;
    font-size: 30px;
    text-align: center;
    color: #3b342a;
    background-color: #ffffff;
    width: 70%;
  }

  .subtitle {
    font-family: 'Handlee', cursive;
    font-size: 20px;
  }

  /* images */
  .line {
    text-align: center;
    height: 20px;
    width: 250px;
  }

  .airplane {
    position: absolute;
    top: 25px;
    right: 0px;
    width: 180px;
  }

  .bagcoffee {
    display: none;
  }
}
</style>
