<template>
  <v-container class="time-table">
    <v-row v-for="days in scheduleDetail" :key="days.day">
      <v-col cols="2" class="day">DAY <br />
        {{ days.day }}</v-col>
      <v-col cols="7">
        <v-timeline side="end" align="start">
          <v-timeline-item size="x-small" class="time-line" v-for="(schedule, index) in days.schedule" :key="schedule.id"
            :dot-color="getDotColor(index)">
            <v-row no-gutters class="d-flex dot">
              <v-col cols="2" class="time me-2">
                {{ formatTime(schedule.startAt) }} - {{ formatTime(schedule.endAt) }}
              </v-col>
              <v-col>
                <strong>{{ schedule.activity }}</strong>
                <div v-show="schedule.type === 'MEAL'" class="restaurant">
                  <v-icon size="small" icon="mdi-food-fork-drink" />
                  {{ schedule.location }}
                </div>

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
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      scheduleDetail: null,
      TRANSPORTATION_TYPE_MAP: {
        TRAIN: 'Taking the train',
        WALKING: 'Walking',
        CAR: 'Driving'
      }
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      axios
        .post('/api/plan', {
          nation: "string",
          city: "string",
          days: 0,
          transportation: "string",
          hotelLocation: "string",
          placeOfInterest: "string",
          foodCategories: "string"
        })
        .then((response) => {
          console.log(response)
          this.scheduleDetail = response.data
        })
        .catch((error) => {
          console.error(error)
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
}
</style>
