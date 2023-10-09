const {contextBridge, ipcRenderer} = require('electron');
const ModbusRTU = require("modbus-serial");

console.log('preload.js');

contextBridge.exposeInMainWorld('Electron', {
    ipcRenderer
});

contextBridge.exposeInMainWorld('useModbusAPI', {
    connect: (ip, port) => {
        const modbusInstance = new ModbusInstance();
        return {
            connect: modbusInstance.connect.bind(modbusInstance, ip, port),
            writeRegisters: modbusInstance.writeRegisters.bind(modbusInstance),
            readHoldingRegisters: modbusInstance.readHoldingRegisters.bind(modbusInstance),
            close: modbusInstance.close.bind(modbusInstance),
            on: modbusInstance.on.bind(modbusInstance)
        };
    }
});

class ModbusInstance {
    constructor() {
        this.client = new ModbusRTU();


    }

    async connect(ip, port) {
        return new Promise((resolve, reject) => {
            this.client.connectTCP(ip, {port: port}, err => {
                if (err) {
                    console.log(err, '-----------')
                    reject(err);
                } else {
                    console.log("连接成功")
                    this.client.setID(9);
                    resolve();
                }
            });
        });
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
