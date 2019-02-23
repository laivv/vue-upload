import VideoPlayer from './video-player.vue';
import './video-player.css';
VideoPlayer.install = Vue => {
  Vue.component('video-player', VideoPlayer);
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VideoPlayer);
}
export default VideoPlayer;
