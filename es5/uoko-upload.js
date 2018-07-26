   (function(Vue) {
       var template = '<div class="uoko-up-load-box">' +
           '<div class="uoko-up-load-item" v-for="img in value">' +
           '<div class="uoko-up-load-item-wrap">' +
           '<div class="uoko-up-load-item-content">' +
           '<span class="uoko-up-load-item-remove" @click="removePic(img.id)" v-if="!previewMode">×</span>' +
           '<div class="uoko-up-load-full uoko-up-load-img-wrap">' +
           '<img :src="img.thumbSrc" v-if="isSupportView || img.status===\'success\'" @click="showBigPic(img)" class="uoko-upload-img" />' +
           '</div>' +
           '<div class="uoko-up-load-mask" v-show="img.status!==\'success\'">' +
           '<div class="uoko-up-load-progress" v-show="img.status ==\'pending\'">' +
           '<span class="uoko-up-load-progress-bar">{{img.progress}}%</span>' +
           '</div>' +
           '<span class="uoko-up-load-error" v-if="img.status===\'fail\'">!</span>' +
           '</div>' +
           '<div v-if="showFileName" class="uoko-up-load-file-name" :title="img.name">{{img.name}}</div>' +
           '</div>' +
           '</div>' +
           '</div>' +
           '<div class="uoko-up-load-item" v-if="!previewMode" v-show="!isOverMaxNumber && enableUpload">' +
           '<div class="uoko-up-load-item-wrap">' +
           '<div class="uoko-up-load-item-content uoko-up-load-add-btn">' +
           '<div class="uoko-up-load-full uoko-up-load-add-btn" ref="uokouploadbtn">' +
           '<span class="uoko-up-load-add-icon">+</span>' +
           '</div>' +
           '</div>' +
           '</div>' +
           '</div>' +
           '<div class="uoko-up-load-preview-dialog" v-show="showPreviewDialog">' +
           '<div class="uoko-up-load-preview-wrapper">'+
           '<div class="uoko-up-load-imgwrapper" v-show="imageStatus === \'success\'" :style="{transform:transform}" ref="picbox" @mousedown="mousedown($event)" @mousemove="mousemove">'+
           '<img :src="currentSrc" class="uoko-up-load-preview-pic" @load="imageLoadHandler($event,\'success\')" @dragstart="imgDragStart($event)" @error="imageLoadHandler($event,\'error\')">'+
           '</div>'+
           '<div v-show="imageStatus === \'pending\'" class="uoko-up-load-loadtip"><i class="iconfont icon-loading"></i></div>' +
           '<div v-show="imageStatus === \'error\'" class="uoko-up-load-loadtiperr"><i class="iconfont icon-loading-error"></i></div>' +
           '<div class="uoko-up-load-uoko-up-load-dialog-close" @click="showPreviewDialog = false">×</div>' +
           '<div class="uoko-up-load-preview-prev-btn" @click="prevPic">&lt;</div>' +
           '<div class="uoko-up-load-preview-next-btn" @click="nextPic">&gt;</div>' +
           '<div class="uoko-up-load-preview-info">' +
           '<div>{{current}}/{{total}}</div>' +
           '<div class="uoko-up-load-preview-info-btns"><button @click="rotate(-90)" title="向左旋转"><i class="iconfont icon-xuanzhuan1"></i></button><button @click="rotate(90)" title="向右旋转"><i class="iconfont icon-xuanzhuan"></i></button><button @click="setLocationCenter" title="居中"><i class="iconfont icon-juzhong"></i></button><button @click="scale(1,true)" title="原始比例"><i class="iconfont icon-yuanshidaxiao"></i></button><button @click="scale(0.2)" title="放大"><i class="iconfont icon-fangda"></i></button><button @click="scale(-0.2)" title="缩小"><i class="iconfont icon-suoxiao"></i></button><button @click="prevPic" title="上一张"><i class="iconfont icon-jiantou"></i></button><button @click="nextPic" title="下一张"><i class="iconfont icon-endarrow"></i></button></div>' + 
           '</div>' +
           '</div>' +
           '</div>' +
           '</div>';
       Vue.component('uoko-upload', {
           template: template,
           props: {
               value: {
                   type: Array,
                   default: []
               },
               configUrl: {
                   type: String,
                   default: ''
               },
               tokenUrl: {
                   type: String,
                   default: ''
               },
               thumbPicQuery: {
                   type: String,
                   default: ''
               },
               previewMode: {
                   type: Boolean,
                   default: false
               },
               maxNumber: {
                   type: Number,
                   default: 0
               },
               maxFileSize: {
                   type: Number,
                   default: 0
               },
               enableUpload:{
                   type: Boolean,
                   default:true
               },
               onFileAdd: {
                   type:Function,
                   default:null
               },
               showFileName:{
                   type:Boolean,
                   default:false
               }
           },
           data: function() {
               return {
                   isSupportView: FileReader && (new FileReader()).readAsDataURL,
                   showPreviewDialog: false,
                   isOverMaxNumber: this.maxNumber > 0 && this.value.length >= this.maxNumber,
                   currentSrc: '',
                   currentId:'',
                   isInitedConfig:false,
                   imageLoadStatus:{},
                   srcX:0,
                   srcY:0,
                   offLeft:0,
                   offTop:0,
                   isMouseDown:false,
                   styles:{}//存放缩放旋转相关信息

             
                 
               }
           },
           methods: {
                autoScale:function(image){
                    var imageWidth = image.width ;
                    var imageHeight = image.height ;
                    var screenWidth  = window.innerWidth;
                    var screenHeight = window.innerHeight;
                    var height = imageHeight;
                    var width = imageWidth;
                    if(this.styles[this.currentId] === undefined){
                        this.$set(this.styles,this.currentId,{rotate:0,scale:1,x:'50%',y:'50%'});
                    }
                    var style = this.styles[this.currentId];
                    var n = 1;
                    while(width >= screenWidth){
                        n -= 0.1;
                        width = imageWidth * n;
                        height = imageHeight * n;
                    }
                    while(height >= screenHeight){
                        n -= 0.1;
                        height = imageHeight * n;
                    }
                    style.scale = n;
                },
                imageLoadHandler:function(e,status){
                    var src = e.target.src;
                    this.$set(this.imageLoadStatus,src,status);
                    if(status === 'success'){
                        this.autoScale(e.target);
                    }
                    
                },
                resetImgStatus:function(src,status){
                    this.$set(this.imageLoadStatus,this.currentSrc,'pending');
                },
               createId:function(){
                    var s = 0;
                    return function (){
                        return ++s + '';
                    }
               }(),
               getConfig: function () {
                   var self = this;
                   var xhr = new XMLHttpRequest();
                   xhr.open("GET", this.configUrl, true);
                   xhr.onreadystatechange = function () {
                       if (xhr.readyState == 4) {
                           if (xhr.status == 200 || xhr.status == 304) {
                               try {
                                   var data = JSON.parse(xhr.responseText);
                               } catch (e) {
                                   console.error("返回的七牛配置JSON解析失败！");
                                   return;
                               }
                               self.upload(data);

                           } else {
                               console.error("获取七牛配置失败！");
                           }
                       }
                   }
                   xhr.send(null);
               },
               getToken: function (tokenUrl, fn) {
                   var self = this;
                   var xhr = new XMLHttpRequest();
                   xhr.open("GET", tokenUrl, true);
                   xhr.onreadystatechange = function () {
                       if (xhr.readyState == 4) {
                           if (xhr.status == 200 || xhr.status == 304) {
                               try {
                                   var data = JSON.parse(xhr.responseText);
                                   fn && fn(data);
                               } catch (e) {
                                   console.error("返回的Token解析失败！");
                                   return;
                               }


                           } else {
                               fn && fn({});
                               console.error("获取Token失败！");
                           }
                       }
                   }
                   xhr.send(null);
               },
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
               upload: function (config) {
                   if (typeof Qiniu === 'undefined') {
                       throw new Error("缺少七牛库！");
                   }
                   var self = this;
                   var option = {
                       runtimes: 'html5,flash,html4',
                       browse_button: self.$refs.uokouploadbtn,
                       filters: {
                           mime_types: [{
                               title: "image files",
                               extensions: "jpg,jpeg,png,gif,bmp"
                           }]
                       },
                       domain: config.domain || config.Domain,
                       get_new_uptoken: false,
                       /*     max_file_size: '5mb',*/
                       flash_swf_url: 'plupload/Moxie.swf',
                       max_retries: 4,
                       dragdrop: false,
                       chunk_size: '4mb',
                       auto_start: true,
                       init: {
                           'FilesAdded': function (up, files) {
                               if (self.maxNumber > 0 && self.value.length >= self.maxNumber) {
                                   return;
                               }

                               plupload.each(files, function (file) {

                                    if (!self.enableUpload) 
                                    {
                                        up.removeFile(file);
                                        return;
                                    }

                                   var isOverMaxNumber = (self.maxNumber > 0 && self.value.length >= self.maxNumber) ? true : false;
                                   if (!isOverMaxNumber) 
                                   {

                                       if (self.maxFileSize <= 0 || file.size <= (self.maxFileSize * 1024 * 1024)) 
                                       {
                                            var next = true;
                                            if(typeof self.onFileAdd === 'function')
                                            {
                                                next = self.onFileAdd();
                                            }
                                            next = next === undefined ? true : next ;

                                            if (!next) 
                                            {
                                                up.removeFile(file);
                                                return;
                                            }

                                           self.addPic(file);
                                           self.setNativeView(file);

                                       } 
                                       else 
                                       {
                                           console.warn("文件'" + file.name + "'的大小超过了设定的值！");
                                           self.$emit("over-size", file.name);
                                           up.removeFile(file);
                                       }
                                   } 
                                   else 
                                   {
                                       console.warn('上传的文件数量超过了设定的值！');
                                       self.$emit("over-number");
                                       up.removeFile(file);
                                   }
                               });
                               self.$emit('before-upload');
                           },
                           'BeforeUpload': function (up, file) {
                               self.setImgUpStart(file.id);
                           },
                           'UploadProgress': function (up, file) {
                               self.setProgress(file.id, file.percent);
                           },
                           'FileUploaded': function (up, file, info) {
                               var domain = up.getOption('domain'),
                                   res = JSON.parse(info),
                                   src = /\/$/.test(domain) ? domain + res.key : domain + "/" + res.key;
                               self.setUrl(file.id, src);
                           },
                           'Error': function (up, err, errTip) {
                               self.setImgUpError(err.file.id);
                           },
                           'UploadComplete': function () {
                               self.dispatchStatusEv('after-upload');
                           },
                           'Key': function (up, file) {
                               var type = file.type.split("/")[1];
                               type = type == 'jpeg' ? 'jpg' : type;
                               var key = (config.prefix ? config.prefix : 'A') + '.' + self.creareGuid(8, 16) + '.' + type;
                               return key;
                           }
                       }
                   };
                   if (config.uptoken || config.token || config.Token || config.Uptoken || config.UpToken) {
                       option.uptoken = config.uptoken || config.token || config.Token || config.Uptoken || config.UpToken;
                       var uploader = Qiniu.uploader(option);
                       self.isInitedConfig = true;
                   } else {
                       // option.uptoken_url
                       var uptoken_url = function () {
                           var url = self.tokenUrl;
                           for (var key in config) {
                               if (config.hasOwnProperty(key)) {
                                   url = url.replace(new RegExp('{' + key + '}', 'ig'), config[key]);
                               }
                           }
                           return url;
                       }();
                       self.getToken(uptoken_url, function (data) {
                           if (data.uptoken || data.token || data.Token || data.Uptoken || data.UpToken) {
                               option.uptoken = data.uptoken || data.token || data.Token || data.Uptoken || data.UpToken;
                           } else {
                               option.uptoken_url = uptoken_url;
                           }
                           var uploader = Qiniu.uploader(option);
                           self.isInitedConfig = true;
                       });
                   }

               },
               addPic: function (file) {
                   this.value.push({ id: file.id, progress: 0, status: 'wait', thumbSrc: false, src: '' , name: file.name});
                   this.$emit('input', this.value);
               },
               removePic: function (id) {
                   var self = this;
                   this.value.every(function (item, index) {
                       if (item.id == id) {
                           var needDispatch = item.status === 'pending';
                           self.value.splice(index, 1);
                           self.$emit('remove', item);
                           self.$emit('input', self.value);
                           if (needDispatch) {
                               var isfinished = true;
                               for (var i = 0, len = self.value.length; i < len; i++) {
                                   if (self.value[i].status === 'pending') {
                                       isfinished = false;
                                       break;
                                   }
                               }
                               if (isfinished) {
                                   self.dispatchStatusEv('after-upload');
                               }
                           }
                           return false;
                       }
                       return true;
                   });
               },
               setNativeView: function (file) {
                   var self = this;
                   if (this.isSupportView) {
                       var reader = new FileReader();
                       reader.readAsDataURL(file.getNative());
                       reader.onload = function (e) {
                           var src = this.result;
                           self.value.every(function (item) {
                               if (item.id == file.id) {
                                   item.thumbSrc = src;
                                   self.$emit('input', self.value);
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
               },
               setProgress: function (id, progress) {
                   var self = this;
                   this.value.every(function (item) {
                       if (item.id == id) {
                           item.progress = progress;
                           self.$emit('input', self.value);
                           return false;
                       }
                       return true;
                   });
               },
               setUrl: function (id, src) {
                   var self = this;
                   this.value.every(function (item) {
                       if (item.id == id) {
                           item.progress = 100;
                           item.src = src;
                           item.thumbSrc = self.isSupportView ? item.thumbSrc : src + self.thumbPicQuery;
                           item.status = 'success';
                           self.$emit('input', self.value);
                           return false;
                       }
                       return true;
                   });
               },
               setImgUpError: function (id) {
                   var self = this;
                   this.value.every(function (item, index) {
                       if (item.id == id) {
                           item.status = 'fail';
                           self.$emit('input', self.value);
                           return false;
                       }
                       return true;
                   });
               },
               setImgUpStart:function(id){
                    var self = this;
                    this.value.every(function (item, index) {
                        if (item.id == id) {
                            item.status = 'pending';
                            self.$emit('input', self.value);
                            return false;
                        }
                        return true;
                    });
               },
               showBigPic: function (img) {
                   this.currentId = img.id;
                   this.currentSrc = img.src;
                   this.showPreviewDialog = true;
               },
               dispatchStatusEv: function (ev) {
                   if (ev === 'after-upload') {
                       this.$emit(ev);
                       return;
                   }
                   var successList = this.value.filter(function (item) {
                       return item.status === 'success';
                   });
                   var errorList = this.value.filter(function (item) {
                       return item.status === 'fail';
                   });
                   this.$emit(ev, successList, errorList, this.value);
               },
               propFix: function () {
                   var self = this;
                   self.isOverMaxNumber = (self.maxNumber > 0 && self.value.length >= self.maxNumber) ? true : false;
                   this.value.forEach(function (item,index) {
                       if(typeof item === 'string'){
                            self.value[index] = {src:item};
                            item = self.value[index];
                       }
                       if (item.id === undefined) {
                           item.id = self.createId();
                       }
                       if (item.status === undefined) {
                           item.status = 'success';
                       }
                       if (item.progress === undefined) {
                           item.progress = 100;
                       }
                       if (item.thumbSrc === undefined) {
                           item.thumbSrc = item.src + self.thumbPicQuery;
                       }
                       if(item.name === undefined){
                           item.name = item.src.split('/').pop();
                       }
                   
                   });
                   this.$emit('input', this.value);
                   this.dispatchStatusEv('change');
               },
               prevPic: function () {
                   if (this.current <= 1) {
                       return;
                   }
                   this.resetImgStatus();
                   var img = this.value.filter(function (item) {
                       return item.status === 'success';
                   })[this.current - 2];

                   this.currentSrc = img.src;
                   this.currentId = img.id;
                  // this.setLocationCenter();
               },
               nextPic: function () {
                   if (this.current >= this.total) {
                       return;
                   }
                   this.resetImgStatus();
                   var img = this.value.filter(function (item) {
                        return item.status === 'success';
                    })[this.current];

                   this.currentSrc = img.src;
                   this.currentId = img.id;
                 //  this.setLocationCenter();
               },
               rotate: function(n){
                    
                    if(this.styles[this.currentId] === undefined){
                        this.$set(this.styles,this.currentId,{rotate:0,scale:1,x:'50%',y:'50%'});
                    }
                    this.styles[this.currentId].rotate += n;
                    if(this.styles[this.currentId].rotate === 360){
                        this.styles[this.currentId].rotate = 0; 
                    }
               },
               scale:function(n,isNoScale){
                    
                    if(this.styles[this.currentId] === undefined){
                        this.$set(this.styles,this.currentId,{rotate:0,scale:1,x:'50%',y:'50%'});
                    }
                    if(isNoScale){
                        this.styles[this.currentId].scale = n;
                        return;
                    }
                    this.styles[this.currentId].scale += n;
                    if(this.styles[this.currentId].scale >= 3){
                        this.styles[this.currentId].scale = 3; 
                    }
                    if(this.styles[this.currentId].scale <= 0.1){
                        this.styles[this.currentId].scale = 0.1; 
                    }
               
               },
               imgDragStart:function(e){
                 e.preventDefault();
               },
               mousedown:function(e){
                    if(this.styles[this.currentId] === undefined){
                        this.$set(this.styles,this.currentId,{rotate:0,scale:1,x:'50%',y:'50%'});
                    }
                    this.srcX = e.clientX;
                    this.srcY = e.clientY;
                    this.offLeft = this.$refs.picbox.offsetLeft;
                    this.offTop = this.$refs.picbox.offsetTop;
                    this.isMouseDown = true;
               },
               mousemove:function(e){
                    if(this.isMouseDown){
                        var curX = e.clientX;
                        var curY = e.clientY;
                        var x = curX - this.srcX;
                        var y = curY - this.srcY;
                        var style = this.styles[this.currentId];
                        style.x = this.offLeft + x;
                        style.y = this.offTop + y;
                        this.$refs.picbox.style.left = style.x + 'px';
                        this.$refs.picbox.style.top = style.y + 'px';
                    }
               },
               setLocationCenter:function(){
                    this.$refs.picbox.style.left = this.$refs.picbox.style.top = '50%';
               },
               initConfig: function () {
                   !this.previewMode && !this.isInitedConfig && this.getConfig();
               },
           
           },
           created: function () {
                this.propFix();
           },
           mounted: function () {
               this.initConfig();
            this.$nextTick(function(){
                document.addEventListener('mousewheel',function(e){
                    if(this.showPreviewDialog){
                        e.preventDefault();
                        this.scale(e.deltaY > 0 ? -0.2 : 0.2);
                    }
                }.bind(this));
                document.addEventListener('mouseup',function(){
                    this.isMouseDown = false;
                }.bind(this));
            })
           },
           computed: {
                transform:function(){
                    var style = this.styles[this.currentId];
                    if(style){
                        return 'rotate(' + style.rotate + 'deg) scale(' + style.scale + ') translate(-50%,-50%)';
                    }
                    return 'rotate(0deg) scale(1) translate(-50%,-50%)';
                },
               total: function () {
                   return this.value.filter(function (item) {
                       return item.status === 'success'
                   }).length;
               },
               current: function () {
                   var current = 0;
                   for (var i = 0, len = this.value.length; i < len; i++) {
                       if (this.value[i].status === 'success') {
                           current++;
                           if (this.value[i].id === this.currentId) {
                               return current;
                           }
                       }
                   }
                   return current;
               },
               imageStatus:function(){
                  return this.imageLoadStatus[this.currentSrc] || 'pending' ;
               }
           },
           watch: {
               value: {
                   handler: function () {
                       this.propFix();
                   },
                   deep: true
               },
               previewMode: {
                   handler: function () {
                       this.initConfig();
                   }
               }
           }
       });
   })(Vue);