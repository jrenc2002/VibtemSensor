/*
所需的API
1. 创建分站表
建立分站-传感器表的索引
在创建分站的时候创建传感器表
2. 建立连接
根据分站表进行遍历连接
3. 实时读取数据
每隔1s读取一次数据
4. 断开连接
输入分站号，断开设备ID
5，发送数据
输入分站号和传感器号以及设定的数据，进行传输。
6. 删除分站


 */
import {useDeviceManage} from '@/store/DeviceManage'

const DeviceManage = useDeviceManage();

/* API-与下位机通讯: 连接设备
    * 文件包含上下位机通讯的所有API
    * @initDeviceManage 对设备管理器初始化
    * 首先他要从设备管理中获取设备列表，然后对设备列表进行遍历，对每一个设备进行尝试连接，如果连接成功就更新设备状态-成功，如果连接失败就更新设备状态-失败

    * @addDevice 增加设备后对设备进行自动尝试连接-对减少设备的异常情况自适应
    * 增加设备后，对设备进行自动尝试连接，如果连接成功就更新设备状态-成功，如果连接失败就更新设备状态-失败
    * _____________________
    * @openDevice  @closeDevice 手动控制设备的连接与断开
    * 设备连接失败后可以手动重新控制设备的连接和断开。
    * _____________________
    * @senddataDevice 设备连接成功后，对设备进行数据的发送
    * 设备连接成功后，对设备进行数据的接收与发送，接收到的数据进行拼接，然后进行解析，解析成功后，将数据更新到应该到的地方；
    * 发送数据时，将数据按特定格式处理，列如分包，然后进行发送，发送成功后，将数据更新到应该到的地方。
 */


// 对设备管理器初始化-添加外部监听


// 添加设备-对
export const addDevice = async (ip, port, name) => {
    // 验证输入的有效性
    if (!ip || !port || !name) {
        console.error("无效的IP、端口或名称:", ip, port, name);
        return;
    }
    
    // 创建DeviceManage的数据
    const index = await DeviceManage.addDevice(ip, port, name);
    
    if (index === undefined || index < 0) {
        console.error(`添加设备失败: ${ip}:${port}`);
        return;
    }
    
    
    DeviceManage.deviceList[index].status = 1;
    
    
}


// 关闭设备-对
export const closeDevice = async (index) => {
    // 检查 index 是否有效
    if (typeof index !== 'number' || index < 0 || index >= DeviceManage.deviceList.length) {
        console.error(`无效的设备索引: ${index}`);
        return;
    }
    
    
    DeviceManage.deviceList[index].status = 0;
    
    
    
}

// 打开设备-对
export const openDevice = async (index) => {
    // 检查index是否有效
    if (typeof index !== 'number' || index < 0 || index >= DeviceManage.deviceList.length) {
        console.error(`无效的设备索引: ${index}`);
        return;
    }
    
    DeviceManage.deviceList[index].status = 1;
    
    
}


/**
 * 更新分站中所有控制板的传感器数据。
 *
 * @param {Object} substation - 分站数据。
 */
const fetchDataFromModbus = async (ip, port, id, startAddress = 0, numRegisters = 20) => {
    try {
        const modbus = window.useModbusAPI.new(ip, port, id);
        await modbus.connect();
        const fetchedData = await modbus.readHoldingRegisters(startAddress, numRegisters);
        console.log("fetchedData", fetchedData);
        modbus.close();
        console.log("close connection...");
        return fetchedData;
    } catch (error) {
        console.error(`从 ${ip}:${port} ID ${id} 读取数据时发生错误:`, error);
        return null;
    }
};


