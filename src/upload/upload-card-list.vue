<template>
  <div>
    <div v-if="!autoUpload" class="uk-upload-header-line">
      <button
        class="uk-upload-text-btn"
        @click="handleStartUploadClick"
        :disabled="disabledStartButton"
      >开始上传</button>
    </div>
    <div class="uk-upload-item" v-for="file in fileList" :key="file.id">
      <div class="uk-upload-item-wrap">
        <div class="uk-upload-item-content">
          <span
            class="uk-upload-item-remove"
            @click="handleFileRemoveClick(file)"
            v-if="!readonly"
          >×</span>
          <div class="uk-upload-full uk-upload-img-wrap" @click="handleFileClick(file)">
            <template v-if="file.type==='image'">
              <img
                :src="file.blob || file.src + thumbQuery"
                v-if="supportView || file.status==='success'"
                class="uk-upload-img"
              >
            </template>
            <template v-else>
              <span
                class="iconfont0"
                :class="{'icon-wenbenwenjian':file.type === 'text','icon-file':file.type === 'file','icon--file-music':file.type === 'audio','icon-filevideo':file.type=== 'video','icon-filezip':file.type==='rar'}"
              ></span>
            </template>
          </div>
          <div
            class="uk-upload-mask"
            :class="{'uk-upload-mask-error':file.status === 'error'}"
            v-show="file.status!=='success'"
          >
            <div class="uk-upload-progress" v-show="file.status =='pending'">
              <span class="uk-upload-progress-bar">{{ file.progress }}%</span>
            </div>
            <div class="uk-upload-progress" v-show="file.status =='waiting'">
              <i class="iconfont0 icon-waiting uk-upload-waiting-icon"></i>
            </div>
            <span class="uk-upload-error" v-if="file.status==='error'">
              <i class="iconfont0 icon-error"></i>
            </span>
            <span class="uk-upload-retry" @click="handleReloadClick(file)" title="重试">
              <i class="iconfont0 icon-iconziti38"></i>
            </span>
          </div>
          <div v-if="showFileName" class="uk-upload-file-name" :title="file.name">{{ file.name }}</div>
        </div>
      </div>
    </div>

    <div class="uk-upload-item" v-if="!readonly && enableUpload">
      <div class="uk-upload-item-wrap">
        <div class="uk-upload-item-content uk-upload-add-btn" @click="handleAddClick">
          <div class="uk-upload-full uk-upload-add-btn">
            <span class="uk-upload-add-icon">+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    enableUpload: {
      type: Boolean,
      default: true
    },
    showFileName: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
     thumbQuery: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      supportView: FileReader && new FileReader().readAsDataURL
    };
  },
  computed: {
    disabledStartButton() {
      return !this.fileList.filter(file => file.status === "waiting").length;
    }
  },
  methods: {
    handleAddClick() {
      this.$emit("onAdd");
    },
    handleStartUploadClick() {
      this.$emit("onStart");
    },
    handleReloadClick(file) {
      this.$emit("onReload", file);
    },
    handleFileRemoveClick(file) {
      this.$emit("onRemove", file);
    },
    handleFileClick(file) {
      this.$emit("onItemClick", file);
    }
  }
};
</script>
