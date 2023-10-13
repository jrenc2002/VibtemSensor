<template>
  <div class="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] ">

    <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 ">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
        <div v-for="machine in machines" :key="machine.device_id"
             class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">

            <div class="min-w-0 flex-1">
                <a class="focus:outline-none flex-col">
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
import {computed, onMounted, ref, watch} from 'vue';
import {useAppGlobal} from "@/store/AppGlobal";
import {useDeviceManage} from "@/store/DeviceManage";

const AppGlobal = useAppGlobal()
const DeviceManage = useDeviceManage();
const machinesRef = ref()
const machines = computed(() => machinesRef.value)

watch(() => AppGlobal.pageChance, () => {
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


onMounted(() => {
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

})
</script>
<style>


</style>