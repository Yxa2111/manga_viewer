<template>
    <v-container>
        <v-row no-gutters><v-col></v-col></v-row>
        <v-row no-gutters><v-col>
            </v-col></v-row>
        <v-row no-gutters>
            <v-spacer></v-spacer>
                <v-progress-circular
                    :rotate="-90"
                    :size="200"
                    :width="30"
                    :value="value"
                    color="pink"
                    >
                    <p style="font-size:30px;">
                    {{ value }}%
                    </p>
                </v-progress-circular>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>


<script>

import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
    methods: {
        changeValue(newVal) {
            this.value = newVal
            console.log(this.value)
        },
        ...mapMutations(['changeCurrentFile'])
    },
    mounted(){
        let url = this.$store.state.url
        console.log('dl ' + this.$store.state.url)
        console.log(axios.get(this.$store.state.url, {
            onDownloadProgress: (e) => {
                this.changeValue(Number((e.loaded / e.total * 100).toFixed(1)))
            },
            responseType: 'blob'
        }).then(resp => {
            console.log(resp)
            this.changeCurrentFile(new File([resp.data], url, {
            type: resp.data.type,
            }))
            this.$router.push('/reader')
        }).catch(err => {
            console.log(err)
        }))
    },
    data: function() {
        return {
            value: 0,
        }
    }
}
</script>