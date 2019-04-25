<template>
  <div class="uk-upload uk-upload-clearfix">
    <input
      v-if="multiple"
      multiple="multiple"
      ref="file"
      type="file"
      style="display:none;"
      @change="onFileChange"
    >
    <input v-else ref="file" type="file" style="display:none;" @change="onFileChange">
    <template v-if="showFileList">
      <upload-card-list
        v-if="listType === 'card'"
        :file-list="value"
        :enable-upload="!previewMode && enableUpload && !overMaxCount"
        :readonly="previewMode"
        :show-file-name="showFileName"
        :auto-upload="autoUpload"
        @onAdd="openFileBrowser"
        @onReload="reload"
        @onRemove="handleFileRemove"
        @onItemClick="handleFileClick"
        @onStart="startUpload"
      ></upload-card-list>
      <upload-text-list
        v-else
        :file-list="value"
        :enable-upload="!previewMode && enableUpload && !overMaxCount"
        :readonly="previewMode"
        :auto-upload="autoUpload"
        @onAdd="openFileBrowser"
        @onReload="reload"
        @onRemove="handleFileRemove"
        @onItemClick="handleFileClick"
        @onStart="startUpload"
      ></upload-text-list>
    </template>

    <previewer
      :file-list="value"
      :visible.sync="showPreviewDialog"
      :index.sync="index"
      :show-file-name="showPreviewFileName"
      :on-close="handlePreviewerClose"
      :on-switch="handlePreviewerSwitch"
    ></previewer>
  </div>
