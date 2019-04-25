export default class Uploader {
  constructor(url) {
    if (new.target !== Uploader) {
      return new Uploader(url);
    }
    this.xhr = null;
    this.formData = null;
    this.file = null;
    this.url = url;
    this.successCallback = null;
    this.errorCallback = null;
    this.progressCallback = null;
    this.isDone = false;
    this.isCalled = false;
    this.isSuccess = false;
    this.dataType = null;
  }
  upload(options) {
    this.formData = new FormData();
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        let value = options[key];
        if (
          value !== undefined &&
          (value instanceof File || (value.rawFile && value.rawFile instanceof File))
        ) {
          this.file = value;
          this.formData.append(key, value instanceof File ? value : value.rawFile);
        } else {
          this.formData.append(key, value);
        }
      }
    }
    return this;
  }
  setDataType(type) {
    this.dataType = type
      .toString()
      .trim()
      .toLowerCase();
    return this;
  }
  start(fn) {
    let self = this;
    this.startCallback = fn;
    this.xhr = new XMLHttpRequest();
    this.xhr.onloadstart = () => {
      self.startCallback && self.startCallback(self.file);
    };
    this.xhr.onload = () => {
      self.isDone = true;
      if (self.xhr.status === 200 || self.xhr.status === 304) {
        self.isSuccess = true;
      } else {
        self.isSuccess = false;
      }
      let response = self.xhr.responseText;
      try {
        response = JSON.parse(response);
      } catch (e) {
        if (self.dataType === 'json') {
          self.isSuccess = false;
        }
      }
      if (self.isSuccess && self.successCallback) {
        self.successCallback(response, self.file);
        self.isCalled = true;
      }
      if (!self.isSuccess && self.errorCallback) {
        self.errorCallback(self.file);
        self.isCalled = true;
      }
    };
    this.xhr.onerror = () => {
      self.isDone = true;
      self.isSuccess = false;
      if (self.errorCallback) {
        self.errorCallback(self.file);
        self.isCalled = true;
      }
    };
    this.xhr.upload.onprogress = e => {
      if (self.progressCallback) {
        let progress = e.total ? (e.loaded / e.total) * 100 : 0;
        self.progressCallback(self.file, Math.floor(progress));
      }
    };
    setTimeout(() => {
      this.xhr.open('POST', this.url);
      this.xhr.send(this.formData);
    }, 0);
    return this;
  }
  progress(fn) {
    this.progressCallback = fn;
    return this;
  }
  then(fn) {
    this.successCallback = fn;
    if (this.isDone && !this.isCalled && this.isSuccess) {
      var response = this.xhr.responseText;
      try {
        response = JSON.parse(response);
      } catch (e) { }
      this.successCallback(response, this.file);
    }
    return this;
  }
  catch(fn) {
    this.errorCallback = fn;
    if (this.isDone && !this.isCalled && !this.isSuccess) {
      this.errorCallback(this.file);
    }
    return this;
  }
}
