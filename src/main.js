import Vue from 'vue';
import Upload from './upload/index.js';
import App from './App.vue';
Vue.use(Upload);
const app = new Vue({
  render: h => h(App)
}).$mount('#app');
