<template>
    <div id="app" class="app">
        <uk-upload ref="upload" v-model="fileList" :token-url="['/api/qiniu/getconfig?prefixType=2','/HouseImages/GetQiniuToken?bucket={bucket}']" :list-type="listType" :multiple="true" :enable-upload="true"
            :max-file-count="5" :show-file-name="true" :preview-mode="false" :show-file-list="true" :max-file-size="0" :extensions="[]"
            :before-file-add="beforeFileAdd" :on-file-remove="onFileRemove" :on-file-click="onFileClick" thumb-query="?imgview/w/100/height/50">
        </uk-upload>
        <button @click="getStatus">获取上传状态</button>
        <button @click="getFileList">获取所有文件</button>
        <button @click="getSuccessList">获取上传成功的文件列表</button>
        <button @click="getErrorList">获取上传失败的文件列表</button>
        <button @click="getUploadingList">获取上传中的文件列表</button>
        <button @click="switchListType">切换列表类型</button>
        <button @click="getOringinalList">获取源始列表</button>
    </div>
</template>
<script>
export default {
  data() {
    return {
      listType: "card",
      fileList: [
        {
          src: "http://ooydngjcf.bkt.clouddn.com/Contract.E00EFDA4.png",
          status: "error"
        },
        {
          src: "http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png",
          status: "success"
        },
        {
          src: "http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png",
          status: "pending"
        },
        {
          src: "http://ooydngjcf.bkt.clouddn.com/Contract.3A54B8D2.png",
          status: "waiting"
        },
        "http://vjs.zencdn.net/v/oceans.mp4 ",
        "http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4",
        "http://yun.it7090.com/video/XHLaunchAd/video02.mp4",
        "http://www.w3school.com.cn/i/movie.ogg",
        "http://www.w3school.com.cn/example/html5/mov_bbb.mp4",
        "http://yun.it7090.com/video/XHLaunchAd/video03.mp4",
        "http://yun.it7090.com/video/XHLaunchAd/video01.mp4",
        "不支持的文件测试-unknow",
        {
          src:
            "http://ooydngjcf.bkt.clouddn.com/ServiceProvider.67823423.测试文本.txt",
          type: "text"
        }
      ]
    };
  },
  mounted(){
    this.$nextTick(_=>{
      this.setCookie("TY_SESSION_ID",'339798d4-af9c-40ec-ae32-3e8334b025b5');
      this.setCookie("grwng_uid",'840fe994-4bfc-4b0c-bed0-01707e34ba1f')
      this.setCookie("_ga",'GA1.2.611614428.1497235082')
      this.setCookie("NTKF_T2D_CLIENTID",'guestD4CC3396-228A-B8CC-AB82-4F5ABA2C810E')
      this.setCookie("Hm_lvt_9efdb82a30972ce34071a031946aa933",'1532678787')
      this.setCookie(".AspNet.Cookies",'t7LeLovKNMvJBrEtO_71XgerYDEsZa--cQu2WQoF9XgX8VOg8NNHG7V20kQMNCwUDhm9iNJ8vJ9QFhfu4XWMeRCPZEqI_X42iJgSMHqoIP2Zhq4NMKMOJxRUtZdiB5B_O3G5n0IO3O8I-SPNmTMo7nPqRI3gZjW9IwNo-NgE72qd5y_Zz0qB4fGfqpUSs7HTULFmIksRTJ8lhORRqCADZpTti4TmkDFzbL-O3mlK-uxkOY4mB-UEdJTnkWQG693lc82t-EZOu8RErgWWM4Q_hMU53JmRY7M8fPwoSHsVqXyqyL-kgvn_KjJFCg0rdBxGN-HEOzT69pWdZ_W1AuNP2iAZPPkfaHs3B7Fc8c6StN0')
      this.setCookie("gr_user_id",'a59fd621-d876-4659-8b2e-a81fd1cda674')
      this.setCookie("b60e094c8b912d47_gr_session_id",'743e10bc-25b2-41ae-a61d-5b791f67cf9d')
      this.setCookie("60e094c8b912d47_gr_session_id_743e10bc-25b2-41ae-a61d-5b791f67cf9d",'true')
    })
  },
  methods: {
    setCookie (name,value){
      var Days = 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    beforeFileAdd: function(file) {
      console.log(file);
    },
    onFileRemove: function(file) {
      console.log(file);
      return true;
    },
    onFileClick: function(file) {
      console.log(file);
      return true;
    },
    getStatus: function() {
      var status = this.$refs.upload.getUploadStatus();
      console.log(status);
    },
    getFileList: function() {
      var files = this.$refs.upload.getFileList();
      console.log(files);
    },
    getSuccessList: function() {
      var files = this.$refs.upload.getSuccessFileList();
      console.log(files);
    },
    getErrorList: function() {
      var files = this.$refs.upload.getErrorFileList();
      console.log(files);
    },
    getUploadingList: function() {
      var files = this.$refs.upload.getUploadingFileList();
      console.log(files);
    },
    switchListType: function() {
      this.listType = this.listType == "card" ? "text" : "card";
    },
    getOringinalList:function(){
      console.log(this.fileList);
    }
  }

};
</script>