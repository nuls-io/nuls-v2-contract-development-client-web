<template>
  <div class="call">
    <el-form :model="callForm" :rules="callRules" ref="callForm" class="call-form">
      <el-form-item label="" prop="region" class="search-model">
        <el-select v-model="callForm.modelValue" :placeholder="$t('call.call1')" @change="changeModel">
          <el-option v-for="item in callForm.modelData"  :key="item.keys" :label="item.name"
                     :value="item.keys">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(domain, index) in callForm.parameterList" :label="domain.name" :key="domain.name"
                    :prop="'parameterList.' + index + '.value'"
                    :rules="{required: domain.required,message:domain.name+$t('call.call2'), trigger: 'blur'}"
      >
        <el-input v-model.trim="domain.value" ></el-input>
      </el-form-item>

      <div class="div-senior" v-if="!selectionData.view">
        <el-form-item :label="$t('call.call3')" class="senior">
          <el-switch v-model="callForm.senior"></el-switch>
        </el-form-item>
        <div class="senior-div" v-if="callForm.senior">
          <el-form-item label="Gas Limit" prop="gas">
          <el-input v-model="callForm.gas" ></el-input>
          </el-form-item>
          <el-form-item label="Price" prop="price">
            <el-input v-model="callForm.price"></el-input>
          </el-form-item>
          <el-form-item label="Value(NULS)" prop="values" v-show="selectionData.payable">
            <el-input v-model="callForm.values"></el-input>
          </el-form-item>
          <div
            class="transfer-multiple-asset"
            v-if="selectionData.payableMultyAsset"
            style="background-color: #fff;width: 500px;padding: 10px 0 15px"
          >
            <el-form-item label="Other Assets" prop="region" class="search-model">
              <el-select v-model="callForm.assetInfo" @change="changeAsset">
                <el-option v-for="(item,index) in multipleAsset" :key="index" :label="item.symbol"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Value" prop="otherValue">
              <el-input v-model="callForm.otherValue"></el-input>
            </el-form-item>
          </div>
          <el-form-item :label="$t('public.remarks')" prop="addtion">
             <el-input type="textarea" :rows="3" maxlength="200" show-word-limit v-model="callForm.addtion">
           </el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item class="search-submit">
        <el-button type="success" @click="submitCallContract('callForm')" v-loading="load" :disabled="load">{{$t('contract.contract4')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="cb"></div>
    <div class="w630 bg-gray wordwrap result" v-if="callResult">
      {{callResult}}
    </div>
    <Password ref="password" @passwordSubmit="confirmCallWrapper">
    </Password>
  </div>
</template>

<script>
  //import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {getNulsBalance} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import {getArgs, Times, chainID, chainIdNumber, timesDecimals1} from '@/api/util'
  import {LOCALHOST_API_URL, PARAMETER} from '@/config.js'
  import axios from 'axios'

  const MAIN_INFO = {
    chainId: 2,
    assetId: 1
  }

  export default {
    data() {

      let validateGas = (rule, value, callback) => {
        if (!value) {
          //callback(new Error(this.$t('deploy.deploy8')));
          callback();
        } else if (value < 1) {
          this.callForm.gas = 1;
          callback();
        } else if (value > 10000000) {
          this.callForm.gas = 10000000;
          callback();
        } else {
          callback();
        }
      };
      let validatePrice = (rule, value, callback) => {
        if (!value) {
           this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
           callback();
        } else if (value < sdk.CONTRACT_MINIMUM_PRICE) {
          this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
          callback();
        } else {
          callback();
        }
      };
      let validateValues = (rule, value, callback) => {
        if (value < 0) {
          this.callForm.values = 0;
          this.callForm.otherValue = 0;
        } else {
          callback();
        }
      };

      return {
        first:0,//首次进入
        addressInfo: {},//地址信息
        balanceInfo: {},//账户余额信息
        assetInfo: null, // 往合约转的其他资产资产信息
        //调用接口form
        callForm: {
          modelData: [],
          modelValue: '',
          parameterList: [],
          senior: false,
          gas: 0,
          price: 0,
          values: 0,
          assetInfo: "",
          otherValue: "",
         addtion: '',
        },
        callRules: {
          gas: [
            {validator: validateGas, trigger: ['blur', 'change']}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ],
          values: [
            {validator: validateValues, trigger: 'blur'}
          ],
          otherValue: [
            {validator: validateValues, trigger: 'blur'}
          ]
        },
        //选中的方法
        selectionData: {
          view: true,
          payable: false, // 是否可向该合约转nuls
          payableMultyAsset: false // 是否可向该合约转其他资产
        },
        contractCallData: {},//调用合约data
        callResult: '',//调用合约结果
        defaultAddress: '',//默认地址
        load: false,
        multipleAsset: [], // 可转入合约的平行链资产列表
        newArgs: [],//合约参数
        multyAssetArray: []
      };
    },
    props: {
      modelList: Array,
      contractAddress: String,
      decimals: Number,
    },
    components: {
      Password,
    },
    created() {
      this.addressInfo = JSON.parse(localStorage.getItem(chainIdNumber()));
      if (!this.addressInfo) {
        this.addressInfo = {};
      }
      if(this.addressInfo.address){
        this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
      }
    },
    mounted() {
      //todo 检查所有的定时查询
      setInterval(() => {
        let info = JSON.parse(localStorage.getItem(chainIdNumber()));
        if (info && info.address) {
          this.defaultAddress = info.address;
        }
      }, 600);

      setTimeout(() => {
        this.getAccountCrossLedgerList(this.addressInfo.address);
      }, 600)
    },
    watch: {
      modelList(val) {
        this.callForm.modelData = val;
      },
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
          this.getAccountCrossLedgerList(this.addressInfo.address);
        }
      }
    },
    methods: {

      /**
       *  方法选择
       **/
      changeModel(val) {
        this.callResult = '';
        this.callForm.parameterList=[];
        this.assetInfo = null;
        this.callForm.assetInfo = "";
        this.newArgs = [];
        for (let itme of this.callForm.modelData) {
          if (itme.keys === val) {
            this.selectionData = itme;
            this.callForm.parameterList = itme.params;
            this.callForm.values = 0;
            this.callForm.otherValue = 0;
            this.callForm.gas = 0;
            this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
            if (!this.selectionData.view) { //上链方法
              if (this.selectionData.params.length === 0) { //没有参数
                if (this.selectionData.payable) {
                  this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs)
                } else {
                  //
                }
              } else { //有参数
                this.newArgs = getArgs(this.callForm.parameterList);
                //console.log(this.newArgs);
                if (this.newArgs.allParameter) {
                  this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs.args)
                }
              }
            }
          }
        }
      },

      /**
       * 判断所有必填参数是否有值
       **/
      changeParameter() {
        if (!this.selectionData.view && !this.selectionData.payable && !this.selectionData.payableMultyAsset) {
            this.chainMethodCall();
        }
      },

      /**
       * 调用方法
       * @param formName
       **/
      submitCallContract(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.load = true;
            if (this.selectionData.view) {  //不上链方法
              let newArgs = [];
              if (this.callForm.parameterList.length > 0) { //有参数
                newArgs = getArgs(this.callForm.parameterList, this.decimals);
                if (newArgs.allParameter) {
                  await this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args)
                }
              } else { //没参数
                await this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs)
              }
            } else { //上链方法
              // await this.chainMethodCall(this.showPassword);
            // this.$refs.password.showPassword(true);
              if (this.selectionData.params.length !== 0) {
                this.newArgs = getArgs(this.callForm.parameterList);
                if (this.newArgs.allParameter) {
                  await this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs.args)
                }
              } else {
                if (this.selectionData.payableMultyAsset && !this.assetInfo) return false;
                const nulsValue = Number(Times(this.callForm.values, 100000000))
                let multyAssets = [], value;
                if (this.assetInfo) {
                  const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
                  value = timesDecimals1(this.callForm.otherValue, decimals);
                  multyAssets = [
                    { value, assetChainId, assetId }
                  ]
                }
                await this.imputedContractCallGas(this.addressInfo.address, nulsValue, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
              }
              this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
              await this.showPassword()
            }
            this.load = false;
          } else {
            return false;
          }
        });
      },

      /**
       * 展示密码窗口
       **/
     async showPassword(){
        if (this.addressInfo.encrypted) {
          this.$refs.password.showPassword(true);
        } else {
          await this.confirmCall();
        }
     },

      /**
       * 不上链方法调用
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async methodCall(contractAddress, methodName, methodDesc, args) {
        PARAMETER.method = 'invokeContractViewMethod';
        PARAMETER.params =[chainID(),contractAddress, methodName, methodDesc, args];
        await axios.post(LOCALHOST_API_URL, PARAMETER)
          .then((response) => {
            if (response.data.hasOwnProperty("result")) {
              this.callResult = response.data.result.methodReturn;
            } else {
              this.$message({message: this.$t('call.call8') + response.data.error.message, type: 'error', duration: 2000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call9') + error, type: 'error', duration: 2000});
          });
      },

      /**
       * 上链方法调用
       */
      async chainMethodCall(callback) {
        let newArgs = [];
        this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        if (this.callForm.parameterList.length > 0) { //有参数
          newArgs = getArgs(this.callForm.parameterList, this.decimals);
          if (newArgs.allParameter) {
            await this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args,callback);
          }
        } else { //没参数
          await this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs,callback);
        }
      },

      /**
       * 验证调用合约交易
       * @param sender
       * @param value
       * @param gasLimit
       * @param price
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async validateContractCall(sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args,callback) {
      //return await post('/','validateContractCall',[sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args])
          PARAMETER.method = 'validateContractCall';
          PARAMETER.params =  [chainID(),sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args];
          return axios.post(LOCALHOST_API_URL, PARAMETER)
          .then(async (response) => {
            if(response.data.hasOwnProperty("result") && response.data.result.success){
               await this.imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args,callback);
            }else {
              this.$message({message: this.$t('call.call6') + response.data.error.message, type: 'error', duration: 2000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call7') + error, type: 'error', duration: 2000});
          });
      },

      /**
       * 预估调用合约交易的gas
       * @param sender
       * @param value
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args,multyAssets) {
          // return await post('/','imputedContractCallGas',[sender, value, contractAddress, methodName, methodDesc, args])
        this.multyAssetArray = []
        let multyAssetArray = [];
        if (multyAssets && multyAssets.length) {
          let length = multyAssets.length;
          multyAssetArray = new Array(length);
          for (let i = 0; i < length; i++) {
            let multyAsset = multyAssets[i];
            multyAssetArray[i] = [multyAsset.value, multyAsset.assetChainId, multyAsset.assetId];
          }
        }
        this.multyAssetArray = multyAssetArray;
          PARAMETER.method = 'imputedContractCallGas';
          PARAMETER.params =  [chainID(),sender, value, contractAddress, methodName, methodDesc, args, multyAssetArray];
          return axios.post(LOCALHOST_API_URL, PARAMETER)
          .then(async (response) => {
            if (response.data.hasOwnProperty("result")) {
              this.callForm.gas = response.data.result.gasLimit;
              let argsTypes = await this.getContractMethodArgsTypes(contractAddress, methodName, methodDesc);
              let newArgs = utils.twoDimensionalArray(args, argsTypes.data.argsTypes);
              this.contractCallData = {
                chainId: chainID(),
                sender: sender,
                contractAddress: contractAddress,
                value: value,
                gasLimit: this.callForm.gas,
                price: this.callForm.price,
                methodName: methodName,
                methodDesc: methodDesc,
                args: newArgs
              };
              /*if(callback instanceof Function){
                await callback();
              }*/
            } else {
              this.$message({message: this.$t('call.call4') + response.data.error.message, type: 'error', duration: 2000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call5') + error, type: 'error', duration: 2000});
          });
      },

      /**
       * 获取合约指定函数的参数类型
       * @param contractAddress
       * @param  methodName
       */
      async getContractMethodArgsTypes(contractAddress, methodName, methodDesc) {
        PARAMETER.method = 'getContractMethodArgsTypes';
        PARAMETER.params =  [chainID(),contractAddress, methodName, methodDesc];
        return axios.post(LOCALHOST_API_URL, PARAMETER)
          .then((response) => {
            if (response.data.hasOwnProperty("result")) {
              return {success: true, data: response.data.result};
            } else {
              return {success: false, data: response.data.error};
            }
          })
          .catch((error) => {
            return {success: false, data: error};
          });
      },

      /**
       * 获取账户余额
       * @param assetChainId
       * @param assetId
       * @param address
       **/
      getBalanceByAddress(assetChainId, assetId, address) {
        getNulsBalance(assetChainId, assetId, address).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 2000});
          }
        }).catch((error) => {
          console.log(error);
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 2000});
        });
      },

      async callContract(assetChainId,assetId, sender,password, contractAddress, value, methodName, methodDesc, args, gasLimit, price,remark){
        PARAMETER.method = 'callContract';
        PARAMETER.params = [chainID(), assetChainId,assetId, sender,password, contractAddress, value, methodName, methodDesc, args, gasLimit, price,remark, this.multyAssetArray];
        await axios.post(LOCALHOST_API_URL, PARAMETER)
          .then((response) => {
          if (response.data.hasOwnProperty('result')) {
            this.callResult=this.$t('call.call11') + response.data.result.txHash;
           }else{
           this.$message({message: this.$t('call.call12')+ response.data.error.message, type: 'error', duration: 2000});
           }
          }).catch((err) => {
              console.log(err)
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async confirmCallWrapper(password) {
        this.load = true;
        await this.confirmCall(password);
        this.load = false
      },

      async confirmCall(password) {
        let newArgs = [];
        if (this.callForm.parameterList.length > 0) {
            let newArgs = getArgs(this.callForm.parameterList);
            if (newArgs.allParameter) {
              await this.callContract(chainID(), 1, this.addressInfo.address, password, this.contractAddress, Number(Times(this.callForm.values, 100000000)),this.selectionData.name, this.selectionData.desc, newArgs.args, this.callForm.gas, this.callForm.price, this.callForm.addtion);
            }
        }else{
            await this.callContract(chainID(), 1, this.addressInfo.address, password, this.contractAddress, Number(Times(this.callForm.values, 100000000)),this.selectionData.name, this.selectionData.desc, newArgs, this.callForm.gas, this.callForm.price, this.callForm.addtion);
        }
      },
      async getAccountCrossLedgerList(address) {
        const res = await this.$post('/', 'getAccountCrossLedgerList', [address])
        if (res.result) {
          this.multipleAsset = res.result
        }
      },
      changeAsset(asset) {
        this.assetInfo = asset;
        this.callForm.assetInfo = asset.symbol;
        const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
        const value = timesDecimals1(this.callForm.values, decimals);
        const multyAssets = [
          { value, assetChainId, assetId }
        ];
        this.imputedContractCallGas(this.addressInfo.address, 0, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
      }
    }
  }
</script>

<style lang="less">
  .call {
    .call-form {
      .el-form-item {
        margin: 0 0 20px 70px;
        width: 500px;
      }
      .search-model {
        margin: 10px 0 10px 70px;
        .el-form-item__label {
          width: 500px;
          text-align: left;
          float: none;
          padding: 0;
          line-height: 17px;
        }
        .el-form-item__content {
          .el-select {
            width: 500px;
            .el-input__inner {
              width: 500px;
            }
          }
        }
      }
      .div-senior {
        margin: 0 0 0 70px;
        .senior {
          margin: 0 0 0 0;
          .el-form-item__label {
            line-height: 40px;
            position: absolute;
            right: 380px;
          }
          .el-form-item__content {
            text-align: right;
            .el-switch {
              .el-switch__core {
              }
            }
          }
        }
        .senior-div {
          .el-form-item {
            margin: 0 0 5px 0;
            .el-form-item__label {
              line-height: 24px;
            }
          }
        }
      }
      .search-submit {
        text-align: center;
        margin: 15px 0 15px 70px;
        .el-button {
          width: 150px;
          padding: 9px;
        }
      }
    }
    .result {
      width: 500px;
      margin: 0 auto;
      border-top: 0 solid #ffffff;
      padding: 20px;
    }
  }

</style>
