<template>
    <!-- 整体样式 -->
    <div class="w-full h-screen rounded-[28px]  items-start inline-flex absolute z-10"
         style="background: linear-gradient(90deg, #C9D6FF 0%, #E9E4F0 100%), radial-gradient(85.89% 47.61% at 442.62% 78.80%, rgba(89.85, 125.68, 217.81, 0.50) 0%, rgba(81, 253, 211.72, 0) 100%); border-radius: 28px">

        <!-- 左侧样式 -->
        <div class="w-2/3 h-full relative rounded-3xl  items-center place-self-center pl-[0.3rem] pt-[0.3rem] pb-[0.3rem]">
            <!-- 左侧背景图片样式 -->
            <img :style="{ width: 'calc(100% - 0.3rem)', height: 'calc(100% - 0.6rem)' }"
                 class=" rounded-3xl bg-cover absolute	 shadow"
                 src="../assets/image/loginbackground.png"/>

            <!-- 左侧文字内容样式 -->
            <div class="w-[99%] h-[99%] absolute left-[0.5%] top-[0.5%]   rounded-3xl">
                <!-- 左上侧logo+名称样式 -->
                <div class="h-[2vh]  justify-start items-center gap-1.5 inline-flex relative left-10 top-10">
                    <img class=" h-[1.6rem]   bg-cover " src="../assets/image/login-logo.png">

                </div>
                <!-- 左下标题样式 -->
                <div class="h-[14vh] absolute bottom-10 left-10 gap-6  flex justify-center items-center  ">
                    <div class=" h-full gap-1 flex flex-col justify-center items-left ">
                        <div
                                class="font-bt leading-normal text-white text-[2.3vw] subpixel-antialiased font-semibold tracking-wide  ">
                            振动温度传感器上位机
                        </div>
                        <div class="w-[34vw] text-white text-wz font-normal text-[1.12vw] leading-normal subpixel-antialiased  ">
                            上位机使用需要厂家校验码进行检验，如果您有需要可以致电15588663668获取进一步相关信息₍ᐢ..ᐢ₎♡
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- 右侧样式 -->
        <div class="w-1/3 h-full relative  flex-col justify-start items-start flex pl-[0.3rem] pt-[0.3rem] ">
            <!-- 右侧白底 -->
            <div :style="{ width: 'calc(100% - 0.3rem)', height: 'calc(100% - 0.3rem)' }"
                 class=" box-border  shadow bg-white rounded-3xl   absoluteflex-col justify-center items-center gap-6 inline-flex">
                <!-- 图标 -->
                <div class="w-[92.5%]  absolute  top-[2%]  bg-black ">
                    <div
                            class="h-8 w-8 p-2 bg-[#F5F5F5] rounded-[2.5rem] right-[0%] justify-center items-center inline-flex  absolute">
                        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                            <path d="M12 4.7L11.3 4L8 7.3L4.7 4L4 4.7L7.3 8L4 11.3L4.7 12L8 8.7L11.3 12L12 11.3L8.7 8L12 4.7Z"
                                  fill="#19161D"/>
                        </svg>
                        <div/>
                    </div>
                </div>
                <!-- 登录成功悬浮栏样式 -->
                <div v-if="loginStatus === 'success'" class="rounded-md bg-green-50 p-4 absolute z-40 top-[10vh]">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <CheckCircleIcon aria-hidden="true" class="h-5 w-5 text-green-400"/>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">激活成功₍ᐢ..ᐢ₎♡</p>
                        </div>
                        <div class="ml-auto pl-3">
                            <div class="-mx-1.5 -my-1.5">
                                <button class="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                        type="button">
                                    <span class="sr-only">Dismiss</span>
                                    <XMarkIcon aria-hidden="true" class="h-5 w-5" @click="close"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 复制成功悬浮栏样式 -->
                <div v-if="loginStatus === 'copysuccess'" class="rounded-md bg-green-50 p-4 absolute z-40 top-[10vh]">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <CheckCircleIcon aria-hidden="true" class="h-5 w-5 text-green-400"/>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">复制成功₍ᐢ..ᐢ₎♡</p>
                        </div>
                        <div class="ml-auto pl-3">
                            <div class="-mx-1.5 -my-1.5">
                                <button class="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                        type="button">
                                    <span class="sr-only">Dismiss</span>
                                    <XMarkIcon aria-hidden="true" class="h-5 w-5" @click="close"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 登录失败悬浮栏样式 -->
                <div v-if="loginStatus === 'failure'" class="rounded-md bg-red-50 p-4 absolute z-40 top-[10vh]">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <XCircleIcon aria-hidden="true" class="h-5 w-5 text-red-400"/>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">激活失败๑ᵒᯅᵒ๑</h3>


                        </div>
                        <div class="ml-auto pl-3">
                            <div class="-mx-1.5 -my-1.5">
                                <button class="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                        type="button">
                                    <span class="sr-only">Dismiss</span>
                                    <XMarkIcon aria-hidden="true" class="h-5 w-5" @click="close"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 核心功能框 -->
                <div class="flex flex-col justify-center items-start gap-6 w-[70%] mix-w">
                    <!-- 文字展示区 -->
                    <div class="self-stretch h-[58px] flex-col justify-start items-start flex ">
                        <div class="self-stretch text-zinc-900 text-3xl font-medium leading-[3rem]">激活</div>
                        <div class="self-stretch text-zinc-600 text-sm font-normal leading-tight tracking-tight">
                            请输入您的激活码
                        </div>
                    </div>
                    <!-- 账号激活码区-->
                    <div class="self-stretch h-[138px] flex-col justify-start items-start gap-3.5 flex">
                        <!-- 账号输入框 -->
                        <div class="self-stretch h-12 flex-col justify-start items-start flex"
                             @click.stop="copyToClipboard">
                            <div class="self-stretch h-12 flex-col justify-start items-start gap-1 flex">
                                <input v-model="param.publicKey" autocomplete="account" class="cursor-pointer   self-stretch h-12 px-3 py-1.5  bg-grey-200 rounded-lg border border-gray-200 justify-start items-center gap-2 inline-flex"
                                       disabled name="account" placeholder="看到我程序有问题"
                                       type="text"/>

                            </div>
                        </div>
                        <!-- 激活码输入框&忘记激活码/记住激活码功能 -->
                        <div class="self-stretch h-[76px] flex-col justify-start items-start gap-2 flex">
                            <div class="self-stretch h-12 flex-col justify-start items-start flex">
                                <div class="self-stretch h-12 flex-col justify-start items-start gap-1 flex">
                                    <input v-model="param.password" autocomplete="current-password" class=" rounded-md shadow-sm  py-1.5 self-stretch h-12 px-3  bg-white border border-gray-200  gap-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                                           name="password"
                                           placeholder="请输入激活码"
                                           type="password"/>
                                </div>
                            </div>

                            <!-- 忘记激活码/记住激活码 -->
                            <div class="self-stretch justify-between items-center gap-1 inline-flex">

                                <div class="form-control justify-start items-start gap-1.5 flex">
                                    <label class="label cursor-pointer flex justify-center items-center inline-flex gap-2">

                                        <span class="text-zinc-900 text-sm font-normal  tracking-tight">记住激活码</span>

                                        <input v-model="rememberPassword" checked class="toggle toggle-sm "
                                               type="checkbox"/>

                                    </label>
                                </div>
                                <div class="justify-start items-center gap-1.5 flex">
                                    <div class="tooltip" data-tip=" 请联系管理员或厂家找回">
                                        <button
                                                class="  text-center text-zinc-900 text-sm font-normal  tracking-tight">
                                            忘记激活码
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 登录按钮 -->
                    <div class="self-stretch h-12 px-4 py-3.5 bg-[#4EA67D] rounded-[40px] justify-center items-center gap-2
                    inline-flex hover:bg-[#83ba9b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:bg-[#83ba9b]" @click="submitForm">
                        <div class="text-white text-sm font-normal leading-tight tracking-tight">登录</div>
                        <svg fill="none" height="16" viewBox="0 0 17 16" width="17" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 3L8.785 3.6965L12.575 7.5H2.5V8.5H12.575L8.785 12.2865L9.5 13L14.5 8L9.5 3Z"
                                  fill="white"/>
                        </svg>
                    </div>
                    <!-- 注册下划区 -->
                    <div class="self-stretch justify-center items-center gap-2 inline-flex">
                        <div class="grow shrink basis-0 h-px bg-neutral-200"/>
                        <div class="text-zinc-900 text-sm font-normal leading-tight tracking-tight">注册</div>
                        <div class="grow shrink basis-0 h-px bg-neutral-200"/>
                    </div>
                    <!-- 手机号按钮 -->
                    <div
                            class="self-stretch h-12 px-4 py-3.5 bg-white rounded-[40px] border border-gray-200 justify-center items-center gap-2 inline-flex">
                        <div class="text-zinc-900 text-sm font-normal leading-tight tracking-tight">请联系管理员注册
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js" setup>
import {onMounted, reactive, ref} from 'vue';

import {useRouter} from 'vue-router';
import {CheckCircleIcon, XCircleIcon, XMarkIcon} from '@heroicons/vue/20/solid'
// import { UserLogin } from "../api/index";
// TODO 放置清除缓存的时候，清除登录状态
// 这里定义了一个响应式的对象 param，它有两个属性 publicKey 和 password，它们的默认值分别为 'admin' 和 '123123'。这个对象会在组件中被用于双向绑定和表单验证。
const router = useRouter();
const param = reactive({
    publicKey: '',
    password: ''
});

const rememberPassword = ref(false);


const submitForm = async () => {

    if (await CheckKey(param.publicKey)) {
        loginStatus.value = 'success';
        localStorage.setItem('publicKey', param.publicKey);


        // 只有当复选框被选中时，才保存激活码

        localStorage.setItem('password', param.password);
        localStorage.setItem('rememberPassword', JSON.stringify(rememberPassword.value));

        await router.push({name: "MainView"});
    } else {
        loginStatus.value = 'failure';
        param.password = '';
        // 登录失败后5秒后，loginStatus设置为空
        setTimeout(() => {
            loginStatus.value = '';
        }, 3000);
    }
}
// 当组件加载时，检查localStorage中是否有用户名和激活码，如果有则自动填充
onMounted(() => {

    const remember = localStorage.getItem('rememberPassword');
    rememberPassword.value = remember ? JSON.parse(remember) : false;
    let storedpublicKey = localStorage.getItem('publicKey') || generateRandomIdentifier();
    const storedPassword = localStorage.getItem('password');

    if (isValidIdentifier(storedpublicKey)) {
        // 检验成功
        param.publicKey = storedpublicKey;
        localStorage.setItem('publicKey', param.publicKey);
    } else {
        param.publicKey = generateRandomIdentifier();
        localStorage.setItem('publicKey', param.publicKey);
    }

    if (remember && storedpublicKey && storedPassword) {
        // 只有当复选框被选中时，才自动填充激活码
        param.publicKey = storedpublicKey;
        param.password = storedPassword;
        submitForm();
    }
});

function isValidIdentifier(identifier) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}$/;
    return pattern.test(identifier);
}


