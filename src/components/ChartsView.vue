<template>
    <div :class="[AppGlobal.isDrawerState? 'w-[calc(94vw-15rem)]':'w-[94vw]']"
         class="transition-all duration-300 ease-in-out shadow bg-white rounded-2xl">
        <div class="h-[10%] flex items-center bg-purple-500 w-full rounded-t-2xl">

        </div>
        <div class=" h-[90%]   w-full">
            <div class="h-[10%] w-full">
                <div>
                    <div class="sm:hidden">
                        <label class="sr-only" for="tabs">Select a tab</label>
                        <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                        <select id="tabs"
                                class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                name="tabs">
                            <option v-for="tab in tabs" :key="tab.name" :selected="tab.id===selectTabs">{{
                                    tab.name
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="hidden sm:block">
                        <nav aria-label="Tabs" class="isolate flex divide-x divide-gray-200 rounded-lg shadow">
                            <button v-for="(tab, tabIdx) in tabs" :key="tab.name"
                                    :aria-current="tab.id===selectTabs ? 'page' : undefined"
                                    :class="[tab.id===selectTabs ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', tabIdx === 0 ? 'rounded-l-lg' : '', tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '', 'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10']"
                                    @click.stop="updateSelectTabs(tab.id)">
                                <span>{{ tab.name }}</span>
                                <span :class="[tab.id===selectTabs ? 'bg-indigo-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5']"
                                      aria-hidden="true"/>
                            </button>
                        </nav>
                    </div>
                </div>

            </div>
            <div class="h-[90%]  flex items-center px-4  w-full">
                <div :class="[AppGlobal.isDrawerState? 'w-[75%]':'w-[calc(75%-11.5rem)]']"
                     class="h-[94%] bg-white rounded-xl flex items-center   transition-all duration-300 ease-in-out flex items-center justify-center ">
                    <GraphView v-show="selectTabs===0" id="0" ref="VibrationChartId"
                               class=" w-full relative left-0  "
                    ></GraphView>
                    <TimeWaveform v-show="selectTabs===1" id="1" ref="TimeDomainChartId"
                                  class=" w-full relative left-0  "
                    ></TimeWaveform>
                    <FrequencyDomain v-show="selectTabs===2" id="2" ref="FrequencyDomainChartId"
                                     class=" w-full relative left-0  ">
                    </FrequencyDomain>
                    <WaterFall v-show="selectTabs===3" id="3" ref="WaterFallChartId"
                               class=" w-full relative left-0  ">

                    </WaterFall>
                    <CepstrumView v-show="selectTabs===4" id="4" ref="CepstrumChartId"
                                  class=" w-full relative left-0  ">
                    </CepstrumView>
                    <BauLuView v-show="selectTabs===5" id="5" ref="BauLuChartId"
                               class=" w-full relative left-0  ">
                    </BauLuView>
                </div>
                <div :class="[AppGlobal.isDrawerState? 'w-[25%]':'w-[calc(25%+11.5rem)]']"
                     class=" h-[94%]  transition-all duration-300 ease-in-out  flex items-center justify-center">
                    <div :class="[AppGlobal.isDrawerState? 'w-[100%]':'w-[calc(100%-12rem)]']"
                         class=" h-full  transition-all duration-300 ease-in-out flex-col items-center justify-center ">
                        <div class="w-[90%] bg-white rounded-md mx-5 mt-0 px-3 h-[17%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                            <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                                   for="name">标定系数</label>
                            <input id="name" v-model="SetData.calibrationCoefficient" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
         hover:border-[#F7BF46] xl:text-xl xl:leading-6"
                                   name="name" placeholder="请输入标定系数" type="text" @keydown.enter="EnterSave(1)"/>
                        </div>
                        <div class="w-[90%] bg-white rounded-md mx-5 mt-4 px-3 h-[17%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                            <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                                   for="name">报警上限</label>
                            <input id="name" v-model="SetData.alarmLimit" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name"
                                   placeholder="请输入报警上限" type="text" @keydown.enter="EnterSave(2)"/>
                        </div>

                        <div class="w-[90%] bg-white rounded-md mx-5 mt-4 px-3 h-[17%]  pt-1 shadow ring-1 border ring-inset ring-gray-300 focus-within:ring-6 focus-within:ring-indigo-600">
                            <label class="block text-xl font-medium text-gray-900 h-[40%]  flex items-center"
                                   for="name">标准值</label>
                            <input id="name" v-model="SetData.standardValue" class="h-[50%] block w-full rounded-md border p-3 text-gray-900  placeholder:text-gray-400 focus:border-[#F7BF46]
        hover:border-[#F7BF46] xl:text-xl xl:leading-6" name="name"
                                   placeholder="请输入标准值" type="text" @keydown.enter="EnterSave(3)"/>
                        </div>

                    </div>


                </div>
            </div>

        </div>


    </div>


</template>
<script lang="ts" setup>
import {useAppGlobal} from '@/store/AppGlobal'
import GraphView from "@/components/selectCharts/GraphView.vue";
import BauLuView from "@/components/selectCharts/BauLuView.vue";
import CepstrumView from "@/components/selectCharts/CepstrumView.vue";
import FrequencyDomain from "@/components/selectCharts/FrequencyDomain.vue";
import TimeWaveform from "@/components/selectCharts/TimeWaveform.vue";
import WaterFall from "@/components/selectCharts/WaterFall.vue";
import {defineProps, onMounted, reactive, ref} from "vue";
import {usePopupMangerState} from "@/store/PopupMangerState";

const PopupMangerState = usePopupMangerState()
const props = defineProps<{
    data: any
}>();

const SetData = reactive(
    {
        calibrationCoefficient: 0,
        alarmLimit: 0,
        standardValue: 0
    }
)

let selectTabs = ref(0)
const tabs = [
    {id: 0, name: '趋势图'},
    {id: 1, name: '时域波形'},
    {id: 2, name: '频域'},
    {id: 3, name: '瀑布图'},
    {id: 4, name: '倒频谱'},
    {id: 5, name: '包洛图'}
]
const AppGlobal = useAppGlobal()
/* ——————————————————————————时间数据配置—————————————————————————— */
const VibrationChartId = ref(null);
const TimeDomainChartId = ref(null);
const FrequencyDomainChartId = ref(null);
const WaterFallChartId = ref(null);
const CepstrumChartId = ref(null);
const BauLuChartId = ref(null);

const updateSelectTabs = (id: any) => {

    selectTabs.value = id
    PopupMangerState.selectTabs = id
}

let data = ref(props.data);
const EnterSave = (id) => {
    if (id == 1) {
        PopupMangerState.setData.calibration = SetData.calibrationCoefficient
    } else if (id == 2) {
        PopupMangerState.setData.alarmLimit = SetData.alarmLimit
    } else if (id == 3) {
        PopupMangerState.setData.Standard = SetData.standardValue
    }

}

onMounted(() => {
    // todo 初始化报警上限数据

    console.log(data, '第二层');
})
</script>
<style lang="scss" scoped></style>
