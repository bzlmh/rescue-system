<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<BreadList :list="['基础信息管理', '服务站点管理']" />
		<!-- 列表展示页 -->
		<station-list></station-list>
	</div>
</template>

<script>
import StationList from './station/StationList.vue'
export default {
	name: "Station",
	components: {
		StationList
	},
}
</script>

<style></style>
