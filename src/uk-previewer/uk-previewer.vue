<template>
    <div class="uk-previewer" v-show="visible">
        <template v-if="['image','video','audio'].indexOf(fileType) > -1">
            <template v-if="fileType === 'image'">
                <div class="uk-previewer-image-wrapper" v-show="loadState === 'success'" :style="{transform:transform,left:left,top:top}"
                    ref="imageBox" @mousedown="mousedown($event)" @mousemove="mousemove">
                    <img :src="fileSrc" @load="handleImageLoad($event,'success')" @dragstart="handleImageDragStart($event)" @error="handleImageLoad($event,'error')">
                </div>
                <div v-show="loadState === 'pending'" class="uk-previewer-loading">
                    <i class="iconfont icon-loading"></i>
                </div>
                <div v-show="loadState === 'error'" class="uk-previewer-error">
                    <i class="iconfont icon-loading-error"></i>
                </div>
            </template>
            <template v-else>
                <div class="uk-previewer-center uk-previewer-video" v-if="visible">
                    <uk-video-player :src="fileSrc" :type="fileType"></uk-video-player>
                </div>
            </template>
        </template>
        <template v-else>
            <span class="uk-previewer-center uk-previewer-unsupport">此文件不支持预览</span>
        </template>
        <div class="uk-previewer-close-btn" @click="closePreviewer">×</div>
        <div class="uk-previewer-prev-btn" @click="prevFile">&lt;</div>
        <div class="uk-previewer-next-btn" @click="nextFile">&gt;</div>
        <div class="uk-previewer-footer">
            <div>{{computedIndex}}/{{computedCount}}</div>
            <div class="uk-previewer-toolbar">
                <button @click="rotate(-90)" title="向左旋转">
                    <i class="iconfont icon-xuanzhuan1"></i>
                </button>
                <button @click="rotate(90)" title="向右旋转">
                    <i class="iconfont icon-xuanzhuan"></i>
                </button>
                <button @click="setLocationCenter" title="居中">
                    <i class="iconfont icon-juzhong"></i>
                </button>
                <button @click="scale(1,true)" title="原始大小">
                    <i class="iconfont icon-yuanshidaxiao"></i>
                </button>
                <button @click="scale(0.2)" title="放大">
                    <i class="iconfont icon-fangda"></i>
                </button>
                <button @click="scale(-0.2)" title="缩小">
                    <i class="iconfont icon-suoxiao"></i>
                </button>
                <button @click="prevFile" title="上一个">
                    <i class="iconfont icon-jiantou"></i>
                </button>
                <button @click="nextFile" title="下一个">
                    <i class="iconfont icon-endarrow"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import UkVideoPlayer from '../uk-video-player/index.js';
    export default {
        props: {
            fileList: {
                type: Array,
                default() {
                    return [];
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            index: {
                type: Number,
                default() {
                    return 0;
                }
            }
        },
        components: {
            UkVideoPlayer
        },
        data() {
            return {
                _index: 0,
                _visible: false,
                fileSrc: '',
                fileId: '',
                fileType: 'image',
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
        mounted() {
            this.createFileState();
            this.init();
            this.setCurrent();
        },
        methods: {
            createFileState() {
                this.fileList.forEach(function (file) {
                    if (this.fileState[file.id] === undefined) {
                        this.$set(this.fileState, file.id, {
                            rotate: 0,
                            scale: 1,
                            x: '50%',
                            y: '50%',
                            loadState: 'pending' //pending or success or error
                        });
                    }
                }.bind(this));
            },
            autoScale(image) {
                let imageWidth = image.width;
                let imageHeight = image.height;
                let screenWidth = window.innerWidth;
                let screenHeight = window.innerHeight;
                let height = imageHeight;
                let width = imageWidth;
                let state = this.fileState[this.fileId];
                let n = 1;
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
            handleImageLoad(e, status) {
                let state = this.fileState[this.fileId];
                if (state) {
                    state.loadState = status;
                    if (status === 'success') {
                        this.autoScale(e.target);
                    }
                }
            },
            handleImageDragStart(e) {
                e.preventDefault();
            },
            setLocationCenter() {
                this.left = this.top = '50%';
            },
            rotate(n) {
                let state = this.fileState[this.fileId];
                state.rotate += n;
                if (state.rotate === 360) {
                    state.rotate = 0;
                }
            },
            scale(n, isNoScale) {
                let state = this.fileState[this.fileId];
                if (isNoScale) {
                    state.scale = n;
                    return;
                }
                state.scale += n;
                if (state.scale >= 6) {
                    state.scale = 6;
                }
                if (state.scale <= 0.1) {
                    state.scale = 0.1;
                }
            },
            mousedown(e) {
                this.srcX = e.clientX;
                this.srcY = e.clientY;
                this.offLeft = this.$refs.imageBox.offsetLeft;
                this.offTop = this.$refs.imageBox.offsetTop;
                this.isMouseDown = true;
            },
            mousemove(e) {
                if (this.isMouseDown) {
                    let curX = e.clientX;
                    let curY = e.clientY;
                    let x = curX - this.srcX;
                    let y = curY - this.srcY;
                    this.left = this.offLeft + x + 'px';
                    this.top = this.offTop + y + 'px';
                }
            },
            resetFileLoadState(src, status) {
                this.fileState[this.fileId].loadState = 'pending';
            },
            prevFile() {
                if (this.computedIndex <= 1) {
                    return;
                }
                this.resetFileLoadState();
                let file = this.fileList.filter(function (file) {
                    return file.status === 'success';
                })[this.computedIndex - 2];
                this.fileSrc = file.src;
                this.fileId = file.id;
                this.fileType = file.type;
            },
            nextFile() {
                if (this.computedIndex >= this.computedCount) {
                    return;
                }
                this.resetFileLoadState();
                let file = this.fileList.filter(function (file) {
                    return file.status === 'success';
                })[this.computedIndex];
                this.fileSrc = file.src;
                this.fileId = file.id;
                this.fileType = file.type;
            },
            init() {
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
            },
            setCurrent(n) {
                let index = n === undefined ? this.index : n;
                if (index >= this.fileList.length) {
                    index = this.fileList.length - 1;
                }
                if (index < 0) {
                    index = 0;
                }
                let file = this.fileList[index];
                if (file) {
                    this._index = index;
                    this.fileId = file.id;
                    this.fileSrc = file.src;
                    this.fileType = file.type;
                }
            },
            closePreviewer() {
                // this.visible = false;
                this.$emit('update:visible', false);
            }
        },
        computed: {
            loadState() {
                if (this.fileState[this.fileId]) {
                    return this.fileState[this.fileId].loadState;
                }
                return 'pending';
            },
            transform() {
                let state = this.fileState[this.fileId];
                if (state) {
                    return 'rotate(' + state.rotate + 'deg) scale(' + state.scale + ') translate(-50%,-50%)';
                }
                return 'rotate(0deg) scale(1) translate(-50%,-50%)';
            },
            computedCount() {
                return this.fileList.filter(function (file) {
                    return file.status === 'success'
                }).length;
            },
            computedIndex() {
                let computedIndex = 0;
                for (let i = 0, len = this.fileList.length; i < len; i++) {
                    if (this.fileList[i].status === 'success') {
                        computedIndex++;
                        if (this.fileList[i].id === this.fileId) {
                            return computedIndex;
                        }
                    }
                }
                return computedIndex;
            },
        },
        watch: {
            index(index) {
                this.setCurrent();
            },
            fileList() {
                this.createFileState();
            }
        }
    }
</script>