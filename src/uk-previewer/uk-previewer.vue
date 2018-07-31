<template>
    <div class="uk-previewer" v-show="visible">
        <template v-if="['image','video','audio','text'].indexOf(fileType) > -1">
            <template v-if="['image','text'].indexOf(fileType) > -1">
                <template v-if="fileType === 'image'">
                <div class="uk-previewer-image-wrapper" v-show="loadState === 'success'" :style="{transform:transform,left:left,top:top}"
                    ref="imageBox" @mousedown="mousedown($event)" @mousemove="mousemove">
                    <img class="uk-previewer-image" :src="fileSrc" @load="handleFileLoad($event,'success',true)" @dragstart="handleImageDragStart($event)" @error="handleFileLoad($event,'error',true)">
                </div>
                </template>
                 <template v-if="fileType === 'text'">
                    <div class="uk-previewer-center uk-previewer-text" v-show="loadState === 'success'">
                        <uk-text-viewer :src="fileSrc" @load="handleFileLoad($event,'success',false)" @error="handleFileLoad($event,'error',false)"></uk-text-viewer>
                    </div>
                </template>
                <div v-show="loadState === 'pending'" class="uk-previewer-loading">
                    <i class="iconfont1 icon-loading"></i>
                </div>
                <div v-show="loadState === 'error'" class="uk-previewer-error uk-previewer-text-center">
                    <div><i class="iconfont1 icon-tupianjiazaishibai03"></i></div>
                    <div class="uk-previewer-warn-text">文件加载失败</div>
                </div>
            </template>
            <template v-if="['video','audio'].indexOf(fileType) > -1">
                <div class="uk-previewer-center uk-previewer-video" v-if="visible">
                    <uk-video-player :src="fileSrc" :type="fileType"></uk-video-player>
                </div>
            </template>
        </template>
        <template v-else>
            <span class="uk-previewer-center uk-previewer-text-center uk-previewer-unsupport">
              <div><i class="iconfont1 icon-expressionfailure"></i></div>
              <div class="uk-previewer-warn-text">无法预览此文件</div>
            </span>
        </template>
        <div class="uk-previewer-close-btn" @click="closePreviewer">×</div>
        <div class="uk-previewer-prev-btn" @click="prevFile">&lt;</div>
        <div class="uk-previewer-next-btn" @click="nextFile">&gt;</div>
        <div class="uk-previewer-footer">
            <div>{{computedIndex}}/{{computedCount}}</div>
            <div class="uk-previewer-toolbar uk-previewer-clearfix">
                <button class="uk-previewer-mini-hide" @click="rotate(-90)" title="向左旋转" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-xuanzhuan1"></i>
                </button>
                <button class="uk-previewer-mini-hide" @click="rotate(90)" title="向右旋转" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-xuanzhuan"></i>
                </button>
                <button class="uk-previewer-mini-hide" @click="setLocationCenter" title="居中" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-juzhong"></i>
                </button>
                <button @click="scale(1,true)" title="原始大小" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-yuanshidaxiao"></i>
                </button>
                <button @click="scale(0.2)" title="放大" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-fangda"></i>
                </button>
                <button @click="scale(-0.2)" title="缩小" :disabled="fileType !== 'image'">
                    <i class="iconfont1 icon-suoxiao"></i>
                </button>
                <button @click="prevFile" title="上一个">
                    <i class="iconfont1 icon-jiantou"></i>
                </button>
                <button @click="nextFile" title="下一个">
                    <i class="iconfont1 icon-endarrow"></i>
                </button>
                <a @click="downLoad($event)" :href="fileSrc" :download="file.name" target="_blank" title="下载" class="uk-previewer-right">
                    <i class="iconfont1 icon-xiazai5"></i>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import UkVideoPlayer from "../uk-video-player/index.js";
