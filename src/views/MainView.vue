<template>
  <div class="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] ">

    <div class="rounded-2xl bg-white w-[100%] h-[100%]  bottom-0  shadow p-4 ">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
        <div v-for="machine in machines" :key="machine.email"
             class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">

          <div class="min-w-0 flex-1">
            <a class="focus:outline-none flex-col">
              <h5 class="text-base font-semibold leading-6 text-gray-900">{{ machine.name }}</h5>
              <div class=" sm:grid-cols-2 grid grid-cols-2 gap-4 ">
                <dl class="mt-5 grid grid-cols-1 gap-5 ">
                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt class="truncate text-sm font-medium text-gray-500">温度</dt>
                    <span class="countdown mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      <span :style="'--value:'+ machine.temperaturevalue"></span>
                    </span>
                  </div>
                </dl>
                <dl class="mt-5 grid grid-cols-1 gap-5 ">
                  <div class="overflow-hidden border border-gray-100 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt class="truncate text-sm font-medium text-gray-500">振动</dt>
                    <span class="countdown mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      <span :style="'--value:'+ machine.vibrationvalue"></span>
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

import {computed, onMounted, ref} from 'vue';

const machinesref = ref([
  {
    id: 1,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  },
  {
    id: 2,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 3,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 4,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 5,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 6,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  }, {
    id: 7,
    name: 'Jane Cooper',
    temperaturevalue: '23',
    vibrationvalue: '43',
  },
])
const machines = computed(() => machinesref.value)
// 引用生命周期
// 在生命周期给vibrationvalue和temperaturevalue随机变化值
onMounted(() => {
  setInterval(() => {
    machinesref.value[2].temperaturevalue = Math.floor(Math.random() * 100).toString()
    machinesref.value[2].vibrationvalue = Math.floor(Math.random() * 100).toString()
  }, 4000)
})

</script>
<style>


</style>