<template>
    <div ref="chartDiv" :style="{ width: '98%', height: '98%' }"></div>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, onUnmounted, ref, watch} from 'vue';
import {ECharts, EChartsOption, init} from 'echarts';
import {usePopupMangerState} from "@/store/PopupMangerState";

const props = defineProps<{ id: string }>();
const chartDiv = ref<HTMLElement | null>(null);
let chartEch: ECharts | null = null;
let dataY = ref();
let dataX = ref();
let alarmLimit = ref(0);
let standardValue = ref(0);
const PopupMangerState = usePopupMangerState()

const updateChart = () => {
    if (!chartDiv.value || !chartEch) return;

    const option: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        xAxis: {
            type: 'category',
            data: dataX.value
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 20,
        },
        legend: {
            data: ['Data']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 70,
                end: 100
            },
            {
                start: 70,
                end: 100,
                showDataShadow: 'auto'
            },
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                startValue: -100,
                endValue: 100
            }
        ],
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                magicType: {type: ['line', 'bar']},
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                type: 'line',
                smooth: true,
                symbol: 'none',
                markLine: {
                    data: [{
                        yAxis: alarmLimit.value,
                        name: '报警上限',
                        label: {
                            formatter: '报警上限'
                        },
                        lineStyle: {
                            color: 'red',
                            type: 'dashed'
                        }
                    }]
                }
            },
            {
                type: 'line',
                smooth: true,
                symbol: 'none',
                markLine: {
                    data: [{
                        yAxis: standardValue.value,
                        name: '标准值',
                        label: {
                            formatter: '标准值'
                        },
                        lineStyle: {
                            color: 'blue',
                            type: 'solid'
                        }
                    }]
                }
            },
            {
                name: PopupMangerState.kind,
                type: 'line',
                smooth: true,//是否平衡显示
                symbol: 'none',//是否显示点
                // areaStyle: {},//是否显示面积
                data: dataY.value
            }
        ]
    };
    chartEch.setOption(option);
    chartEch.resize();
};


watch(() => PopupMangerState.setData.alarmLimit, (newData) => {
    alarmLimit.value = newData
    updateChart();
})
watch(() => PopupMangerState.setData.Standard, (newData) => {
    standardValue.value = newData
    updateChart();
})

watch(() => PopupMangerState.selectTabs, (newData) => {
    setTimeout(() => {
        updateChart();
    }, 500);
})
watch(() => PopupMangerState.isShowPop, (newData, oldValue) => {
    if (oldValue === false && newData === true) {
        dataY.value = PopupMangerState.CepstrumData.autocorrelation
        dataX.value = PopupMangerState.CepstrumData.timeLags

        setTimeout(() => {
            updateChart();
        }, 500);
    }

})
onMounted(() => {
    if (chartDiv.value) {
        chartEch = init(chartDiv.value);
        window.addEventListener('resize', () => {
            if (chartEch) {
                chartEch.resize();
            }
        });

        updateChart();
    }
});

onUnmounted(() => {
    if (chartEch) {
        chartEch.dispose();
        chartEch = null;
    }
    window.removeEventListener('resize', updateChart);
});

</script>

<style lang="scss" scoped></style>
