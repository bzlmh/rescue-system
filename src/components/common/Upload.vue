<template>
  <div>
    <a-button class="btn-upload" type="primary" @click="handleUpdate"
      >上传文件</a-button
    >
    <a-modal
      v-model="dialogVisible"
      title="上传文件"
      @ok="handleOk"
      :footer="false"
    >
      <span>
        <h3>上传文件</h3>
        <a-upload-dragger
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或者将文件拖拽上传</p>
          <p class="ant-upload-hint">只允许上传 Excel 或者 文件</p>
        </a-upload-dragger>
      </span>
      <span class="dialog-footer">
        <a-button
          type="primary"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? "上传中" : "上传" }}
        </a-button>
        <a-button type="primary" @click="handleCancel" style="margin-left: 20px"
          >取 消</a-button
        >
      </span>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data() {
    return {
      dialogVisible: false,
      uploading: false,
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
      this.dialogVisible = false;
    },
    handleUpdate() {
      this.dialogVisible = true;
    },
    // 处理文件上传的函数
    handleUpload() {
      // const {
      // 	fileList
      // } = this;
      // const formData = new FormData();
      // fileList.forEach(file => {
      // 	formData.append('files[]', file);
      // });
      this.uploading = true;

      // You can use any AJAX library you like
      // reqwest({
      // 	url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      // 	method: 'post',
      // 	processData: false,
      // 	data: formData,
      // 	success: () => {
      // 		this.fileList = [];
      // 		this.uploading = false;
      // 		this.$message.success('upload successfully.');
      // 	},
      // 	error: () => {
      // 		this.uploading = false;
      // 		this.$message.error('upload failed.');
      // 	},
      // });
      this.dialogVisible = false;
      this.$message.success("上传成功");
    },
    handleCancel() {
      this.dialogVisible = false;
      this.$message.info("取消上传");
    },
    handleOk() {
      console.log(1231);
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped="scoped">
.btn-upload {
  top: 70px;
  right: 40px;
  position: fixed;
  z-index: 100;
  border-radius: 30px;
  box-shadow: 0 2px 12px 0 rgba(91, 156, 255, 0.9);
}

.el-upload {
  margin: 5px;
}
</style>
