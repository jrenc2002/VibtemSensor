<template>
  <div :id="props.id" ref="rootRef" :style="{ width: '50%', height: '400px' }"></div>
</template>
<script lang="ts" name="checkReport" setup>
import {defineProps, onMounted, ref} from 'vue';
// Echarts 为init（dom元素后的类型）
// EChartsOption 为 option 的类型
import {ECharts, EChartsOption, init} from 'echarts';

const props = defineProps<{ id: any }>();
const rootRef = ref();
onMounted(() => {
  // 这里是由于图表渲染快于父元素导致图表比例溢出，做的一个延缓操作
  setTimeout(() => {
    line();
  }, 1500);
});
const line = () => {
  const charEle = document.getElementById(props.id) as HTMLElement;
  console.log();
  const charEch: ECharts = init(charEle);
  const option: EChartsOption = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['product', '2015', '2016'],
        ['Matcha Latte', 43.3, 85.8],
        ['Milk Tea', 83.1, 73.4],
        ['Cheese Cocoa', 86.4, 65.2],
        ['Walnut Brownie', 72.4, 53.9],
      ],
    },
    xAxis: {type: 'category'},
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{type: 'bar'}, {type: 'bar'}],
  };
  charEch.setOption(option);
  // 监听窗口变化 - 只刷新最后一个图表
  window.onresize = () => {
    charEch.resize();
  };

  // 监听窗口变化 - 多个图表同时刷新
  window.addEventListener('resize', () => {
    charEch.resize();
  });
};
</script>
<style lang="scss" scoped></style>
