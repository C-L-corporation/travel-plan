<template>
  <v-container class="time-table">
    <v-row>
      <v-col cols="2" class="day"
        >DAY <br />
        1</v-col
      >
      <v-col cols="7">
        <v-timeline side="end" align="start">
          <v-timeline-item dot-color="#b4b17e" size="small">
            <div class="d-flex">
              <strong class="me-4">10:00 - 12:00</strong>
              <div>
                <strong>Meiji Jingu (明治神宮)</strong>
                <div class="text-caption">
                  A shrine dedicated to the deified spirits of Emperor Meiji and his consort,
                  Empress Shoken.
                </div>
              </div>
            </div>
          </v-timeline-item>

          <v-timeline-item dot-color="#3d8994" size="small">
            <div class="d-flex">
              <strong class="me-4">12:00 - 18:00</strong>
              <div>
                <strong>Harajuku (原宿)</strong>
                <div class="text-caption mb-2">
                  Harajuku is the fun and quirky center of fashion, food and youth culture.
                </div>
              </div>
            </div>
          </v-timeline-item>

          <v-timeline-item dot-color="#b4b17e" size="small">
            <div class="d-flex">
              <strong class="me-4">18:00 - 22:00</strong>
              <div>
                <strong>Shinjuku (新宿)</strong>
                <div class="text-caption">
                  Shinjuku is one of Tokyo's most famous neighborhoods,it is also a microcosm of
                  Tokyo: there are skyscrapers and neon lights but also yakitori stalls in old
                  wooden shacks; luxury hotels and manga kissa; legacy department stores and
                  discount electronics retailers…
                </div>
              </div>
            </div>
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

.text-caption {
}
</style>
