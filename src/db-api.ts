import {ipcMain, IpcMainInvokeEvent} from 'electron';
import sqlite3Lib from 'sqlite3';

const path = require('path');

// 为了避免 ESLint 的 'no-var-requires' 错误，我们这样导入 sqlite3
const sqlite3 = sqlite3Lib.verbose();
const dbPath = path.join(__dirname, '../src/database.db');
console.log(dbPath)
const db = new sqlite3.Database(dbPath);

export function createInitDB(): any {
    ipcMain.handle('init-db', async (event: IpcMainInvokeEvent) => {
        console.log("Database path:", dbPath);
        console.log('init-db');
        const runQuery = (query: string) => {
            return new Promise((res, rej) => {
                db.prepare(query).run(err => {
                    if (err) rej(err);
                    else res("true");
                });
            });
        };
        try {
            await runQuery(`
                CREATE TABLE IF NOT EXISTS substation (
                    substation_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主键，自动递增的分站ID
                    substation_name TEXT NOT NULL,                   -- 分站名
                    substation_ip TEXT NOT NULL,                     -- 分站IP地址
                    substation_port INTEGER NOT NULL                 -- 分站端口
                );
            `);
            await runQuery(`
                CREATE TABLE IF NOT EXISTS sensor_device (
                    device_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主键，自动递增的传感器设备ID,从1开始递增
                    substation_id INTEGER NOT NULL,               -- 所属的分站ID，与分站表关联
                    device_name TEXT NOT NULL,                    -- 传感器设备的名称
                    FOREIGN KEY (substation_id) REFERENCES substation(substation_id)  -- 外键关联到分站表的ID
                );

                );
            `);
            await runQuery(`
                CREATE TABLE IF NOT EXISTS data_item (
                    item_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键，自动递增的数据项ID
                    device_id INTEGER NOT NULL,                  -- 所属的传感器设备ID，与传感器设备表关联
                    vibration_data REAL NOT NULL,                -- 振动实时数据
                    temperature_data REAL NOT NULL,              -- 温度实时数据
                    vibration_threshold REAL NOT NULL,           -- 振动报警上限
                    temperature_threshold REAL NOT NULL,         -- 温度报警上限
                    vibration_coefficient REAL NOT NULL,         -- 振动系数
                    temperature_coefficient REAL NOT NULL,       -- 温度系数
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,-- 数据存入时间，默认为当前时间
                    is_hidden BOOLEAN NOT NULL DEFAULT 0,        -- 数据是否隐藏，默认为0（不隐藏）
                    is_alerted BOOLEAN NOT NULL DEFAULT 0,       -- 数据是否报警，默认为0（无报警）
                    FOREIGN KEY (device_id) REFERENCES sensor_device(device_id)  -- 外键关联到传感器设备表的ID
                );
            `);
            return "数据库初始化成功";

        } catch (error) {
            console.error('Unexpected error while initializing the database:', error);
            return "数据库初始化失败";
        }

    });


    // 隐藏指定的数据项
    ipcMain.handle('hide-data-item', async (event: IpcMainInvokeEvent, substation_id: number, device_id: number, item_id: number) => {
        try {
            return new Promise((resolve, reject) => {
                const query = `
                UPDATE data_item
                SET is_hidden = 1
                WHERE device_id = (SELECT device_id FROM sensor_device WHERE substation_id = ? AND device_id = ?)
                AND item_id = ?;
            `;
                db.run(query, [substation_id, device_id, item_id], (err) => {
                    if (err) {
                        console.error("Error hiding data item:", err);
                        reject(err);
                    } else {
                        resolve("数据项隐藏成功");
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in hide-data-item:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    // 新建分站
    ipcMain.handle('add-substation', async (event: IpcMainInvokeEvent, substationData: { substation_name: string, substation_ip: string, substation_port: number }) => {
        try {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO substation(substation_name, substation_ip, substation_port) VALUES (?, ?, ?)`;
                db.run(query, [substationData.substation_name, substationData.substation_ip, substationData.substation_port], function (err: Error) {
                    if (err) {
                        console.error("Error adding data to substation:", err);
                        reject(err);
                    } else {
                        resolve(this.lastID);  // 返回新插入数据的ID
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in add-substation:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    // 新建传感器设备
    ipcMain.handle('add-sensor-device', async (event: IpcMainInvokeEvent, data: { substation_id: number, device_name: string }) => {
        try {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO sensor_device(substation_id, device_name) VALUES (?, ?)`;
                db.run(query, [data.substation_id, data.device_name], function (err: Error) {
                    if (err) {
                        console.error("Error adding new sensor device:", err);
                        reject(err);
                    } else {
                        resolve(this.lastID);  // 返回新插入设备的ID
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in add-sensor-device:", error);
            throw error;
        }
    });

    // 新建传感器设备数据
    ipcMain.handle('add-data-item', async (event: IpcMainInvokeEvent, data: {
        device_id: number,
        vibration_data: number,
        temperature_data: number,
        vibration_threshold: number,
        temperature_threshold: number,
        vibration_coefficient: number,     // 新增的振动系数
        temperature_coefficient: number,   // 新增的温度系数
        is_alerted: boolean
    }) => {
        try {
            return new Promise((resolve, reject) => {
                const query = `
                INSERT INTO data_item(
                    device_id, vibration_data, temperature_data, vibration_threshold,
                    temperature_threshold, vibration_coefficient, temperature_coefficient, is_alerted
  
                ) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
                db.run(query, [
                    data.device_id, data.vibration_data, data.temperature_data,
                    data.vibration_threshold, data.temperature_threshold,
                    data.vibration_coefficient, data.temperature_coefficient,  // 新增的字段
                    data.is_alerted
                ], function (err: Error) {
                    if (err) {
                        console.error("Error adding data to data_item:", err);
                        reject(err);
                    } else {
                        resolve(this.lastID);  // 返回新插入数据的ID
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in add-data-item:", error);
            throw error;
        }
    });
    // 获取所有分站的数据
    ipcMain.handle('get-all-substations', async (event: IpcMainInvokeEvent) => {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM substation';
                db.all(query, [], (err, rows) => {
                    if (err) {
                        console.error("Error fetching all substations:", err);
                        reject(err);
                    } else {
                        resolve(rows);  // 返回所有分站的数据
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in get-all-substations:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    // 根据分站ID获取与其关联的所有传感器设备
    ipcMain.handle('get-all-sensors-by-substation', async (event: IpcMainInvokeEvent, substationId: number) => {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM sensor_device WHERE substation_id = ?';
                db.all(query, [substationId], (err, rows) => {
                    if (err) {
                        console.error("Error fetching sensors by substation:", err);
                        reject(err);
                    } else {
                        resolve(rows);  // 返回与该分站相关的所有传感器设备
                    }
                });
            });
        } catch (error) {
            console.error("Unexpected error in get-all-sensors-by-substation:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    
    // 根据分站ID和传感器设备ID获取所有未被隐藏且处于报警状态的数据项
    ipcMain.handle('get-alerted-data-item-by-substation-and-device', async (event: IpcMainInvokeEvent, substationId: number, deviceId: number) => {
        try {
            return new Promise((resolve, reject) => {
                // 检查传感器设备是否属于这个分站
                const checkQuery = 'SELECT * FROM sensor_device WHERE substation_id = ? AND device_id = ?';
                db.all(checkQuery, [substationId, deviceId], (checkErr, deviceRows) => {
                    if (checkErr) {
                        console.error("Error checking if the device belongs to the substation:", checkErr);
                        reject(checkErr);
                        return;
                    }
                    
                    if (deviceRows.length === 0) {
                        reject(new Error("The device doesn't belong to the provided substation or doesn't exist."));
                        return;
                    }
                    
                    // 如果传感器设备确实属于这个分站，获取所有未被隐藏且处于报警状态的数据项
                    const query = `
                    SELECT * FROM data_item
                    WHERE device_id = ?
                    AND is_hidden = 0
                    AND (is_alerted = 1
                        OR vibration_data > vibration_threshold
                        OR temperature_data > temperature_threshold)
                    ORDER BY timestamp ASC
                `;
                    db.all(query, [deviceId], (err, rows) => {
                        if (err) {
                            console.error("Error fetching alerted data items by device ID:", err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Unexpected error in get-alerted-data-item-by-substation-and-device:", error);
            throw error;
        }
    });
    
    // 根据分站ID和传感器设备ID获取所有未被隐藏相关数据项
    ipcMain.handle('get-data-item-by-substation-and-device', async (event: IpcMainInvokeEvent, substationId: number, deviceId: number) => {
        try {
            return new Promise((resolve, reject) => {
                // 检查传感器设备是否属于这个分站
                const checkQuery = 'SELECT * FROM sensor_device WHERE substation_id = ? AND device_id = ?';
                db.all(checkQuery, [substationId, deviceId], (checkErr, deviceRows) => {
                    if (checkErr) {
                        console.error("Error checking if the device belongs to the substation:", checkErr);
                        reject(checkErr);
                        return;
                    }

                    if (deviceRows.length === 0) {
                        reject(new Error("The device doesn't belong to the provided substation or doesn't exist."));
                        return;
                    }
                    console.log("Device rows:", deviceRows)
                    // 如果传感器设备确实属于这个分站，获取所有未被隐藏的数据项
                    const query = 'SELECT * FROM data_item WHERE device_id = ? AND is_hidden = 0 ORDER BY timestamp ASC';
                    db.all(query, [deviceId], (err, rows) => {
                        if (err) {
                            console.error("Error fetching data items by device ID:", err);
                            reject(err);
                        } else {
                            resolve(rows);
                            console.log("Device rows:", rows)
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Unexpected error in get-data-item-by-substation-and-device:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    
    // 根据分站ID和传感器设备ID获取所有未被隐藏相关数据项的最后3w条
    ipcMain.handle('get-data-item-by-substation-and-device-last', async (event: IpcMainInvokeEvent, substationId: number, deviceId: number) => {
        try {
            return new Promise((resolve, reject) => {
                // 检查传感器设备是否属于这个分站
                const checkQuery = 'SELECT * FROM sensor_device WHERE substation_id = ? AND device_id = ?';
                db.all(checkQuery, [substationId, deviceId], (checkErr, deviceRows) => {
                    if (checkErr) {
                        console.error("Error checking if the device belongs to the substation:", checkErr);
                        reject(checkErr);
                        return;
                    }
                    
                    if (deviceRows.length === 0) {
                        reject(new Error("The device doesn't belong to the provided substation or doesn't exist."));
                        return;
                    }
                    
                    // 如果传感器设备确实属于这个分站，获取所有未被隐藏的数据项的最后3w条
                    const query = `
                SELECT * FROM data_item
                WHERE device_id = ? AND is_hidden = 0
                ORDER BY timestamp DESC
                LIMIT 32768
                `;
                    db.all(query, [deviceId], (err, rows) => {
                        if (err) {
                            console.error("Error fetching last 30k data items by device ID:", err);
                            reject(err);
                        } else {
                            resolve(rows.reverse());  // 这里再次将结果反转，以保持时间的升序排序
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Unexpected error in get-data-item-by-substation-and-device:", error);
            throw error;  // 或者返回一个特定的错误消息或对象，这取决于你如何处理这些错误
        }
    });
    
}

