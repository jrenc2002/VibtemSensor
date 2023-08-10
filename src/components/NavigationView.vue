<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto  px-6  pt-4">

    <nav class="flex flex-1 flex-col ">
      <ul class="flex flex-1 flex-col gap-y-4" role="list">
        <li>
          <ul class="-mx-2 space-y-1" role="list">
            <li v-for="item in navigation" :key="item.name">
              <router-link
                  :class="[item.current ? 'bg-white text-indigo-600 shadow' : 'text-gray-700 hover:text-indigo-600 hover:bg-white hover:shadow', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']"
                  :to="item.href">
                <component :is="item.icon"
                           :class="[item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                           aria-hidden="true"/>
                {{ item.name }}
                <span v-if="item.count"
                      aria-hidden="true"
                      class="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200">{{
                    item.count
                  }}</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <div class="relative">
            <div aria-hidden="true" class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"/>
            </div>
          </div>
          <ul class="-mx-2 mt- space-y-1" role="list">
            <li v-for="team in teams" :key="team.name">
              <a :class="[team.current ? 'bg-white rounded-xl shadow text-indigo-600' : 'text-gray-700 hover:text-gray-600 hover:bg-white hover:shadow', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']"
                 :href="team.href">
                <span
                    :class="[team.current ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white']">{{
                    team.id
                  }}</span>
                <span class="truncate">{{ team.name }}</span>
              </a>
            </li>
          </ul>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {computed} from 'vue'
import {CalendarIcon, FolderIcon, HomeIcon, UsersIcon,} from '@heroicons/vue/24/outline'

const route = useRoute()
const navigation = computed(() => [
  {name: '显示界面', href: '/mainview', icon: HomeIcon, current: route.path === '/mainview'},
  {name: '分析界面', href: '/analysisview', icon: UsersIcon, current: route.path === '/analysisview'},
  {name: '设置界面', href: '/setiew', icon: FolderIcon, current: route.path === '/setiew'},
  {name: '报警数据', href: '/alarmview', icon: CalendarIcon, count: '20+', current: route.path === '/alarmview'}
])
const teams = [
  {id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false},
  {id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false},
  {id: 3, name: 'Workcation', href: '#', initial: 'W', current: false},
  {id: 4, name: 'Heroicons', href: '#', initial: 'H', current: false},
  {id: 5, name: 'Heroicons', href: '#', initial: 'H', current: false},


]
</script>
