<template>
  <v-container v-if="scheduleDetail" class="time-table">
    <v-row class="time-table-mobile" v-for="dayData in scheduleDetail.itinerary" :key="dayData.day">

      <v-col lg="2" xs="12" class="day">
        <div>DAY</div>
        <div>{{ dayData.day }}</div>
      </v-col>

      <v-col cols="7">
        <v-timeline side="end" align="start">

          <v-timeline-item size="x-small" min-width="100%" v-for="(schedule, index) in dayData.events" :key="schedule.id"
            :dot-color="getDotColor(index)">

            <v-row no-gutters class="time-line-mobile time-line">
              <!-- time -->
              <v-col lg="2" md="2" xs="12" class="time me-2">
                {{ formatTime(schedule.startAt) }} - {{ formatTime(schedule.endAt) }}
              </v-col>

              <!-- activities -->
              <v-col xs="12">
                <strong>{{ schedule.description }}</strong>

                <!-- restaurant -->
                <div v-show="schedule.type === 'MEAL'" class="restaurant">
                  <v-icon size="small" icon="mdi-food-fork-drink" />
                  {{ schedule.location }}
                </div>

                <!-- route -->
                <div class="route" v-for="transport in schedule.transportation" :key="transport.type">
                  >>><v-icon v-if="transport.type === 'TRAIN'" size="small" icon="mdi-train" />
                  <v-icon v-else-if="transport.type === 'WALKING'" size="small" icon="mdi-shoe-print" />
                  <v-icon v-else size="small" icon="mdi-car" />
                  {{ TRANSPORTATION_TYPE_MAP[transport.type] }} from {{ transport.from }} to
                  {{ transport.to }} for {{ formatDuration(transport.duration) }}.
                </div>

              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col cols="3" class="image-position">
        <img class="image" src="/images/pic5.png" />
      </v-col>
    </v-row>
  </v-container>
  <div v-else class="planning">
    <div>Planning...</div>
    <v-progress-circular indeterminate color="#3d8994" height="6" max-width="100px"></v-progress-circular>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters, mapMutations } from 'vuex'


export default {


  data() {
    return {
      scheduleDetail: null,
      TRANSPORTATION_TYPE_MAP: {
        TRAIN: 'Taking the train',
        WALKING: 'Walking',
        CAR: 'Driving'
      },
    }
  },

  computed: {
    ...mapState('data', ['selectedData']),
    ...mapState('error', ['error']),
    ...mapGetters('data', ['getSelectedData']),
  },

  mounted() {
    this.fetchData()
  },


  methods: {
    ...mapMutations('error', ['setError', 'clearError']),
    fetchData() {
      const {
        place,
        day,
        tran,
        hotel,
        site,
        food
      } = this.selectedData;

      axios
        .post('/api/plan/new', {
          nation: place,
          city: place,
          days: day,
          transportation: tran,
          hotelLocation: hotel,
          placeOfInterest: site,
          foodCategories: food,
        })
        .then((response) => {
          this.clearError()
          this.scheduleDetail = response.data
        })
        .catch((error) => {
          if (error.response) {
            this.setError(error.response.data.message);
          } else {
            console.error(error);
          }
        })
    },



    formatTime(timestamp) {
      const date = new Date(timestamp * 1000)
      const hours = date.getHours().toString().padStart(2, '0')
      return `${hours}:00`
    },
    formatDuration(duration) {
      const minutes = Math.round(duration / 60)
      return `${minutes} mins`
    },

    getDotColor(index) {
      return index % 2 === 0 ? '#3d8994' : '#b4b17e'
    }
  }


}
</script>

<style scoped>
.time-table {
  width: 70%;
  color: #3b342a;
}


.day {
  font-family: 'Handlee', cursive;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  color: #3d8994;
  padding-top: 40px;
}

.image-position {
  text-align: right;
}

.image {
  width: 300px;
}

.time {
  font-weight: bold;
  width: 100%;
}


.restaurant {
  font-weight: bold;
  color: #3d8994;
  margin-top: 10px;
}

.route {
  font-size: small;
  color: #6e604d;
  background-color: #f2efe6;
  margin-top: 10px;
}

.planning {
  font-family: 'Handlee', cursive;
  font-size: 40px;
  text-align: center;
  color: #3d8994;
  margin: 100px;

}

@media (max-width: 768px) {
  .time-table {
    color: #3b342a;
    width: 100%;

  }

  .time-table-mobile {
    display: flex;
    flex-direction: column;
  }

  .time-line-mobile {
    display: flex;
    flex-direction: column;
    width: 90%;
  }

  .day {
    font-family: 'Handlee', cursive;
    font-size: 20px;
    font-weight: bold;
    color: #3d8994;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-content: center;
  }

  .image {
    display: none;
  }

  .time {
    font-weight: bold;
    width: 300px;
  }

  .restaurant {
    font-weight: bold;
    color: #3d8994;
    margin-top: 10px;
  }

  .route {
    font-size: small;
    color: #6e604d;
    background-color: #f2efe6;
    margin-top: 10px;
    width: 100%;
  }

  .planning {
    font-family: 'Handlee', cursive;
    font-size: 20px;
    text-align: center;
    color: #3d8994;
    margin: 100px;
  }
}
</style>
