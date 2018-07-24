  Vue.component('uk-file-list',{
            template:filelist.innerHTML,
            props:{
                fileList:{
                    type:Array,
                    default:[]
                },
                listType:{
                    type:String,
                    default:'card',//card or text
                },
                onRemoveFile:Function,
                onClickFile:Function,
                readOnly:{
                    type:Boolean,
                    default:true
                },
                enablePreview:{
                    type:Boolean,
                    default:true
                }
            },
            data:function(){
                return {
                    supportView: FileReader && (new FileReader()).readAsDataURL,
                    showPreviewDialog:false,
                }
            },
            methods:{
                handleRemoveFile:function(file){
                    var isRemove = true;
                    if(this.onRemoveFile)
                    {
                        isRemove = this.onRemoveFile(file);
                        isRemove = isRemove === undefined ? true : isRemove;
                    }
                    if(isRemove){
                        this.fileList.splice(this.fileList.indexOf(file),1);
                    }
                },
                openPreviewDialog:function(file){
                    if(this.enablePreview){
                        this.showPreviewDialog = true;
                    }
                }
            }
        })