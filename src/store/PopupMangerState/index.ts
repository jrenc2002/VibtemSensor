import {defineStore} from "pinia";

// 给开发人员使用的debug
const debug = false;

export enum PopupType {
    // 无弹窗
    None = 0,
    // 温度值
    Temperature = 1,
    // PH值
    PHValue = 2,
    // 溶氧值
    DissolvedOxygen = 3,
    // 酸泵
    AcidPump = 5,
    // 碱泵
    LyePump = 6,
    // 补料泵
    FeedPump = 7,
    // 消泡剂泵
    DefoamerPump = 8,
}


const state = () => {
    return {
        // 弹出内容为:
        popupContent: PopupType.None,
        kind: '',
        setData: {
            TempAlarm: 0,
            VibrationAlarm: 0,
            Standard: 0,
            TempCoefficent: 0,
            VibrationCoefficent: 0
        },
        // 是否打开弹窗
        isShowPop: false,
        WaterFallData: {
            placeholderData: null,
            actualData: null,
            categories: null,

        }, //瀑布图
        BauLuData: {
            frequencies: null,
            amplitudes: null,
            phases: null

        }, //包络图
        CepstrumData: {
            timeLags: null,
            autocorrelation: null
        }, //倒谱图
        FrequencyData: {    //频谱图
            frequencies: null,
            amplitudes: null,
        },
        GraphData: null,//趋势图
        TimeWaveData: null,//时域波形
        selectTabs: 0,


    }
}

/**
 * 提供弹窗管理
 */
export const usePopupMangerState = defineStore('popupManger', {
    state,
    actions: {
        updatePopupContent(popupContent: PopupType) {
            if (debug) {
                console.log('[调试] 当前弹窗为：', popupContent);
            }
            this.popupContent = popupContent;
        },
        updateIsShowPop(newisShowPop: boolean) {
            if (debug) {
                console.log('[调试] 当前弹窗为：', newisShowPop);
            }
            this.isShowPop = newisShowPop;
        },

    },
});
