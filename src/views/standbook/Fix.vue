<template>
  <div style="margin-top: -30px; margin-left: -25px">
    <BreadList :list="['基础信息', '组织管理']" />
    <!-- 详细表单 -->
    <div>
      <FixList></FixList>
    </div>
  </div>
</template>

<script>
import FixList from "./fix/FixList.vue";
export default {
  name: "Fix",
  components: {
    FixList,
  },
  data() {
    return {};
  },
  methods: {
    search(text, id) {
      this.$message.success(id + text);
    },
    // 维修台账添加
    handleFixAdd() {
      this.$router.push({
        name: "FixEdit",
      });
    },
    // 维修台账修改
    handleFixEdit(id) {
      this.$router.push(`/standbook/fix/edit?fixId=${id}`);
    },
  },
};
</script>

<style></style>
