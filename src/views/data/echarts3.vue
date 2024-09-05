<template>
  <div style="width: 453px; height: 225px" id="echarts3"></div>
</template>

<script>
import echarts from 'echarts';
import { getComplaintCountByStandard } from '../../api/analyse'; 

export default {
  name: 'echarts3',
  data() {
    return {
      // option 配置
      option: {
        title: {
          text: '各项投诉指标占比图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        color: ['#0072B2', '#E69F00', '#009E73', '#D55E00'],
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [], // 从 API 获取的数据将填充在这里
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.echartsInit();
  },
  methods: {
    async echartsInit() {
  // 在生命周期中挂载
    this.myChart = echarts.init(document.getElementById('echarts3'));
  
  // 获取数据并更新图表配置
    const { data: res } = await getComplaintCountByStandard(); // 调用你的 API 获取数据的函数
    // 
    // console.log(res.data[0])
    // console.log(res.data[0].stationName);
    const standardNames = res.data.map(item => item.standardName);
    // const complaintCounts = res.data.map(item => item.complaintCount);
    // 更新图表配置
    this.option.legend.data = standardNames; // 设置图例名称为站点名称
    this.option.series[0].data = res.data.map(item => ({
      value: item.complainCount,
      name: item.standardName
    })); // 更新饼图数据

    this.myChart.setOption(this.option);
  } 
}
};
</script>
 
<style scoped>
 
</style>