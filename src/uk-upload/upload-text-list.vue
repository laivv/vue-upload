<template>
	<div>
		<div class="uk-upload-text" v-if="!readonly">
			<a @click="handleAddClick" :disabled="!enableUploadBtn">
				<button class="uk-upload-text-btn">上传文件</button>
			</a>
		</div>
		<ul class="uk-upload-list">
			<li class="uk-upload-list-item" v-for="file in fileList" :key="file.id">
				<div class="uk-upload-list-name uk-upload-clearfix">
					<span
						class="uk-upload-list-title"
						:class="{'uk-upload-list-error':file.status === 'error'}"
						@click="handleFileClick(file)"
					>
						<span
							class="iconfont0"
							:class="{'icon-tupian-copy':file.type==='image','icon-wenbenwenjian':file.type === 'text','icon-file':file.type === 'file','icon--file-music':file.type === 'audio','icon-filevideo':file.type=== 'video','icon-filezip':file.type==='rar'}"
						>
						</span>
						{{ file.name }}
					</span>
					<span class="uk-upload-list-icons uk-upload-right" v-if="!readonly">
						<span class="uk-upload-list-tip" v-if="file.status === 'pending'">{{ file.progress }}%</span>
						<template v-if="file.status === 'error'">
							<span class="uk-upload-list-retry" title="重试" @click="handleReloadClick(file)">
								<i class="iconfont0 icon-iconziti38"></i>
							</span>
							<span class="uk-upload-list-tip uk-upload-list-error">
								<i class="iconfont0 icon-iconsb"></i>
							</span>
						</template>
						<span class="uk-upload-list-tip" v-if="file.status === 'success'">
							<i class="iconfont0 icon-icon-check-solid"></i>
						</span>
						<span v-if="file.status === 'waiting'" class="uk-upload-list-tip uk-upload-list-wait">
							<i class="iconfont0 icon-waiting"></i>
						</span>
						<span class="uk-upload-list-remove" @click="handleFileRemoveClick(file)" title="删除">×</span>
					</span>
				</div>
				<div class="uk-upload-list-progress" v-if="file.status === 'pending'">
					<div
						class="uk-upload-list-progress-bar"
						:class="{'uk-upload-error-bar':file.status === 'error'}"
						:style="{width:file.progress + '%'}"
					></div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			fileList: {
				type: Array,
				default() {
					return [];
				},
			},
			enableUploadBtn: {
				type: Boolean,
				default: true,
			},
			readonly: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {};
		},
		methods: {
			handleAddClick() {
				this.$emit('onAdd');
			},
			handleReloadClick(file) {
				this.$emit('onReload', file);
			},
			handleFileRemoveClick(file) {
				this.$emit('onRemove', file);
			},
			handleFileClick(file) {
				this.$emit('onItemClick', file);
			},
		},
	};
</script>
