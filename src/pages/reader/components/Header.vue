<template>
  <v-container class="header-container">
    <v-row align="center" dense>
      <!-- <v-spacer></v-spacer> -->
      <v-col md="8" cols="12">
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
          <v-icon dark>  mdi-image-multiple-outline </v-icon>
        </v-btn>
      </v-col>
      <v-col md="1">
        <v-menu 
          offset-y
          transition="slide-y-transition"
          >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              plain
              dark
              height=".86rem"
              width=".86rem"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>  mdi-book-plus </v-icon>
            </v-btn>
          </template>
          <v-list
            dark
            >
           <v-list-item-group
              color="primary"
            >
            
              <v-list-item
                v-for="(item, index) in this.$store.state.shelfList"
                :key="index"
                @click="changeShelfItemSelected(item)"
              >
                <!-- <template v-slot:default="{ active }"> -->
                  <v-list-item-action>
                    <v-checkbox :input-value="item.contains"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="header-title" style="font-size: 1.2em;margin-top: 0;margin-left: 0.5em;">{{ item.name }} ({{item.size}})</v-list-item-title>
                  </v-list-item-content>
                <!-- </template> -->
            </v-list-item>
            <v-list-item @click="showCreateShelf=true">
              <v-icon dark> mdi-plus </v-icon>
              <v-list-item-content>
                <v-list-item-title class="header-title" style="font-size: 1.2em;margin-top: 0;margin-left: 0.5em;">New Shelf</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
      <!-- <v-spacer></v-spacer> -->
    </v-row>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="showCreateShelf"
      dark
      >
        <v-card>
          <v-card-title style="font-size: 2em;"> New Shelf </v-card-title>
          <v-container>
            <v-text-field
              label="new Shelf Name"
              v-model="newShelfName"
            ></v-text-field>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="createShelfHandler"
              style="font-size: 1.2em;"
            >
              Create
            </v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapState(["currentTitle", "loadingDetail", "cb_id", "shelfList"]),
  },
  data() {
    return {
      book_id: this.$store.state.cb_id,
      loading: "",
      showCreateShelf: false,
      newShelfName: ""
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
    changeShelfItemSelected(item) {
      console.log('changing', item.id)
      item.contains = !item.contains
      this.$emit("changeShelf", item.id, this.book_id, item.name, item.contains);
    },
    createShelfHandler() {
      this.showCreateShelf = false
      this.$emit("createShelf", this.newShelfName);
    }
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
