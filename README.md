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

<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
      getUploadStatus(){
         const uploadStatus = this.$refs.upload.getUploadStatus() //true上传完毕 false未上传完毕
      }
  
    }
  })

</script>  
```

### 获取上传成功的文件列表

```html
<uk-upload ref="upload" v-model="fileList"></uk-upload>

<script>
  new Vue({
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
      getUploadStatus(){
         const successFileList = this.$refs.upload.getSuccessFileList() 
      }
    }
  })

</script>  
```

