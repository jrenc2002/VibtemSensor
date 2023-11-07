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
// TODO 将其数据读取改为socket存储，放置阻塞冲突。

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
    const deviceInfo = DeviceManage.deviceList[index];
    deviceInfo.socket = null;
    try {
        // 使用Promise.all进行并行连接
        const deviceSocket = window.useModbusAPI.new(ip, port);
        const device = await deviceSocket.connect(ip, port);
        
        device.on('connect', () => {
            deviceInfo.sockets = device;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接成功`);
        });
        
        device.on('error', (err) => {
            deviceInfo.sockets = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接失败，错误信息:`, err);
        });
        
        device.on('disconnect', () => {
            deviceInfo.sockets = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接断开`);
        });
        
    } catch (error) {
        console.error("设备连接中发生错误：", error);
    }
}


// 关闭设备-对
export const closeDevice = async (index) => {
    // 检查 index 是否有效
    if (typeof index !== 'number' || index < 0 || index >= DeviceManage.deviceList.length) {
        console.error(`无效的设备索引: ${index}`);
        return;
    }
    
    const deviceInfo = DeviceManage.deviceList[index];
    try {
        if (deviceInfo.socket) {
            await deviceInfo.socket.close();
            console.log(`设备 ${index} 的${deviceInfo.name} 连接已成功关闭`);
        }
    } catch (error) {
        console.error(`关闭设备 ${index} 的${deviceInfo.name}  连接时出错:`, error);
    }
    
    
}

// 打开设备-对
export const openDevice = async (index) => {
    // 检查index是否有效
    if (typeof index !== 'number' || index < 0 || index >= DeviceManage.deviceList.length) {
        console.error(`无效的设备索引: ${index}`);
        return;
    }
    
    const deviceInfo = DeviceManage.deviceList[index];
    try {
        // 使用Promise.all进行并行连接
        const deviceSocket = window.useModbusAPI.new(deviceInfo.ip, deviceInfo.port);
        const device = await deviceSocket.connect();
        
        device.on('connect', () => {
            deviceInfo.sockets = device;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接成功`);
        });
        
        device.on('error', (err) => {
            deviceInfo.sockets = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接失败，错误信息:`, err);
        });
        
        device.on('disconnect', () => {
            deviceInfo.sockets = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${name} 连接断开`);
        });
        
    } catch (error) {
        console.error("设备连接中发生错误：", error);
    }
    
}


/**
 * 更新分站中所有控制板的传感器数据。
 *
 * @param {Object} substation - 分站数据。
 */
const fetchDataFromModbus = async (socket, substationIndex) => {
    try {
        
        
        const allData = [];
        
        for (let i = 0; i < 3; i++) {
            const startAddress = i * 120;
            const fetchedData = await socket.readHoldingRegisters(startAddress, 120);
            allData.push(...fetchedData);
        }
        
        return allData;
    } catch (error) {
        console.error(`从分站${substationIndex} 读取数据时发生错误:`, error);
        return null;
    }
};


