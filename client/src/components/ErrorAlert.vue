<template>
    <v-alert class="alert" v-model="showAlert" type="error" closable prominent location="center" position="fixed"
        color="#F4D3D3" elevation="20" max-width="500px" title="Unable to Plan">
        {{ error }}
    </v-alert>
</template>

<script>
import { mapState, mapMutations } from 'vuex'


export default {
    data() {
        return {
            showAlert: false,
        }
    },
    computed: {
        ...mapState('error', ['error']),
    },

    methods: {
        ...mapMutations('error', ['clearError']),
    },

    watch: {
        error(newError) {
            if (newError !== null) {
                this.showAlert = true;
            }
        },
        showAlert(newShowAlert) {
            if (!newShowAlert) {
                this.clearError()
            }
        }
    }
}
</script>

<style>
.alert {
    z-index: 999;
}
</style>