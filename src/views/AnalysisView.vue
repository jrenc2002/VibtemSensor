<template>
    <div class="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]  ">
        <transition name="fade">
            <div
                    v-if="PopupMangerState.isShowPop"
                    class="rounded-2xl absolute bg-white bg-opacity-50 h-[calc(100%-2rem)] w-[calc(100%-2rem)]  z-30 backdrop-blur-sm items-center justify-center flex"
            >
                <ChartsView :deviceid="deviceid" class="w-full h-full "></ChartsView>
            </div>
        </transition>
        <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 overflow-auto ">
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                <div v-for="board in machines" :key="board.id">
                    <div v-for="machine in board" :key="machine.device_id"
                         class="relative flex items-center space-x-3 rounded-lg mt-3 border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                    >
                        
                        <div class="min-w-0 flex-1">
                            <a class="focus:outline-none flex-col">
                                <h5 class="text-xl font-semibold leading-6 text-gray-900">{{ machine.device_name }}</h5>
                                <div class=" sm:grid-cols-2 grid grid-cols-2 gap-4 ">
                                    <dl class="mt-5 grid grid-cols-1 gap-5 ">
                                        
                                        <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-1 py-1
                                    hover:bg-neutral-100 hover:cursor-pointer hover:border-indigo-500 hover:border-2 shadow "
                                             @click="popManager(machine.device_id,DeviceManage.deviceList[AppGlobal.pageChance].substation_id,'振动')">
                                            <img :src="chart"/>
                                            <div class=" leading-4 mt-2 h-6 flex justify-center items-center w-full text-center">
                                                振动
                                            </div>

                                        </div>
                                    </dl>
                                    <dl class="mt-5 grid grid-cols-1 gap-5 "
                                        @click="popManager(machine.device_id,DeviceManage.deviceList[AppGlobal.pageChance].substation_id,'温度')">
                                        <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-1 py-1
                                    hover:bg-neutral-100 hover:cursor-pointer hover:border-indigo-500 hover:border-2 shadow ">
                                            <img :src="chart"/>
                                            <div class=" leading-4 mt-2 h-6 flex justify-center items-center w-full text-center">
                                                温度
                                            </div>
        
                                        </div>
                                    </dl>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="js" setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {usePopupMangerState} from "@/store/PopupMangerState";
import ChartsView from "@/components/ChartsView.vue";
import {useAppGlobal} from "@/store/AppGlobal";
import {useDeviceManage} from "@/store/DeviceManage";
import chart from '@/assets/image/chart.png'
import {fft, util} from 'fft-js';

import swal from 'sweetalert';

const AppGlobal = useAppGlobal()
const DeviceManage = useDeviceManage();
const PopupMangerState = usePopupMangerState()
/* ——————————————————————————声明echart—————————————————————————— */


