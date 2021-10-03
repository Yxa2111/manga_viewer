<template>
    <v-dialog v-model="show" width="600">
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn>
      </template> -->

      <v-card>
        <v-card-text>
          <v-row>
            <v-col class="pr-4">
              <v-slider
                v-model="page"
                class="align-center"
                :max="currentTotal"
                :min="1"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="page"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "dialogSilder",
  data() {
    return {
      dialog: false,
      max: 55,
      min: 1,
    };
  },
  props: {
     value: Boolean
  },
  methods: {
    ...mapMutations(['changeCurrent', 'addSlotList', 'delSlotList', 'delSlotListAll']),
  },
  computed: {
    ...mapState(["currentFile", "readerMode", "currentTitle", "currentPage", "currentTotal"]),
    page: {
      get() {
        return this.currentPage;
      },
      set(value) {
        this.changeCurrent({
          currentPage: value,
        });
      },
    },
    show: {
        get() {
            return this.value
        },
        set(v) {
            this.$emit('input', v)
        }
    }
  },
};
</script>