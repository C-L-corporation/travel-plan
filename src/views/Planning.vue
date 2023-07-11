<template>
  <div class="page">
    <div class="content">
      <div class="title">Let's plan!</div>
      <div>Your Name</div>
      <v-text-field label="Name" variant="solo"></v-text-field>
      <div>Place</div>
      <v-select
        label="Choose a place"
        :items="['Tokyo', 'Los Angeles', 'Paris']"
        variant="solo"
      ></v-select>
      <div>Days</div>
      <v-text-field label="Days" variant="solo"></v-text-field>
      <div>Style</div>
      <TravelStyle />
      <div>Eat</div>
      <ChooseEat />
    </div>
  </div>
  <div class="button"><v-btn>Create Your Own Itinerary!</v-btn></div>
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
  margin-top: 200px;
}

.title {
  font-family: 'Satisfy', cursive;
  font-size: 80px;
}
.content {
  font-family: 'Handlee', cursive;
  font-size: 20px;
}

.button {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
