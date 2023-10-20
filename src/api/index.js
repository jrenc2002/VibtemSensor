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
    
    const deviceInfo = DeviceManage.deviceList[index];
    
    // 初始化sockets为null
    deviceInfo.sockets = [null, null, null, null, null, null];
    deviceInfo.editSocket = null;
    
    try {
        // 使用Promise.all进行并行连接
        const promises = Array.from({length: 6}, async (_, idx) => {
            const id = idx + 1;
            const deviceSocket = window.useModbusAPI.new(ip, port, id);
            const device = await deviceSocket.connect();
            
            device.on('connect', () => {
                deviceInfo.sockets[id - 1] = device;
                console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${id} 连接成功`);
            });
            
            device.on('error', (err) => {
                deviceInfo.sockets[id - 1] = null;
                console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${id} 连接失败，错误信息:`, err);
            });
            
            device.on('disconnect', () => {
                deviceInfo.sockets[id - 1] = null;
                console.log(`${deviceInfo.ip}:${deviceInfo.port} 控制板ID ${id} 连接断开`);
            });
            
            return device; // 返回设备作为promise的结果
        });
        
        await Promise.all(promises);
        
        // 创建编辑socket
        const editDeviceSocket = window.useModbusAPI.new(ip, port, 9);
        const editDevice = await editDeviceSocket.connect();
        
        editDevice.on('connect', () => {
            deviceInfo.editSocket = editDevice;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 编辑socket连接成功`);
        });
        
        editDevice.on('error', (err) => {
            deviceInfo.editSocket = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 编辑socket连接失败，错误信息:`, err);
        });
        
        editDevice.on('disconnect', () => {
            deviceInfo.editSocket = null;
            console.log(`${deviceInfo.ip}:${deviceInfo.port} 编辑socket连接断开`);
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
    
    // 封装关闭逻辑并集中处理错误
    const safelyClose = async (device, deviceType, deviceId) => {
        if (device) {
            try {
                await device.close();
                console.log(`设备 ${index} 的${deviceType} ${deviceId ? `控制板 ${deviceId}` : ''} 连接已成功关闭`);
            } catch (error) {
                console.error(`关闭设备 ${index} 的${deviceType} ${deviceId ? `控制板 ${deviceId}` : ''} 连接时出错:`, error);
            }
        }
    }
    
    // 使用Promise.all进行并行断开连接
    const promises = [];
    
    // 关闭editSocket
    promises.push(safelyClose(deviceInfo.editSocket, '编辑连接'));
    deviceInfo.editSocket = null; // 确保资源引用已被清除
    
    // 关闭sockets中的每个deviceSocket
    for (let id = 0; id < 6; id++) {
        promises.push(safelyClose(deviceInfo.sockets[id], '控制板', id + 1));
        deviceInfo.sockets[id] = null; // 确保资源引用已被清除
    }
    
    await Promise.all(promises);
}

// 打开设备-对
export const openDevice = async (index) => {
    // 检查index是否有效
    if (typeof index !== 'number' || index < 0 || index >= DeviceManage.deviceList.length) {
        console.error(`无效的设备索引: ${index}`);
        return;
    }
    console.log(1231)
    const deviceInfo = DeviceManage.deviceList[index];
    
    const handleDeviceConnection = async (id, isEditSocket = false) => {
        let targetDevice;
        
        try {
            console.log(deviceInfo.ip, deviceInfo.port, id);
            targetDevice = window.useModbusAPI.new(deviceInfo.ip, deviceInfo.port, id);
            if (isEditSocket) {
                deviceInfo.editSocket = targetDevice;
            } else {
                deviceInfo.sockets[id - 1] = targetDevice;
            }
            // 先绑定事件处理器
            targetDevice.on('connect', () => {
                
                console.log(`${deviceInfo.ip}:${deviceInfo.port} ${isEditSocket ? 'editSocket' : 'sensorsData id:' + id} 连接成功`);
            });
            
            targetDevice.on('error', (err) => {
                console.log(`${deviceInfo.ip}:${deviceInfo.port} ${isEditSocket ? 'editSocket' : 'sensorsData id:' + id} 连接失败，错误信息:`, err);
            });
            
            targetDevice.on('disconnect', () => {
                console.log(`${deviceInfo.ip}:${deviceInfo.port} ${isEditSocket ? 'editSocket' : 'sensorsData id:' + id} 连接断开`);
            });
            
            // 现在进行连接操作
            await targetDevice.connect(deviceInfo.ip, deviceInfo.port, id);
            
        } catch (error) {
            console.error(`${deviceInfo.ip}:${deviceInfo.port} ${isEditSocket ? 'editSocket' : 'sensorsData id:' + id} 连接过程中出现错误:`, error);
        }
        
        return targetDevice;
    };
    
    // 打开或重新添加editSocket连接
    if (!deviceInfo.editSocket) {
        await handleDeviceConnection(9, true);
    }
    
    // 打开或重新添加sensorsData中的设备连接
    const promises = Array.from({length: 6}, async (_, idx) => {
        const id = idx + 1;
        if (!deviceInfo.sensorsData[id - 1] || !deviceInfo.sensorsData[id - 1].deviceSocket) {
            return handleDeviceConnection(id);
        }
    });
    
    await Promise.all(promises);
}

/**
 * 更新分站中所有控制板的传感器数据。
 *
 * @param {Object} substation - 分站数据。
 */
export const updateSubstationData = async (substationIndex) => {
    // 遍历所有的控制板
    for (let boardIndex = 0; boardIndex < DeviceManage.deviceList[substationIndex].sockets.length; boardIndex++) {
        const socket = DeviceManage.deviceList[substationIndex].sockets[boardIndex];
        
        // 如果socket为null，则跳过
        if (!socket) {
            // console.warn(`控制板${boardIndex + 1}的socket未连接`);
            continue;
        }
        
        try {
            // 从socket读取20个存储单元
            // 直接使用API提供的方法得到浮点数数据
            const floatData = await socket.readHoldingRegisters(0, 20);
            
            // 更新传感器数据
            for (let sensorIndex = 0; sensorIndex < 5; sensorIndex++) {
                const sensor = DeviceManage.deviceList[substationIndex].sensorsData[boardIndex][sensorIndex];
                sensor.current_data.temperature_data = parseFloat(floatData[sensorIndex * 2].toFixed(2));
                sensor.current_data.vibration_data = parseFloat(floatData[sensorIndex * 2 + 1].toFixed(2));
                
                // Check if values exceed the thresholds
                const isTemperatureAlerted = sensor.current_data.temperature_data >= sensor.current_data.temperature_threshold;
                const isVibrationAlerted = sensor.current_data.vibration_data >= sensor.current_data.vibration_threshold;
                const isAlerted = isTemperatureAlerted || isVibrationAlerted; // Alert if any of the values exceed their respective thresholds
                
                await window.Electron.ipcRenderer.invoke('add-data-item', {
                    device_id: sensor.device_id,
                    vibration_data: sensor.current_data.vibration_data,
                    temperature_data: sensor.current_data.temperature_data,
                    vibration_threshold: sensor.current_data.vibration_threshold,
                    temperature_threshold: sensor.current_data.temperature_threshold,
                    is_alerted: isAlerted
                });
                
            }
        } catch (error) {
            console.error(`从控制板${boardIndex + 1}读取数据时发生错误:`, error);
        }
    }
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


