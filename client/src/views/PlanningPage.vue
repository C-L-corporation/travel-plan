<template>
  <UserNameAndLogout />
  <div class="page">
    <div class="title">Let's plan !</div>
    <div class="content">
      <div class="contentpaper">
        <div>Place you want to explore</div>
        <v-select class="selectors" v-model="selectPlace" :items="places" variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>Days of trip</div>
        <v-select class="selectors" v-model="selectDay" :items="days" variant="solo"></v-select>

      </div>

      <div class="contentpaper">
        <div>Transportation</div>
        <v-select class="selectors" v-model="selectTran" :items="transportations" variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>Hotel location</div>
        <v-select class="selectors" v-model="selectHotel" :items="hotels" variant="solo"></v-select>
      </div>

      <div class="contentpaper">
        <div>What you want to See</div>
        <v-select class="selectors" placeholder="Random" v-model="selectSites" :items="sites" variant="solo"
          multiple></v-select>
      </div>

      <div class="contentpaper">
        <div>What you want to Eat</div>
        <v-select class="selectors" placeholder="Random" v-model="selectFoods" :items="foods" variant="solo"
          multiple></v-select>
      </div>
    </div>

    <div>
      <v-btn class="button" size="x-large" @click="openDialog">
        Create!
      </v-btn>
      <v-dialog v-model="dialog" persistent width="600" class="dialog">
        <v-card elevation="20">
          <v-card-title class="card-title">
            Ready to plan?
          </v-card-title>
          <v-card-text class="card-text"> Each user only have 3 times a day to plan. </v-card-text>
          <v-card-actions>
            <v-row justify="space-evenly">
              <v-btn class="card-button" @click="dialog = false">
                Think again
              </v-btn>
              <v-btn class="card-button" @click="planNow">
                Plan now
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <img class="suitcase" src="/images/suitcase.png" />
    <img class="camera" src="/images/camera.png" />
    <img class="pic1" src="/images/pic1.png" />
  </div>
</template>

<script>
import UserNameAndLogout from '../components/UserNameAndLogout.vue'
import { mapMutations } from 'vuex'
import authMixin from '../authMixin'

