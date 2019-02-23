import TextViewer from './textviewer.vue';
TextViewer.install = Vue => {
  Vue.component('textviewer', TextViewer);
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TextViewer);
}
export default TextViewer;
