<template>
    <v-card class="mx-auto" max-width="500">
      <v-container>
        <v-row align="center" justify="start">
          <v-col
            v-for="(selection, i) in selections"
            :key="selection.text"
            cols="auto"
            class="py-1 pe-0"
          >
            <v-chip :disabled="loading" closable @click:close="selected.splice(i, 1)">
              <v-icon :icon="selection.icon" start></v-icon>
  
              {{ selection.text }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
  
      <v-divider v-if="!allSelected"></v-divider>
  
      <v-list>
        <template v-for="item in categories">
          <v-list-item
            v-if="!selected.includes(item)"
            :key="item.text"
            :disabled="loading"
            @click="selected.push(item)"
          >
            <template v-slot:prepend>
              <v-icon :disabled="loading" :icon="item.icon"></v-icon>
            </template>
  
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
  
      <v-divider></v-divider>
    </v-card>
  </template>
  
  <script>
  export default {
    data: () => ({
      items: [
        {
          text: 'Nature',
          icon: 'mdi-nature'
        },
        {
          text: 'Nightlife',
          icon: 'mdi-glass-wine'
        },
        {
          text: 'November',
          icon: 'mdi-calendar-range'
        },
        {
          text: 'Portland',
          icon: 'mdi-map-marker'
        },
        {
          text: 'Biking',
          icon: 'mdi-bike'
        }
      ],
      loading: false,
      search: '',
      selected: []
    }),
  
    computed: {
      allSelected() {
        return this.selected.length === this.items.length
      },
      categories() {
        const search = this.search.toLowerCase()
  
        if (!search) return this.items
  
        return this.items.filter((item) => {
          const text = item.text.toLowerCase()
  
          return text.indexOf(search) > -1
        })
      },
      selections() {
        const selections = []
  
        for (const selection of this.selected) {
          selections.push(selection)
        }
  
        return selections
      }
    },
  
    watch: {
      selected() {
        this.search = ''
      }
    }
  }
  </script>
  