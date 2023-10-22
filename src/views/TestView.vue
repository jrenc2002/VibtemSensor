<template>
    <div>
        <button @click="fetchData">获取数据</button>
    
        <ul v-if="data.length">
            <li v-for="(value, index) in data" :key="index">
                寄存器地址: {{ index }}，数据: {{ value }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import {ref} from "vue";

const data = ref([]);

// 这里假设你需要读取的开始地址是0，需要读取的寄存器数量是20
const startAddress = 0;
const numRegisters = 20;

const fetchData = async () => {
    console.log("fetchData");
    try {
        await ping('192.168.0.2', 502, 1);
        await ping('192.168.0.2', 502, 2);
        
        await ping('192.168.0.2', 502, 3);
        await ping('192.168.0.2', 502, 4);
        await ping('192.168.0.2', 502, 13);
        await ping('192.168.0.2', 502, 14);
        await ping('192.168.0.2', 502, 23);
        await ping('192.168.0.2', 502, 24);
        
        
    } catch (error) {
        console.error("读取Modbus数据时发生错误:", error);
    }
};
const ping = async (ip, port, id) => {
    
    console.log(ip, port, id, 'text-----------')
    const modbus = window.useModbusAPI.new(ip, port, id);
    console.log("Before connection...");
    await modbus.connect();
    console.log("After connection...");
    // TODO Modbus已经成功连接，之前连接不成功是因为没有Close，他不会自动Close，所以连接失败。现在的问题是接受失败。
    const fetchedData = await modbus.readHoldingRegisters(startAddress, numRegisters);
    console.log("fetchedData", fetchedData);
    data.value += fetchedData;
    modbus.close();
    console.log("close connection...");
    
}
const fetchDataFromModbus = async (ip, port, id, startAddress = 0, numRegisters = 20) => {
    try {
        const modbus = window.useModbusAPI.new(ip, port, id);
        console.log("Before connection...");
        await modbus.connect();
        console.log("After connection...");
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
</script>
