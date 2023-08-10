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
          <ul class="-mx-2 mt-4 space-y-1" role="list">
            <li v-for="team in pages" :key="team.name">
              <div
                  :class="[team.current ? 'bg-white rounded-md shadow text-indigo-600' : 'text-gray-700 hover:text-gray-600 hover:bg-white hover:shadow', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']"
                  :href="team.href" @click.prevent="changebindPage(team.id,$event)"
                  @dblclick.stop="changePageName(team.id,$event)">
                <span
                    :class="[team.current ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white']">{{
                    team.id
                  }}
                </span>

                <span v-if="team.id !== editID" class="truncate">{{ team.name }}</span>
                <span v-else>
                <input v-model="updateName"
                       :placeholder="team.name"
                       class="broder border-gray-200 text-black w-full"
                       @keyup.enter="enterEdit(team.id,$event)"

                >

              </span>
              </div>
            </li>
          </ul>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {computed, ref} from 'vue'
import {ChartBarIcon, Cog8ToothIcon, ServerStackIcon, TvIcon} from '@heroicons/vue/24/outline'
import {useAppGlobal} from '@/store/appglobal'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const AppGlobal = useAppGlobal()
const chancepage = ref(AppGlobal.pageChance)
const editID = ref(-1)
const updateName = ref('')
const route = useRoute()
const navigation = computed(() => [
  {name: '显示界面', href: '/mainview', icon: TvIcon, current: route.path === '/mainview'},
  {name: '分析界面', href: '/analysisview', icon: ChartBarIcon, current: route.path === '/analysisview'},
  {name: '设置界面', href: '/setiew', icon: Cog8ToothIcon, current: route.path === '/setiew'},
  {name: '报警数据', href: '/alarmview', icon: ServerStackIcon, count: '20+', current: route.path === '/alarmview'}
])

const basePages = ref([
  {id: 1, name: '一号工厂', href: '#'},
  {id: 2, name: '二号工厂', href: '#'},
  {id: 3, name: '三号工厂', href: '#'},
  {id: 4, name: '四号工厂', href: '#'},
  {id: 5, name: '五号工厂', href: '#'},
])

const pages = computed(() => {
  return basePages.value.map(page => ({
    ...page,
    current: page.id === chancepage.value
  }))
})

// 切换绑定的分页
const changebindPage = (id: number) => {
  chancepage.value = id;
  AppGlobal.updatePageChance(id);

}
// 改变分页名称
const changePageName = (id: number) => {
  editID.value = id

}
// 监听分页名称输入框
const enterEdit = (id: number) => {
  basePages.value[id - 1].name = updateName.value;
  editID.value = -1;
}


</script>