export const updateSubstationData = async (substationIndex) => {
    const deviceInfo = DeviceManage.deviceList[substationIndex];
    
    // Load calibration coefficients and alert thresholds
    let calibrationCoefficients = [];
    let alertThresholds = [];
    
    for (let i = 0; i < 6; i++) {
        try {
            const calibrationData = await fetchDataFromModbus(deviceInfo.ip, deviceInfo.port, i + 9);
            if (calibrationData === null) {
                calibrationCoefficients.push({
                    temperature_coefficient: -1,
                    vibration_coefficient: -1
                });
            } else {
                calibrationCoefficients.push({
                    temperature_coefficient: calibrationData[0],
                    vibration_coefficient: calibrationData[1]
                });
            }
            
            
            const thresholdData = await fetchDataFromModbus(deviceInfo.ip, deviceInfo.port, i + 19); // i+6 + 1 (因为i从0开始)
            
            if (calibrationData === null) {
                thresholdData.push({
                    temperature_coefficient: -1,
                    vibration_coefficient: -1
                });
            } else {
                thresholdData.push({
                    temperature_threshold: thresholdData[0],
                    vibration_threshold: thresholdData[1]
                });
            }
        } catch (error) {
            console.error(`分站${substationIndex}从editSocket ${i + 1} 读取数据时发生错误:`, error);
        }
    }
    
    // Iterate over each control board
    for (let boardIndex = 0; boardIndex < 6; boardIndex++) {
        try {
            let floatData = await fetchDataFromModbus(deviceInfo.ip, deviceInfo.port, boardIndex + 1);  // 加1是因为boardIndex从0开始
            if (floatData === null) {
                floatData = await fetchDataFromModbus(deviceInfo.ip, deviceInfo.port, boardIndex + 1);  // 加1是因为boardIndex从0开始
                
            }
            // Update sensor data
            for (let sensorIndex = 0; sensorIndex < 5; sensorIndex++) {
                const temperatureData = parseFloat(floatData[sensorIndex * 2].toFixed(2));
                const vibrationData = parseFloat(floatData[sensorIndex * 2 + 1].toFixed(2));
                
                // Update real-time data
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_data = temperatureData;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_data = vibrationData;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_threshold = alertThresholds[boardIndex].temperature_threshold === -1 ? deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_threshold : alertThresholds[boardIndex].temperature_threshold;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_threshold = alertThresholds[boardIndex].vibration_threshold === -1 ? deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_threshold : alertThresholds[boardIndex].vibration_threshold;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.TempCoefficent = calibrationCoefficients[boardIndex].temperature_coefficient !== -1 ? calibrationCoefficients[boardIndex].temperature_coefficient : deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.TempCoefficent;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.VibrationCoefficent = calibrationCoefficients[boardIndex].vibration_coefficient !== -1 ? calibrationCoefficients[boardIndex].vibration_coefficient : deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.VibrationCoefficent;
                
                
                // Check for threshold exceedances
                const isTemperatureAlerted = temperatureData >= deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_threshold;
                const isVibrationAlerted = vibrationData >= deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_threshold;
                const isAlerted = isTemperatureAlerted || isVibrationAlerted;
                deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.is_alerted = isAlerted;
                if (isAlerted === true) {
                    deviceInfo.alarm = true
                }
                
                await window.Electron.ipcRenderer.invoke('add-data-item', {
                    device_id: deviceInfo.sensorsData[boardIndex][sensorIndex].device_id,
                    vibration_data: vibrationData,
                    temperature_data: temperatureData,
                    vibration_threshold: deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_threshold,
                    temperature_threshold: deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_threshold,
                    vibration_coefficient: calibrationCoefficients[boardIndex].vibration_coefficient,
                    temperature_coefficient: calibrationCoefficients[boardIndex].temperature_coefficient,
                    is_alerted: isAlerted
                });
            }
        } catch (error) {
            console.error(`分站${substationIndex}从控制板${boardIndex + 1}读取数据时发生错误:`, error);
        }
    }
    
    // After updating the deviceInfo, assign it back to DeviceManage.deviceList
    DeviceManage.deviceList[substationIndex] = deviceInfo;
}


// 数据发送
export const sendData = (index, data) => {
    
    //分包发送
    if (DeviceManage.deviceList[index].nowData !== undefined && DeviceManage.deviceList[index].nowData !== null) {
        
        // 将对象的键拆分成每6个一组的数组
        const chunks = Object.keys(data).reduce((result, key, chunkindex) => {
            if (chunkindex % 6 === 0) result.push([]);
            result[Math.floor(chunkindex / 6)].push(key);
            return result;
        }, []);
        
        let chunkIndex = 0;
        
        const sendDataChunk = () => {
            if (chunkIndex < chunks.length) {
                const chunkData = {};
                chunks[chunkIndex].forEach(key => {
                    chunkData[key] = data[key];
                });
                // 发送当前分组的数据
                console.log("发送数据", chunkData);
                DeviceManage.deviceList[index].deviceSocket.send(JSON.stringify(chunkData));
                chunkIndex++;
            } else {
                clearInterval(intervalId);  // 当所有分组都已发送时，清除间隔
            }
        };
        
        const intervalId = setInterval(sendDataChunk, 500);
        
    }
}


