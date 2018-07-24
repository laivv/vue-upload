  Vue.component('uk-previewer',{
            template:previewer.innerHTML,
            props:{
                fileList:{
                    type:Array,
                    default:[]
                }
            },
            data:function(){
                return {
                    index:0,
                }
            },
            methods:{

            }
        });