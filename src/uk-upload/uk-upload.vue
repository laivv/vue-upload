<template>
    <div class="uk-upload uk-upload-clearfix">
        <input v-if="multiple" multiple="multiple" ref='file' type="file" style="display:none;" @change="onFileChange">
        <input v-else ref='file' type="file" style="display:none;" @change="onFileChange">
        <div class="uk-upload-text" v-if="!previewMode && listType !== 'card'">
            <button class="uk-upload-text-btn" @click="openFileBrowser" :disabled="!enableUpload || overMaxCount">上传文件</button>
        </div>
        <template v-if="listType === 'card'">
            <template v-if="showFileList">
                <div class="uk-upload-item" v-for="file in fileList" :key="file.id">
                    <div class="uk-upload-item-wrap">
                        <div class="uk-upload-item-content">
                            <span class="uk-upload-item-remove" @click="handleFileRemove(file)" v-if="!previewMode">×</span>
                            <div class="uk-upload-full uk-upload-img-wrap" @click="handleFileClick(file)">
                                <template v-if="file.type==='image'">
                                    <img :src="file.thumbSrc" v-if="supportView || file.status==='success'" class="uk-upload-img" />
                                </template>
                                <template v-else>
                                    <span class="iconfont" :class="{'icon-wenbenwenjian':file.type === 'text','icon-file':file.type === 'file','icon--file-music':file.type === 'audio','icon-filevideo':file.type=== 'video','icon-filezip':file.type==='rar'}">
                                    </span>
                                </template>
                            </div>
                            <div class="uk-upload-mask" :class="{'uk-upload-mask-error':file.status === 'error'}" v-show="file.status!=='success'">
                                <div class="uk-upload-progress" v-show="file.status =='pending'">
                                    <span class="uk-upload-progress-bar">{{file.progress}}%</span>
                                </div>
                                <span class="uk-upload-error" v-if="file.status==='error'">
                                    <i class="iconfont icon-error"></i>
                                </span>
                                <span class="uk-upload-retry" @click="reload(file)" title="重试">
                                    <i class="iconfont icon-zhongfa"></i>
                                </span>
                            </div>
                            <div v-if="showFileName" class="uk-upload-file-name" :title="file.name">{{file.name}}</div>
                        </div>
                    </div>
                </div>
            </template>
            <div class="uk-upload-item" v-if="!previewMode && enableUpload && !overMaxCount">
                <div class="uk-upload-item-wrap">
                    <div class="uk-upload-item-content uk-upload-add-btn" @click="openFileBrowser">
                        <div class="uk-upload-full uk-upload-add-btn">
                            <span class="uk-upload-add-icon">+</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <ul v-if="showFileList" class="uk-upload-list">
                <li class="uk-upload-list-item" v-for="file in fileList" :key="file.id">
                    <div class="uk-upload-list-name uk-upload-clearfix">
                        <span class="uk-upload-list-title" :class="{'uk-upload-list-error':file.status === 'error'}" @click="handleFileClick(file)">
                            <span class="iconfont" :class="{'icon-tupian-copy':file.type==='image','icon-wenbenwenjian':file.type === 'text','icon-file':file.type === 'file','icon--file-music':file.type === 'audio','icon-filevideo':file.type=== 'video','icon-filezip':file.type==='rar'}">
                            </span>
                            {{file.name}}
                        </span>
                        <span class="uk-upload-list-icons uk-upload-right" v-if="!previewMode">
                            <span class="uk-upload-list-tip" v-if="file.status === 'pending'">{{file.progress}}%</span>
                            <template v-if="file.status === 'error'">
                                <span class="uk-upload-list-retry" title="重试" @click="reload(file)">
                                    <i class="iconfont icon-zhongfa"></i>
                                </span>
                                <span class="uk-upload-list-tip uk-upload-list-error">
                                    <i class="iconfont icon-iconsb"></i>
                                </span>
                            </template>
                            <span class="uk-upload-list-tip" v-if="file.status === 'success'">
                                <i class="iconfont icon-icon-check-solid"></i>
                            </span>
                            <span v-if="file.status === 'waiting'" class="uk-upload-list-tip uk-upload-list-wait">
                                <i class="iconfont icon-waiting"></i>
                            </span>
                            <span class="uk-upload-list-remove" @click="handleFileRemove(file)" title="删除">×</span>
                        </span>
                    </div>
                    <div class="uk-upload-list-progress" v-if="file.status === 'pending'">
                        <div class="uk-upload-list-progress-bar" :class="{'uk-upload-error-bar':file.status === 'error'}" :style="{width:file.progress + '%'}"></div>
                    </div>
                </li>
            </ul>
        </template>
        <uk-previewer :file-list="fileList" :visible.sync="showPreviewDialog" :index.sync="index"></uk-previewer>
    </div>
