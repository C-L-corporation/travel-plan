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
        <img src="images/poloroid.png" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script></script>

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
}
</style>
