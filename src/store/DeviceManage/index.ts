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
    alarm: boolean;
    sensorsData: any[];
    sockets: any[];
    editSocket: null;
    
    
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
        async addDevice(ip: string, port: number, nameDevice: string) {
            if (this.deviceList.length > AppGlobal.limitDivceNum) {
                return -1;
            }
            const newId = this.deviceList.length;
            const newDevice: Device = {
                id: newId,
                substation_id: newId + 1,  // 在这里先设为null，稍后我们会从数据库更新这个值
                name: nameDevice,
                ip: ip,
                port: port,
                alarm: false,
                sensorsData: Array(6).fill([]),  // 初始化为6个空数组，代表6个控制板
                sockets: Array(6).fill(null),  // 初始化为6个null，代表6个控制板的sockets
                editSocket: null
            };
        
            // 先创建分站
            let substationId;
            try {
                substationId = await window.Electron.ipcRenderer.invoke('add-substation', {
                    substation_name: nameDevice,
                    substation_ip: ip,
                    substation_port: port
                });
                newDevice.substation_id = substationId;
            } catch (error) {
                console.error("Error while adding substation:", error);
                throw error;  // Or handle the error as needed
            }
        
            // 然后为新分站添加六个控制板，每个控制板有5个传感器设备
            for (let i = 0; i < 6; i++) {
                newDevice.sensorsData[i] = [];  // 初始化控制板的传感器数组
                for (let j = 0; j < 5; j++) {   // 每个控制板有5个传感器
                    const sensorName = `${i + 1}号板设备${i * 5 + j + 1}`;
                    const sensorData = {
                        device_id: newId,
                        device_name: sensorName,
                        current_data: {
                            vibration_data: 0,
                            temperature_data: 0,
                            vibration_threshold: 999,
                            temperature_threshold: 999,
                        }
                    };
                    newDevice.sensorsData[i].push(sensorData);
                
                    // 向数据库添加每一个传感器设备
                    try {
                        await window.Electron.ipcRenderer.invoke('add-sensor-device', {
                            substation_id: substationId,
                            device_name: sensorName
                        });
                    } catch (error) {
                        console.error(`Error while adding sensor device ${sensorName}:`, error);
                        throw error;  // Or handle the error as needed
                    }
                }
            }
        
            this.deviceList.push(newDevice);  // 这里将设备添加到列表，确保所有的信息都已被填充
        
            return newId;
        },
        // 更新设备表，但是不更新传感器表，传感器表放后面更新
        updateDeviceList(res: any[]) {

            if (res) {
                for (const item of res) {
                    if (this.deviceList.length > AppGlobal.limitDivceNum) {
                        return -1;
                    }
                    if (item.substation_id && item.substation_ip && item.substation_port && item.substation_name) {
                        const newId = this.deviceList.length;
    
                        const newDevice: Device = {
                            id: newId,//从0开始
                            substation_id: item.substation_id,
                            name: item.substation_name,
                            ip: item.substation_ip,
                            port: item.substation_port,
                            alarm: false,
                            editSocket: null, // 初始化编辑socket
                            sockets: [null, null, null, null, null, null],  // 初始化控制板sockets
                            sensorsData: []  // 初始化传感器数据
                        };
                        this.deviceList.push(newDevice);
                    }
    
                }
    
            }
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
    
    
    },
});