export const updateSubstationData = async (substationIndex) => {
    const deviceInfo = DeviceManage.deviceList[substationIndex];
    if (!deviceInfo) {
        console.error(`分站${substationIndex}读取数据时发生错误: 无数据返回`);
        return;
    }
    const allData = await fetchDataFromModbus(deviceInfo.socket, substationIndex);
    
    if (!allData) {
        console.error(`分站${substationIndex}读取数据时发生错误: 无数据返回`);
        return;
    }
    
    const sensorData = allData.slice(0, 60);
    const coefficients = allData.slice(60, 120);
    const thresholds = allData.slice(120, 180);
    
    for (let boardIndex = 0; boardIndex < 6; boardIndex++) {
        for (let sensorIndex = 0; sensorIndex < 5; sensorIndex++) {
            const dataIndex = boardIndex * 10 + sensorIndex * 2;
            
            
            const vibrationData = parseFloat(sensorData[dataIndex].toFixed(2));
            const temperatureData = parseFloat(sensorData[dataIndex + 1].toFixed(2));
            
            const vibrationCoefficient = parseFloat(coefficients[dataIndex].toFixed(2));
            const temperatureCoefficient = parseFloat(coefficients[dataIndex + 1].toFixed(2));
            
            const vibrationThreshold = parseFloat(thresholds[dataIndex].toFixed(2));
            const temperatureThreshold = parseFloat(thresholds[dataIndex + 1].toFixed(2));
            
            
            // Update sensor data
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_data = temperatureData;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_data = vibrationData;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.temperature_threshold = temperatureThreshold;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.vibration_threshold = vibrationThreshold;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.TempCoefficent = temperatureCoefficient;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.VibrationCoefficent = vibrationCoefficient;
            // Check for threshold exceedances
            const isTemperatureAlerted = temperatureData >= temperatureThreshold;
            const isVibrationAlerted = vibrationData >= vibrationThreshold;
            const isAlerted = isTemperatureAlerted || isVibrationAlerted;
            deviceInfo.sensorsData[boardIndex][sensorIndex].current_data.is_alerted = isAlerted;
            if (isAlerted === true) {
                deviceInfo.alarm = true
            }
            
            await window.Electron.ipcRenderer.invoke('add-data-item', {
                device_id: deviceInfo.sensorsData[boardIndex][sensorIndex].device_id,
                vibration_data: vibrationData,
                temperature_data: temperatureData,
                vibration_threshold: vibrationThreshold,
                temperature_threshold: temperatureThreshold,
                vibration_coefficient: vibrationCoefficient,
                temperature_coefficient: temperatureCoefficient,
                is_alerted: isAlerted
            });
        }
    }
    
    // After updating the deviceInfo, assign it back to DeviceManage.deviceList
    DeviceManage.deviceList[substationIndex] = deviceInfo;
}


// 数据发送
/**
 * 发送分站某个传感器的数据。
 * @substationIndex {Number} 这个是substationIndex是从0开始的，id是从1开始的 - 分站数据。
 * @deviceId {Number} deviceId是从1开始的 - 分站数据。
 * @data {Number} number数据 - 分站数据。
 * @kind {String} 数据类型 - 分站数据。
 */
export const sendData = async (substationIndex, deviceId, data, kind) => {
    console.log("sendData", substationIndex, deviceId, data, kind)
    // 这个substationIndex是从0开始的，id是从1开始的
    const deviceInfo = DeviceManage.deviceList[substationIndex];
    if (deviceInfo.socket === null) {
        console.error(`分站${substationIndex}发送数据时发生错误:未连接`);
        return;
    }
    
    
    let addressOffset;
    
    // Determine the addressOffset based on deviceId
    let boardIndex = Math.floor((deviceId - 1) / 5);
    let sensorIndex = (deviceId - 1) % 5;
    console.log("boardIndex", boardIndex, "sensorIndex", sensorIndex)
    
    let baseAddress;
    switch (kind) {
        case 'vibration_coefficient':
            baseAddress = 60; // Starting point for coefficients
            addressOffset = baseAddress + boardIndex * 10 + sensorIndex * 2;
            break;
        case 'temperature_coefficient':
            baseAddress = 60; // Starting point for coefficients
            addressOffset = baseAddress + boardIndex * 10 + sensorIndex * 2 + 1;
            break;
        case 'vibration_threshold':
            baseAddress = 120; // Starting point for thresholds
            addressOffset = baseAddress + boardIndex * 10 + sensorIndex * 2;
            break;
        case 'temperature_threshold':
            baseAddress = 120; // Starting point for thresholds
            addressOffset = baseAddress + boardIndex * 10 + sensorIndex * 2 + 1;
            break;
        default:
            console.error("Unknown kind:", kind);
            return;
    }
    
    console.log("addressOffset", addressOffset)
    
    
    try {
        const modbus = deviceInfo.socket;
        console.log(addressOffset, Number(data))
        await modbus.updateRegisterByDataIndex(addressOffset, Number(data));
        
        console.log("Data sent and connection closed...");
    } catch (error) {
        console.error(`发送数据到 ${deviceInfo.ip}:${deviceInfo.port} addressOffset ${addressOffset} 时发生错误:`, error);
    }
    
}


