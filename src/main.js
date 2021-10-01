import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './vuex/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueSlider from 'vue-slider-component'

//style
import './assets/style/reset.css'
import './assets/style/border.css'
import 'swiper/dist/css/swiper.css'
import 'vue-slider-component/theme/default.css'
import vuetify from './plugins/vuetify';


Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.component('VueSlider', VueSlider);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
