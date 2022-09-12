<template>
  <v-dialog v-model="show" width="60%" dark fullscreen>
    <v-toolbar>
      <v-btn icon dark @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title class="title">Related Books</v-toolbar-title>
    </v-toolbar>
    <div style="backdrop-filter: blur(10px) brightness(110%); width: 100%; height: 100%; background-color: rgb(0 0 0 / 30%)">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
          <v-skeleton-loader
            class="mx-auto"
            type="card"
            v-if="related === null"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <div v-if="related">
      <v-row align="center" v-for="author in related.authors" :key="'author_' + author.id">
        <v-spacer></v-spacer>
        <v-col style="text-align: center;">
          <a :href="author.href" target="_blank">
          <v-btn plain x-large color="rgba(0,0,0,.5)">
            <v-icon left> mdi-book </v-icon>
            <div class="title" style="font-size: 0.4em; color: #ffffff;">{{ author.name }}</div>
          </v-btn>
          </a>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row align="center">
        <v-col v-for="book in related.items" :key="book.id">
          <v-card max-width="190" min-width="100" hover color="rgba(0,0,0,.3)">
            <a :href="book.url" target="_blank">
              <v-img
                :src="book.cover"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
                <p class="lang-mark">
                  <span class="lang-mark-text">{{ book.langmark }}</span>
                </p>
              </v-img>
            </a>
            <v-card-title
              v-text="book.shorten_title"
              class="title font-weight-light "
            ></v-card-title>
            <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
        </v-card-actions> -->
          </v-card>
        </v-col>
      </v-row>
      </div>
    </v-container>
    </div>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "relatedBooks",
  data() {
    return {
      dialog: false,
      loaded: false,
    };
  },
  props: ["value", "related"],
  methods: {
    ...mapMutations([
      "changeCurrent",
      "addSlotList",
      "delSlotList",
      "delSlotListAll",
    ]),
  },
  computed: {
    ...mapState([
      "currentFile",
      "readerMode",
      "currentTitle",
      "currentPage",
      "currentTotal",
    ]),
    show: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
};
</script>

<style lang="stylus" scoped>
.title {
  font-size: 1.25em;
  line-height: 1.2em;
  font-family: Roboto,sans-serif!important;
  font-weight: 300;
}

.lang-mark {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
}

.lang-mark:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border-style: solid;
  border-width: 25px;
  z-index: 1;
  border-color: rgba(206, 3, 5, 0.7) transparent transparent rgba(206, 3, 5, 0.7);
}

.lang-mark-text {
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg) translateZ(0);
  transform: rotate(-45deg) translateZ(0);
  color: #FFF;
  display: inline-block;
  position: absolute;
  left: 5px;
  top: 5px;
  z-index: 1;
  font-size: 18px;
  text-transform: uppercase;
  text-align: center;
}
</style>