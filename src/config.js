//开发模式
export const IS_DEV = process.env.NODE_ENV !== 'production';
//链ID
export const API_CHAIN_ID = sessionStorage.hasOwnProperty('chainID') ?  Number(sessionStorage.getItem('chainID')): 100;
//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = '0298f88c3cae67385ce3cbee00f78816db3e56e566b62bd0f4c5b45f205d3021c3';
//运行环境（true:正式环境，false:测试环境）
export const RUN_DEV = false;
//运行模式（true:electron窗体模式，false:浏览器模式）
export const RUN_PATTERN = false;
//正式、测试网络的api
export let API_URL = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'https://beta.public1.nuls.io/';
setInterval(() => {
  API_URL = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'https://beta.public1.nuls.io/';
}, 600);
//正式、测试网络的api
export let LOCALHOST_API_URL = "http://"+window.location.host+"/offlineSmartContract";
// export let LOCALHOST_API_URL = "http://192.168.0.107:18081/offlineSmartContract";
export let PARAMETER = {jsonrpc: '2.0', method: '', params: [], id: 5898};


//请求最迟时间
export const API_TIME = IS_DEV ? '29000' : '28000';
//默认节点服务列表
//默认节点服务列表
export const defaultData = [
  {name: 'Official',chainId:2,assetId:1,decimals:8,chainName:'nuls2', urls: 'https://beta.public1.nuls.io', delay: '10ms', selection: false, isDelete: false},
];

//默认服务节点地址
export const defaultUrl ={name: 'Official',chainId:2,assetId:1,decimals:8,chainName:'nuls2', urls: 'https://beta.wallet.nuls.io/api', delay: '10ms', selection: true, isDelete: false};
//默认浏览器地址（跳转地址）
export const explorerUrl = 'http://beta.nulscan.io/';
