# vue-upload
### 使用组件
```html
<uk-upload v-model="fileList"></uk-upload>

<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    }
  })

</script>  
```

### 获取上传状态

```html
<uk-upload ref="upload" v-model="fileList"></uk-upload>
<button @click="submit">提交</button>
<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
      submit(){
         const uploadStatus = this.$refs.upload.getUploadStatus() //true上传完毕 ;false未上传完毕
         if(!uploadStatus){
            alert("还有文件正在上传，不能提交")
          }
      }
  
    }
  })

</script>  
```

### 获取上传成功的文件列表

```html
<uk-upload ref="upload" v-model="fileList"></uk-upload>
<button @click="submit">提交</button>
<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
     submit(){
        //获取上传是否完毕，无论上传成功还是失败
         const uploadStatus = this.$refs.upload.getUploadStatus() //true上传完毕 ;false未上传完毕
         if(!uploadStatus){
            alert("还有文件正在上传，不能提交")
          }else{
              //获取上传成功的文件列表
              const successFiles = this.$refs.upload.getSuccessFileList()
              //提交数据 do ajax
          }
      }
    }
  })

</script>  
```


### 获取 所有/失败 的文件列表

```html
<uk-upload ref="upload" v-model="fileList"></uk-upload>
<button @click="getErrorFiles">获取上传失败的文件列表</button>
<button @click="getFiles">获取所有文件列表</button>
<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
     getErrorFiles(){
        //上传失败的文件列表
        const errorFiles = this.$refs.upload.getErrorFileList()
        console.log(errorFileList)
      },
      getFiles() {
        //同 `v-model` 绑定的list一样
        const files = this.$refs.upload.getFileList()
        console.log(files)
    },
    }
  })

</script>  
```


### 属性
|属性名|说明|类型|默认值|
|-------|----------------|-----|------|
|url|上传的url地址|String|upload.qiniu.com|
|v-model|绑定的数据|Array|[]|
|multiple|是否支持同时选择多个文件|Boolean|true|
|maxFileSize|单个文件大小限制（MB）|Number|无|
|maxFileCount|最多上传多少个文件|Number|无|
|acceptList|可上传的文件扩展名列表(如 ['jpg','png'])|Array|无|
|thumbQuery|如果上传的是图片，此参数为缩略图query字符串,(如'?image/height/200/width/100')|String|无|
|tokenUrl|获取上传token的url列表(如 ['/api/token1','/api/token2'])|Array|无|
|previewMode|是否预览模式,设为true将不能上传，只作展示使用|Boolean|false|
|enableUpload|是否开启上传，某些条件下不允许用户再进行上传操作可设置为false|Boolean|true|
|showFileName|显示上传的文件名|Boolean|false|
|showFileList|显示上传的文件列表|Boolean|true|
|showPreviewFileName|显示全屏预览器中的文件名|Boolean|false|
|listType|文件列表的显示方式,可选值 'list' 或 'card'|String|card|

