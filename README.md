# vue-upload
轻量级的vue上传组件，已上传文件列表中的图片支持预览大图、音视频支持播放
### 安装 
本组件没有发布到npm，所以需要手动克隆或下载
```sh
git clone https://github.com/laivv/vue-upload.git
```
### 引入
```js
import upload from './upload'
```
### 上传文件

```html
<upload 
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"
>
</upload>

<script>
  export default {
    data(){
      return {
        fileList:[]
      }
    },
    onFileSuccess(response, file){
      // 返回文件的url地址
      return resopnse.data.fileUrl 
    }
  }
</script>  
```
### 携带额外的参数
实际开发中可能需要token或者其它额外参数时，可以通过`data`属性传入,`data`会被展开合并到上传的参数中



```html
<upload 
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"
  :data="extraData"
  
>
</upload>

<script>
  export default {
    data(){
      return {
        fileList:[],
        extraData:{
          fileName:'文件1',
          token:'abcdefg'
        }
      }
    },
    onFileSuccess(response, file){
      // 返回文件的url地址
      return resopnse.data.fileUrl 
    }
  }
</script>  
```



### 自定义上传行为（会覆盖组件自身的上传）
当`data`属性携带额外数据不能满足需求，或都是需要自定义上传时，可以传入`custom-request`来自定义上传行为

```html
<upload 
  v-model="fileList"
  url="http://uploadaddress.com"
  :custom-request="customRequest"
  :on-file-success="onFileSuccess"
>
</upload>

<script>
  export default {
    data(){
      return {
        fileList:[]
      }
    },
    customRequest(file){
      // 必须返回一个Promise
      return new Promise((resolve, reject) => {
        // 获取原始文件 （参数file是经过组件包装后的数据，并不是原始文件）
        const rawFile = file.rawFile
        // 用户自已处理上传...
        // file.process = 50  可以设置上传进度，以便组件显示
        // if(finish){
        // resolve(response)  response为服务器返回的数据，用于在onFileSuccess回调中使用
        //}
      })
    }
    onFileSuccess(response, file){
      return resopnse.data.fileUrl
    }
  }
</script>  
```
`customRequest`必须返回一个`Promise`


### 给组件绑定初始列表 
fileList的格式需要按照下面一样，其中 列表项中的`type`字段的类型只能是这些：`image`、 `video`、 `audio`、 `text`、 `rar` 、`file`，用于在列表中显示文件类型图标
```html
<upload 
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"

></upload>

<script>
 export default {
    data(){
      return {
        fileList:[
          {
            src:'/a1.jpg',
            type:'image' //如果不设置type属性，默认为 `file` ，将不能作为图片预览
          },
          {
            src:'/a2.avi',
            type:'video'
          },
          {
            src:'/a3.mp3',
            type:'audio'
          },
          {
            src:'/a4.txt',
            type:'text'
          },
          {
            src:'/a5.zip',
            type:'rar'
          },
          {
            src:'/a5.7z',
            type:'rar'
          },
          {
            src:'/a6-unknow-file-type',
            type:'file'
          },
        ]
      }
    },
     onFileSuccess(response, file){
      return resopnse.data.fileUrl 
    }
  }

</script>  
```


### 获取上传状态

```html
<upload 
  ref="upload"
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"
 ></upload>
<button @click="submit">提交</button>

<script>
 export default {
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
      submit(){
         const isCompleted = this.$refs.upload.isCompleted() //true上传完毕 ;false未上传完毕
         if(!isCompleted){
            alert("还有文件正在上传，不能提交")
          }
      },
      onFileSuccess(response, file){
        return resopnse.data.fileUrl 
      }
  
    }
  }

</script>  
```

### 获取上传成功的文件列表

```html
<upload 
  ref="upload" 
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"
></upload>
<button @click="submit">提交</button>

<script>
  export default {
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
     submit(){
        //获取上传成功的文件列表
          const successFiles = this.$refs.upload.getSuccessFiles()
        //提交数据 do ajax...
      },
      onFileSuccess(response, file){
        return resopnse.data.fileUrl 
      }
    }
  }

</script>  
```


### 获取 所有/失败 的文件列表

```html
<upload 
  ref="upload" 
  v-model="fileList"
  url="http://uploadaddress.com"
  :on-file-success="onFileSuccess"
></upload>
<button @click="getErrorFiles">获取上传失败的文件列表</button>
<button @click="getFiles">获取所有文件列表</button>

<script>
  export default {
    data(){
      return {
        fileList:[]
      }
    },
    methods:{
     getErrorFiles(){
        //上传失败的文件列表
        const errorFiles = this.$refs.upload.getErrorFiles()
        console.log(errorFileList)
      },
      getFiles() {
        //所有文件列表，同 `v-model` 绑定的list一样
        const files = this.$refs.upload.getFiles()
        console.log(files)
      },
      ,
      onFileSuccess(response, file){
        return resopnse.data.fileUrl 
      }
    }
  }

</script>  
```



