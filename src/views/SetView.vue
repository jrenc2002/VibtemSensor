<template>

  <div class="flex w-[100%] h-[100%] flex items-center justify-center ">
    <div class="bg-white w-[60%] h-[97%] rounded-2xl  shadow  items-begin flex-col   ">
      <div class="md:flex md:items-center md:justify-between  h-[11%] px-5">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            传感器列表</h2>
        </div>

      </div>
      <div class=" w-[100%] h-[88%] overflow-y-auto pl-4 pl-5 pr-5  ">

        <div class=" w-[100%]  h-[100%]  bottom-0 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:grid-rows-6 ">

          <button v-for="machine in machines" :key="machine.id" :class="machine.select?'border-[#F7BF46]':'border-gray-300'"
                  class="relative flex items-center  rounded-lg border
                    bg-white p-2 shadow-sm  hover:border-[#F7BF46]"
                  @click="machine.select=!machine.select">

            <div class="min-w-0 flex-1 ">
              <h5 class="text-base font-semibold leading-6 text-gray-900 px-3">{{ machine.name }}</h5>
            </div>
          </button>


        </div>
      </div>
    </div>
    <div class="bg-white ml-3 w-[37%] h-[97%] rounded-2xl flex-col relative items-center shadow">


      <div
          class="rounded-md mx-5 mt-5 px-3 h-[12%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
        <label class="block text-[16px] font-medium text-gray-900 h-[40%]  flex items-center" for="name">标准值</label>
        <input id="name" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] sm:text-sm sm:leading-6" name="name" placeholder="请输入标准值" type="text"/>
      </div>
      <div
          class="rounded-md mx-5 mt-4 px-3 h-[12%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
        <label class="block text-[16px] font-medium text-gray-900 h-[40%]  flex items-center"
               for="name">报警上限</label>
        <input id="name" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] sm:text-sm sm:leading-6" name="name" placeholder="请输入报警上限" type="text"/>
      </div>
      <div
          class="rounded-md mx-5 mt-4 px-3 h-[12%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
        <label class="block text-[16px] font-medium text-gray-900 h-[40%]  flex items-center"
               for="name">报警下限</label>
        <input id="name" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] sm:text-sm sm:leading-6" name="name" placeholder="请输入报警下限" type="text"/>
      </div>
      <div
          class="rounded-md mx-5 mt-4 px-3 h-[12%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
        <label class="block text-[16px] font-medium text-gray-900 h-[40%]  flex items-center"
               for="name">标定系数</label>
        <input id="name" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] sm:text-sm sm:leading-6" name="name" placeholder="请输入标定系数" type="text"/>
      </div>
      <div class=" mx-5 mt-5 h-[7%]   flex items-center justify-begin ">
        <button class="btn btn-outline btn-success w-[45%] shadow ">确定</button>
        <button class="btn btn-outline btn-info w-[45%] ml-[2.75rem] shadow  ">置零</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";

const SensorList = ref([
  {
    id: 1,
    name: '传感器1号',
    select: false
  },
  {
    id: 2,
    name: '传感器2号',
    select: false
  }, {
    id: 3,
    name: '传感器3号',
    select: false
  }, {
    id: 4,
    name: '传感器4号',
    select: false
  }, {
    id: 5,
    name: '传感器5号',
    select: false
  }, {
    id: 6,
    name: '传感器6号',
    select: false
  }, {
    id: 7,
    name: '传感器7号',
    select: false
  },
])
const machines = computed(() => SensorList.value)
</script>
<style>

</style>