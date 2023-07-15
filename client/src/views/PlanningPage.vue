<template>
  <div class="page">
    <div class="title">Let's plan !</div>
    <div class="content">
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
        <div>Days of trip</div>
        <v-select
          class="selectors"
          label="Days"
          :items="['1', '2', '3', '4', '5', '6', '7']"
          variant="solo"
        ></v-select>
      </div>

      <div class="contentpaper">
        <div>Transportation</div>
        <v-select
          class="selectors"
          label="By"
          :items="['Car', 'Public Transportation']"
          variant="solo"
        ></v-select>
      </div>

      <div class="contentpaper">
        <div>Hotel location (expectation)</div>
        <v-select
          class="selectors"
          label="Choose a place"
          :items="[
            'Shinjuku Area (West)',
            'Minato Area (South)',
            'Chuo Area (East)',
            'Taito Area (North)'
          ]"
          variant="solo"
        ></v-select>
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

    <img class="suitcase" src="/images/suitcase.png" />
    <img class="camera" src="/images/camera.png" />
    <img class="pic4" src="/images/pic4.png" />
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
  background-image: url('/images/paper.png');
  background-position-x: 50%;
  background-size: 65% 100%;
}

.title {
  font-family: 'Satisfy', cursive;
  font-size: 80px;
  color: #3b342a;
  margin-top: 80px;
}
.content {
  font-family: 'Handlee', cursive;
  font-size: 25px;
  font-weight: bold;
  color: #3b342a;
  width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.contentpaper {
  background-image: url('images/contentpaper.png');
  background-position: center;
  background-size: 70%;
  width: 800px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.choosing {
  background-image: url('/images/note.png');
  background-position-x: 60%;
  background-position-y: 7%;
  background-size: 90%;
  width: 600px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
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
  width: 300px;
  height: 100px;
}

.suitcase {
  position: absolute;
  bottom: 10px;
  left: 50px;
  width: 300px;
}

.camera {
  position: absolute;
  top: 150px;
  right: 150px;
}

.pic4 {
  position: absolute;
  bottom: -700px;
  right: 0px;
  width: 450px;
}
</style>