</template>
<script>
import UploadCardList from "./upload-card-list.js";
import UploadTextList from "./upload-text-list.js";
import Previewer from "../previewer/index.js";
import Uploader from "./uploader.js";
export default {
  props: {
    url: {
      type: String,
      default: "http://up.qiniu.com"
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    name: {
      type: String,
      default: "file"
    },
    autoUpload:{
      type:Boolean,
      default:true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 0
    },
    maxFileCount: {
      type: Number,
      default: 0
    },
    acceptList: {
      type: Array,
      default() {
        return [];
      }
    },
    thumbQuery: {
      type: String,
      default: ""
    },
    tokenFunc: {
      type: Function
    },
    tokenUrl: Array,
    previewMode: {
      type: Boolean,
      default: false
    },
    enableUpload: {
      type: Boolean,
      default: true
    },
    onFileTypeError: Function,
    onFileCountError: Function,
    onFileSizeError: Function,
    beforeFileAdd: Function,
    onFileSuccess: Function,
    onFileError: Function,
    onUploadComplete: Function,
    onFileClick: Function,
    onFileRemove: Function,
    showFileName: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    showPreviewFileName: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: "card" //card or text
    },
    onPreviewClose: Function,
    onPreviewSwitch: Function
  },
  components: {
    Previewer,
    UploadCardList,
    UploadTextList
  },
  data() {
    return {
      supportView: FileReader && new FileReader().readAsDataURL,
      options: {}, //token相关数据
      showPreviewDialog: false,
      index: 0,
      isQiniu: true
    };
  },
  computed: {
    overMaxCount() {
      if (this.maxFileCount <= 0) {
        return false;
      }
      return this.value.length >= this.maxFileCount;
    }
  },
  created() {
    this.isQiniu = /\.qiniu\./gi.test(this.url);
    this.propFix();
    this.getUploadToken();
  },
  methods: {
    request(options) {
      let params = options.data,
        url = options.url;
      if (params && typeof params === "object") {
        for (let key in params) {
          if (params.hasOwnProperty[key]) {
            url +=
              (url.indexOf("?") > -1 ? "&" : "?") + key + "=" + params[key];
          }
        }
      }
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          let data = xhr.responseText;
          let success = true;
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            success = false;
          }
          if (success && (xhr.status === 200 || xhr.status === 304)) {
            options.success && options.success(data);
            options.complete && options.complete(true, data);
          } else {
            options.error && options.error(data);
            options.complete && options.complete(false, data);
          }
        }
      };
      xhr.send(null);
    },
    getUploadToken(index, url) {
      /* 如果传入了自定义token获取方法，直接使用自定义方法配置token和config */
      if (this.tokenFunc) {
        this.tokenFunc(data => {
          if (!data) {
            return;
          }
          Object.keys(data).forEach(key => {
            this.$set(this.options, key, data[key]);
          });
        });
        return;
      }
      let _self = this;
      if (index === undefined) {
        index = 0;
      }
      if (
        this.previewMode ||
        !this.tokenUrl ||
        !this.tokenUrl.length ||
        index > this.tokenUrl.length - 1 ||
        !this.tokenUrl[index]
      ) {
        return;
      }
      _self.request({
        url: url || this.tokenUrl[index],
        complete(success, res) {
          let url = _self.tokenUrl[index + 1];
          if (success) {
            for (let key in res) {
              if (res.hasOwnProperty(key)) {
                if (_self.isQiniu) {
                  if (new RegExp("token", "i").test(key)) {
                    _self.$set(_self.options, "token", res[key]);
                  }
                  if (key.toLowerCase() === "domain") {
                    _self.$set(_self.options, "domain", res[key]);
                  }
                  if (key.toLowerCase() === "prefix") {
                    _self.$set(_self.options, "prefix", res[key]);
                  }
                } else {
                  _self.$set(_self.options, key, res[key]);
                }

                if (url) {
                  let exp = new RegExp("{s*" + key + "s*}", "ig");
                  url = url.replace(exp, res[key]);
                }
              }
            }
          }
          if ((_self.isQiniu && !_self.options.token) || !success) {
            index = index + 1;
            if (index > _self.tokenUrl.length - 1) {
              console.error("获取上传token失败！");
            } else {
              _self.getUploadToken(index, url);
            }
          }
        }
      });
    },
    getKey(file) {
      let _self = this;
      let ext = file.ext ? "." + file.ext : "";
      let key =
        (_self.options.prefix ? _self.options.prefix : "A") +
        "." +
        _self.createGuid(8, 16) +
        ext;
      return key;
    },
    propFix() {
      this.value.forEach((file, index) => {
        if (typeof file === "string") {
          this.value.splice(index, 1, { src: file });
          file = this.value[index];
        }
        if (file.id === undefined) {
          this.$set(file, "id", this.createId());
        }
        if (file.name === undefined) {
          this.$set(
            file,
            "name",
            file.src
              ? file.src
                  .split("/")
                  .pop()
                  .trim()
              : ""
          );
        }
        if (file.ext === undefined) {
          this.$set(file, "ext", this.getFileExt(file.name));
        }
        if (file.size === undefined) {
          this.$set(file, "size", "");
        }

        if (file.rawFile === undefined) {
          this.$set(file, "rawFile", null);
        }
        if (file.progress === undefined) {
          this.$set(file, "progress", 100);
        }
        if (file.status === undefined) {
          this.$set(file, "status", "success");
        }
        if (file.base64 === undefined) {
          this.$set(file, "base64", '');
        }
        if (file.type === undefined) {
          this.$set(file, "type", this.getFileType(file));
        }
      });
    },
    getFileType(file) {
      if (["jpg", "png", "gif", "bmp", "jpeg", "webp"].indexOf(file.ext) > -1) {
        return "image";
      }
      if (["mp4", "avi", "rmvb", "mkv", "3gp"].indexOf(file.ext) > -1) {
        return "video";
      }
      if (["rar", "zip", "7z", "cab"].indexOf(file.ext) > -1) {
        return "rar";
      }
      if (file.ext === "txt") {
        return "text";
      }
      if (
        [
          "mp3",
          "ogg",
          "m4a",
          "wav",
          "ape",
          "flac",
          "wma",
          "aac",
          "amr"
        ].indexOf(file.ext) > -1
      ) {
        return "audio";
      }
      return "file";
    },
    getFileListByStatus(status) {
      let files = [];
      this.value.forEach(file => {
        if (status.indexOf(file.status) > -1) {
          files.push({
            name: file.name,
            ext: file.ext,
            src: file.src,
            status: file.status
          });
        }
      });
      return files;
    },
    getFileList() {
      return this.value.map(file => {
        return {
          name: file.name,
          ext: file.ext,
          src: file.src,
          status: file.status
        };
      });
    },
    getSuccessFileList() {
      return this.getFileListByStatus(["success"]);
    },
    getUploadingFileList() {
      return this.getFileListByStatus(["pending", "waiting"]);
    },
    getErrorFileList() {
      return this.getFileListByStatus(["error"]);
    },
    getUploadStatus() {
      return !this.getUploadingFileList().length;
    },
    createId: (function() {
      let id = 0;
      return function() {
        return `${Date.now()}${++id}`;
      };
    })(),
    createGuid(len, radix) {
      let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
      );
      let uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
      } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16);
            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join("");
    },
    handlePreviewerClose() {
      this.onPreviewClose && this.onPreviewClose();
    },
    handlePreviewerSwitch(index, file) {
      this.onPreviewSwitch && this.onPreviewSwitch(index, file);
    },
    openFileBrowser() {
      this.$refs.file.click();
    },
    openPreviewer(index) {
      let maxIndex = this.value.length ? this.value.length - 1 : 0;
      index = index > maxIndex ? maxIndex : index;
      index = index < 0 ? 0 : index;
      this.index = index;
      this.showPreviewDialog = true;
    },
    handleFileClick(file) {
      let next = true;
      if (this.onFileClick) {
        next = this.onFileClick(file);
        next = next === undefined ? true : next;
      }
      if (file.status === "success") {
        if (next instanceof Promise) {
          next.then(() => {
            this.index = this.value.indexOf(file);
            this.showPreviewDialog = true;
          });
          return;
        } else if (!next) {
          return;
        }

        this.index = this.value.indexOf(file);
        this.showPreviewDialog = true;
      }
    },
    doFileRemove(file) {
      let isComplete = this.getUploadStatus();
      this.value.splice(this.value.indexOf(file), 1);
      if (!isComplete && this.getUploadStatus() && this.onUploadComplete) {
        this.onUploadComplete();
      }
    },
    handleFileRemove(file) {
      let next = true;
      if (this.onFileRemove) {
        next = this.onFileRemove(file);
        next = next === undefined ? true : next;
      }
      if (next instanceof Promise) {
        next.then(() => {
          this.doFileRemove(file);
        });
      } else if (next) {
        this.doFileRemove(file);
      }
    },
    getFileExt(file) {
      let name = file;
      if (typeof file === "object") {
        name = file.name;
      }
      let res = name.match(/\.([\w\d]+)$/i);
      return res ? res[1].toLowerCase() : "";
    },
    getFileSize(file) {
      return file.size / 1024 / 1024;
    },
    validateType(file) {
      if (this.acceptList.length && this.acceptList.indexOf(file.ext) === -1) {
        return false;
      }
      return true;
    },
    validateCount() {
      if (this.maxFileCount > 0 && this.value.length >= this.maxFileCount) {
        return false;
      }
      return true;
    },
    validateSize(file) {
      if (this.maxFileSize > 0 && file.size > this.maxFileSize) {
        return false;
      }
      return true;
    },
    validateFile(file) {
      return (
        this.validateType(file) &&
        this.validateCount() &&
        this.validateSize(file)
      );
    },
    startUpload(){
      this.value.forEach(file => {
        if(file.status === 'waiting'){
          this.upload(file)
        }
      })
    },
    reload(file) {
      file.status = "waiting";
      file.progress = 0;
      this.upload(file);
    },
    upload(file) {
      let options = {
        [this.name]: file
      };
      if (this.isQiniu) {
        options.key = this.getKey(file);
        options.token = this.options.token;
      } else {
        for (let key in this.options) {
          if (this.options.hasOwnProperty(key)) {
            options[key] = this.options[key];
          }
        }
      }
      new Uploader(this.url)
        .upload(options)
        .setDataType("json")
        .start(file => {
          file.status = "pending";
        })
        .progress((file, percent) => {
          file.progress = percent;
        })
        .then((response, file) => {
          file.status = "success";
          file.progress = 100;
          let src = undefined;
          if (this.onFileSuccess) {
            let param = Object.keys(this.options).length
              ? this.options
              : undefined;
            src = this.onFileSuccess(file, response, param);
          }
          src =
            src === undefined
              ? this.isQiniu
                ? this.options.domain + response.key
                : response
              : src;
          file.src = src;
          if (this.getUploadStatus() && this.onUploadComplete) {
            this.onUploadComplete();
          }
        })
        .catch(file => {
          file.status = "error";
          this.onFileError && this.onFileError(file);
          if (this.getUploadStatus() && this.onUploadComplete) {
            this.onUploadComplete();
          }
        });
    },
    imageBase64(file) {
      if (this.getFileType(file) === "image") {
        if (this.supportView) {
          let reader = new FileReader();
          reader.readAsDataURL(file.rawFile);
          reader.onload = function(e) {
            file.base64 = this.result;
          };
        }
      }
    },
    onFileChange() {
      let files = [].slice.call(this.$refs.file.files, 0);
      if (!files.length) {
        return;
      }
      this.$refs.file.value = "";
      let typeErrorFiles = [],
        countErrorFiles = [],
        sizeErrorFiles = [];
      files.forEach(rawFile => {
        let file = {
          id: this.createId(),
          name: rawFile.name.trim(),
          src: "",
          ext: this.getFileExt(rawFile),
          size: this.getFileSize(rawFile),
          rawFile: rawFile,
          progress: 0,
          status: "waiting",
          base64: ""
        };
        file.type = this.getFileType(file);
        if (this.validateFile(file)) {
          if (this.beforeFileAdd) {
            let next = this.beforeFileAdd(file);
            next = next === undefined ? true : next;
            if (!next) {
              return;
            }
          }
          this.value.push(file);
          this.imageBase64(file);
          if(this.autoUpload){
            this.upload(file);
          }
        } else {
          if (!this.validateCount()) {
            countErrorFiles.push(file);
          } else if (!this.validateType(file)) {
            typeErrorFiles.push(file);
          } else if (!this.validateSize(file)) {
            sizeErrorFiles.push(file);
          }
        }
      });
      this.onFileCountError &&
        countErrorFiles.length &&
        this.onFileCountError(countErrorFiles);
      this.onFileTypeError &&
        typeErrorFiles.length &&
        this.onFileTypeError(typeErrorFiles);
      this.onFileSizeError &&
        sizeErrorFiles.length &&
        this.onFileSizeError(sizeErrorFiles);
    }
  },
  watch: {
    value() {
      this.propFix();
    },
    previewMode() {
      this.getUploadToken();
    }
  }
};
</script>
