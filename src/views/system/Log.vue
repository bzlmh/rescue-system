<template>
	<div>
		<BreadList :list="['主页', '系统管理', '日志管理']" />
		<a-card>

			<!-- 表单 -->
			<a-table :rowKey="id" :pagination="false" :columns="columns" :data-source="page.list"
				:scroll="{ x: 300, y: 710 }">
			</a-table>
			<br />
			<a-button type="primary" style="float:left;margin-top: 15px;">总条数：{{ page.totalCount }}</a-button><a-pagination
				v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
				show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
		</a-card>
	</div>
</template>
<script>
import {
	selectByPage
} from "@/api/SysLog.js"

import {
	SysLogColumns as columns
} from "@/assets/js/columns/StandBook.js";

//防抖函数时间ID

export default {
	name: "SysLog",
	data() {
		return {
			loading: true,
			confirmLoading: false,
			//数据库查到的数据
			page: {
				currentPage: 1, // 当前页
				pageSize: 10, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {
				}, // 查询参数对象
				list: [], // 数据
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
			},
			columns
		};
	},
	created() {
		this.getUserList()
	},
	methods: {
		// 网络请求模拟数据
		async getUserList() {
			const {
				data: res
			} = await selectByPage(this.page);
			console.log(res);
			this.page.list = res.data.list;
			this.page.totalCount = res.data.totalCount;
			this.loading = false;
			this.$message.success(res.msg);
		},
		onPageChange(newPage) {
			this.page.currentPage = newPage;
			this.getUserList();
		},
		// 页面变化
		onSizeChange(current, newSize) {
			this.page.pageSize = newSize;
			this.getUserList();
		}
	}
};
</script>

<style></style>
