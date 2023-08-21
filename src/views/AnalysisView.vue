<template>
  <div class=" rounded-2xl bg-white w-[98%] h-[97%] shadow items-center justify-center flex">

    <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 ">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        <div v-for="machine in machines" :key="machine.email"
             class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">

          <div class="min-w-0 flex-1">
            <a class="focus:outline-none flex-col">
              <h5 class="text-base font-semibold leading-6 text-gray-900">{{ machine.name }}</h5>
              <div class=" sm:grid-cols-2 grid grid-cols-2 gap-4 ">
                <dl class="mt-5 grid grid-cols-1 gap-5 ">
                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <AnalyCharts id="2" ref="Vibrationchartid"
                                 class=" h-[15vh] relative left-0 "
                    ></AnalyCharts>

                  </div>
                </dl>
                <dl class="mt-5 grid grid-cols-1 gap-5 ">
                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <AnalyCharts id="1"
                                 ref="Temperaturechartid"
                                 class=" h-[15vh] relative left-0 "></AnalyCharts>

                  </div>
                </dl>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import {computed, onMounted, onUnmounted, ref} from "vue";
import AnalyCharts from "@/components/AnalyCharts.vue";

const Temperaturechartid = ref<any>(null);
const Vibrationchartid = ref<any>(null);
/* ——————————————————————————声明echart—————————————————————————— */
let Vibrationchart;
let Temperaturechart;
var option;

onMounted(() => {
  // chart =echarts.init(document.getElementById('comment-line'));
  // Vibrationchart = echarts.init(Temperaturechartid.value);
  // Temperaturechart = echarts.init(Vibrationchartid.value);
  // initChart();

});
onUnmounted(() => {
  echarts.dispose;
});
const machinesref = ref([
  {
    id: 1,
    name: '一号电机',
    temperaturevalue: '23',
    vibrationvalue: '43',
  },
  {
    id: 2,
    name: '二号电机',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 3,
    name: '三号电机',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 4,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 5,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 6,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 7,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  },
])
const machines = computed(() => machinesref.value)
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
  Vibrationchart.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },

    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      width: "100%",
      hight: "100%",
      borderWidth: 1,
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

  // 把配置和数据放这里
  Temperaturechart.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      width: "100%",
      hight: "100%",
      borderWidth: 1,
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
    Vibrationchart.resize();
    Temperaturechart.resize();
  };
}

/* ——————————————————————————定时器时间函数配置—————————————————————————— */


</script>
<style>

</style>