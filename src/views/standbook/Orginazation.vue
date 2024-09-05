<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<BreadList :list="['基础信息管理','组织管理']"/>
		<!-- 列表展示页 -->
		<orginazation-list></orginazation-list>
	</div>
</template>

<script>
	import OrginazationList from './orginazation/OrginazationList.vue'
	export default {
		name: "Orginazation",
		components: {
			OrginazationList
		},
	}
</script>

<style>
</style>
