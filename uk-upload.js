(function(Vue){
       Vue.component('uk-upload',{
            props:{
                url:String,
                value:{
                    type:Array,
                    default:[]
                },
                multiple:{
                    type:Boolean,
                    default:true
                },
                maxFileSize:{
                    type:Number,
                    default:0,
                },
                maxFileCount:{
                    type:Number,
                    default:0
                },
                extensions:{
                    type:Array,
                    default:[]
                },
                thumbQuery:{
                    type:String,
                    default:''
                },
                tokenUrl:Array,
                previewMode:{
                    type:Boolean,
                    default:false
                },
                enableUpload:{
                   type: Boolean,
                   default:true
               },
               beforeFileAdd:Function,
               onFileClick:Function,
               onFileRemove:Function,
               showFileName:{
                   type:Boolean,
                   default:false
               },
               showFileList:{
                   type:Boolean,
                   default:true
               },
               listType:{
                   type:String,
                   default:'card' //card or text
               }
               
            },
            template:template.innerHTML,
            data:function(){
                return {
                    url:'http://www.qinui.com',
                    supportView: FileReader && (new FileReader()).readAsDataURL,
                    fileList:[],
                    token:'',
                    domain:'',
                    prefix:'',
                    showPreviewDialog:false,
                    index:0,

                }
            },
            computed:{
                overMaxCount:function(){
                    if(this.maxFileCount <=0){
                        return false;
                    }
                    return this.fileList.length >= this.maxFileCount;
                }
            },
            created:function(){
                this.fileList = this.value;
                this.propFix();
                this.getUploadToken();
            },
            methods:{
                request:function(options){
                   var params = options.data;
                   var url = options.url;
                   if(params && typeof params === 'object'){
                       for(var key in params){
                           if(params.hasOwnProperty[key]){
                                url += (url.indexOf('?') > -1 ? '&' : '?') + key + '=' + params[key];
                           }
                       }
                   }
                   var xhr = new XMLHttpRequest();
                   xhr.open("GET", url, true);
                   xhr.onreadystatechange = function () {
                       if (xhr.readyState == 4) {
                            var data = xhr.responseText;
                            try {
                                data = JSON.parse(xhr.responseText);
                            } catch (e) {}
                           if (xhr.status == 200 || xhr.status == 304) {
                                
                                options.success && options.success(data);
                                options.complete && options.complete(true,data);

                           } else {
                                options.error && options.error(data);
                                options.complete && options.complete(false,data);
                           }
                       }
                   }
                   xhr.send(null);
                },
                getUploadToken: function (index) {
                    var _self = this;
                    if(index === undefined){
                        index = 0;
                    }
                    if(!this.tokenUrl || !this.tokenUrl.length || index >= this.tokenUrl.length || !this.tokenUrl[index]){
                        return;
                    }
                    _self.request({
                        url: this.tokenUrl[index],
                        complete: function (success,res) {
                            if(success){
                                var url = _self.tokenUrl[index + 1];
                                for (var key in res) {
                                    if (res.hasOwnProperty[key]) {
                                        if (['token', 'uptoken'].indexOf(key.toLowerCase()) > -1) {
                                            _self.token = res[key];
                                        }
                                        if (key.toLowerCase() === 'domain') {
                                            _self.domain = res[key];
                                        }
                                        if (key.toLowerCase() === 'prefix') {
                                            _self.prefix = res[key];
                                        }
                                        if (url) {
                                            var exp = new RegExp('{\s*' + key + '\s*}', 'ig');
                                            url = url.replace(exp, res[key]);
                                        }
                                    }
                                }
                            }
                            
                            if(!_self.token || !success){
                                index = index + 1;
                                if(index >= _self.tokenUrl.length){
                                    console.error('获取上传token失败！');
                                }else{
                                    _self.getUploadToken(index);
                                }
                            }
                        }
                    });
                },
                getKey: function (file) {
                    var _self = this;
                    var ext = file.ext ? '.' + file.ext : '';
                    var key = (_self.prefix ? _self.prefix : 'A') + '.' + _self.creareGuid(8, 16) + ext;
                    return key;
                },
                propFix:function(){
                    var _self = this;
                    this.fileList.forEach(function (file,index) {
                       if(typeof file === 'string'){
                            _self.value[index] = {src:file};
                            file = _self.value[index];
                       }
                       if (file.id === undefined) {
                           file.id = _self.createId();
                       }
                       if(file.name === undefined){
                           file.name = file.src.split('/').pop();
                       }
                       if(file.ext === undefined){
                           file.ext = _self.getFileExt(file.name);
                       }
                       if(file.size === undefined){
                           file.size = '';
                       }
                       if(file.rawFile === undefined){
                           file.rawFile = null
                       }
                       if (file.progress === undefined) {
                           file.progress = 100;
                       }
                       if (file.status === undefined) {
                           file.status = 'success';
                       }
                       if (file.thumbSrc === undefined){
                           file.thumbSrc = file.src + _self.thumbQuery;
                       }
                   });
                },
                getFileType:function(file){
                    if (['jpg','png','gif','bmp','jpeg'].indexOf(file.ext) > -1)
                    {
                        return 'image';
                    }
                    if(['mp4','avi','rmvb','mkv'].indexOf(file.ext) > -1){
                        return 'video'
                    }
                    if(['mp3','ogg','m4a'].indexOf(file.ext) > -1){
                        return 'audio';
                    }
                    return 'file';
                },
                getFileList:function(status){
                    return this.fileList.filter(function(file){
                        return file.status === status;
                    });
                },
                getSuccessFileList:function(){
                   return this.getFileList('success');
                },
                getUploadingFileList:function(){
                    return this.fileList.filter(function(file){
                        return file.status === 'pending' || file.status === 'waiting';
                    });
                },
                getErrorFileList:function(){
                    return this.getFileList('error');
                },
                getUploadStatus:function(){
                    return this.getUploadingFileList().length ? 'uploading' : 'completed'; 
                },
                createId:function(){
                    var id = 0;
                    return function(){
                        return ++id;
                    }
                }(),
                creareGuid: function (len, radix) {
                   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                   var uuid = [],
                       i;
                   radix = radix || chars.length;
                   if (len) {
                       for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                   } else {
                       var r;
                       uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                       uuid[14] = '4';
                       for (i = 0; i < 36; i++) {
                           if (!uuid[i]) {
                               r = 0 | Math.random() * 16;
                               uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                           }
                       }
                   }
                   return uuid.join('');
                },
                openFileBrowser:function(){
                    // if(!this.token){
                    //     return;
                    // }
                    this.$refs.file.click();
                },
                handleFileClick:function(file){
                    var next = true;
                    if(this.onFileClick){
                        next = this.onFileClick(file);
                        next = next === undefined ? true : next;
                    }
                    if(next && file.status === 'success'){
                        this.index = this.fileList.indexOf(file);
                        this.showPreviewDialog = true;
                    }
                },
                handleFileRemove:function(file){
                    var isRemove = true;
                    if(this.onFileRemove){
                        isRemove = this.onFileRemove(file);
                        isRemove = isRemove === undefined ? true : isRemove;
                    }
                    if(isRemove){
                        this.fileList.splice(this.fileList.indexOf(file),1);
                    }
                },
                getFileExt:function(file){
                    var name = file;
                    if(typeof file === 'object'){
                        name = file.name ;
                    }
                    var res = name.match(/\.([\w\d]{1,4})$/i);
                    return res ? res[1].toLowerCase() : '';
                },
                getFileSize:function(file){
                    return file.size / 1024 / 1024;
                },
                validateFile:function(file){
                    var res = true;
                    if(this.maxFileCount > 0 && this.fileList.length >= this.maxFileCount){
                        res = false;
                    }
                    if(this.maxFileSize > 0 && file.size > this.maxFileSize){
                       res = false;
                    }
                    if(this.extensions.length && this.extensions.indexOf(file.ext) === -1){
                       res = false;
                    }
                    return res;
                },
                reload:function(file){
                    file.status = 'waiting';
                    file.progress = 0;
                    this.upload(file);
                },
                upload:function(file){
                    var _self = this;
                    var options = {
                        file:file,
                        key:_self.getKey(file),
                        token:_self.token
                    };
                    new Uploader(this.url)
                    .upload(options)
                    .start(function(file){
                        file.status = 'pending';
                    })
                    .progress(function(file,percent){
                        file.progress = percent;
                    })
                    .then(function(response,file){
                           file.status = 'success';
                           file.progress = 100;
                           file.src = _self.domain + response.key;
                    })
                    .catch(function(file){
                        file.status = 'error';
                    });
                    
                },
                onStart:function(file){
                    this.fileList.push(file);
                    if(this.supportView) {
                       var reader = new FileReader();
                       reader.readAsDataURL(file);
                       reader.onload = function (e) {
                           file.thumbSrc = this.result;
                       }
                   }
                },
                onFileChange:function(){
                   var files = [].slice.call(this.$refs.file.files,0);
                   if(!files.length){
                       return;
                   }
                   this.$refs.file.value = '';
                   files.forEach(function(rawFile){
                       var file = {
                           id:this.createId(),
                           name:rawFile.name,
                           src:'',
                           ext:this.getFileExt(rawFile),
                           size:this.getFileSize(rawFile),
                           rawFile:rawFile,
                           progress:0,
                           status:'waiting',
                           thumbSrc:'',
                       }
                       if(this.validateFile(file)){
                           if(this.beforeFileAdd){
                               var next = this.beforeFileAdd(file);
                               next = next === undefined ? true : next;
                               if(!next){
                                    return;
                               }
                           }
                            this.onStart(file);
                            this.upload(file);
                       }
                       
                   }.bind(this));
                }
            }
        });
    })(Vue);