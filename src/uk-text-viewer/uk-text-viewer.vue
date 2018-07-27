<template>
    <div class="uk-text-viewer">
        <div class="uk-text-viewer-text"> {{text}}</div>
    </div>
</template>
<script>
export default {
  props: {
    src: String
  },
  data() {
    return {
      text: ""
    };
  },
  mounted() {
    this.request(true);
  },
  beforeDestory() {
    this.request(false);
  },
  methods: {
    request: (function() {
      let xhr = null;
      let start = function(flag) {
        let _self = this;
        _self.text = "";
        if (xhr && xhr.readyState !== 4) {
          xhr.abort();
          xhr = null;
        }
        if (!flag) {
          return;
        }
        if (typeof _self.src === undefined) {
          _self.$emit("error");
          return;
        }
        xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                _self.text = new TextDecoder("gbk").decode(
                  new DataView(xhr.response)
                );
              } catch (e) {
                _self.text = xhr.responseText;
              }
              // console.log(xhr.responseText);
              _self.$emit("load");
            } else {
              _self.$emit("error");
            }
          }
        };
        xhr.open("GET", _self.src);
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