</template>
<script>
import UkPreviewer from "../uk-previewer/index.js";
import Uploader from "./Uploader.js";
export default {
  props: {
    url: {
      type: String,
      default: "http://www.qiniu.com"
    },
    value: {
      type: Array,
      default() {
        return [];
      }
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
    extensions: {
      type: Array,
      default() {
        return [];
      }
    },
    thumbQuery: {
      type: String,
      default: ""
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
    beforeFileAdd: Function,
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
    listType: {
      type: String,
      default: "card" //card or text
    }
  },
  components: {
    UkPreviewer
  },
  data() {
    return {
      supportView: FileReader && new FileReader().readAsDataURL,
      fileList: [],
      token: "",
      domain: "",
      prefix: "",
      showPreviewDialog: false,
      index: 0
    };
  },
  computed: {
    overMaxCount() {
      if (this.maxFileCount <= 0) {
        return false;
      }
      return this.fileList.length >= this.maxFileCount;
    }
  },
  created() {
    this.fileList = this.value;
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
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {}
          if (xhr.status == 200 || xhr.status == 304) {
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
    getUploadToken(index) {
      let _self = this;
      if (index === undefined) {
        index = 0;
      }
      if (
        !this.tokenUrl ||
        !this.tokenUrl.length ||
        index >= this.tokenUrl.length ||
        !this.tokenUrl[index]
      ) {
        return;
      }
      _self.request({
        url: this.tokenUrl[index],
        complete(success, res) {
          if (success) {
            let url = _self.tokenUrl[index + 1];
            for (let key in res) {
              if (res.hasOwnProperty[key]) {
                if (new RegExp("token", "i").test(key)) {
                  _self.token = res[key];
                }
                if (key.toLowerCase() === "domain") {
                  _self.domain = res[key];
                }
                if (key.toLowerCase() === "prefix") {
                  _self.prefix = res[key];
                }
                if (url) {
                  let exp = new RegExp("{s*" + key + "s*}", "ig");
                  url = url.replace(exp, res[key]);
                }
              }
            }
          }
          if (!_self.token || !success) {
            index = index + 1;
            if (index >= _self.tokenUrl.length) {
              console.error("获取上传token失败！");
            } else {
              _self.getUploadToken(index);
            }
          }
        }
      });
    },
    getKey(file) {
      let _self = this;
      let ext = file.ext ? "." + file.ext : "";
      let key =
        (_self.prefix ? _self.prefix : "A") +
        "." +
        _self.creareGuid(8, 16) +
        ext;
      return key;
    },
    propFix() {
      this.fileList.forEach((file, index) => {
        if (typeof file === "string") {
          this.value[index] = { src: file };
          file = this.value[index];
        }
        if (file.id === undefined) {
          file.id = this.createId();
        }
        if (file.name === undefined) {
          file.name = file.src
            .split("/")
            .pop()
            .trim();
        }
        if (file.ext === undefined) {
          file.ext = this.getFileExt(file.name);
        }
        if (file.size === undefined) {
          file.size = "";
        }
        if (file.rawFile === undefined) {
          file.rawFile = null;
        }
        if (file.progress === undefined) {
          file.progress = 100;
        }
        if (file.status === undefined) {
          file.status = "success";
        }
        if (file.thumbSrc === undefined) {
          file.thumbSrc = file.src + this.thumbQuery;
        }
        if (file.type === undefined) {
          file.type = this.getFileType(file);
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
      this.fileList.forEach(file => {
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
      return this.fileList.map(file => {
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
      return this.getUploadingFileList().length ? "uploading" : "complete";
    },
    createId: (function() {
      let id = 0;
      return function() {
        return ++id;
      };
    })(),
    creareGuid(len, radix) {
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
    openFileBrowser() {
      // if(!this.token){
      //     return;
      // }
      this.$refs.file.click();
    },
    handleFileClick(file) {
      let next = true;
      if (this.onFileClick) {
        next = this.onFileClick(file);
        next = next === undefined ? true : next;
      }
      if (next && file.status === "success") {
        this.index = this.fileList.indexOf(file);
        this.showPreviewDialog = true;
      }
    },
    handleFileRemove(file) {
      let isRemove = true;
      if (this.onFileRemove) {
        isRemove = this.onFileRemove(file);
        isRemove = isRemove === undefined ? true : isRemove;
      }
      if (isRemove) {
        this.fileList.splice(this.fileList.indexOf(file), 1);
      }
    },
    getFileExt(file) {
      let name = file;
      if (typeof file === "object") {
        name = file.name;
      }
      let res = name.match(/\.([\w\d]{1,4})$/i);
      return res ? res[1].toLowerCase() : "";
    },
    getFileSize(file) {
      return file.size / 1024 / 1024;
    },
    validateFile(file) {
      let res = true;
      if (this.maxFileCount > 0 && this.fileList.length >= this.maxFileCount) {
        res = false;
      }
      if (this.maxFileSize > 0 && file.size > this.maxFileSize) {
        res = false;
      }
      if (this.extensions.length && this.extensions.indexOf(file.ext) === -1) {
        res = false;
      }
      return res;
    },
    reload(file) {
      file.status = "waiting";
      file.progress = 0;
      this.upload(file);
    },
    upload(file) {
      let options = {
        file: file,
        key: this.getKey(file),
        token: this.token
      };
      new Uploader(this.url)
        .upload(options)
        .start(file => {
          file.status = "pending";
        })
        .progress((file, percent) => {
          file.progress = percent;
        })
        .then((response, file) => {
          file.status = "success";
          file.progress = 100;
          file.src = this.domain + response.key;
        })
        .catch(file => {
          file.status = "error";
        });
    },
    onStart(file) {
      this.fileList.push(file);
      if (this.getFileType(file) === "image") {
        if (this.supportView) {
          let reader = new FileReader();
          reader.readAsDataURL(file.rawFile);
          reader.onload = function(e) {
            file.thumbSrc = this.result;
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
          thumbSrc: ""
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
          this.onStart(file);
          this.upload(file);
        }
      });
    }
  }
};
</script>