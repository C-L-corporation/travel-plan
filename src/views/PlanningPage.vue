<template>
  <div class="page">
    <div class="title">Let's plan !</div>
    <div class="content">
      <div>Your Name</div>
      <v-text-field label="Name" variant="solo"></v-text-field>
      <div>Place you want to explore</div>
      <v-select
        label="Choose a place"
        :items="['Tokyo', 'Los Angeles', 'Paris']"
        variant="solo"
      ></v-select>
      <div>How long will you stay</div>
      <v-text-field label="Days" variant="solo"></v-text-field>
      <div>What you want to See</div>
      <TravelStyle />
      <div>What you want to Eat</div>
      <ChooseEat />
    </div>
    <v-btn class="button" size="x-large">Create !</v-btn>
  </div>
</template>

<script>
import TravelStyle from '../components/TravelStyle.vue'
import ChooseEat from '../components/ChooseEat.vue'

export default {
  components: {
    TravelStyle,
    ChooseEat
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  text-align: center;
}

.title {
  font-family: 'Satisfy', cursive;
  font-size: 80px;
}
.content {
  font-family: 'Handlee', cursive;
  font-size: 20px;
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
}

.button {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  background-color: #3d8994;
}
</style>
