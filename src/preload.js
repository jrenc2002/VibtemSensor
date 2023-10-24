const {contextBridge, ipcRenderer} = require('electron');
const ModbusRTU = require("modbus-serial");

console.log('preload.js');

contextBridge.exposeInMainWorld('Electron', {
    ipcRenderer
});

contextBridge.exposeInMainWorld('useModbusAPI', {
    new: (ip, port, id) => {
        const modbusInstance = new ModbusInstance(id);
        return {
            connect: modbusInstance.connect.bind(modbusInstance, ip, port, id),
            writeRegisters: modbusInstance.writeRegisters.bind(modbusInstance),
            readHoldingRegisters: modbusInstance.readHoldingRegisters.bind(modbusInstance),
            updateRegisterByDataIndex: modbusInstance.updateRegisterByDataIndex.bind(modbusInstance),
            close: modbusInstance.close.bind(modbusInstance),
            on: modbusInstance.on.bind(modbusInstance),
            getConnectedDeviceID: modbusInstance.getConnectedDeviceID.bind(modbusInstance),
        };
    }
});

class ModbusInstance {
    constructor(id) {
        this.client = new ModbusRTU();
        this.client.setTimeout(1000);  // Set timeout to 5 seconds
        
    }
    
    async connect(ip, port, id) {
        return new Promise((resolve, reject) => {
            this.client.connectTCP(ip, {port: port}, async err => {
                if (err) {
                    console.log(err, '-----------');
                    reject(err);
                } else {
                    await this.client.setID(id);  // Correct usage of setID
                    console.log(id)
                    if (this.client.emit) {
                        this.client.emit('connect');  // 直接触发 connect 事件
                    }
                    resolve();
                }
            });
            
        });
    }
    
    async getConnectedDeviceID(ip, port, startID = 1, endID = 247, testAddress = 0) {
        for (let id = startID; id <= endID; id++) {
            try {
                await this.connect(ip, port, id);
                await this.readHoldingRegisters(testAddress, 1);  // 尝试读取一个寄存器
                this.close();  // 关闭连接
                return id;  // 如果读取成功，则返回此ID
            } catch (error) {
                this.close();  // 确保在每次尝试后关闭连接
                // 如果出现错误（例如连接失败或读取失败），继续下一个ID
            }
        }
        throw new Error("No Modbus device responded within the given ID range.");
    }
    
    
    on(event, callback) {
        this.client.on(event, callback);
    }
    
    writeRegisters(address, values) {
        return new Promise((resolve, reject) => {
            this.client.writeRegisters(address, values)
                .then(resolve)
                .catch(reject);
        });
    }
    
    // 获取浮点数数据的地址
    getFloatAddress(dataIndex) {
        return (dataIndex * 2);
    }
    
    // dataIndex是从0开始
    async updateRegisterByDataIndex(dataIndex, newValue) {
        const address = this.getFloatAddress(dataIndex);
        try {
            const [high, low] = floatToUint16(newValue);
            console.log("updateRegisterByDataIndex", address, high, low)
            await this.writeRegisters(address, [high, low]);
        } catch (error) {
            console.error("Failed to update register:", error, dataIndex, newValue, address);
        }
    }
    
    
    readHoldingRegisters(address, numRegisters) {
        return new Promise((resolve, reject) => {
            this.client.readHoldingRegisters(address, numRegisters)
                .then(data => {
                    const floatData = [];
                    for (let i = 0; i < data.data.length; i += 2) {
                        floatData.push(convertToFloat32(data.data[i], data.data[i + 1]));
                    }
                    resolve(floatData);

                })
                .catch(reject);
        });
    }

    close() {
        this.client.close();
    }
}

function convertToFloat32(high, low) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint16(0, high, false);  // false for Big-endian
    view.setUint16(2, low, false);   // false for Big-endian
    return view.getFloat32(0, false);
}

function floatToUint16(value) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, value, false);
    return [view.getUint16(0, false) & 0xFFFF, view.getUint16(2, false) & 0xFFFF];
}

