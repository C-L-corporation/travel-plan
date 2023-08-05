<script>
import TheFooter from '../src/components/TheFooter.vue'
import ErrorAlert from './components/ErrorAlert.vue'


export default {
  components: { TheFooter, ErrorAlert }
}
</script>

<template>
  <ErrorAlert />
  <router-view></router-view>
  <TheFooter />
</template>
