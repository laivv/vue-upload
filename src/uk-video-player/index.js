import UkVideoPlayer from './uk-video-player.vue';
import './uk-video-player.css';
UkVideoPlayer.install = function (Vue) {
    Vue.component('uk-video-player', UkVideoPlayer);
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(UkVideoPlayer);
}
export default UkVideoPlayer;