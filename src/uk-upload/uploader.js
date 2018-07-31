(function(context) {
    function Uploader(url) {
        if (!(this instanceof Uploader)) {
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
        this._isSuccess = false;
        this._dataType = null;
    }
    Uploader.prototype = {
        constructor: Uploader,
        upload(options) {
            let _self = this;
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    let value = options[key];
                    if (value instanceof File || (value.rawFile && (value.rawFile instanceof File))) {
                        this._file = value;
                        this._formData.append(key, (value instanceof File) ? value : value.rawFile);
                    } else {
                        this._formData.append(key, value);
                    }
                }
            }
            this._xhr.onloadstart = () => {
                _self._start && _self._start(_self._file);
            };
            this._xhr.onload = () => {
                _self._isReady = true;
                if (_self._xhr.status === 200 || _self._xhr.status === 304) {
                    _self._isSuccess = true;
                } else {
                    _self._isSuccess = false;
                }
                let response = _self._xhr.responseText;
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    if (_self._dataType === 'json') {
                        _self._isSuccess = false;
                    }
                }
                if (_self._isSuccess && _self._success) {
                    _self._success(response, _self._file);
                    _self._isCalled = true;
                }
                if (!_self._isSuccess && _self._error) {
                    _self._error(_self._file);
                    _self._isCalled = true;
                }
            };
            this._xhr.onerror = () => {
                _self._isReady = true;
                _self._isSuccess = false;
                if (_self._error) {
                    _self._error(_self._file);
                    _self._isCalled = true;
                }
            };
            this._xhr.upload.onprogress = (e) => {
                if (_self._progress) {
                    let percent = e.total ? (e.loaded / e.total * 100) : 0;
                    _self._progress(_self._file, percent);
                }
            };
            setTimeout(() => {
                this._xhr.open("POST", this._url);
                this._xhr.send(this._formData);
            }, 0);
            return this;
        },
        setDataType(type) {
            this._dataType = type.trim().toString();
            return this;
        },
        start(fn) {
            this._start = fn;
            return this;
        },
        progress(fn) {
            this._progress = fn;
            return this;
        },
        then(fn) {
            this._success = fn;
            if (this._isReady && !this._isCalled && this._isSuccess) {
                var response = this._xhr.responseText;
                try {
                    response = JSON.parse(response);
                } catch (e) {}
                this._success(response, this._file);
            }
            return this;
        },
        catch (fn) {
            this._error = fn;
            if (this._isReady && !this._isCalled && !this._isSuccess) {
                this._error(this._file);
            }
            return this;
        }
    }
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = Uploader;
    } else {
        context['Uploader'] = Uploader;
    }
})(this);