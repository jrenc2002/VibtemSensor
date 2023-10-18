<template>
    <div
            class=" h-[6.2rem] fixed top-[32vh] left-[13rem] w-48 py-1 z-50 bg-neutral-100  rounded-lg shadow border border-stone-300 flex-col justify-start items-start gap-0.5 inline-flex"
            specialType="device-context-menu">
        <div class="self-stretch py-1 flex-col justify-start items-start flex">
            <div class="h-[1.6rem]  self-stretch px-3 py-px justify-start items-center gap-1 inline-flex select-none ">
                <div class="  text-green-600  text-2xs font-bold leading-none ">{{ props.index }} :
                    {{ DeviceManage.deviceList[props.index].name }}
                </div>
            </div>
            
            <div
                    class="h-[1.6rem]  hover:bg-blue-500 hover:text-white  self-stretch px-3 py-px justify-start items-center gap-1 inline-flex select-none"
                    @click="disconnectDevice">
                断开此设备
            </div>
            <div
                    class=" h-[1.6rem] hover:bg-blue-500 hover:text-white  self-stretch px-3 py-px justify-start items-center gap-1 inline-flex select-none"
                    @click="reconnectDevice">
                重新连接此设备
            </div>
        
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';
import {useAppGlobal} from "@/store/AppGlobal";
import {useDeviceManage} from '@/store/DeviceManage'
import {closeDevice, openDevice} from '@/api/index.js'

const DeviceManage = useDeviceManage()
const AppGlobal = useAppGlobal()
const props = defineProps({
    index: Number
});
// 添加设备相关的操作方法

const disconnectDevice = () => {
    // 这里执行断开设备的代码...
    closeDevice(props.index)
    AppGlobal.selectedDeviceIndex = -1
}

const reconnectDevice = () => {
    // 这里执行重新连接设备的代码...
    openDevice(props.index)
    
    AppGlobal.selectedDeviceIndex = -1
}
</script>