export default {
  components: {
    UserNameAndLogout
  },
  mixins: [authMixin],

  data() {
    return {
      selectPlace: 'Tokyo',
      places: ['Tokyo'],
      selectDay: '2',
      days: ['2', '3', '4', '5', '6', '7'],
      selectTran: 'Public',
      transportations: ['Public', 'Private'],
      selectHotel: 'Shinjuku Area (West)',
      hotels: [
        'Shinjuku Area (West)',
        'Minato Area (South)',
        'Chuo Area (East)',
        'Taito Area (North)'
      ],
      selectSites: [],
      sites: ['Shopping', 'Historic Site', 'Nature', 'Museum', 'Aqurium', 'Animals'],
      selectFoods: [],
      foods: ['Ramen', 'Udon', 'Japanese BBQ', 'Sushi', 'Sashimi', 'Hotpot', 'Dessert', 'Alcohol'],
      dialog: false,
    }
  },

  methods: {
    ...mapMutations('data', ['setSelectedData']),
    setItineraryQuery() {
      const selectedData = {
        place: this.selectPlace,
        day: parseInt(this.selectDay, 10),
        tran: this.selectTran.toUpperCase(),
        hotel: this.selectHotel,
        site: this.selectSites,
        food: this.selectFoods
      };
      this.setSelectedData(selectedData);
    },
    openDialog() {
      this.setItineraryQuery();
      this.dialog = true;
    },
    planNow() {
      this.$router.push('/itinerary')
    },
  },
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

.button {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  background-color: #3d8994;
}

.dialog {
  font-family: 'Handlee', cursive;
  font-size: 25px;
  font-weight: bold;
  color: #3b342a;
  text-align: center;
}

.card-title {
  font-family: 'Satisfy', cursive;
  font-size: 35px;
  font-weight: bold;
  color: #3b342a;
  margin-top: 20px;

}

.card-text {
  font-family: 'Handlee', cursive;
  color: #3b342a;
  margin: 10px;
}

.card-button {
  font-weight: bold;
  color: #3d8994;
}

.card-button:hover {
  font-weight: bold;
  color: white;
  background-color: #3d8994;
}

/* images */
.suitcase {
  position: absolute;
  width: 250px;
  bottom: 10px;
  left: 20px;
}

.camera {
  position: absolute;
  top: 150px;
  right: 100px;
}

.pic1 {
  position: absolute;
  bottom: -750px;
  right: 0px;
  width: 350px;
}

@media (max-width: 920px) {
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-align: center;
    background-image: url('/images/paper.png');
    background-position-x: 50%;
    background-size: 80% 100%;
  }

  .title {
    font-family: 'Satisfy', cursive;
    font-size: 50px;
    color: #3b342a;
    margin-top: 80px;
  }

  .content {
    font-family: 'Handlee', cursive;
    font-size: 20px;
    font-weight: bold;
    color: #3b342a;
    width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 40px;
  }

  .contentpaper {
    background-image: url('images/contentpaper.png');
    background-position: center;
    background-size: 70%;
    width: 600px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .selectors {
    width: 300px;
    height: 50px;
  }

  .button {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-content: center;
    color: white;
    background-color: #3d8994;
  }

  .dialog {
    font-family: 'Handlee', cursive;
    font-size: 25px;
    font-weight: bold;
    color: #3b342a;
    text-align: center;
  }

  .card-title {
    font-family: 'Satisfy', cursive;
    font-size: 35px;
    font-weight: bold;
    color: #3b342a;
    margin-top: 20px;

  }

  .card-text {
    font-family: 'Handlee', cursive;
    color: #3b342a;
    margin: 10px;
  }

  .card-button {
    font-weight: bold;
    color: #3d8994;
  }

  .card-button:hover {
    font-weight: bold;
    color: white;
    background-color: #3d8994;
  }

  /* images */
  .suitcase {
    position: absolute;
    width: 180px;
    top: 420px;
    left: 20px;
  }

  .camera {
    position: absolute;
    width: 120px;
    top: 140px;
    right: 0px;
  }

  .pic1 {
    position: absolute;
    width: 250px;
    bottom: -200px;
    right: 0px;
  }
}

@media (max-width: 768px) {
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-align: center;
    background-image: url('/images/paper.png');
    background-position-x: 50%;
    background-size: 120% 100%;
  }

  .title {
    font-family: 'Satisfy', cursive;
    font-size: 40px;
    color: #3b342a;
    margin-top: 80px;
  }

  .content {
    font-family: 'Handlee', cursive;
    font-size: 18px;
    font-weight: bold;
    color: #3b342a;
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 40px;
  }

  .contentpaper {
    background-image: url('images/contentpaper.png');
    background-position: center;
    background-size: 70%;
    width: 450px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .selectors {
    width: 200px;
    height: 50px;
  }

  .button {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-content: center;
    color: white;
    background-color: #3d8994;
  }

  .dialog {
    font-family: 'Handlee', cursive;
    font-size: 25px;
    font-weight: bold;
    color: #3b342a;
    text-align: center;
  }

  .card-title {
    font-family: 'Satisfy', cursive;
    font-size: 35px;
    font-weight: bold;
    color: #3b342a;
    margin-top: 20px;
  }

  .card-text {
    font-family: 'Handlee', cursive;
    color: #3b342a;
    margin: 10px;
  }

  .card-button {
    font-weight: bold;
    color: #3d8994;
  }

  .card-button:hover {
    font-weight: bold;
    color: white;
    background-color: #3d8994;
  }

  /* images */
  .suitcase {
    width: 100px;
    bottom: -420px;
    left: 0px;
  }

  .camera {
    position: absolute;
    width: 100px;
    top: 140px;
    right: 0px;
  }

  .pic1 {
    position: absolute;
    width: 200px;
    bottom: -500px;
    right: 0px;
  }
}
</style>
