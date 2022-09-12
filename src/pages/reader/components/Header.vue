<template>
  <v-container class="header-container">
    <v-row align="center" dense>
      <!-- <v-spacer></v-spacer> -->
      <v-col md="10" cols="12">
        <p class="header-title text-justify">{{ loading }} {{ currentTitle }}</p>
      </v-col>
      <v-col md="1">
        <a v-bind:href="'../../book/' + book_id">
          <v-btn rounded plain dark height=".86rem" width=".86rem">
            <v-icon dark> mdi-arrow-left </v-icon>
          </v-btn>
        </a>
      </v-col>
      <v-col md="1">
        <v-btn
          rounded
          plain
          dark
          height=".86rem"
          width=".86rem"
          @click="showRelated"
        >
          <v-icon dark> mdi-book </v-icon>
        </v-btn>
      </v-col>
      <!-- <v-spacer></v-spacer> -->
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapState(["currentTitle", "loadingDetail", "cb_id"]),
  },
  data() {
    return {
      book_id: this.$store.state.cb_id,
      loading: "",
    };
  },
  watch: {
    loadingDetail: function (detail) {
      if (detail == null) {
        this.loading = "";
      } else {
        if (detail.total == 0) {
          this.loading = `${detail.status} ${detail.name}`;
        } else {
          this.loading = `${detail.status} ${detail.name}: ${Number(
            ((detail.loaded / detail.total) * 100).toFixed(1)
          )}%`;
        }
      }
    },
  },
  methods: {
    showRelated() {
      this.$emit("changeShowRelated", true);
    },
    shortenTitle(s) {
      if (s.length > 12) {
        return s.substr(0, 12) + "...";
      }
      return s;
    },
  },
};
</script>

<style lang="stylus" scoped>
.header-container {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 2;
  // height: 0.86rem;
  // line-height: 0.86rem;
  text-align: center;
}
.header-title {
  margin-top: 0.86em
  font-family: Roboto,sans-serif!important;
  font-weight: 300;
}
</style>
