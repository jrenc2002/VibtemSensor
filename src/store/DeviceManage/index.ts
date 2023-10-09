import {defineStore} from "pinia";

// 给开发人员使用的debug
const debug = false;

interface SetData {
    // PH控制部分变量
    vibration_value: number;         // 振动值
    temp_value: number;              // 温度值

}

interface deviceSet {
    /** 温度报警上限 */
    tempMaxWarn: number;

    /** 温度报警下限 */
    tempMinWarn: number;

    /** PH报警上限 */
    phMaxWarn: number;

    /** PH报警下限 */
    phMinWarn: number;

    /** DO报警上限 */
    doMaxWarn: number;

    /** DO报警下限 */
    doMinWarn: number;

    /** 酸泵单步速度 */
    acidPumpSpeed: number;

    /** 碱泵单步速度 */
    lyePumpSpeed: number;

    /** 补料泵单步速度 */
    feedPumpSpeed: number;

    /** 消泡泵单步速度 */
    defoamerPumpSpeed: number;
    tempState: number,
    phState: number,
    doState: number,
}

interface Device {
    id: number;
    name: string;
    deviceNum: string;
    ip: string;
    port?: number; // 这意味着 port 是可选的
    state: number;
    nowData: SetData | null;
    deviceSocket: any;
    start_time: any;
    batch_name: any;
    alarm: boolean;
    deviceSet: deviceSet | null


}

// TODO:设备管理要重构
// 1.内容数据表项不全仍然缺乏
// 2.各个部分的状态灯
// 3.报警数据

const state = (): {
    deviceList: Device[];
} => {
    return {
        deviceList: [
            {
                id: 0,
                name: '设备A',
                deviceNum: "BAB-00",
                ip: '192.168.1.3',
                port: 2000,
                state: 0,
                nowData: null,
                deviceSocket: null,
                start_time: null,
                batch_name: null,
                alarm: false,
                deviceSet: {
                    tempState: 0,
                    phState: 0,
                    doState: 0,
                    tempMaxWarn: 0,
                    tempMinWarn: 0,
                    phMaxWarn: 0,
                    phMinWarn: 0,
                    doMaxWarn: 0,
                    doMinWarn: 0,
                    acidPumpSpeed: 0,
                    lyePumpSpeed: 0,
                    feedPumpSpeed: 0,
                    defoamerPumpSpeed: 0,
                }
            },

        ]
    }
}

/**
 * 提供可视窗口的公共状态
 */
export const useDeviceManage = defineStore('DeviceManage', {
    state,
    actions: {
        addDevice(ip: string, port: number, nameDevice: string) {
            const newId = this.deviceList.length;
            const newDevice: Device = {
                id: newId,
                name: nameDevice,
                deviceNum: `BAB-${newId}`,
                ip: ip,
                port: port,
                state: 0,
                nowData: null,
                deviceSocket: null,
                start_time: null,
                batch_name: null,
                alarm: false,
                deviceSet: null
            };

            this.deviceList.push(newDevice);
            return newId;
        },
        updateDeviceListData(index: number, newDeviceData: (SetData | number)) {
            console.log('newDeviceData', newDeviceData)
            if (typeof newDeviceData === 'number') {
                if (newDeviceData === -1) console.log("Error")
                return;
            }

            if (newDeviceData) {  // 确保 nowData 不为 null


                /*——————————————————————————————对状态的处理———————————————————————————————————*/
                // 未连接-未连接不会进行数据处理，在这里进行数据处理的只有已连接和报警两个选项

                // 已连接-已连接的设备如果没有修改通讯标志进行修改

                // 运行中-刚开始运行，状态还没变过来

                // 报警


            }
            console.log(this.deviceList[index].state)
            this.deviceList[index].nowData = newDeviceData;


        },
        updateDeviceList(newDeviceList: Device[]) {
            this.deviceList = newDeviceList;
        }


    },
});
