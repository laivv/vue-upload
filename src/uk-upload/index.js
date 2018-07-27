import UkUpload from './uk-upload.vue';
import './uk-upload.css';
UkUpload.install = function(Vue){
    Vue.component('uk-upload',UkUpload);
}
if (typeof window !== 'undefined' && window.Vue) { 
    window.Vue.use(UkUpload);
 }
export default UkUpload;