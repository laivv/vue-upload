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
        :enable-upload="!readonly && enableUpload && !overMaxCount"
        :readonly="readonly"
        :show-file-name="showFileName"
        :auto-upload="autoUpload"
        :thumb-query="thumbQuery"
        @onAdd="openFileBrowser"
        @onReload="reload"
        @onRemove="handleFileRemove"
        @onItemClick="handleFileClick"
        @onStart="startUpload"
      ></upload-card-list>
      <upload-text-list
        v-else
        :file-list="value"
        :enable-upload="!readonly && enableUpload && !overMaxCount"
        :readonly="readonly"
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
    url: String,
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    name: {
      type: String,
      default: 'file'
    },
    autoUpload: {
      type: Boolean,
      default: true
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
    accepts: {
      type: Array,
      default() {
        return [];
      }
    },
    thumbQuery: {
      type: String,
      default: ""
    },
    data: Object,
    customRequest: Function,
    readonly: {
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
      supportView: URL && URL.createObjectURL,
      showPreviewDialog: false,
      index: 0,
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
    this.propFix();
  },
  methods: {

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
        if (file.blob === undefined) {
          this.$set(file, "blob", "");
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
    getFiles() {
      return this.value.map(file => {
        return {
          name: file.name,
          ext: file.ext,
          src: file.src,
          status: file.status
        };
      });
    },
    getSuccessFiles() {
      return this.getFileListByStatus(["success"]);
    },
    getUploadingFiles() {
      return this.getFileListByStatus(["pending", "waiting"]);
    },
    getErrorFiles() {
      return this.getFileListByStatus(["error"]);
    },
    isCompleted() {
      return !this.getUploadingFiles().length;
    },
    createId: (function() {
      let id = 0;
      return function() {
        return `${Date.now()}${++id}`;
      };
    })(),
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
      let isComplete = this.isCompleted();
      this.value.splice(this.value.indexOf(file), 1);
      if (!isComplete && this.isCompleted() && this.onUploadComplete) {
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
      if (this.accepts.length && this.accepts.indexOf(file.ext) === -1) {
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
    startUpload() {
      this.value.forEach(file => {
        if (file.status === "waiting") {
          this.upload(file);
        }
      });
    },
    reload(file) {
      file.status = "waiting";
      file.progress = 0;
      this.upload(file);
    },
    async upload(file) {
      const form = { [this.name]: file };

      if(this.customRequest){
        try{
          const response = await this.customRequest(file)
          this.processFileSuccess(response, file);
        } catch(e){
          this.processFileError(file)
        }
        return
      }

      if(this.data){
        for (let key in this.data) {
          if (this.data.hasOwnProperty(key)) {
            form[key] = this.data[key];
          }
        }
      }
      
      new Uploader(this.url)
      .upload(form)
      .setDataType("json")
      .start(file => {
        file.status = "pending";
      })
      .progress((file, percent) => {
        file.progress = percent;
      })
      .then((response, file) => {
        this.processFileSuccess(response, file);
      })
      .catch(file => {
        this.processFileError(file);
      });
    },
    processFileError(file){
      file.status = "error";
      this.onFileError && this.onFileError(file);
      if (this.isCompleted() && this.onUploadComplete) {
        this.onUploadComplete();
      }
    },
    processFileSuccess(response, file) {
      file.status  = "success";
      file.progress = 100;
      let src = undefined;
      if (this.onFileSuccess) {
         src = this.onFileSuccess(response, file);
       }
      if(src){
        file.src = src
      }
      if (this.isCompleted() && this.onUploadComplete) {
        this.onUploadComplete();
      }
    },
    createFileBlob(file) {
      if (this.getFileType(file) === "image") {
        if (this.supportView) {
          file.blob = URL.createObjectURL(file.rawFile)
        }
      }
    },
    onFileChange() {
      const files = [].slice.call(this.$refs.file.files, 0);
      if (!files.length) {
        return;
      }
      this.$refs.file.value = "";
      const typeErrorFiles = [];
      const countErrorFiles = [];
      const sizeErrorFiles = [];

      files.forEach(rawFile => {
        const file = {
          id: this.createId(),
          name: rawFile.name.trim(),
          src: "",
          ext: this.getFileExt(rawFile),
          size: this.getFileSize(rawFile),
          rawFile: rawFile,
          progress: 0,
          status: "waiting",
          blob: ""
        };
        file.type = this.getFileType(file)
        
        if (this.validateFile(file)) {
          if (this.beforeFileAdd) {
            let next = this.beforeFileAdd(file);
            next = next === undefined ? true : next;
            if (!next) {
              return;
            }
          }
          this.value.push(file);
          this.createFileBlob(file);
          if (this.autoUpload) {
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
    }
  }
};
</script>