import UkTextViewer from "../uk-text-viewer/index.js";
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default() {
        return 0;
      }
    },
    onFileDownload:Function
  },
  components: {
    UkVideoPlayer,
    UkTextViewer
  },
  data() {
    return {
      _index: 0,
      _visible: false,
      file:'',
      fileSrc: "",
      fileId: "",
      fileType: "image",
      fileState: {},
      left: "50%",
      top: "50%",
      srcX: 0,
      srcY: 0,
      offLeft: 0,
      offTop: 0,
      isMouseDown: false
    };
  },
  mounted() {
    this.createFileState();
    this.init();
    this.setCurrentIndex();
  },
  methods: {
    createFileState() {
      this.fileList.forEach(file => {
        if (this.fileState[file.id] === undefined) {
          this.$set(this.fileState, file.id, {
            rotate: 0,
            scale: 1,
            x: "50%",
            y: "50%",
            loadState: "pending" //pending or success or error
          });
        }
      });
    },
    autoScale(image) {
      let imageWidth = image.width,
        imageHeight = image.height,
        screenWidth = window.innerWidth,
        screenHeight = window.innerHeight,
        height = imageHeight,
        width = imageWidth,
        state = this.fileState[this.fileId],
        n = 1;
      while (width >= screenWidth) {
        n -= 0.1;
        width = imageWidth * n;
        height = imageHeight * n;
      }
      while (height >= screenHeight) {
        n -= 0.1;
        height = imageHeight * n;
      }
      state.scale = n;
    },
    handleFileLoad(e, status, isImage) {
      let state = this.fileState[this.fileId];
      if (state) {
        state.loadState = status;
        if (status === "success" && isImage) {
          this.autoScale(e.target);
        }
      }
    },
    handleImageDragStart(e) {
      e.preventDefault();
    },
    setLocationCenter() {
      this.left = this.top = "50%";
    },
    rotate(n) {
      let state = this.fileState[this.fileId];
      state.rotate += n;
      if (state.rotate === 360) {
        state.rotate = 0;
      }
    },
    scale(n, isNoScale) {
      let state = this.fileState[this.fileId];
      if (isNoScale) {
        state.scale = n;
        return;
      }
      state.scale += n;
      if (state.scale >= 6) {
        state.scale = 6;
      }
      if (state.scale <= 0.1) {
        state.scale = 0.1;
      }
    },
    mousedown(e) {
      this.srcX = e.clientX;
      this.srcY = e.clientY;
      let imageBox = this.$refs.imageBox;
      this.offLeft = imageBox.offsetLeft;
      this.offTop = imageBox.offsetTop;
      this.isMouseDown = true;
    },
    mousemove(e) {
      if (this.isMouseDown) {
        let curX = e.clientX,
          curY = e.clientY,
          x = curX - this.srcX,
          y = curY - this.srcY;
        this.left = this.offLeft + x + "px";
        this.top = this.offTop + y + "px";
      }
    },
    resetFileLoadState(src, status) {
      this.fileState[this.fileId].loadState = "pending";
    },
    getIndex(n) {
      let index = this._index + n,
        maxIndex = this.fileList.length - 1;
      if (index > maxIndex || index < 0) {
        return this._index;
      }
      while (
        index > 0 &&
        index < maxIndex &&
        this.fileList[index].status !== "success"
      ) {
        index += n;
      }
      if (this.fileList[index].status === "success") {
        return index;
      }
      return this._index;
    },
    swicthFile(n) {
      let index = this.getIndex(n);
      if (index !== this._index) {
        this.resetFileLoadState();
        this.setCurrentIndex(index);
      }
    },
    prevFile() {
      this.swicthFile(-1);
    },
    nextFile() {
      this.swicthFile(1);
    },
    downLoad:function(e){
      let next = true;
      if(this.onFileDownload){
         next = this.onFileDownload(this.file);
         next = next === undefined ? true : next;
      }
      if(!next){
        e.preventDefault();
      }
    },
    init() {
      this.$nextTick(() => {
        document.addEventListener("mousewheel", e => {
          if (this.visible && this.fileType === "image") {
            e.preventDefault();
            this.scale(e.deltaY > 0 ? -0.2 : 0.2);
          }
        });
        document.addEventListener("mouseup", () => {
          this.isMouseDown = false;
        });
      });
    },
    setCurrentIndex(n) {
      let index = n === undefined ? this.index : n,
        maxIndex = this.fileList.length - 1;
      if (index > maxIndex) {
        index = maxIndex;
      }
      if (index < 0) {
        index = 0;
      }
      let file = this.fileList[index];
      if (file) {
        this.file = file;
        this._index = index;
        this.fileId = file.id;
        this.fileSrc = file.src;
        this.fileType = file.type;
        this.$emit("update:index", this._index);
      }
    },
    closePreviewer() {
      // this.visible = false;
      this.$emit("update:visible", false);
    }
  },
  computed: {
    loadState() {
      let state = this.fileState[this.fileId];
      if (state) {
        return state.loadState;
      }
      return "pending";
    },
    transform() {
      let state = this.fileState[this.fileId];
      if (state) {
        return (
          "rotate(" +
          state.rotate +
          "deg) scale(" +
          state.scale +
          ") translate(-50%,-50%)"
        );
      }
      return "rotate(0deg) scale(1) translate(-50%,-50%)";
    },
    computedCount() {
      return this.fileList.filter(file => file.status === "success").length;
    },
    computedIndex() {
      let computedIndex = 0;
      for (let i = 0, len = this.fileList.length; i < len; i++) {
        if (this.fileList[i].status === "success") {
          computedIndex++;
          if (this.fileList[i].id === this.fileId) {
            return computedIndex;
          }
        }
      }
      return computedIndex;
    }
  },
  watch: {
    index(index) {
      this.setCurrentIndex(index);
    },
    fileList() {
      this.createFileState();
    }
  }
};
</script>