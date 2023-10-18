<template>
  <div class="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] ">
    
      <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 overflow-auto">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3  ">
              <div v-for="machine in machines" :key="machine.device_id"
                   class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                
                  <div class="min-w-0 flex-1 ">
                      <a class="focus:outline-none flex-col ">
                          <h5 class="text-base font-semibold leading-6 text-gray-900">{{ machine.device_name }}</h5>
                          <div class=" sm:grid-cols-2 grid grid-cols-2 gap-4 ">
                              <dl class="mt-5 grid grid-cols-1 gap-5 ">
                                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                      <dt class="truncate text-sm font-medium text-gray-500">温度</dt>
                                      <span class="countdown mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {{ machine.current_data?.temperature_data }}
                    </span>
                                  </div>
                              </dl>
                <dl class="mt-5 grid grid-cols-1 gap-5 ">
                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt class="truncate text-sm font-medium text-gray-500">振动</dt>
                    <span class="countdown mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                     {{ machine.current_data?.vibration_data }}
                    </span>
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
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useAppGlobal} from "@/store/AppGlobal";
import {useDeviceManage} from "@/store/DeviceManage";

const AppGlobal = useAppGlobal()
const DeviceManage = useDeviceManage();
const machinesRef = ref([])
const machines = computed(() => machinesRef.value)

watch(() => AppGlobal.pageChance, () => {
    updateSensorData();
})

let readSensorsInterval;

const updateSensorData = () => {
    let sensorsBoards = DeviceManage.deviceList[AppGlobal.pageChance]?.sensorsData;
    if (sensorsBoards) {
        let allSensors = [];
        for (let board of sensorsBoards) {
            allSensors = allSensors.concat(board);  // 合并所有传感器数据
        }
        machinesRef.value = allSensors;
    }
}

onMounted(() => {
    updateSensorData(); // 在组件加载时立即执行一次
    readSensorsInterval = setInterval(updateSensorData, 1000); // 每隔1秒循环更新传感器数据
})

onUnmounted(() => {
    if (readSensorsInterval) {
        clearInterval(readSensorsInterval); // 当组件销毁时清除定时器
    }
});

</script>
<style>


</style>