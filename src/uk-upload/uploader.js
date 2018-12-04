function Uploader(url) {
	if (!(this instanceof Uploader)) {
		return new Uploader(url);
	}
	this._xhr = new XMLHttpRequest();
	this._formData = new FormData();
	this._file = null;
	this._url = url;
	this._successCallback = null;
	this._errorCallback = null;
	this._progressCallback = null;
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
				if (
					value !== undefined &&
					(value instanceof File || (value.rawFile && value.rawFile instanceof File))
				) {
					this._file = value;
					this._formData.append(key, value instanceof File ? value : value.rawFile);
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
			if (_self._isSuccess && _self._successCallback) {
				_self._successCallback(response, _self._file);
				_self._isCalled = true;
			}
			if (!_self._isSuccess && _self._errorCallback) {
				_self._errorCallback(_self._file);
				_self._isCalled = true;
			}
		};
		this._xhr.onerror = () => {
			_self._isReady = true;
			_self._isSuccess = false;
			if (_self._errorCallback) {
				_self._errorCallback(_self._file);
				_self._isCalled = true;
			}
		};
		this._xhr.upload.onprogress = e => {
			if (_self._progressCallback) {
				let percent = e.total ? (e.loaded / e.total) * 100 : 0;
				_self._progressCallback(_self._file, parseInt(percent));
			}
		};
		setTimeout(() => {
			this._xhr.open('POST', this._url);
			this._xhr.send(this._formData);
		}, 0);
		return this;
	},
	setDataType(type) {
		this._dataType = type
			.toString()
			.trim()
			.toLowerCase();
		return this;
	},
	start(fn) {
		this._start = fn;
		return this;
	},
	progress(fn) {
		this._progressCallback = fn;
		return this;
	},
	then(fn) {
		this._successCallback = fn;
		if (this._isReady && !this._isCalled && this._isSuccess) {
			var response = this._xhr.responseText;
			try {
				response = JSON.parse(response);
			} catch (e) {}
			this._successCallback(response, this._file);
		}
		return this;
	},
	catch(fn) {
		this._errorCallback = fn;
		if (this._isReady && !this._isCalled && !this._isSuccess) {
			this._errorCallback(this._file);
		}
		return this;
	},
};

export default Uploader;
