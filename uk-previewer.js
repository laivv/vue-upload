Vue.component('uk-previewer', {
    template: previewer.innerHTML,
    props: {
        fileList: {
            type: Array,
            default: []
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            fileSrc:'',
            fileId: '',
            fileState: {},
            left: '50%',
            top: '50%',
            srcX: 0,
            srcY: 0,
            offLeft: 0,
            offTop: 0,
            isMouseDown: false,
        }
    },
    mounted: function () {
        this.init();
    },
    methods: {
        createFileState: function () {
            this.fileList.forEach(function (file) {
                if (this.fileState[file.id] === undefined) {
                    this.fileState[file.id] = {
                        rotate: 0,
                        scale: 1,
                        x: '50%',
                        y: '50%',
                        loadState: 'pending' //pending or success or error
                    };
                }
            }.bind(this));
        },
        autoScale: function (image) {
            var imageWidth = image.width;
            var imageHeight = image.height;
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;
            var height = imageHeight;
            var width = imageWidth;

            var state = this.fileState[this.fileId];
            var n = 1;
            while (width >= screenWidth) {
                n -= 0.1;
                width = imageWidth * n;
                height = imageHeight * n;
            }
            while (height >= screenHeight) {
                n -= 0.1;
                height = imageHeight * n;
            }
            state.scale = n;
        },
        handleImageLoad: function (e, state) {
            var state = this.fileState[this.fileId];
            if(state){
                state.loadState = state;
                if (state === 'success') {
                    this.autoScale(e.target);
                }
            }
           
        },
        handleImageDragStart: function (e) {
            e.preventDefault();
        },
        setLocationCenter: function () {
            this.left = this.top = '50%';
        },
        rotate: function (n) {
            var state = this.fileState[this.fileId];
            state.rotate += n;
            if (state.rotate === 360) {
                state.rotate = 0;
            }
        },
        scale: function (n, isNoScale) {
            var state = this.fileState[this.fileId];
            if (isNoScale) {
                state.scale = n;
                return;
            }
            state.scale += n;
            if (state.scale >= 3) {
                state.scale = 3;
            }
            if (state.scale <= 0.1) {
                state.scale = 0.1;
            }
        },
        mousedown: function (e) {
            this.srcX = e.clientX;
            this.srcY = e.clientY;
            this.offLeft = this.$refs.picbox.offsetLeft;
            this.offTop = this.$refs.picbox.offsetTop;
            this.isMouseDown = true;
        },
        mousemove: function (e) {
            if (this.isMouseDown) {
                var curX = e.clientX;
                var curY = e.clientY;
                var x = curX - this.srcX;
                var y = curY - this.srcY;
                this.left = this.offLeft + x + 'px';
                this.top = this.offTop + y + 'px';
            }
        },
        prevFile: function () {
            if (this.index <= 1) {
                return;
            }
            this.resetFileLoadState();
            var file = this.fileList.filter(function (file) {
                return file.status === 'success';
            })[this.index - 2];

            this.fileSrc = file.src;
            this.fileId = file.id;
        },
        resetFileLoadState:function(src,status){
            this.fileState[this.fileId].loadState = 'pending';
        },
        nextFile: function () {
            if (this.index >= this.count) {
                return;
            }
            this.resetFileLoadState();
            var file = this.fileList.filter(function (file) {
                 return file.status === 'success';
             })[this.index];

            this.fileSrc = file.src;
            this.fileId = file.id;
        },
        init: function () {
            this.$nextTick(function () {
                document.addEventListener('mousewheel', function (e) {
                    if (this.visible) {
                        e.preventDefault();
                        this.scale(e.deltaY > 0 ? -0.2 : 0.2);
                    }
                }.bind(this));
                document.addEventListener('mouseup', function () {
                    this.isMouseDown = false;
                }.bind(this));
            });
        }
    },
    computed: {
        loadState: function () {

        },
        transform:function(){
            var state = this.fileState[this.fileId];
            if(state){
                return 'rotate(' + state.rotate + 'deg) scale(' + state.scale + ') translate(-50%,-50%)';
            }
            return 'rotate(0deg) scale(1) translate(-50%,-50%)';
        },
       count: function () {
           return this.fileList.filter(function (file) {
               return file.status === 'success'
           }).length;
       },
       index: function () {
           var current = 0;
           for (var i = 0, len = this.fileList.length; i < len; i++) {
               if (this.fileList[i].status === 'success') {
                   current++;
                   if (this.fileList[i].id === this.fileId) {
                       return current;
                   }
               }
           }
           return current;
       },
    }
});