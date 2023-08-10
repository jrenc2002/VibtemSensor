<template>
  <div class=" rounded-2xl bg-white w-[95%] h-[95%] shadow items-center justify-center flex">
    <div class=" z-50 items-center justify-center flex">
      <div ref="chartRef" class="w-[75vw] h-[75vh] relative left-0 "></div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import {onMounted, onUnmounted, ref} from "vue";


/* ——————————————————————————声明echart—————————————————————————— */
let chart;
const chartRef = ref(null);
var option;

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    initChart();
  }
});
onUnmounted(() => {
  echarts.dispose;
});

/* ——————————————————————————时间数据配置—————————————————————————— */
// 时间单位
let oneDay = 24 * 3600 * 1000;
// 初始时间原点
let base = +new Date(2023, 8, 11);
// data数据
let data = [[base, Math.random() * 300]];
for (let i = 1; i < 20000; i++) {
  let now = new Date((base += oneDay));
  data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}


/* ——————————————————————————echarts配置—————————————————————————— */
function initChart() {

  // 把配置和数据放这里
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: 'Large Ara Chart'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false //就是会不会只能在线上
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 70,
        end: 100
      },
      {
        start: 70,
        end: 100
      }
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        smooth: false,//是否平衡显示
        symbol: 'none',//是否显示点
        // areaStyle: {},//是否显示面积
        data: data
      },

    ]
  });
  window.onresize = function () {
    //自适应大小
    chart.resize();
  };
}

/* ——————————————————————————定时器时间函数配置—————————————————————————— */


</script>
<style>

</style>