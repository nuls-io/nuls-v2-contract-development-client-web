<template>
  <div>
    <div class="bottom">
      <div class="w1200 font14">
        <div class="left fl">
          <div class="url">
            {{$t('bottom.serviceNode')}}: <u class="click" @click="toUrl('nodeService')">{{serviceUrls}}</u>
          </div>
          <div class="version">
            <span>{{$t('public.version')}}: </span>{{versionInfo}}
          </div>
        </div>
        <div class="right fr">
          {{$t('bottom.nodeHeight')}}: {{heightInfo.networkHeight}}/{{heightInfo.localHeight}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import axios from 'axios'
  import {defaultData,API_URL,LOCALHOST_API_URL} from '@/config.js'
  import {chainID, chainIdNumber, addressInfo, timesDecimals} from '@/api/util'
  import {setPropertyAtBackEnd} from '@/api/requestData'

  export default {
    name: "bottom-bar",
    data() {
      return {
        heightInfo: [],//高度信息
        serviceUrls:'', //服务节点
        versionInfo:'',//版本信息
      }
    },
    created() {
      this.initServiceAddress();
      this.getVersionInfo();
      this.getHeaderInfo();
      setInterval(() => {
        this.serviceUrls = API_URL;
      }, 500);
    },
    mounted() {
      setInterval(() => {
        this.getHeaderInfo();
        this.getAddressInfo();
      }, 10000);
    },
    watch: {},
    methods: {

       async initServiceAddress() {
          let isUrl = true;//是否有可用连接
          if (localStorage.hasOwnProperty('urlsData')) {
            let newUrlsData = [];
            let selectionUrl = '';
            for (let item of JSON.parse(localStorage.getItem("urlsData"))) {
              let startTime = (new Date()).valueOf();
              let endTime = 0;
              const params = {jsonrpc: "2.0", method: "getChainInfo", "params": [], "id": 5898};
              await axios.post(item.urls, params)
                .then(function (response) {
                  if (response.data.hasOwnProperty("result")) {
                    endTime = (new Date()).valueOf();
                    item.delay = endTime - startTime;
                    item.chainId = response.data.result.chainId;
                    item.chainName = response.data.result.chainName;
                  } else {
                    item.delay = 100000;
                    item.selection = false;
                    item.state = 0;
                  }
                })
                .catch(function (error) {
                  item.delay = 200000;
                  item.selection = false;
                  item.state = 0;
                  console.log(error);
                });

              if (item.name !== 'Official') {
                newUrlsData.push(item)
              }
              //若缓存的服务节点并且可用则继续选择
              if (item.selection && item.delay<100000) {
                selectionUrl=item.urls;
                isUrl=false;
              }else{
                 item.selection = false;
              }
            }

            //若没有选择服务节点，则先检查配置的本地服务节点是否还有次优的服务节点；若没有再选择默认服务节点中的最优节点
            if(isUrl){
                let minNumber = Math.min.apply(Math, newUrlsData.map((o) => o.delay));
                let minIndex = newUrlsData.map((o) => o.delay).findIndex((n) => n === minNumber);
                if(minNumber<100000){
                  for (let item in newUrlsData) {
                    if (Number(item) === minIndex) {
                       newUrlsData[minIndex].selection = true;
                       selectionUrl=newUrlsData[minIndex].urls;
                       isUrl=false;
                    }
                  }
                }

               if(isUrl){
                 let minNumber = Math.min.apply(Math, defaultData.map((o) => o.delay));
                 let minIndex = defaultData.map((o) => o.delay).findIndex((n) => n === minNumber);
                 for (let item in defaultData) {
                     if (Number(item) === minIndex) {
                        defaultData[minIndex].selection = true;
                        selectionUrl=defaultData[item].urls;
                     }
                 }
               }
            }else{
              for (let item of defaultData) {
                  if (item.urls === selectionUrl) {
                    item.selection = true
                  }
              }
            }

            this.serviceUrls =selectionUrl;

            let urlsData = [...defaultData, ...newUrlsData];
            for (let item of urlsData) {
                if(item.selection){
                    localStorage.setItem("urls", JSON.stringify(item));
                }
            }
            localStorage.removeItem('urlsData');
            localStorage.setItem("urlsData", JSON.stringify(urlsData));
          } else {
            localStorage.setItem("urlsData", JSON.stringify(defaultData));
            for (let item of defaultData) {
              if (item.selection) {
                localStorage.setItem("urls", JSON.stringify(item));
                this.serviceUrls = item.urls;
              }
            }
          }
          this.setUrlAddress(this.serviceUrls);
        },

      /**
       * 获取离线智能合约客户端的版本信息
       */
      getVersionInfo() {
        const url =  LOCALHOST_API_URL;
        const params = {"jsonrpc": "2.0", "method": "getVersionInfo", "params": [], "id": 5898};
        axios.post(url, params)
          .then((response) => {
            if (response.data.hasOwnProperty("result")) {
              this.versionInfo = response.data.result.version;
            }
          })
          .catch((error) => {
            console.log("getVersionInfo:" + error)
          })
      },

      /**
       * 获取主网最新高度和本地高度
       */
      getHeaderInfo() {
        const url =  API_URL;
       // this.serviceUrls.urls=API_URL;
        this.serviceUrls= API_URL;
        const params = {"jsonrpc": "2.0", "method": "getInfo", "params": [chainID()], "id": 5898};
        axios.post(url, params)
          .then((response) => {
            if (response.data.hasOwnProperty("result")) {
              this.heightInfo = response.data.result;
              sessionStorage.setItem("info", JSON.stringify(response.data.result))
            } else {
              this.heightInfo = {localHeight: 0, networkHeight: 0};
              sessionStorage.removeItem("info")
            }
          })
          .catch((error) => {
            sessionStorage.removeItem("info");
            this.heightInfo = {localHeight: 0, networkHeight: 0};
            console.log("getInfo:" + error)
          })
      },

        /**
         * 设置后端的服务节点
         **/
       setUrlAddress(urls){
         setPropertyAtBackEnd("apiModuleAddress",urls).then((response) => {
              if (response.success) {
                  // this.$message({message: this.$t('public.setsuccess'), type: 'error', duration: 1000});
              } else {
                   this.$message({message: this.$t('public.setfail') , type: 'error', duration: 1000});
              }
         }).catch((error) => {
                this.$message({message: this.$t('public.setfail')+error , type: 'error', duration: 1000});
         });
      },

      /**
       * 获取地址网络信息
       **/
      async getAddressInfo() {
        let addressInfos = addressInfo(1);
        let addressList = addressInfo(0);
        if (addressInfos) {
          await this.$post('/', 'getAccount', [addressInfos.address], 'BottomBar')
            .then((response) => {
              //console.log(response);
              if (response.hasOwnProperty("result")) {
                for (let item of addressList) {
                  if (item.address === addressInfos.address) {
                    item.alias = response.result.alias;
                    item.balance = timesDecimals(response.result.balance);
                    item.consensusLock = timesDecimals(response.result.consensusLock);
                    item.totalReward = timesDecimals(response.result.totalReward);
                    item.tokens = [];
                    item.chainId = nuls.verifyAddress(item.address).chainId;
                  }
                }
                localStorage.setItem(chainIdNumber(), JSON.stringify(addressList));
                //this.$store.commit('setAddressInfo', addressList);
              }
            })
        }
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        //console.log(name)
        this.$router.push({
          name: name
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .bottom {
    height: 60px;
    border-top: 1px solid @Dcolour;
    position: fixed;
    line-height: 60px;
    bottom: 0;
    background-color: @Bcolour;
    width: 100%;
    @media screen and (max-width: 1000px) {
      height: 4rem;
      font-size: 0.7rem;
      line-height: 1rem;
    }
    .w1200 {
      .left {
        width: 50%;
        .url {
          font-size: 14px;
          line-height: 34px;
        }
        .version {
          font-size: 12px;
        }
        @media screen and (max-width: 1000px) {
          width: 100%;
          margin: 0.5rem 0 0 0.5rem;
          p {
            margin: 0;
            float: none;
            display: block;
          }
        }
      }
      .right {
        width: 40%;
        line-height: 60px;
        text-align: right;
        @media screen and (max-width: 1000px) {
          width: 100%;
          float: none;
        }
        label {
          padding: 0 10px;
          @media screen and (max-width: 1000px) {
            padding: 0 0.5rem;
            font-size: 0.7rem;
            line-height: 1rem;
          }
        }
      }
    }

  }
</style>
