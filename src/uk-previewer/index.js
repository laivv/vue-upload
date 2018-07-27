import UkPreviewer from './uk-previewer.vue';
import './uk-previewer.css';
UkPreviewer.install = Vue =>{
    Vue.component('uk-previewer',UkPreviewer);
}
if (typeof window !== 'undefined' && window.Vue) { 
    window.Vue.use(UkPreviewer);
 }
export default UkPreviewer;