<template>
    
    <div class="flex w-[100%] h-[100%] flex items-center justify-center ">
        <div class="bg-white w-[60%] h-[97%] rounded-2xl  shadow  items-begin flex-col   ">
            <div class="md:flex md:items-center md:justify-between  h-[8%] px-5">
                <div class="min-w-0 flex-1">
                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        传感器列表</h2>
                </div>
            
            </div>
            <div class=" w-[100%] h-[88%] overflow-y-auto pl-4 pl-5 pr-5 overflow-auto ">
                
                <div class=" w-[100%]  h-[100%]  bottom-0 grid grid-cols-1 gap-3 sm:grid-cols-5 overflow-auto">
    
                    <button v-for="machine in machines" :key="machine.id"
                            :class="machine.select?'bg-[rgb(26,133,211)] border-gray-300 border-2 text-white ':' bg-white border-gray-300'"
                            class="relative flex items-center  rounded-lg border
                     shadow-sm h-24  hover:border-[rgb(26,133,211)] hover:border-4"
                            @click="machine.select=!machine.select;EditData=DeviceManage.deviceList[AppGlobal.pageChance].sensorsData[Math.floor((machine.id-1) / 5)][(machine.id-1) % 5].current_data;console.log(machine.id);console.log(Math.floor((machine.id-1) / 5),(machine.id-1) % 5)">
                        <div class="min-w-0 flex-1 ">
                            <h5 class="text-xl font-none leading-6 px-3">{{ machine.name }}</h5>
                        </div>
                    </button>


                </div>
            </div>

        </div>
        <div class="bg-white ml-3 w-[37%] h-[97%] rounded-2xl flex-col relative items-center shadow">
    
    
            <div
                    class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border  ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                       for="name">标准值</label>
                <div class="flex ">
                    <input id="name"
                           v-model="Content.standard" class=" input input-bordered h-[50%]  w-[30%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                           disabled
                           name="name"
                           type="text"/>
                    <input id="name" v-model="Content.Standard" class="h-[50%] mx-2 w-[67%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name" placeholder="请输入标准值"
                           type="text"/>
                </div>
    
            </div>
            <div
                    class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border  ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                       for="name">振动报警上限</label>
                <div class="flex ">
                    <input id="name"
                           v-model="EditData.vibration_threshold" class=" input input-bordered h-[50%]  w-[30%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                           disabled
                           name="name"
                           type="text"/>
                    <input id="name" v-model="Content.VibrationAlarm" class="h-[50%] mx-2 w-[67%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name" placeholder="请输入标准值"
                           type="text"/>
                </div>
    
            </div>
            <div
                    class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border  ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                       for="name">振动标定系数</label>
                <div class="flex ">
                    <input id="name"
                           v-model="EditData.VibrationCoefficent" class=" input input-bordered h-[50%]  w-[30%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                           disabled
                           name="name"
                           type="text"/>
                    <input id="name" v-model="Content.VibrationCoefficent" class="h-[50%] mx-2 w-[67%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name" placeholder="请输入标准值"
                           type="text"/>
                </div>
    
            </div>
            <div
                    class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border  ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                       for="name">温度报警上限</label>
                <div class="flex ">
                    <input id="name"
                           v-model="EditData.temperature_threshold" class=" input input-bordered h-[50%]  w-[30%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                           disabled
                           name="name"
                           type="text"/>
                    <input id="name" v-model="Content.TempAlarm" class="h-[50%] mx-2 w-[67%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name" placeholder="请输入标准值"
                           type="text"/>
                </div>
    
            </div>
            <div
                    class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border  ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                       for="name">温度标定系数</label>
                <div class="flex ">
                    <input id="name"
                           v-model="EditData.TempCoefficent" class=" input input-bordered h-[50%]  w-[30%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                           disabled
                           name="name"
                           type="text"/>
                    <input id="name" v-model="Content.TempCoefficent" class="h-[50%] mx-2 w-[67%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name" placeholder="请输入标准值"
                           type="text"/>
                </div>
    
            </div>
    
    
            <div class=" mx-5 mt-5 h-[7%]   flex items-center justify-begin ">
                <button class="btn btn-outline text-center btn-success w-[45%] shadow " @click.stop="confirm">确定
                </button>
                <button class="btn btn-outline text-center btn-info w-[45%] ml-[2.75rem] shadow " @click.stop="setZero">
                    置零
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="js" setup>

import {computed, onMounted, reactive, ref, watch} from "vue";
import {useDeviceManage} from "@/store/DeviceManage";
import {useAppGlobal} from "@/store/AppGlobal";
import {sendData} from "@/api";

const DeviceManage = useDeviceManage();
const AppGlobal = useAppGlobal()
const extractedSensors = ref([]);
const SensorList = ref([]);
const EditData = ref([]);
const Content = reactive({
    TempAlarm: null,
    VibrationAlarm: null,
    Standard: null,
    TempCoefficent: null,
    VibrationCoefficent: null
    
})
const setZero = () => {
    Content.Standard = null;
    Content.VibrationAlarm = null;
    Content.TempAlarm = null;
    Content.VibrationCoefficent = null;
    Content.TempCoefficent = null;
}
const getSensorData = (index) => {
    const i = Math.floor(index / 5);
    const j = index % 5;
    return DeviceManage.deviceList[AppGlobal.pageChance].sensorsData[i][j].current_data;
};

const confirm = async () => {
    if (!SensorList.value || SensorList.value.length === 0) {
        console.log('SensorList.value is empty');
        return;
    }
    
    for (let sensor of SensorList.value) {
        if (sensor.select) {
            
            const sensorData = getSensorData(sensor.id - 1);  // 使用新的辅助函数
            sensorData.vibration_threshold = Content.VibrationAlarm;
            sensorData.temperature_threshold = Content.TempAlarm;
            sensorData.VibrationCoefficent = Content.VibrationCoefficent;
            sensorData.TempCoefficent = Content.TempCoefficent;
            // if (Content.Standard) {
            //     // sensorData.standard = Content.Standard;
            // }
            if (Content.VibrationAlarm) {
                await sendData(AppGlobal.pageChance, sensor.id, Content.VibrationAlarm, 'vibration_threshold');
            }
            if (Content.TempAlarm) {
                await sendData(AppGlobal.pageChance, sensor.id, Content.TempAlarm, 'temperature_threshold');
            }
            if (Content.VibrationCoefficent) {
                await sendData(AppGlobal.pageChance, sensor.id, Content.VibrationCoefficent, 'vibration_coefficient');
            }
            if (Content.TempCoefficent) {
                await sendData(AppGlobal.pageChance, sensor.id, Content.TempCoefficent, 'temperature_coefficient');
            }
    
        }
    }
};

const updateData = () => {
    
    extractedSensors.value = DeviceManage.deviceList[AppGlobal.pageChance]?.sensorsData?.flatMap(board => board) || [];
    SensorList.value = extractedSensors.value.map((sensor, index) => ({
        id: index + 1,
        name: sensor.device_name,
        select: false
    }));
    
    
}


let machines = computed(() => SensorList.value);

watch(() => AppGlobal.pageChance, () => {
    updateData();
})


onMounted(() => {
    updateData();
    setTimeout(() => {
        updateData();
    
    }, 100)
    
});

</script>

<style>

</style>
