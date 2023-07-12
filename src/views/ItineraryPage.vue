<template>
  <div class="top">
    <div>Christine's</div>
    <img class="line" src="images/line.png" />
    <div class="subtitle">5 DAYS TRIP</div>
    <div>Tokyo Itinerary</div>
  </div>
  <div>
    <TimeLine />
  </div>
</template>

<script>
import TimeLine from '../components/TimeLine.vue'

export default {
  components: { TimeLine }
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
</style>
