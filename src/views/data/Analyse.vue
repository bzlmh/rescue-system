<template>
<div style="padding: 0;;">
		<BreadList :list="['数据统计与反馈','用户评价']"/>
  <div>
    <!--块类统计-->
    <a-row :gutter="30">
      <a-col :span="8">
        <a-card class="order">
          <h3>历史救援工单总数</h3>
          <div>
            <i class="a-icon-s-shop" style="color: purple"></i>
            <span>{{orderCount}}</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="complain">
          <h3>累计投诉数量</h3>
          <div>
            <i class="a-icon-user-solid" style="color: green"></i>
            <span>{{ complainCount }}</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="station">
          <h3>所设服务点数量</h3>
          <div>
            <i class="el-icon-s-flag" style="color: red"></i>
            <span>{{ stationCount }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!--acharts统计图-->
    <a-row :gutter="20">
      <a-col :span="16">
        <a-card class="accident_line">
          <echarts1/>
        </a-card>
      </a-col>
      <div>
      <a-col :span="8">
        <a-card class="complain_pie" style="float: right: inherit;" >
          <echarts2/>
          <div class="chart-divider"></div> <!-- Add a divider element -->
          <echarts3 />
        </a-card>
      </a-col>
    </div>
    </a-row>
   </div>
  </div>
</template>
 
<script>
import echarts1 from './echarts1.vue'
import echarts2 from './echarts2.vue'
import echarts3 from './echarts3.vue'
import { getOrderCount,
  getComplainCount,
  getStationCount
} from '../../api/analyse'; 

export default {
  name: 'home',
  components: {
    echarts1,
    echarts2,
    echarts3,
  },
  data() {
    return {
      orderCount: 0,
      complainCount: 0,
      stationCount: 0,
    };
},
  mounted() {
    // 延迟初始化以确保容器准备就绪
    setTimeout(() => {
      this.fetchData(); // 调用获取数据的方法
    }, 100);
  },

  methods:{
   async fetchData() {
      await this.getOrderCount(); // 获取历史救援工单总数
      await this.getComplainCount(); // 获取累计投诉数量
      await this.getStationCount(); // 获取所设服务点数量
  },
  async getOrderCount() {
      const { data: res } = await getOrderCount();
      this.orderCount = res.data;
    },
    async getComplainCount() {
      const { data: res } = await getComplainCount();
      this.complainCount = res.data;
    },
    async getStationCount() {
      const { data: res } = await getStationCount();
      this.stationCount = res.data;
    }
  }
}

</script>
<style scoped>
.order{
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.complain{
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.station{
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.accident_line{
  margin-top: 45px;
}
.complain_pie{
  margin-top: 20px;
}
.box-card3{
  margin: 10px;
}
.chart-divider {
  width: 100%;
  height: 1px;
  background-color: #ccc; /* Adjust the color as needed */
  margin: 10px 0; /* Adjust the margin as needed */
}
</style>