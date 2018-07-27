<template>
    <div class="video-player" ref="videobox" :class="{'video-player-fullscreen':isFullScreen,'video-player-toolbar-show':showToolbar}"
    @mousemove="mousemove">
    <template v-if="type === 'video'">
        <div class="video-player-load-error" v-show="!loadStatus">
            <span class="video-player-layout-center">
                <div class="video-player-text-center">
                    <i class="iconfont icon-jiazaishibaitidaiicon"></i>
                </div>
                <div class="video-player-text-center">视频加载失败</div>
            </span>

        </div>
        <span class="video-player-loading video-player-layout-center" v-show="isLoading">缓冲中...</span>
        <video v-show="loadStatus" @playing="playing" @waiting="waiting" @error="loadError" @dblclick="onScreen" @click="onPlay"
            ref="video" class="video-player-video" :class="{'video-player-fullscreen':isFullScreen}" @timeupdate="timeupdate"
            @canplay="canplay" :src="src"></video>
    </template>
    <template v-if="type === 'audio'">
        <div class="video-player-audio-window">
            <span class="video-player-layout-center">
                <div class="video-player-text-center">
                    <i class="iconfont icon-yinpin"></i>
                </div>
                <div class="video-player-text-center" v-show="!loadStatus">音频加载失败</div>
            </span>

        </div>
        <span class="video-player-loading video-player-layout-center" v-show="isLoading">缓冲中...</span>

        <audio v-show="loadStatus" @playing="playing" @waiting="waiting" @error="loadError" @dblclick="onScreen" @click="onPlay"
            ref="video" class="video-player-video" :class="{'video-player-fullscreen':isFullScreen}" @timeupdate="timeupdate"
            @canplay="canplay" :src="src"></audio>
    </template>
    <div class="video-player-toolbar">
        <div class="video-player-progress" @mousemove="getHoverTime" @click="setProgress($event)" ref='progressbar'>
            <div class="video-player-progressbar">
                <span class="video-player-hover-time" :style="{left:hoverleft}" ref="hovertime">{{hovertime | formatTime}}</span>
                <div class="video-player-progress-played" :style="{width:progress}"></div>
            </div>
        </div>
        <div class="video-player-controls video-player-clearfix">
            <button class="video-player-playbtn video-player-left" @click="onPlay">
                <i class="iconfont" :class="this.paused? 'icon-iconset0481' : 'icon-icon-'"></i>
            </button>
            <span class="video-player-times video-player-left">{{currentTime | formatTime}}/{{duration | formatTime}}</span>
            <button class="video-player-fullscreen-btn video-player-right" @click="onScreen">
                <i class="iconfont" :class="isFullScreen ? 'icon-tuichuquanping' : 'icon-quanping'"></i>
            </button>
            <button class="video-player-rate-btn video-player-right" @click.stop="openRateList">
                {{this.playbackRate == 1 ? '倍速' : (this.playbackRate + 'x')}}
                <ul class="video-player-rate-list" v-show="showRate">
                    <li @click.stop="setPlaybackRate(item)" class="video-player-rate-item" v-for="item in rateList">{{item}}x</li>
                </ul>
            </button>
        </div>
    </div>
