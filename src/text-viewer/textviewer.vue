<template>
  <div class="uk-text-viewer">
    <div class="uk-text-viewer-text" v-show="text">{{text}}</div>
  </div>
</template>
<script>
export default {
  props: {
    src: String
  },
  data() {
    return {
      text: "",
      originalData: ""
    };
  },
  mounted() {
    this.request(true);
  },
  beforeDestory() {
    this.request(false);
  },
  methods: {
    decoder(encode) {
      try {
        this.text = new TextDecoder(encode).decode(
          new DataView(this.originalData)
        );
      } catch (e) {}
    },
    request: (function() {
      let xhr = null;
      let start = function(flag) {
        let _this = this;
        _this.text = "";
        if (xhr && xhr.readyState !== 4) {
          xhr.abort();
          xhr = null;
        }
        if (!flag) {
          return;
        }
        if (_this.src === undefined) {
          _this.$emit("error");
          return;
        }
        xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 304) {
              _this.originalData = xhr.response;
              _this.decoder("gbk");
              _this.$emit("load");
            } else {
              _this.$emit("error");
            }
          }
        };
        xhr.open("GET", _this.src);
        xhr.send();
      };
      return start;
    })()
  },
  watch: {
    src() {
      this.request(true);
    }
  }
};
</script>
<style>
.uk-text-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
.uk-text-viewer-text {
  width: 100%;
  background: #fff;
  line-height: 30px;
  letter-spacing: 2px;
  box-sizing: border-box;
  padding: 20px;
  user-select: text;
}
.uk-text-viewer::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.uk-text-viewer::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.uk-text-viewer::-webkit-scrollbar-track {
  display: none;
}
.uk-text-viewer::-webkit-scrollbar-button {
  display: none;
}
</style>
