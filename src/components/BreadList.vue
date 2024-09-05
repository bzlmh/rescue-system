<template>
	<div>
		<a-breadcrumb>
			<a-breadcrumb-item v-for="(item,index) of list" :key="index">
				<router-link v-if="index == 0" to="/welcome">{{item}}</router-link>
				<router-link v-else-if="typeof item === 'object'" :to="{name: item.name}">{{item.name}}</router-link>
				<span v-else>
					{{item}}
				</span>
			</a-breadcrumb-item>
		</a-breadcrumb>
	</div>
</template>

<script>
	export default {
		name: 'BreadList',
		props: {
			list: Array
		}
	}
</script>

<style>
</style>
