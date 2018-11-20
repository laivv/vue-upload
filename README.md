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
