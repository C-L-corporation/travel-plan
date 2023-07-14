<template>
  <v-container class="time-table">
    <v-row v-for="days in scheduleDetail" :key="days.day">
      <v-col cols="2" class="day"
        >DAY <br />
        {{ days.day }}</v-col
      >
      <v-col cols="7">
        <v-timeline side="end" align="start">
          <v-timeline-item
            size="x-small"
            class="time-line"
            v-for="(schedule, index) in days.schedule"
            :key="schedule.id"
            :dot-color="getDotColor(index)"
          >
            <v-row no-gutters class="d-flex dot">
              <v-col cols="2" class="time me-2">
                {{ formatTime(schedule.startAt) }} - {{ formatTime(schedule.endAt) }}
              </v-col>
              <v-col>
                <strong>{{ schedule.activity }}</strong>
                <div class="text-caption">
                  A shrine dedicated to the deified spirits of Emperor Meiji and his consort,
                  Empress Shoken.
                </div>
                <div
                  class="route"
                  v-for="transport in schedule.transportation"
                  :key="transport.type"
                >
                  <v-icon size="small" icon="mdi-train-car" />
                  {{ transport.type }}: From {{ transport.from }} to {{ transport.to }} for
                  {{ formatDuration(transport.duration) }}.
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col cols="3" class="poloroid">
        <img src="/images/poloroid.png" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      scheduleDetail: null
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      axios
        .get('/api/plan', { headers: { 'Content-Type': 'application/json' } })
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
.poloroid {
  text-align: right;
}

.time {
  font-weight: bold;
  width: 300px;
}

.food {
  font-weight: bold;
  margin-top: 10px;
}

.route {
  font-size: small;
  background-color: #e7e3d9;
  margin-top: 20px;
}
</style>
