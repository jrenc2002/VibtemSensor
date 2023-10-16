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
let frequencies = ref();
let amplitudes = ref();
let phases = ref();
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
            type: 'log',
            name: 'Frequency (Hz)',
            data: frequencies.value
        },
        yAxis: [
            {
                type: 'value',
                name: 'Amplitude (dB)'
            },
            {
                type: 'value',
                name: 'Phase (°)',
                min: -180,
                max: 180
            }
        ],
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
                name: 'Amplitude (dB)',
                type: 'line',
                data: amplitudes.value
            },
            {
                name: 'Phase (°)',
                type: 'line',
                yAxisIndex: 1,
                data: phases.value
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
        if (!PopupMangerState.BauLuData.amplitudes || !PopupMangerState.BauLuData.phases) {
            console.error("Amplitudes or phases are not defined!");
            return;
        }

        frequencies.value = PopupMangerState.BauLuData.frequencies
        if (Array.isArray(PopupMangerState.BauLuData.amplitudes) && Array.isArray(PopupMangerState.BauLuData.phases)) {
            amplitudes.value = (PopupMangerState.BauLuData.amplitudes as number[]).map(amplitude => 20 * Math.log10(amplitude))
            phases.value = (PopupMangerState.BauLuData.phases as number[]).map(phase => phase * (180 / Math.PI))
        }


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
