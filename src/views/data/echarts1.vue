<template>
  <div>
    <!-- ECharts 容器元素 -->
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getAvg } from '../../api/Evaluate';

export default {
  data() {
    return {
      myChart: null, // ECharts 实例
      chartOption: { // 图表配置选项
        title: {
          text: '各项指标平均分',
          left: 'center',
        },
        legend: {
          data: ['平均分'],
          left: '10%',
        },
        brush: {
          toolbox: ['rect', 'polygon', 'clear'],
          xAxisIndex: 0,
        },
        color: ['#4682B4'],
        toolbox: {
          feature: {
            magicType: {
              type: ['stack'],
              title: {
                stack: '堆叠',
              },
            },
            dataView: {
              title: '数据视图',
            },
          },
        },
        tooltip: {},
        xAxis: {
          data: [],
          name: '评分标准',
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false },
        },
        yAxis: {},
        grid: {
          bottom: 100,
        },
        series: [
          {
            name: '平均分',
            type: 'bar',
            stack: 'one',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)',
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    // 延迟初始化以确保容器准备就绪
    setTimeout(() => {
      this.initChart();
    }, 100);
  },
  methods: {
    async initChart() {
    // 初始化 ECharts 实例
    this.myChart = echarts.init(this.$refs.chart);
    const { data: res } = await getAvg(); // 替换成实际的接口地址

    // 创建一个新数组，包含 res.data 中的所有 standardName
    const standardNames = res.data.map(item => item.standardName);
    const averageScores = res.data.map(item => item.averageScore);
    // 使用 Vue.set 方法更新图表配置选项的数据
    this.$set(this.chartOption.xAxis, 'data', standardNames);
    this.$set(this.chartOption.series[0], 'data', averageScores);

    // 配置图表选项
    this.myChart.setOption(this.chartOption);

    // 输出新数组

}

}
};
</script>

<style>
/* ECharts 容器样式 */
.echarts-container {
  width: 100%;
  height: 400px;
}
</style>
