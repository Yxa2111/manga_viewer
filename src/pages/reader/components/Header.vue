<template>
  <div class="header-container">
    <a v-bind:href="'../../book/' + cb_id">
      <v-btn rounded plain dark left absolute height=".86rem" width=".86rem">
        <v-icon dark> mdi-arrow-left </v-icon>
      </v-btn>
    </a>
    {{ loading }} {{ currentTitle }}
  </div>
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
      cb_id: this.$store.state.cb_id,
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
  height: 0.86rem;
  line-height: 0.86rem;
  text-align: center;
}
</style>
