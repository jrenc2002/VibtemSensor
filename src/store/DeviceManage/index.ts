import {defineStore} from "pinia";
import {useAppGlobal} from '@/store/AppGlobal'
// 给开发人员使用的debug
const debug = false;
const AppGlobal = useAppGlobal()


interface Device {
    id: number;
    substation_id: number;// 所属分站
    name: string;
    ip: string;
    port: number; // 这意味着 port 是可选的
    alarm: boolean;
    sensorsData: any[];
    is_alerted: boolean;
    socket: any,
    
    
}



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

            const newId = this.deviceList.length;
            const newDevice: Device = {
                id: newId,
                substation_id: newId + 1,  // 在这里先设为null，稍后我们会从数据库更新这个值
                name: nameDevice,
                ip: ip,
                port: port,
                alarm: false,
                socket: null,
                sensorsData: Array(6).fill([]),  // 初始化为6个空数组，代表6个控制板
                is_alerted: false
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
                            TempCoefficent: 1,
                            VibrationCoefficent: 1,
                            is_alerted: false
    
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
            const newDeviceList: Device[] = []; // 初始化一个新的设备列表
    
            if (res) {
                for (const item of res) {
    
                    if (item.substation_id && item.substation_ip && item.substation_port && item.substation_name) {
                        const newId = newDeviceList.length;  // 使用新列表的长度作为ID
                
                        const newDevice: Device = {
                            id: newId,
                            substation_id: item.substation_id,
                            name: item.substation_name,
                            ip: item.substation_ip,
                            port: item.substation_port,
                            alarm: false,
                            socket: null,
                            sensorsData: Array(6).fill([]),  // 初始化为6个空数组，代表6个控制板
                            is_alerted: false
                        };
                
                        newDeviceList.push(newDevice);
                    }
                }
            }
    
            this.deviceList = newDeviceList;  // 覆盖原有的设备列表
            console.log('设备列表已更新！');
        }
    
    
    },
});
