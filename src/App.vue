<template>
    <div id="app" class="app">
        <uk-upload 
            ref="upload" 
            v-model="fileList" 
            :token-get-method="getToken"
            :token-url="['/api/qiniu/getconfig?prefixType=2','/HouseImages/GetQiniuToken?bucket={bucket}']" 
            :list-type="listType" 
            :multiple="true" 
            :enable-upload="true"
            :max-file-count="1" 
            :show-file-name="true" 
            :preview-mode="false" 
            :show-file-list="true" 
            :max-file-size="0" 
            :accept-list="[]"
            :before-file-add="beforeFileAdd" 
            :on-file-remove="onFileRemove" 
            :on-file-click="onFileClick" 
            thumb-query="?imgview/w/100/height/50">
        </uk-upload>
        <button @click="getStatus">获取上传状态</button>
        <button @click="getFileList">获取所有文件</button>
        <button @click="getSuccessList">获取上传成功的文件列表</button>
        <button @click="getErrorList">获取上传失败的文件列表</button>
        <button @click="getUploadingList">获取上传中的文件列表</button>
        <button @click="switchListType">切换列表类型</button>
        <!-- <button @click="getOringinalList">获取源始列表</button> -->
    </div>
</template>
<script>
import request from './request'
export default {
  data() {
    return {
      listType: 'card',
      fileList: [
        {
          src: 'http://ooydngjcf.bkt.clouddn.com/Contract.E00EFDA4.png',
          status: 'error'
        },
        {
          src: 'http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png',
          status: 'success'
        },
        {
          src: 'http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png',
          status: 'pending'
        },
        {
          src: 'http://ooydngjcf.bkt.clouddn.com/Contract.3A54B8D2.png',
          status: 'waiting'
        },
        'http://vjs.zencdn.net/v/oceans.mp4 ',
        'http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4',
        'http://yun.it7090.com/video/XHLaunchAd/video02.mp4',
        'http://www.w3school.com.cn/i/movie.ogg',
        'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
        'http://yun.it7090.com/video/XHLaunchAd/video03.mp4',
        'http://yun.it7090.com/video/XHLaunchAd/video01.mp4',
        '不支持的文件测试-unknow',
        {
          src:
            'http://ooydngjcf.bkt.clouddn.com/ServiceProvider.67823423.测试文本.txt',
          type: 'text'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.setCookie('TY_SESSION_ID', '5a8be636-c95e-4180-90dd-3c32bdff86e5')
      this.setCookie('grwng_uid', 'b5477f77-dae0-47da-aa54-1f546e7001a1')
      this.setCookie('_ga', 'GA1.2.1271618431.1535967392')
      this.setCookie(
        'NTKF_T2D_CLIENTID',
        'guest3F4F216C-89DA-241F-AF29-9ECA711C4CE0'
      )
      this.setCookie('Hm_lvt_9efdb82a30972ce34071a031946aa933', '1536116361')
      this.setCookie(
        '.AspNet.Cookies',
        'vPBTUBGKBxxpqxESFSbaFKBnrBYl3GjPVEBqs1CNMIhPqVUR0n2oa3OxuWr9_jO-7p6gwAN9y2lzU65Ffdhtmz8JHGKWSEbiKzkbWBJZP91Q1Wm_0hdWs3Cbi1divY79r8WXgYa9HfFe5khY7SJbKj7J1q4lFP9wAmc_HkZ9W2fxf7WhbrJrXMMeM2UJyo3kTpBEkPQGby32z3UcIiV0LpnFtap9JEkqO4gxxtvttV549-wD2OzwVW7glo3eSM6I6-5w2nJ7r7tNQ-Mz94J6acX3l7HCk_0xcyPYdSvm6TEGymRHmeeeOUTFSKLrhbAJpYsqBJUkDPlOVO0GHC5fWO6zMz00tEqF7xfUHDt5Jbx0DtXdF8kSGmC_FzMDITEf'
      )
      this.setCookie('gr_user_id', 'a1bc9973-87ea-45fe-8484-defc92672868')
      this.setCookie(
        'b60e094c8b912d47_gr_session_id',
        'c9e9f7b4-297f-48e3-af26-2c8763f9271a'
      )
      this.setCookie(
        'b60e094c8b912d47_gr_session_id_c9e9f7b4-297f-48e3-af26-2c8763f9271a',
        'true'
      )
    })
  },
  methods: {
    setCookie(name, value) {
      var Days = 30
      var exp = new Date()
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      document.cookie =
        name + '=' + escape(value) + ';expires=' + exp.toGMTString()
    },
    getToken(done) {
      request.get('/api/qiniu/getconfig', { prefixType: 2 }, data1 => {
        request.get(
          '/HouseImages/GetQiniuToken',
          { bucket: data1.bucket },
          data2 => {
            let data = Object.assign({}, data1, {
              token: data2.uptoken
            })
            done(data)
          }
        )
      })
    },
    beforeFileAdd: function(file) {
      console.log(file)
    },
    onFileRemove: function(file) {
      console.log(file)
      return true
    },
    onFileClick: function(file) {
      console.log(file)
      return true
    },
    getStatus: function() {
      var status = this.$refs.upload.getUploadStatus()
      console.log(status)
    },
    getFileList: function() {
      var files = this.$refs.upload.getFileList()
      console.log(files)
    },
    getSuccessList: function() {
      var files = this.$refs.upload.getSuccessFileList()
      console.log(files)
    },
    getErrorList: function() {
      var files = this.$refs.upload.getErrorFileList()
      console.log(files)
    },
    getUploadingList: function() {
      var files = this.$refs.upload.getUploadingFileList()
      console.log(files)
    },
    switchListType: function() {
      this.listType = this.listType == 'card' ? 'text' : 'card'
    },
    getOringinalList: function() {
      console.log(this.fileList)
    }
  }
}
</script>