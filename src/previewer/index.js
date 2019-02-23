import Previewer from './previewer.vue';
import './previewer.css';
Previewer.install = Vue => {
  Vue.component('previewer', Previewer);
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Previewer);
}
export default Previewer;
