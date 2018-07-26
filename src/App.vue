<template>
        <div id="app" class="app">
                <uk-upload 
                ref="upload"
                v-model="fileList" 
                :token-url="['111','222']" 
                :list-type="listType"
                :multiple="true"
                :enable-upload="true"
                :max-file-count="5"
                :show-file-name="true"
                :preview-mode="false"
                :show-file-list="true"
                :max-file-size="0"
                :extensions="[]"
                :before-file-add="beforeFileAdd"
                :on-file-remove="onFileRemove"
                :on-file-click="onFileClick"
                thumb-query="?imgview/w/100/height/50"
                >
            </uk-upload>
            <button @click="getStatus">获取上传状态</button>
            <button @click="getSuccessList">获取上传成功的文件列表</button>
            <button @click="getErrorList">获取上传失败的文件列表</button>
            <button @click="getUploadingList">获取上传中的文件列表</button>
            <button @click="switchListType">切换列表类型</button>
        </div>
    
</template>
<script>
  
    export default {
        data(){
            return{
                listType:'card',
                fileList:[{src:'http://ooydngjcf.bkt.clouddn.com/Contract.E00EFDA4.png',status:'error'},
                   {src:'http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png',status:'success'},
                   {src:'http://ooydngjcf.bkt.clouddn.com/Contract.8036359D.png',status:'pending'},
                   {src:'http://ooydngjcf.bkt.clouddn.com/Contract.3A54B8D2.png',status:'waiting'},
                   'http://vjs.zencdn.net/v/oceans.mp4 ',
                    'http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4',
                    'http://yun.it7090.com/video/XHLaunchAd/video02.mp4',
                    'http://www.w3school.com.cn/i/movie.ogg',
                    'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
                    'http://yun.it7090.com/video/XHLaunchAd/video03.mp4',
                    'http://yun.it7090.com/video/XHLaunchAd/video01.mp4'
                ]
            }
        },
        methods:{
            beforeFileAdd:function(file){
                console.log(file)
            },
            onFileRemove:function(file){
                console.log(file);
                return true;
            },
            onFileClick:function(file){
                console.log(file);
                return true;
            },
            getStatus:function(){
               var status = this.$refs.upload.getUploadStatus();
               console.log(status);
            },
            getSuccessList:function(){
                var status = this.$refs.upload.getSuccessFileList();
               console.log(status);
            },
            getErrorList:function(){
                var status = this.$refs.upload.getErrorFileList();
               console.log(status);
            },
            getUploadingList:function(){
                var status = this.$refs.upload.getUploadingFileList();
               console.log(status);
            },
            switchListType:function(){
                this.listType = this.listType == 'card' ?  'text' :'card';
            }
        }
    }
</script>