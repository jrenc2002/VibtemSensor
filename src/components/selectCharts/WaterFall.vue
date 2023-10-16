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
let actualData = ref();
let placeholderData = ref();
let categories = ref()
let alarmLimit = ref(0);
let standardValue = ref(0);
const PopupMangerState = usePopupMangerState()

const updateChart = () => {
    if (!chartDiv.value || !chartEch) return;

    const option: EChartsOption = {


        xAxis: {
            type: 'time',
            splitLine: {show: false},
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: PopupMangerState.kind === '温度' ? '{value} °C' : '{value} mm/s'
            }
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
                startValue: 0,
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
        legend: {
            data: ['Data']
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: placeholderData.value
            },
            {
                name: 'Data',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: actualData.value
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
        actualData.value = PopupMangerState.WaterFallData.actualData
        placeholderData.value = PopupMangerState.WaterFallData.placeholderData
        categories.value = PopupMangerState.WaterFallData.categories
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
