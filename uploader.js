
(function(context){
        function Uploader (url){
            if(!(this instanceof Uploader)){
                return new Uploader(url);
            }
            this._xhr = new XMLHttpRequest();
            this._formData = new FormData();
            this._file = null;
            this._url = url;
            this._success = null;
            this._error = null;
            this._progress = null;
            this._isReady = false;
            this._isCalled = false;
            this._success = false;
        }
        Uploader.prototype = {
            constructor:Uploader,
            upload:function(options){
                for (var key in options){
                    if(options.hasOwnProperty(key)){
                        var value = options[key];
                        if(value instanceof File || (value.rawFile && (value.rawFile instanceof File))){
                            this._file = value;
                            this._formData.append(key,(value instanceof File) ? value : value.rawFile );
                        }else{
                            this._formData.append(key,value);
                        }
                    }
                }
                this._xhr.onstart = function(){
                    this._start && this._start(this._file);
                    return this;
                },
                this._xhr.onload = function(){
                    this._isReady = true;
                    this._success = true;
                    if(this._success){
                        var response = this._xhr.responseText;
                        try{
                            response = JSON.parse(response);
                        }catch(e){}

                        this._success(response,this._file);
                        this._isCalled = true;
                    }
                }; 
                this._xhr.onerror =  function(){
                    this._isReady = true;
                    this._success = false;
                    if(this._error){
                        this._error(this._file);
                        this._isCalled = true;
                    }
                }
                this._xhr.upload.onprogress = function(e){
                    if(this._progress){
                        var percent = (e.loaded / e.total * 100);
                        this._progress(this._file,percent);
                    }
                };
                setTimeout(function(){
                    this._xhr.open("POST",this._url);
                    this._xhr.send(this._formData);
                }.bind(this),0);
                
                return this;
            },
            then:function(fn){
                this._success = fn;
                if(this._isReady && !this._isCalled &&this._success){
                    var response = this._xhr.responseText;
                    try{
                        response = JSON.parse(response);
                    }catch(e){}
                    this._success(response,this._file);
                }
                return this;
            },
            start:function(fn){
                this._start = fn;
                return this;
            },
            progress:function(fn){
                this._progress = fn;
                return this;
            },
            catch:function(fn){
                this._error = fn;
                if(this._isReady && !this._isCalled && !this._success){
                    this._error(this._file);
                }
                return this;
            }
        }
        if(typeof module === 'object' && typeof module.exports === 'object'){
            module.exports = Uploader;
        }else{
            context['Uploader'] = Uploader;
        }
    })(this);