<template>
  <div id="app" class="app">
    <upload
      ref="upload"
      v-model="fileList"
      :list-type="listType"
      :multiple="true"
      :auto-upload="autoUpload"
      :enable-upload="true"
      :max-file-count="50"
      :show-file-name="true"
      :preview-mode="false"
      :show-file-list="true"
      :max-file-size="10"
      :accept-list="['png']"
      :on-file-type-error="onFileTypeError"
      :on-file-count-error="onFileCountError"
      :on-file-size-error="onFileSizeError"
      :before-file-add="beforeFileAdd"
      :on-file-remove="onFileRemove"
      :on-file-click="onFileClick"
      thumb-query="?imgview/w/100/height/50"
    ></upload>
    <button @click="getStatus">获取上传状态</button>
    <button @click="getFileList">获取所有文件</button>
    <button @click="getSuccessList">获取上传成功的文件列表</button>
    <button @click="getErrorList">获取上传失败的文件列表</button>
    <button @click="getUploadingList">获取上传中的文件列表</button>
    <button @click="switchListType">切换列表类型</button>
    <button @click="switchAutoUpload">切换自动上传</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listType: "card",
      fileList: [
       {src: "http://vjs.zencdn.net/v/oceans.mp4 ",status:'waiting'},
        {src:"http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4",status:'pending'},
        "http://yun.it7090.com/video/XHLaunchAd/video02.mp4",
        "http://www.w3school.com.cn/i/movie.ogg",
        "http://www.w3school.com.cn/example/html5/mov_bbb.mp4",
        "http://yun.it7090.com/video/XHLaunchAd/video03.mp4",
        "https://www.baidu.com/img/bd_logo1.png",
        "不支持的文件测试-unknow"
      ],
      autoUpload:true,
    };
  },
  methods: {
    beforeFileAdd: function(file) {
      console.log(file);
    },
    onFileRemove: function(file) {
      console.log(file);
      return true;
    },
    switchAutoUpload: function() {
      this.autoUpload = !this.autoUpload;
    },
    onFileClick: function(file) {
      console.log(file);
      return true;
    },
    getStatus: function() {
      var isCompleted = this.$refs.upload.isCompleted();
      console.log(isCompleted);
    },
    getFileList: function() {
      var files = this.$refs.upload.getFiles();
      console.log(files);
    },
    getSuccessList: function() {
      var files = this.$refs.upload.getSuccessFiles();
      console.log(files);
    },
    getErrorList: function() {
      var files = this.$refs.upload.getErrorFiles();
      console.log(files);
    },
    getUploadingList: function() {
      var files = this.$refs.upload.getUploadingFiles();
      console.log(files);
    },
    switchListType: function() {
      this.listType = this.listType == "card" ? "text" : "card";
    },
    getOringinalList: function() {
      console.log(this.fileList);
    },
    onFileTypeError: function(files) {
      alert("文件类型不正确");
      console.log(files);
    },
    onFileSizeError: function(files) {
      alert("文件大小超过设定值");
      console.log(files);
    },
    onFileCountError: function(files) {
      alert("最多上传5个文件");
      console.log(files);
    }
  }
};
</script>