// 关闭弹窗的函数
const close = () => {
    console.log(loginStatus.value);
    loginStatus.value = '';
}

const copyToClipboard = () => {

    navigator.clipboard.writeText(param.publicKey).then(() => {

        loginStatus.value = 'copysuccess';
        setTimeout(() => {
            loginStatus.value = '';
        }, 3000);
    }, (err) => {
        console.error('无法复制文本: ', err);
    });
};
// 记录登录状态
const loginStatus = ref('') // 登录状态，可以是 'success', 'failure', 或者 '' (空字符串)
function generateRandomIdentifier() {
    // 获取一个Uint32的随机数组
    let randomValues = new Uint32Array(4);
    window.crypto.getRandomValues(randomValues);
    // 转换为16进制字符串
    return Array.from(randomValues).map(val => val.toString(16)).join('-');
}

const Privatekey = "MIIEpAIBAAKCAQEA15gUinYWEYh9TyDBn+RRc1UAjMstdaUFrxvendk197ih1tnX\n" +
    "ip57U/B6A1o4BgIN5AihwIxLGlDDgzEbRq8Nsl0yENcPt0Q9MT59cdFy6jk+/v2u\n" +
    "KYS+r02xKyG6PCVimTCHZ5SoYdKEjWKu8g1i7StqBShIQl3ZMIddEF8FLB/fHNmF\n" +
    "RN7N4/9wr6rmz+qdwpVThOi3lYYZPbQqwLHLZCj1UhnshNKPbW2/sP2zvD18JS4D\n" +
    "3YJZVXk5OkMAzKV3ZD++v1T4PvUIhY++BIt//em61aHv6UgetlSYtBVow2Ulqin/\n" +
    "lSXhIA7DOf6Mk9YwjQ9P7662wRhiWOuoH7hZ5wIDAQABAoIBAQCkODNtRIWK1Wyd\n" +
    "2VWjdUaVkynYFOuLsSejOpdXpRx2lSyxez2zWQSX65UE+LOz39y01d5fzH1ojhxe\n" +
    "0gj0zmKgelyodyiBcHksCW2ERQZDY1eY46LF/VdCMOvC7u3s4o04Ir8BJzsbSD+v\n" +
    "cnvP5GJ2RZt8UjK4WsQVMwawcbB+6mHRBRbLquGixDM42JrcrMILIJXTqOTPAK7J\n" +
    "MJ2UpgNMjsW17x3I3Li9ABZYhVodFRkENtI4BYg8FwuPtqRUyCObInnxAgHuG2wr\n" +
    "fZNBDq5IoHyPpxF+PDW6sK4jDzTmki/uPD4Ian9AlidrtF6ICu9Z/wVRQnZ8FRyn\n" +
    "IwD8IPgBAoGBAPUC+2C/CDKI8yKVBEZ3NEQXBPfufMyhLVckB6IUSi7EdCWJkEZ0\n" +
    "7jasNNyxXhiq6daqH9YmBlfIXOgO4mHvvUnSP5Xo+jvFYE1vlsLVzbF19VnfySF/\n" +
    "iBzFmK70GfY2PzbsxuBh/8OCJ3wDbyK9ABnFf+zDtQGxT4ICjiFDuHKlAoGBAOFD\n" +
    "Wav8T894ZHrBUYUpFV9KkNhdpgx5E9iyINkOhQcH+5w7I3nLp0rWl6OHW7xeNnyn\n" +
    "SCflo7eyXZc04lKpJpN2Em5RH7nuRX+lLyQ3GcolFtBNn4dUWK9HguyaQJNsnpi/\n" +
    "dUY7eXDCjXkXPPtAokbWF26TUfRpp0XFoO5pnDCbAoGBAJ+oS8qlcWAM4fL9DAYn\n" +
    "E4XzQieV3vkxZmxMbDTv589F8TGszLk85SX3XZMaeWi1px9dSNWxfZyiUfheCqMr\n" +
    "KDv8p7a2VKmyWqjbOHDKBfnIFhN0wonzouyszmvjYS+R9euCq6337kSmgbhMPJV0\n" +
    "d6ZTjqLofQEXW+oqZBfFG2KJAoGAMPIRae1I6iueqY2XyPdETZBGKL0wd0VXqp4J\n" +
    "xSACh6SUZz3yV2SI1RoLmNywch2GeU9fvkuHZ0K6U0CKbKuUVjYxiwbVffDn6PRb\n" +
    "aeMPF303l8tF/oG1Q2CmcgKSRXY0f7waH0iM+pNLaiRCe9VvbTTXoo8gH5tVXTOz\n" +
    "5BnOdkECgYBYdMQ+SlTVCQnTcAStIDYzZbWNSA0wbVOJ+eBN5lVldXWVyRpWXmhR\n" +
    "ss9ZDdMye3/RZVaUuD2qIlfHMCRY1YkxT6ZTSI59e1l9s1veGaZBe6niCWy96/4M\n" +
    "k/bg2z7nE7JD6nAj9LGPGRrwbWQ/No48pJz7eJDWC6UB9BelCY4+IQ=="; // 这是您和上位机都知道的共享激活码

