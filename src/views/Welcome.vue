<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<!-- <BreadList :list="['首页']" /> -->
		<a-card style="height: 100%;">
			<baidu-map class="map" :center="{lng: 111.78659844978476, lat: 32.628692924430865}" :zoom="14" :scroll-wheel-zoom="true">
				<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
				<bm-marker  :key="index" v-for="(item,index) in mapInfo" :position="{lng: item.lng, lat: item.lat}" :dragging="true"
				@click="infoWindowOpen(index)" :animation="item.flag==false?'BMAP_ANIMATION_BOUNCE':''">
					<bm-info-window :show="item.show" @close="infoWindowClose(index)" @open="infoWindowOpen(index)">
						桩号:{{item.mileId}} <a @click="check(item.mileId)">查看</a><br/>
						事故数量:{{item.counts}} <br/>
							方向:{{item.lineDirection!==0?"上行往湖北方向":"下行往河南方向"}}<br/>
						坐标:{{item.coordinates}}
					</bm-info-window>
				</bm-marker>
			</baidu-map>
				<audio muted style="display: none;" id="audio" ref="audioDom" src="../assets/video/4611.mp3" controls="controls" loop="loop" autoplay="autoplay"></audio>
		</a-card>
	</div>
</template>

<script>
	import {
		getOrganizationList,
	} from "@/api/Organization.js";
	import {
		getMapInfo
	} from "@/api/Fix.js"
	export default {
		data() {
			return {
				page: {
					currentPage: 1, // 当前页
					pageSize: 5, // 每页显示条数
					totalPage: 0, // 总页数
					totalCount: 0, // 总条数
					params: {
						name: "",
						mobile: ""
					}, // 查询参数对象
					list: [], // 数据
					sortColumn: "", // 排序列
					sortMethod: "", // 排序方式					
				},
				mapInfo:[],
				mileId:[]
			}
		},
		created() {			
			// this.initMapInfo();	
			this.getOrganizationList();
		},
		mounted() {
			this.timer = setInterval(this.getOrganizationList, 30000);
		},
		methods: {
			check(mileId){
				this.$router.push(`/standbook/Organization?mileId=${mileId}`);
			},
			async getOrganizationList() {
				// this.handlePause();
				const {
					data: res
				} = await getOrganizationList(this.page);
				console.log(res);
				if (res.code !== 20005) return this.$message.error("加载数据出错");
				this.page.list = res.data.list;
				this.page.totalCount = res.data.totalCount;		
				this.mileId=[]
				this.page.list.forEach(item => {
					if(item.status==0||item.status=="0"){
						this.handlePlay();
						this.mileId.push({mileId:item.mileagePile,lineDirection:item.lineDirection});
					}
				})
				this.loading = false;
				this.initMapInfo();	
				if(this.mileId.length===0||this.mileId===[]||this.mileId===null||this.mileId==="")
				this.handlePause();
			},
			handlePause () {
				this.$refs["audioDom"].pause();
			},
			handlePlay(){
				this.$refs["audioDom"].play();
			},
			async initMapInfo() {
				const {
					data: res
				} = await getMapInfo();

				if (res.code !== 20005) return this.$message.error("数据加载出错");
				this.mapInfo = res.data;
				this.mapInfo.forEach(item => {
					if(item.coordinates!=null){
						this.$set(item, 'lat', item.coordinates.slice(1, -1).split(',')[0])
						this.$set(item, 'lng', item.coordinates.slice(1, -1).split(',')[1])
						this.$set(item, 'show', false)
						for(let i=0;i<this.mileId.length;i++){
							console.log("mileId"+this.mileId[i].mileId)
							console.log("hahahha"+this.mileId[i].lineDirection)
								if(item.mileId==this.mileId[i].mileId&&item.lineDirection==this.mileId[i].lineDirection){
									this.$set(item, 'flag', false)
								}else{
									this.$set(item, 'flag', true)
								}
						}
					}
				})
				console.log(this.mapInfo)
			},
			infoWindowClose(index) {
				console.log(index)
				this.mapInfo[index].show = false
			},
			infoWindowOpen(index) {
				console.log(index)
				this.mapInfo[index].show = true
			}
		}

	}
</script>

<style>
	.map {
		width: 100%;
		
		height: 86vh;
	}
</style>
