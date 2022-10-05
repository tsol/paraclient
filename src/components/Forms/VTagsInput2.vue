<template>
    <div class="file-upload">
        <v-label>{{label}}</v-label>
        <div class="drop-area pa-6"
             @drop.prevent="handleDrop"
             @dragover.prevent
             @click="$refs.upload.click()">
            <input ref="upload" type="file" @change="handleInput" v-show="false" accept=".pdf">
            <div class="content-wrapper text-center">
                <v-icon :size="50" class="mb-1">far fa-cloud-upload</v-icon>
                <div v-if="files.length === 0">
                    Drag a PDF into this box, or click on it to upload a file
                </div>
                <div v-else> {{files.length}} file{{files.length > 1 ? 's' : ''}} chosen</div>
            </div>
        </div>
        <VMessages :value="errorBucket" color="error"/>
    </div>
</template>

<script>
import VInput from 'vuetify/lib/components/VInput/VInput';

export default {
  name: 'VTagsInput',
  extends: VInput,
  props: {
    value: {
      required: false,
      type: [Array, FileList],
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.files = value;
        }
      },
    },
  },
  data() {
    return {
      files: [],
    };
  },
  methods: {
    handleDrop(e) {
      const { files } = e.dataTransfer;
      this.handleFiles(files);
    },
    handleInput(e) {
      const { files } = e.target;
      this.handleFiles(files);
    },
    handleFiles(files) {
      if (files.length > 0) {
        this.files = files;
        this.$emit('input', files);
      }
    },
    reset() {
      this.files = [];
    },
  },
};
</script>

<style lang="scss">
.file-upload {
    margin-top: 5px;
    .drop-area {
        cursor: pointer;
        border: 2px lightgray dashed;
        width: 100%;
        display: block;
    }
    .v-input__slot {
        display: block;
    }
    .v-label {
        top: -7px;
    }
}
</style>
