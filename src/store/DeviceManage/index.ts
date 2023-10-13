import {defineStore} from "pinia";
import {useAppGlobal} from '@/store/AppGlobal'
// 给开发人员使用的debug
const debug = false;
const AppGlobal = useAppGlobal()
interface SetData {
    // PH控制部分变量
    vibration_value: number;         // 振动值
    temp_value: number;              // 温度值

}

interface Device {
    id: number;
    substation_id: number;// 所属分站
    name: string;
    ip: string;
    port: number; // 这意味着 port 是可选的
    deviceSocket: any;
    alarm: boolean;
    sensorsData: any[];


}

// TODO:设备管理要重构
// 1.内容数据表项不全仍然缺乏
// 2.各个部分的状态灯
// 3.报警数据

const state = (): {
    deviceList: Device[];
} => {
    return {
        deviceList: []
    }
}

/**
 * 提供可视窗口的公共状态
 */
export const useDeviceManage = defineStore('DeviceManage', {
    state,
    actions: {
        addDevice(ip: string, port: number, nameDevice: string, substation_id: number) {
            if (this.deviceList.length > AppGlobal.limitDivceNum) {
                return -1;
            }
            const newId = this.deviceList.length;
            const newDevice: Device = {
                id: newId,
                substation_id: substation_id,
                name: nameDevice,
                ip: ip,
                port: port,
                deviceSocket: null,
                alarm: false,
                sensorsData: []
            };

            this.deviceList.push(newDevice);
            return newId;
        },
        updateDeviceListData(index: number, newDeviceData: any[] | null | number) {
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


        },
        updateDeviceList(res: any[]) {

            if (res) {
                for (const item of res) {
                    if (this.deviceList.length > AppGlobal.limitDivceNum) {
                        return -1;
                    }
                    if (item.substation_id && item.substation_ip && item.substation_port && item.substation_name) {
                        const newId = this.deviceList.length;
                        const newDevice: Device = {
                            id: newId,
                            substation_id: item.substation_id,
                            name: item.substation_name,
                            ip: item.substation_ip,
                            port: item.substation_port,
                            deviceSocket: null,
                            alarm: false,
                            sensorsData: []
                        };
                        this.deviceList.push(newDevice);
                    }

                }

            }
        }


    },
});
