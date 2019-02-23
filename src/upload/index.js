import Upload from './upload.vue';
import './upload.css';
Upload.install = Vue => {
  Vue.component('upload', Upload);
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Upload);
}
export default Upload;