onMounted(() => {
    
    window.addEventListener('keydown', handleKeydown);
    // 写个计时器
    let timerId = setInterval(() => {
        let sensorsData;
        
        if (
            DeviceManage &&
            DeviceManage.deviceList &&
            AppGlobal &&
            typeof AppGlobal.pageChance !== 'undefined' &&
            DeviceManage.deviceList[AppGlobal.pageChance] &&
            DeviceManage.deviceList[AppGlobal.pageChance].sensorsData
        ) {
            sensorsData = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;
        } else {
            console.error('sensorsData does not exist.');
        }
        
        
        // 检查sensorsData是否不为空
        if (sensorsData && sensorsData.length > 0) {
            
            machinesRef.value = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;
            // 清除计时器
            clearInterval(timerId);
        } else {
            console.log("数据尚未读取");
        }
    }, 1000);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

/* ——————————————————————————设备数据—————————————————————————— */

const machinesRef = ref()
const machines = computed(() => machinesRef.value)

watch(() => AppGlobal.pageChance, () => {
    
    machinesRef.value = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData
})


watch(() => DeviceManage.deviceList[AppGlobal.pageChance], (newdata) => {
    
    // 写个计时器
    let timerId = setInterval(() => {
        let sensorsData;
        
        if (
            DeviceManage &&
            DeviceManage.deviceList &&
            AppGlobal &&
            typeof AppGlobal.pageChance !== 'undefined' &&
            DeviceManage.deviceList[AppGlobal.pageChance] &&
            DeviceManage.deviceList[AppGlobal.pageChance].sensorsData
        ) {
            sensorsData = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;
        } else {
            console.error('sensorsData does not exist.');
        }
        
        
        // 检查sensorsData是否不为空
        if (sensorsData && sensorsData.length > 0) {
            
            machinesRef.value = newdata.sensorsData;
            // 清除计时器
            clearInterval(timerId);
        } else {
            console.log("数据尚未读取");
        }
    }, 1000);
    
    
})
/* ——————————————————————————时间数据配置—————————————————————————— */
let data;

/* ——————————————————————————定时器时间函数配置—————————————————————————— */
const deviceid = ref()
const popManager = async (device_id, substation_id, kind) => {
    console.log(device_id, substation_id)
    deviceid.value = device_id
    // console.log(deviceid.value)
    // if (deviceid.value !== undefined) {
    //     console.log(DeviceManage.deviceList[AppGlobal.pageChance].sensorsData,'sensorsData')
    //     console.log(DeviceManage.deviceList,'deviceList')
    //     console.log('deviceid.value',deviceid.value,'pageChance', AppGlobal.pageChance,'(deviceid.value - AppGlobal.pageChance * 30) / 5', Math.floor((deviceid.value - AppGlobal.pageChance * 30) / 5),'deviceid.value - AppGlobal.pageChance * 30 - 1', (deviceid.value - AppGlobal.pageChance * 30 - 1)%5)
    //     console.log('data',DeviceManage.deviceList[AppGlobal.pageChance].sensorsData[Math.floor((deviceid.value - AppGlobal.pageChance * 30-1) / 5)][(deviceid.value - AppGlobal.pageChance * 30 - 1)%5].device_name);
    // }
    
    await handleData(device_id, substation_id, kind)
    
}
const handleData = async (device_id, substation_id, kind) => {
    await window.Electron.ipcRenderer.invoke('get-data-item-by-substation-and-device-last', substation_id, device_id)
        .then((res) => {
            try {
                if (res.length === 0) {
                    swal({
                        title: "报错",
                        text: "读取数据为空",
                        icon: "error",
                    });
                    console.log("读取数据为空:", res);
                    return
                }
                // 先确保res是有效的数组
                if (!Array.isArray(res)) {
                    swal({
                        title: "报错",
                        text: "数据不是数组",
                        icon: "error",
                    });
                    console.log("数据不是数组:", res);
                    return
                }
    
    
                // 这里将原始数据转换为需要的格式
                let data;
                if (kind === '振动') {
                    data = res.map(item => [+new Date(item.timestamp), item.vibration_data]);
                } else if (kind === '温度') {
                    data = res.map(item => [+new Date(item.timestamp), item.temperature_data]);
                } else {
                    throw new Error(`Unknown kind: ${kind}`);
                }
                
                
                PopupMangerState.kind = kind
                data.sort((a, b) => a[0] - b[0]);
                PopupMangerState.GraphData = data
                PopupMangerState.TimeWaveData = data
                PopupMangerState.updateIsShowPop(true)
                
                // -------------------------------频域------------------------------
                const getUniformData = (data, closestPowerOfTwo) => {
                    const values = data.map(item => item[1]);
                    let result = [...values];
                    while (result.length < closestPowerOfTwo) {
                        result = result.concat(values);
                    }
                    return result.slice(0, closestPowerOfTwo);
                }
                
                
                // 假设数据已经按时间戳排序
                const targetSampleRate = 2; // 例如，将采样率设置为 1 Hz,就是一秒一次
                const sampleInterval = 1 / targetSampleRate * 500; // 采样时间间隔（以毫秒为单位）
                
                
                // 调整数据大小为2的整数次幂
                const closestPowerOfTwo = Math.pow(2, Math.ceil(Math.log(data.length) / Math.log(2)));
                const uniformData = getUniformData(data, closestPowerOfTwo);
                // FFT变换
                const phasors = fft(uniformData);
                const frequencies = util.fftFreq(phasors, sampleInterval);
                const amplitudes = util.fftMag(phasors);
                PopupMangerState.FrequencyData.frequencies = frequencies;
                PopupMangerState.FrequencyData.amplitudes = amplitudes;
                // -------------------------------倒频谱------------------------------
                
                // 获取幅度信息并转换为对数幅度
                const logAmplitudes = amplitudes.map(a => Math.log(a));
                // 再次应用FFT来获得倒频谱
                const cepstrumPhasors = fft(logAmplitudes);
                const quefrency = util.fftFreq(cepstrumPhasors, sampleInterval);
                const cepstralCoefficients = util.fftMag(cepstrumPhasors);
                
                PopupMangerState.CepstrumData.quefrency = quefrency;
                PopupMangerState.CepstrumData.cepstralCoefficients = cepstralCoefficients;
                
                PopupMangerState.CepstrumData.timeLags = quefrency;
                PopupMangerState.CepstrumData.autocorrelation = cepstralCoefficients;
                
                // -------------------------------包络图------------------------------
                
                const calculatePhases = () => {
                    return phasors.map(p => {
                        const real = p[0];
                        const imag = p[1];
                        
                        return Math.atan2(imag, real);
                    });
                }
                
                const phases = calculatePhases(phasors); // 新增计算相位
                
                PopupMangerState.BauLuData.frequencies = frequencies;
                PopupMangerState.BauLuData.amplitudes = amplitudes;
                PopupMangerState.BauLuData.phases = phases; // 存储相位数据
                
                
                // -------------------------------瀑布图------------------------------
                const categories = data.map(item => item[0]);
                const actualData = [];
                const placeholderData = [];
                for (let i = 0; i < data.length; i++) {
                    const timestamp = data[i][0];
                    const value = data[i][1];
                    
                    // 添加时间戳和值到相应的数组
                    categories.push(timestamp);
                    
                    // 对于占位数据，您可以将其设置为上一个数据点的值
                    // 注意：第一个数据点没有上一个数据点，所以将其设置为0或者null等适当的值
                    if (i === 0) {
                        placeholderData.push([timestamp, 0]); // 或 [timestamp, null]
                        actualData.push([timestamp, toFixed2Decimal(value)]);
                    } else {
                        const prevValue = data[i - 1][1];
                        
                        if (value - prevValue < 0) {
                            placeholderData.push([timestamp, toFixed2Decimal(value)]);
                            actualData.push([timestamp, toFixed2Decimal(prevValue - value)]);
                        } else {
                            placeholderData.push([timestamp, toFixed2Decimal(prevValue)]);
                            actualData.push([timestamp, toFixed2Decimal(value - prevValue)]);
                        }
                        
                    }
                }
                
                PopupMangerState.WaterFallData.actualData = actualData;
                PopupMangerState.WaterFallData.placeholderData = placeholderData
                PopupMangerState.WaterFallData.categories = categories
                
            } catch (error) {
                swal({
                    title: "报错",
                    text: "处理数据时错误",
                    icon: "error",
                });
                console.log("An error occurred while processing the data:", error);
            }
        })
        .catch(error => {
            swal({
                title: "报错",
                text: "从数据读取数据时错误",
                icon: "error",
            });
            console.log("Error fetching data:", error, '没找到数据');
        });
    
}


function toFixed2Decimal(value) {
    return parseFloat(value.toFixed(2));
}

const handleKeydown = (event) => {
    if (event.keyCode === 27) { // 27 是 esc 键的 keyCode
        
        // 在此处执行你想要的操作
        PopupMangerState.updateIsShowPop(false)
    }
};
</script>
<style>

</style>
