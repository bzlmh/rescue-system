<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<BreadList :list="['基础信息管理','电话信息管理']"/>
		<!-- 列表展示页 -->
		<telephone-list></telephone-list>
	</div>
</template>

<script>
	import TelephoneList from './telephone/TelephoneList.vue'
	export default {
		name: "Telephone",
		components: {
			TelephoneList
		},
	}
</script>

<style>
</style>
