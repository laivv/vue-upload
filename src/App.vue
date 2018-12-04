<template>
	<div id="app" class="app">
		<uk-upload
			ref="upload"
			v-model="fileList"
			:token-func="getToken"
			:token-url="['/api/qiniu/getconfig?prefixType=2','/HouseImages/GetQiniuToken?bucket={bucket}']"
			:list-type="listType"
			:multiple="true"
			:enable-upload="true"
			:max-file-count="1"
			:show-file-name="true"
			:preview-mode="false"
			:show-file-list="true"
			:max-file-size="0"
			:accept-list="[]"
			:before-file-add="beforeFileAdd"
			:on-file-remove="onFileRemove"
			:on-file-click="onFileClick"
			thumb-query="?imgview/w/100/height/50"
		>
		</uk-upload>
		<button @click="getStatus">获取上传状态</button> <button @click="getFileList">获取所有文件</button>
		<button @click="getSuccessList">获取上传成功的文件列表</button>
		<button @click="getErrorList">获取上传失败的文件列表</button>
		<button @click="getUploadingList">获取上传中的文件列表</button>
		<button @click="switchListType">切换列表类型</button>
	</div>
</template>
<script>
	import request from './request';
	export default {
		data() {
			return {
				listType: 'card',
				fileList: [
					'http://vjs.zencdn.net/v/oceans.mp4 ',
					'http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4',
					'http://yun.it7090.com/video/XHLaunchAd/video02.mp4',
					'http://www.w3school.com.cn/i/movie.ogg',
					'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
					'http://yun.it7090.com/video/XHLaunchAd/video03.mp4',
					'http://yun.it7090.com/video/XHLaunchAd/video01.mp4',
					'不支持的文件测试-unknow',
				],
			};
		},
		methods: {
			getToken(done) {
				request.get('/api/qiniu/getconfig', { prefixType: 2 }, data1 => {
					request.get('/HouseImages/GetQiniuToken', { bucket: data1.bucket }, data2 => {
						let data = Object.assign({}, data1, {
							token: data2.uptoken,
						});
						done(data);
					});
				});
			},
			beforeFileAdd: function(file) {
				console.log(file);
			},
			onFileRemove: function(file) {
				console.log(file);
				return true;
			},
			onFileClick: function(file) {
				console.log(file);
				return true;
			},
			getStatus: function() {
				var status = this.$refs.upload.getUploadStatus();
				console.log(status);
			},
			getFileList: function() {
				var files = this.$refs.upload.getFileList();
				console.log(files);
			},
			getSuccessList: function() {
				var files = this.$refs.upload.getSuccessFileList();
				console.log(files);
			},
			getErrorList: function() {
				var files = this.$refs.upload.getErrorFileList();
				console.log(files);
			},
			getUploadingList: function() {
				var files = this.$refs.upload.getUploadingFileList();
				console.log(files);
			},
			switchListType: function() {
				this.listType = this.listType == 'card' ? 'text' : 'card';
			},
			getOringinalList: function() {
				console.log(this.fileList);
			},
		},
	};
</script>