</div>
</template>
<script>
export default {
        props:{
            src:{
                type:String,
                default:''
            },
            rateList:{
                type:Array,
                default(){
                    return [0.5,1,1.25,1.5,1.75,2].reverse();
                }
            },
            type:{
                type:String,
                default:'video' //video/audio
            }
        },
        data:function(){
            return {
                loadStatus:true,
                playbackRate:1,
                isFullScreen:false,
                paused:true,
                showRate:false,
                duration:0,
                currentTime:0,
                showToolbar:true,
                isLoading:false,
                hovertime:'00:00:00',
                hoverleft:'0%'
            }
        },
        mounted:function(){
            var _self = this;
            this.$nextTick(function(){
                _self.scaleVideoWindow();
                window.addEventListener('resize',function(){
                    _self.scaleVideoWindow();
                });
                document.addEventListener('click',function(){
                    _self.showRate =false;
                });
                ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
                .forEach(function(item){
                    document.addEventListener(item,function(e){
                        var isFullScreen = false;
                        [document.fullscreenEnabled,window.fullScreen,document.webkitIsFullScreen,document.msFullscreenEnabled]
                        .every(function(item){
                            if(item !== undefined){
                                isFullScreen = item;
                                return false;
                            }
                            return true;
                        })
                        if(!isFullScreen){
                            _self.isFullScreen = false;
                            _self.setToolbar();
                        }
                    });
                })
               
            })
        },
        computed:{
            progress:function(){
                return this.duration !== 0 ? (this.currentTime / this.duration * 100 + '%') : '0%';
            }
        },
        filters:{
            formatTime:function(time){
                if(time <= 0){
                    return '00:00:00';
                }
                if(time < 60)
                {
                    time = parseInt(time);
                    time = time < 10 ? ('0' + (time + '')) : time;
                    return '00:00:' + time;
                }
                
                var minute = Math.floor(time / 60);
                minute = minute < 10 ? ('0' + (minute + '')) : minute;
                var hour = Math.floor(minute / 60);
                hour = hour < 10 ? ('0' + (hour + '')) : hour;
                var second = parseInt(time % 60);
                second = second < 10 ? ('0' + (second + '')) : second;
                return hour + ':' + minute + ':' + second;
            }
        },
        methods:{
            canplay:function(){
                this.setDuration();
                this.setProgressTime();
            },
            setDuration:function(){
                this.duration = this.$refs.video.duration;
            },
            setProgressTime:function(){
                this.currentTime = this.$refs.video.currentTime;
                if(this.currentTime >= this.duration){
                    this.paused = true;
                    var video = this.$refs.video;
                    video.currentTime = 0;
                    //video.paused = true;
                    this.showToolbar = true;
                }
            },
            timeupdate:function(){
                this.setProgressTime();
            },
            onPlay:function(){
                if(!this.loadStatus){
                    return;
                }
                var video = this.$refs.video;
                this.paused = !this.paused;
                //video.paused = this.paused;
                video[this.paused? 'pause' : 'play']();
            },
            setProgress:function(e){
                if(!this.loadStatus){
                    return;
                }
                var offsetX = e.offsetX;
                var width = this.$refs.progressbar.getBoundingClientRect().width;
                var percent = offsetX / width;
                var video = this.$refs.video;
                video.currentTime = this.duration * percent;
                this.paused = false;
                //video.paused = false;
                video.play();
            },
            getHoverTime:function(e){
                var offsetX = e.offsetX;
                var width = this.$refs.progressbar.getBoundingClientRect().width;
                var percent = offsetX / width;
                var hoverWidth = this.$refs.hovertime.getBoundingClientRect().width;
                this.hovertime = this.duration * percent;
                var hoverleft = offsetX - (hoverWidth/2);
                if(hoverleft < 0){
                    hoverleft = 0;
                }
                if(hoverleft > width - hoverWidth){
                    hoverleft = width - hoverWidth;
                }
                this.hoverleft =  hoverleft +'px';
            },
            setPlaybackRate:function(rate){
                this.$refs.video.playbackRate = this.playbackRate = rate;
                this.showRate = false;
            },
            openRateList:function(){
                this.showRate = !this.showRate;
            },
            onScreen:function(){
                this[this.isFullScreen ? 'exitFullscreen' : 'fullscreen']();
            },
            fullscreen:function(){
                var videobox = this.$refs.videobox;
                var fullscreen = videobox.requestFullscreen 
                                || videobox.msRequestFullscreen 
                                || videobox.mozRequestFullScreen
                                || videobox.webkitRequestFullScreen;
                if(fullscreen){
                    fullscreen.call(videobox);
                    this.isFullScreen = true;
                }
            },
            exitFullscreen:function(){
                var exitFullscreen = document.exitFullscreen
                                || document.webkitExitFullscreen
                                || document.mozCancelFullScreen  
                                || document.msCancelFullScreen;
                                
                if(exitFullscreen){
                    exitFullscreen.call(document);
                    this.isFullScreen = false;
                }
            },
            setToolbar:function(){
                var timer = null;
                return function(){
                    var _self = this;
                    if(timer){
                        clearTimeout(timer);
                        timer = null;
                    }
                    _self.showToolbar = true;
                    if(_self.isFullScreen && !_self.paused){
                        timer = setTimeout(function(){
                            _self.showToolbar = false;
                            console.log(_self.showToolbar);
                        },5000);
                    }
                    
                }
            }(),
            mousemove:function(){
                if(this.isFullScreen){
                    this.setToolbar();
                }
            },
            waiting:function(){
                this.isLoading = true;
            },
            playing:function(){
                this.isLoading = false;
            },
            scaleVideoWindow:function(){
                var width = '100%';
                var height = '100%';
                var style = this.$refs.videobox.style;
                if(!this.isFullScreen){
                    width = window.innerWidth + 'px';
                    height = window.innerHeight + 'px';
                }
                style.maxHeight =  height;
                style.maxWidth =  width;
            },
            loadError:function(){
                this.loadStatus = false;
            }
        },
        watch:{
            src:function(){
                this.paused = true;
                this.loadStatus = true;
                this.isLoading = false;
                var video = this.$refs.video ;
                this.currentTime = 0;
                this.duration = 0;
                video.currentTime = 0;
                

            }
        }
    }


</script>