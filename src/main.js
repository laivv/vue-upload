import Vue from 'vue';
import UkUpload from './uk-upload/index.js';
import App from './App.vue';
Vue.use(UkUpload);
const app = new Vue({
    render:h => h(App)
  }).$mount('#app')