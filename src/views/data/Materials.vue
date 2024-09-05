<template>
	<a-card>
		<div>
			<BreadList :list="['事故数据管理','事故图片管理']" />
			<div class="search-group" style="margin-left: -10%;">
				<div class="search-item">
					<span class="search-text">救援编号:</span>
					<a-input style="width: 300px;" v-model="page.params.rescueId" type="text" placeholder="可根据救援编号查询" />
				</div>
				<div class="search-item">
					<!-- 搜索按钮 -->
					<a-button type="primary" icon="search" @click="searchBySelect">
						Search
					</a-button>
				</div>
			</div>

			<a-divider></a-divider>


			<!-- 表单 -->
			<a-table rowKey="id" :pagination="false" :columns="columns" :data-source="page.list" :scroll="{ x: 300, y: 560 }">

				<template slot="url" slot-scope="url">
					<img :src="url" />
				</template>
				<template slot="operation" slot-scope="text, record">
					<a-space>
						<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了" @confirm="handlePicDelete(record.id)">
							<a-button type="danger"> 删 除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
			<br />
			<a-button type="primary"  style="float:left;margin-top: 15px;">总条数：{{page.totalCount}}</a-button><a-pagination v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
			show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
			<!-- 添加对话框 -->
		</div>
	</a-card>
</template>

<script>
	
	import {
		getPicList,
		deletePicById
	} from "@/api/scenePic.js";
	import {
		ScenePicColumns as columns
	} from "@/assets/js/columns/StandBook.js";
	
	export default {
		name: 'Materials',
		data() {
			return {
				loading: true,
				confirmLoading: false,
				//数据库查到的数据
				page: {
					currentPage: 1, // 当前页
					pageSize: 5, // 每页显示条数
					totalPage: 0, // 总页数
					totalCount: 0, // 总条数
					params: {
						rescueId:"",
					}, // 查询参数对象
					list: [], // 数据
					sortColumn: "", // 排序列
					sortMethod: "", // 排序方式
				},
				//列名的数组
				columns,
				
			};
		},
		created() {
			this.getPicList();
		},
		methods: {
			async handlePicDelete(id){
				const {
					data: res
				} = await deletePicById(id);
				this.$message.success(res.msg);
				this.getPicList();
			},
			searchBySelect() {
				this.getPicList();
			},
			// 网络请求模拟数据
			async getPicList() {
				console.log(this.page);
				const {
					data: res
				} = await getPicList(this.page);
				console.log(res);
				this.page.list = res.data.list;
				this.page.totalCount = res.data.totalCount;
				this.loading = false;
				this.$message.success(res.msg);
			},
			onPageChange(newPage) {
				this.page.currentPage = newPage;
				this.getPicList();
			},
			// 页面变化
			onSizeChange(current, newSize) {
				this.page.pageSize = newSize;
				this.getPicList();
			}
		},mounted() {
			this.page.params.rescueId = this.$route.query.rescueId;
		}
	}
</script>

<style>
	.search-group {
		margin-top: 30px;
		display: flex;
		justify-content: space-around;
	}

	.search-item {
		margin-right: 22px;
	}

	.search-item input {
		width: 120px;
	}

	.search-text {
		font-size: 18px;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
	}

	.search-btn {
		white-space: pre;
	}

	img{
		width: 150px;
		height: 150px;
	}
</style>