// 从激活码中派生出AES密钥
async function deriveKeyFromPassword(password) {
    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw", passwordBuffer, {name: "PBKDF2"}, false, ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
        {"name": "PBKDF2", salt: enc.encode("SOME_SALT"), iterations: 1000, hash: "SHA-256"},
        keyMaterial, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]
    );
    return key;
}

// 使用AES密钥进行加密
async function encryptWithKey(data, key) {
    const enc = new TextEncoder();
    const iv = new Uint8Array(12).fill(91);  // 使用固定的初始化向量
    const encodedData = enc.encode(data);
    const encryptedData = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, encodedData);
    const encryptedString = uint8ArrayToBase64(new Uint8Array(encryptedData));
    console.log(encryptedString)
    return {iv: iv, data: encryptedString};
}

function uint8ArrayToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, buffer));
}


// // 使用AES密钥进行解密
// async function decryptWithKey(encryptedData, key, iv) {
//     const dec = new TextDecoder();
//     const decryptedData = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encryptedData);
//     return dec.decode(decryptedData);
// }

async function CheckKey(randomData) {
    const key = await deriveKeyFromPassword(Privatekey);
    const encrypted = await encryptWithKey(randomData, key);
    console.log(encrypted.data)
    return param.password === encrypted.data;
}


</script>

<style></style>