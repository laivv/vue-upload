import UkTextViewer from './uk-text-viewer.vue';
UkTextViewer.install = (Vue) => {
    Vue.component('uk-text-viewer', UkTextViewer);
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(UkTextViewer);
}
export default UkTextViewer;