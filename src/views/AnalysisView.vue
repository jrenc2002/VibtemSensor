<template>
    <div class="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]  ">
        <transition name="fade">
            <div
                    v-show="PopupMangerState.isShowPop"
                    class="rounded-2xl absolute bg-white bg-opacity-50 h-[calc(100%-2rem)] w-[calc(100%-2rem)]  z-30 backdrop-blur-sm items-center justify-center flex"
            >
                <ChartsView :data="data" class="w-full h-full "></ChartsView>
            </div>
        </transition>
        <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 overflow-auto ">

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                <div v-for="machine in machines" :key="machine.id"
                     class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >

                    <div class="min-w-0 flex-1">
                        <a class="focus:outline-none flex-col">
                            <h5 class="text-xl font-semibold leading-6 text-gray-900">{{ machine.device_name }}</h5>
                            <div class=" sm:grid-cols-2 grid grid-cols-2 gap-4 ">
                                <dl class="mt-5 grid grid-cols-1 gap-5 ">

                                    <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-1 py-1
                                    hover:bg-neutral-100 hover:cursor-pointer hover:border-indigo-500 hover:border-2 shadow " @click="popManager(machine.device_id,machine.substation_id,'zd')">
                                        <img :src="chart"/>
                                        <div class=" leading-4 mt-2 h-6 flex justify-center items-center w-full text-center">
                                            振动
                                        </div>

                                    </div>
                                </dl>
                                <dl class="mt-5 grid grid-cols-1 gap-5 "
                                    @click="popManager(machine.device_id,machine.substation_id,'wd')">
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

</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {usePopupMangerState} from "@/store/PopupMangerState";
import ChartsView from "@/components/ChartsView.vue";
import {useAppGlobal} from "@/store/AppGlobal";
import {useDeviceManage} from "@/store/DeviceManage";
import chart from '@/assets/image/chart.png'

const AppGlobal = useAppGlobal()
const DeviceManage = useDeviceManage();
const PopupMangerState = usePopupMangerState()
/* ——————————————————————————声明echart—————————————————————————— */


onMounted(() => {

    window.addEventListener('keydown', handleKeydown);
    // 写个计时器
    let timerId = setInterval(() => {
        const sensorsData = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;

        // 检查sensorsData是否不为空
        if (sensorsData && sensorsData.length > 0) {

            machinesRef.value = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;
            // 清除计时器
            clearInterval(timerId);
        } else {
            console.log("数据尚未读取");
        }
    }, 200);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

/* ——————————————————————————设备数据—————————————————————————— */

const machinesRef = ref()
const machines = computed(() => machinesRef.value)

watch(() => AppGlobal.pageChance, () => {
    console.log('11111111')
    console.log(DeviceManage.deviceList[AppGlobal.pageChance])
    console.log(DeviceManage.deviceList[AppGlobal.pageChance].sensorsData)
    machinesRef.value = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData
})


watch(() => DeviceManage.deviceList[AppGlobal.pageChance], (newData) => {

    // 写个计时器
    let timerId = setInterval(() => {
        const sensorsData = DeviceManage.deviceList[AppGlobal.pageChance].sensorsData;

        // 检查sensorsData是否不为空
        if (sensorsData && sensorsData.length > 0) {

            machinesRef.value = newData.sensorsData;
            // 清除计时器
            clearInterval(timerId);
        } else {
            console.log("数据尚未读取");
        }
    }, 200);


})
/* ——————————————————————————时间数据配置—————————————————————————— */
let data;


/* ——————————————————————————定时器时间函数配置—————————————————————————— */
const popManager = async (device_id: any, substation_id: any, kind: any) => {
    await handleData(device_id, substation_id, kind)

}
const handleData = (device_id, substation_id, kind) => {
    window.Electron.ipcRenderer.invoke('get-data-item-by-substation-and-device', substation_id, device_id).then(
        (res) => {
            // 这里将原始数据转换为需要的格式
            if (kind === 'zd') {
                data = res.map(item => {
                    return [+new Date(item.timestamp), item.vibration_data];

                });

            } else if (kind === 'wd') {
                data = res.map(item => {
                    return [+new Date(item.timestamp), item.temperature_data];
                });

            }
            console.log(data, '第一层');
            PopupMangerState.updateIsShowPop(true)
        }
    );

}

const handleKeydown = (event) => {
    if (event.keyCode === 27) { // 27 是 esc 键的 keyCode
        console.log('ESC key was pressed!');
        // 在此处执行你想要的操作
        PopupMangerState.updateIsShowPop(false)
    }
};
</script>
<style>

</style>