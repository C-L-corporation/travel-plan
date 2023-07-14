<template>
  <v-container class="time-table">
    <v-row>
      <v-col cols="2" class="day"
        >DAY <br />
        1</v-col
      >
      <v-col cols="7">
        <v-timeline class="time-line" side="end" align="start">
          <v-timeline-item dot-color="#b4b17e" size="x-small">
            <v-row no-gutters class="d-flex">
              <v-col cols="2" class="time me-2">10:00 - 12:00</v-col>
              <v-col>
                <strong>Meiji Jingu (明治神宮)</strong>
                <div class="text-caption">
                  A shrine dedicated to the deified spirits of Emperor Meiji and his consort,
                  Empress Shoken.
                </div>
                <div class="route">
                  <v-icon size="small" icon="mdi-train-car" />Route: Walk 10 mins to Harajuku
                  station.
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item dot-color="#3d8994" size="x-small">
            <v-row no-gutters class="d-flex">
              <v-col cols="2" class="time me-2">12:00 - 16:00</v-col>
              <v-col>
                <strong>Harajuku (原宿)</strong>
                <div class="text-caption">
                  Harajuku is the fun and quirky center of fashion, food and youth culture.
                </div>
                <div class="food">
                  <v-icon size="small" color="#3d8994" icon="mdi-food-fork-drink" />
                  Lunch: Restaurant
                </div>
                <div class="route">
                  <v-icon size="small" icon="mdi-train-car" />Route: Walk 10 mins to Omotesando.
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item dot-color="#b4b17e" size="x-small">
            <v-row no-gutters class="d-flex">
              <v-col cols="2" class="time me-2">16:00 - 19:00</v-col>
              <v-col>
                <strong>Omotesando (表參道)</strong>
                <div class="text-caption">
                  It is a major luxury shopping destination (along with Ginza); it is also home to
                  some of the most amazing examples of human-scale modern architecture that you will
                  find anywhere in the world.
                </div>
                <div class="route">
                  <v-icon size="small" icon="mdi-train-car" />Route: Take train from Omotesando
                  station to Shinjuku station around 10 mins.
                </div>
              </v-col>
            </v-row>
          </v-timeline-item>

          <v-timeline-item dot-color="#3d8994" size="x-small">
            <v-row no-gutters class="d-flex">
              <v-col cols="2" class="time me-2">19:00 - 22:00</v-col>
              <v-col>
                <strong>Shinjuku (新宿)</strong>
                <div class="text-caption">
                  Shinjuku is one of Tokyo's most famous neighborhoods,it is also a microcosm of
                  Tokyo: there are skyscrapers and neon lights but also yakitori stalls in old
                  wooden shacks; luxury hotels and manga kissa; legacy department stores and
                  discount electronics retailers…
                </div>
                <div class="food">
                  <v-icon size="small" color="#3d8994" icon="mdi-food-fork-drink" />
                  Dinner: Restaurant
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

  <v-container class="time-table">
    <v-row v-for="days in scheduleDetail" :key="days.day">
      <v-col cols="2" class="day"
        >DAY <br />
        {{ days.day }}</v-col
      >
      <v-col cols="7">
        <v-timeline side="end" align="start">
          <v-timeline-item
            dot-color="{{ getDotColor(schedule.id) }}"
            size="x-small"
            class="time-line"
            v-for="schedule in days.schedule"
            :key="schedule.id"
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
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import data from '../mock_plan.json'

export default {
  data() {
    return {
      scheduleDetail: data
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
      return index % 2 === 0 ? '#b4b17e' : '#3d8994'
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
