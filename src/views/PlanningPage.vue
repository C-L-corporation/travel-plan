<template>
  <div class="page">
    <div class="title">Let's plan !</div>
    <div class="content">
      <div class="contentpaper">
        <div>Your Name</div>
        <v-text-field class="selectors" label="Name" variant="solo"></v-text-field>
      </div>

      <div class="contentpaper">
        <div>Place you want to explore</div>
        <v-select
          class="selectors"
          label="Choose a place"
          :items="['Tokyo', 'Los Angeles', 'Paris']"
          variant="solo"
        ></v-select>
      </div>

      <div class="contentpaper">
        <div>How long will you stay</div>
        <v-text-field class="selectors" label="Days" variant="solo"></v-text-field>
      </div>

      <div class="choosing">
        <div>What you want to See</div>
        <TravelStyle />
      </div>

      <div class="choosing">
        <div>What you want to Eat</div>
        <ChooseEat />
      </div>
    </div>

    <router-link to="/itinerary">
      <v-btn class="button" size="x-large">Create !</v-btn>
    </router-link>
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
  font-weight: bold;
  font-size: 25px;
  width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.contentpaper {
  background-image: url('images/linepaper.png');
  background-position-y: center;
  background-size: cover;
  width: 800px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.choosing {
  background-image: url('images/linepaper.png');
  background-position-y: center;
  background-size: cover;
  width: 800px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  background-color: #3d8994;
}

.selectors {
  width: 400px;
}
</style>
