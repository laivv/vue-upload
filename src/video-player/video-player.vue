<template>
  <div
    class="video-player"
    ref="videobox"
    :class="{'video-player-fullscreen':isFullScreen,'video-player-toolbar-show':showToolbar}"
    @mousemove="mousemove"
  >
    <template v-if="type === 'video'">
      <div class="video-player-load-error" v-show="!loadStatus">
        <span class="video-player-layout-center">
          <div class="video-player-text-center">
            <i class="iconfont icon-jiazaishibaitidaiicon"></i>
          </div>
          <div class="video-player-text-center">视频加载失败</div>
        </span>
      </div>
      <video
        v-show="loadStatus"
        @playing="playing"
        @waiting="waiting"
        @error="loadError"
        @dblclick="onScreen"
        @click="onPlay"
        ref="video"
        class="video-player-video video-player-layout-center"
        @timeupdate="timeupdate"
        @canplay="canplay"
        :src="src"
      ></video>
    </template>
    <template v-if="type === 'audio'">
      <div class="video-player-audio-window" v-show="!isLoading">
        <span class="video-player-layout-center">
          <div class="video-player-text-center video-player-audio-icon">
            <i class="iconfont icon-yinpin"></i>
          </div>
          <div class="video-player-text-center" v-show="!loadStatus">音频加载失败</div>
        </span>
      </div>
      <audio
        @playing="playing"
        @waiting="waiting"
        @error="loadError"
        @dblclick="onScreen"
        @click="onPlay"
        ref="video"
        class="video-player-video"
        @timeupdate="timeupdate"
        @canplay="canplay"
        :src="src"
      ></audio>
    </template>
    <span
      class="video-player-loading video-player-layout-center video-player-text-center"
      v-show="isLoading && !paused && loadStatus"
    >
      <i class="video-player-loading-load iconfont icon-loading1"></i>
      <div class="video-player-fetch-text">缓冲中...</div>
    </span>
    <!--
			<template>
			  <div class="video-player-mask" v-show="paused">
			  <span class="video-player-layout-center video-player-quick-btn" @click="onPlay">
			    <i class="iconfont icon-iconset0481"></i>
			  </span>
			  </div>
			</template>
    -->
    <div class="video-player-toolbar">
      <div
        class="video-player-progress"
        @mousemove="getHoverTime"
        @click="setProgress($event)"
        ref="progressbar"
      >
        <div class="video-player-progressbar">
          <span class="video-player-hover-time" :style="{left:hoverleft}" ref="hovertime">
            {{
            hovertime | formatTime
            }}
          </span>
          <div class="video-player-progress-played" :style="{width:progress}"></div>
        </div>
      </div>
      <div class="video-player-controls video-player-clearfix">
        <button class="video-player-playbtn video-player-left" @click="onPlay">
          <i class="iconfont" :class="this.paused? 'icon-iconset0481' : 'icon-icon-'"></i>
        </button>
        <span
          class="video-player-times video-player-left"
        >{{ currentTime | formatTime }}/{{ duration | formatTime }}</span>
        <button class="video-player-fullscreen-btn video-player-right" @click="onScreen">
          <i class="iconfont" :class="isFullScreen ? 'icon-tuichuquanping' : 'icon-quanping'"></i>
        </button>
        <button
          class="video-player-rate-btn video-player-right video-player-mini-hide"
          @click.stop="openRateList"
        >
          {{ this.playbackRate == 1 ? '倍速' : this.playbackRate + 'x' }}
          <ul class="video-player-rate-list" v-show="showRate">
            <li
              @click.stop="setPlaybackRate(item)"
              class="video-player-rate-item"
              v-for="item in rateList"
              :key="item"
            >{{ item }}x</li>
          </ul>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ""
    },
    rateList: {
      type: Array,
      default() {
        return [0.5, 1, 1.25, 1.5, 1.75, 2].reverse();
      }
    },
    type: {
      type: String,
      default: "video" //video or audio
    }
  },
  data() {
    return {
      loadStatus: true,
      playbackRate: 1,
      isFullScreen: false,
      paused: true,
      showRate: false,
      duration: 0,
      currentTime: 0,
      showToolbar: true,
      isLoading: false,
      hovertime: "00:00:00",
      hoverleft: "0%"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.scaleVideoWindow();
      window.addEventListener("resize", () => {
        this.scaleVideoWindow();
      });
      document.addEventListener("click", () => {
        this.showRate = false;
      });
      [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "MSFullscreenChange"
      ].forEach(item => {
        document.addEventListener(item, e => {
          let isFullScreen = false;
          [
            document.fullscreenEnabled,
            window.fullScreen,
            document.webkitIsFullScreen,
            document.msFullscreenEnabled
          ].every(item => {
            if (item !== undefined) {
              isFullScreen = item;
              return false;
            }
            return true;
          });
          if (!isFullScreen) {
            this.isFullScreen = false;
            this.setToolbar();
          }
        });
      });
    });
  },
  beforeDestory() {
    const { video } = this.$refs;
    video && video.pause();
  },
  computed: {
    progress() {
      return this.duration !== 0
        ? (this.currentTime / this.duration) * 100 + "%"
        : "0%";
    }
  },
  filters: {
    formatTime(time) {
      if (time <= 0) {
        return "00:00:00";
      }
      if (time < 60) {
        time = parseInt(time);
        time = time < 10 ? `0${time}` : time;
        return `00:00:${time}`;
      }
      let minute = Math.floor(time / 60);
      minute = minute < 10 ? `0${minute}` : minute;
      let hour = Math.floor(minute / 60);
      hour = hour < 10 ? `0'${hour}` : hour;
      let second = parseInt(time % 60);
      second = second < 10 ? `0${second}` : second;
      return `${hour}:${minute}:${second}`;
    }
  },
  methods: {
    canplay() {
      this.setDuration();
      this.setProgressTime();
    },
    setDuration() {
      const { video } = this.$refs;
      let duration = video ? video.duration : 0;
      duration = isNaN(duration) ? 0 : duration;
      this.duration = duration;
    },
    setProgressTime() {
      const { video } = this.$refs;
      if (video) {
        this.currentTime = video.currentTime;
        if (this.currentTime >= this.duration) {
          this.paused = this.showToolbar = true;
          video.currentTime = 0;
        }
      }
    },
    timeupdate() {
      this.setProgressTime();
    },
    onPlay() {
      if (!this.loadStatus) {
        return;
      }
      const { video } = this.$refs;
      this.paused = !this.paused;
      video[this.paused ? "pause" : "play"]();
    },
    setProgress(e) {
      if (!this.loadStatus) {
        return;
      }
      let { offsetX } = e;
      let { width } = this.$refs.progressbar.getBoundingClientRect();
      let percent = offsetX / width;
      const { video } = this.$refs;
      video.currentTime = this.duration * percent;
      this.paused = false;
      video.play();
    },
    getHoverTime(e) {
      let { offsetX } = e;
      let { width } = this.$refs.progressbar.getBoundingClientRect();
      let percent = offsetX / width;
      let { width: hoverWidth } = this.$refs.hovertime.getBoundingClientRect();
      this.hovertime = this.duration * percent;
      let hoverleft = offsetX - hoverWidth / 2;
      if (hoverleft < 0) {
        hoverleft = 0;
      }
      if (hoverleft > width - hoverWidth) {
        hoverleft = width - hoverWidth;
      }
      this.hoverleft = `${hoverleft}px`;
    },
    setPlaybackRate(rate) {
      this.$refs.video.playbackRate = this.playbackRate = rate;
      this.showRate = false;
    },
    openRateList() {
      this.showRate = !this.showRate;
    },
    onScreen() {
      this[this.isFullScreen ? "exitFullscreen" : "fullscreen"]();
    },
    fullscreen() {
      const { videobox } = this.$refs;
      let fullscreen =
        videobox.requestFullscreen ||
        videobox.msRequestFullscreen ||
        videobox.mozRequestFullScreen ||
        videobox.webkitRequestFullScreen;
      if (fullscreen) {
        fullscreen.call(videobox);
        this.isFullScreen = true;
      }
    },
    exitFullscreen() {
      let exitFullscreen =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msCancelFullScreen;
      if (exitFullscreen) {
        exitFullscreen.call(document);
        this.isFullScreen = false;
      }
    },
    setToolbar: (function() {
      let timer = null;
      return function() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        this.showToolbar = true;
        if (this.isFullScreen && !this.paused) {
          timer = setTimeout(() => {
            this.showToolbar = false;
          }, 5000);
        }
      };
    })(),
    mousemove() {
      if (this.isFullScreen) {
        this.setToolbar();
      }
    },
    waiting() {
      this.isLoading = true;
    },
    playing() {
      this.isLoading = false;
    },
    scaleVideoWindow() {
      let width = "100%",
        height = "100%";
      const { videobox } = this.$refs;
      if (videobox) {
        let { style } = videobox;
        if (!this.isFullScreen) {
          width = window.innerWidth + "px";
          height = window.innerHeight + "px";
        }
        style.maxHeight = height;
        style.maxWidth = width;
      }
    },
    loadError() {
      this.loadStatus = false;
    }
  },
  watch: {
    src() {
      this.paused = this.loadStatus = true;
      this.isLoading = false;
      const { video } = this.$refs;
      this.currentTime = this.duration = video.currentTime = 0;
    }
  }
};
</script>
