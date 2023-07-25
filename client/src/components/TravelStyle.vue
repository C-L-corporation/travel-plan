<template>
  <v-row justify="space-around">
    <v-col cols="6">
      <v-chip-group multiple selected-class="text-primary" v-model="selectTags">
        <v-chip size="large" v-for="tag in tags" :key="tag"> {{ tag }} </v-chip>
      </v-chip-group>

    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    tags: ['Shopping', 'Historic Site', 'Nature', 'Museum', 'Aqurium', 'Animals', 'Kids'],
    selectTags: [],
  }),

}
</script>