### 组件只读展示
将组件的`readonly`属性设置为`true`则仅将组件作展示用途，不能上传或编辑
```html
<upload v-model="fileList" :readonly="true"></upload>

<script>
 export default {
    data(){
      return {
        fileList:[
          {
            src:'/a1.jpg',
            type:'image' 
          },
          {
            src:'/a2.avi',
            type:'video'
          },
          {
            src:'/a3.mp3',
            type:'audio'
          },
          {
            src:'/a4.txt',
            type:'text'
          },
          {
            src:'/a5.zip',
            type:'rar'
          },
          {
            src:'/a5.7z',
            type:'rar'
          },
          {
            src:'/a6-unknow-file-type',
            type:'file'
          },
        ]
      }
    }
  }

</script>  
```




### 单独使用组件的预览窗功能
当不想使用组件自带的文件列表，但又想使用组件的预览功能时，可以仅使用组件的预览功能  
将组件的`readonly`属性设置为`true`，并且将`showFileList`设置为`false`能够起到不显示组件的作用
```html
<upload ref="upload" :readonly="true" :show-file-list="false" v-model="currentFileList"></upload>
<div>
  <img :src="image.src" v-for="(image,index) in image1" @click="showPreview(index,image1)">
</div>
<div>
  <img :src="image.src" v-for="(image,index) in image2" @click="showPreview(index,image2)">
</div>

<script>
 export default {
    data(){
      return {
        image1:[
          {
            src:'/a1.jpg',
            type:'image'
          },
          {
            src:'/a2.jpg',
            type:'image'
          }
        ],
         image2:[
          {
            src:'/b1.jpg',
            type:'image'
          },
          {
            src:'/b2.jpg',
            type:'image'
          }
        ],
        currentFileList:[]
      }
    },
    methods:{
      showPreview(index,files){
          this.currentFileList = files
          this.$refs.upload.openPreviewer(index)
      }
    }
  }

</script>  
```



### 属性
|属性名|说明|类型|默认值|
|----------|----------------|-----|------|
|url|上传的url地址，必填|String|无|
|v-model|绑定的数据|Array|[]|
|name|上传的参数名|String|`file`|
|auto-upload|是否在选择文件后立即上传|Boolean|`true`|
|multiple|是否支持同时选择多个文件|Boolean|true|
|max-file-size|单个文件大小限制（MB）|Number|无|
|max-file-count|最多上传多少个文件|Number|无|
|accepts|可上传的文件扩展名列表(如 ['jpg','png'])|Array|无|
|thumb-query|如果上传的是图片，此参数为缩略图query字符串,用于在显示文件列表是图片的时候节约流量(如'?image/height/200/width/100')|String|无|
|readonly|是否只读模式,设为true将不能上传，只作展示使用|Boolean|false|
|enable-upload|是否开启上传，某些条件下不允许用户再进行上传操作可设置为false|Boolean|true|
|show-file-name|显示上传的文件名|Boolean|false|
|show-file-list|显示上传的文件列表|Boolean|true|
|show-preview-file-name|显示全屏预览器中的文件名|Boolean|false|
|list-type|文件列表的显示方式,可选值 'list' 或 'card'|String|card|
|data|额外的参数,将被展开并且合并到上传的参数中|Object|无|


### 回调钩子
|属性名|说明|回调参数|回调参数说明|
|------------|--------------------|-----|-------------|
|before-file-add|当某个文件在添加到上传列表之前调用，通过返回true或false来决定该文件是否被添加|Function(file)|即将被添加的文件|
|on-file-success|当某个文件上传成功时调用|Function(file,response,param?)|file:上传成功的那个文件,response:上传成功服务器返回的数据|
|on-file-error|当某个文件上传失败时调用|Function(file)|某个上传失败的文件|
|on-upload-complete|当所有文件上传完毕时调用（无论上传成功还是失败）|Function()|无|
|on-file-click|当点击文件列表中的某个文件时调用，通过返回true或false来决定是否打开预览窗|Function(file)|被点击的那个文件|
|on-file-remove|当移除文件列表中的某个文件时调用，通过返回true、false或Promise来决定该文件是否移除|Function(file)|将被移除的那个文件|
|on-preview-close|当预览窗关闭的时候调用|Function()|无|
|on-preview-switch|当在预览窗中切换上一个或下一个文件时调用|Function(index,file)|index:当前文件在文件列表filelist中的索引;file:当前文件|
|on-file-type-error|当上传的文件类型不符合设定的值时调用|Function(files)|不符合条件的文件列表|
|on-file-count-error|当上传的文件超过限定的个数时调用|Function(files)|超出部分的文件列表|
|on-file-size-error|当上传的单个文件大小超过设定的值时调用|Function(files)|超过设定大小的文件列表|
|custom-request|用户自定义上传行为，必须返回一个promise,成功时resolve(response),response为服务器返回的数据|Function(file) ;file为经过包装后的数据|

### 组件实例方法  
使用`vm.$refs.uploadRef.methodName()`的形式来调用   
|方法名|参数|说明|
|-----|-----|------|
|getSuccessFiles|-|获取上传成功的文件列表|
|getErrorFiles|-|获取上传失败的文件列表|
|getUploadingFiles|-|获取正在上传的文件列表|
|getFiles|-|获取所有文件列表（含 上传成功/失败/上传中/等待上传 的文件）|
|isCompleted|-|获取所有文件是否上传完毕|
