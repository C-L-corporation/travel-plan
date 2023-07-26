<template>
  <UserNameAndLogout />
  <div class="page">
    <div class="title">Let's plan !</div>
    <div class="content">
      <div class="contentpaper">
        <div>Place you want to explore</div>
        <v-select class="selectors" label="Choose a place" v-model="selectPlace" :items="places"
          variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>Days of trip</div>
        <v-select class="selectors" label="Days" v-model="selectDay" :items="days" variant="solo"></v-select>

      </div>

      <div class="contentpaper">
        <div>Transportation</div>
        <v-select class="selectors" label="By" v-model="selectTran" :items="transportations" variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>Hotel location</div>
        <v-select class="selectors" label="Choose a place" v-model="selectHotel" :items="hotels"
          variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>What you want to See</div>
        <v-select class="selectors" v-model="selectSites" :items="sites" variant="solo" label="Sites(multiple)"
          multiple></v-select>
      </div>

      <div class="contentpaper">
        <div>What you want to Eat</div>
        <v-select class="selectors" v-model="selectFoods" :items="foods" variant="solo" label="Foods(multiple)"
          multiple></v-select>
      </div>
    </div>


    <router-link to="/itinerary">
      <v-btn class="button" size="x-large" @click="createItinerary">Create !</v-btn>
    </router-link>

    <img class="suitcase" src="/images/suitcase.png" />
    <img class="camera" src="/images/camera.png" />
    <img class="pic4" src="/images/pic4.png" />
  </div>
</template>

<script>
import UserNameAndLogout from '../components/UserNameAndLogout.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    UserNameAndLogout
  },

  data() {
    return {
      selectPlace: null,
      places: ['Tokyo', 'Los Angeles', 'Paris'],
      selectDay: null,
      days: ['1', '2', '3', '4', '5', '6', '7'],
      selectTran: null,
      transportations: ['Car', 'Public Transportation'],
      selectHotel: null,
      hotels: [
        'Shinjuku Area (West)',
        'Minato Area (South)',
        'Chuo Area (East)',
        'Taito Area (North)'
      ],
      selectSites: null,
      sites: ['Shopping', 'Historic Site', 'Nature', 'Museum', 'Aqurium', 'Animals', 'Kids'],
      selectFoods: null,
      foods: ['Noodle', 'BBQ', 'Sushi', 'Food', 'Sashimi', 'Hotpot', 'Dessert', 'Alcohol'],
    }
  },


  methods: {
    ...mapMutations('data', ['setSelectedData']),
    createItinerary() {
      const selectedData = {
        place: this.selectPlace,
        day: this.selectDay,
        tran: this.selectTran,
        hotel: this.selectHotel,
        site: this.selectSites,
        food: this.selectFoods
      };
      console.log(this.selectSites)
      this.setSelectedData(selectedData);
    },
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

.selectors {
  width: 300px;
  height: 100px;
}

/* .choosing {
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
} */

.button {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  background-color: #3d8994;
}


/* images */
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
