Vue.component('uk-video-player',{
        props:{
            src:{
                type:String,
                default:''
            },
            rateList:{
                type:Array,
                default:[0.5,1,1.25,1.5,1.75,2].reverse()
            },
            type:{
                type:String,
                default:'video' //video/audio
            }
        },
        template:document.querySelector("#template").innerHTML,
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
                    video.paused = true;
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
                video.paused = this.paused;
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
                video.paused = false;
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
    })
