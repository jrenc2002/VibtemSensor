<template>
  <div class="bg-white w-[98%] h-[97%] rounded-2xl bg-white shadow">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
        <tr>
          <th></th>
          <th>传感器ID</th>
          <th>报警时间</th>
          <th>传感器</th>
          <th>报警值</th>
          <th>标准值</th>
        </tr>
        </thead>
        <tbody>
        <!-- row 1 -->
        <tr v-for="(AlarmData,index) in AlarmDatas" :key="AlarmData.index" class="hover">
          <th>{{ index + 1 }}</th>
          <td>{{ AlarmData.SenorId }}</td>
          <td>{{ AlarmData.AlarmTime }}</td>
          <td>{{ AlarmData.SenorKind }}</td>
          <td>{{ AlarmData.AlarmValue }}</td>
          <td>{{ AlarmData.NormalValue }}</td>
        </tr>

        </tbody>
      </table>
    </div>

  </div>

</template>

<script lang="ts" setup>
import {ref} from "vue"

const AlarmDatas = ref([
  {
    SenorId: 1,
    AlarmTime: new Date(),
    SenorKind: "振动",
    AlarmValue: 12,
    NormalValue: 5
  },
  {
    SenorId: 1,
    AlarmTime: new Date(),
    SenorKind: "振动",
    AlarmValue: 12,
    NormalValue: 5
  },
  {
    SenorId: 1,
    AlarmTime: new Date(),
    SenorKind: "振动",
    AlarmValue: 12,
    NormalValue: 5
  },
  {
    SenorId: 1,
    AlarmTime: new Date(),
    SenorKind: "振动",
    AlarmValue: 12,
    NormalValue: 5
  },
  {
    SenorId: 1,
    AlarmTime: new Date(),
    SenorKind: "振动",
    AlarmValue: 12,
    NormalValue: 5
  },
])
</script>
<style>

</style>