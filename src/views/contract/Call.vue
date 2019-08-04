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
          <el-form-item label="Value" prop="values" v-show="selectionData.payable">
            <el-input v-model="callForm.values"></el-input>
          </el-form-item>
          <el-form-item :label="$t('public.remarks')" prop="addtion">
             <el-input type="textarea" :rows="3" maxlength="200" show-word-limit v-model="callForm.addtion">
           </el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item class="search-submit">
        <el-button type="success" @click="submitCallContract('callForm')">{{$t('contract.contract4')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="cb"></div>
    <div class="w630 bg-gray wordwrap result" v-if="callResult">
      {{callResult}}
    </div>
    <Password ref="password" @passwordSubmit="confirmCall">
    </Password>
  </div>
</template>

<script>
  //import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {getNulsBalance} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import {getArgs, Times, chainID,chainIdNumber} from '@/api/util'
  import {LOCALHOST_API_URL, PARAMETER} from '@/config.js'
  import axios from 'axios'
  import {post} from '@/api/https'

  export default {
    data() {

      let validateGas = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('deploy.deploy8')));
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
          callback(new Error(this.$t('deploy.deploy9')));
        } else if (value < 1) {
          this.callForm.price = 1;
        } else {
          callback();
        }
      };
      let validateValues = (rule, value, callback) => {
        if (value < 0) {
          this.callForm.values = 0;
        } else {
          callback();
        }
      };

      return {
        first:0,//首次进入
        addressInfo: {},//地址信息
        balanceInfo: {},//账户余额信息
        //调用接口form
        callForm: {
          modelData: [],
          modelValue: '',
          parameterList: [],
          senior: false,
          gas: 0,
          price: 0,
          values: 0,
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
          ]
        },
        //选中的方法
        selectionData: {
          view: true,
          payable:false,
        },
        contractCallData: {},//调用合约data
        callResult: '',//调用合约结果
        defaultAddress: '',//默认地址
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
      this.addressInfo.address = localStorage.getItem(chainIdNumber());
      this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
    },
    mounted() {
      setInterval(() => {
        this.defaultAddress = localStorage.getItem(chainIdNumber());
      }, 500);
    },
    watch: {
      modelList(val) {
        this.callForm.modelData = val;
      },
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
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
        for (let itme of this.callForm.modelData) {
          if (itme.keys === val) {
            this.selectionData = itme;
            this.callForm.parameterList = itme.params;
            this.callForm.values = 0;
            this.callForm.gas = 0;
            this.callForm.price = 0;
            if (!itme.view) {
               if(!itme.payable){
                  this.chainMethodCall();
               }
            }
          }
        }
      },

      /**
       * 判断所有必填参数是否有值
       **/
      changeParameter() {
         if (!this.selectionData.view) {
            this.chainMethodCall();
        }
      },

      /**
       * 调用方法
       * @param formName
       **/
      submitCallContract(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.selectionData.view) {  //不上链方法
              let newArgs = [];
              if (this.callForm.parameterList.length > 0) { //有参数
                newArgs = getArgs(this.callForm.parameterList, this.decimals);
                if (newArgs.allParameter) {
                  this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args)
                }
              } else { //没参数
                this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs)
              }
            } else { //上链方法
              this.chainMethodCall(this.showPassword);
            // this.$refs.password.showPassword(true);
            }
          } else {
            return false;
          }
        });
      },

      /**
       * 展示密码窗口
       **/
     showPassword(){
        this.$refs.password.showPassword(true);
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
        axios.post(LOCALHOST_API_URL, PARAMETER)
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
      chainMethodCall(callback) {
        let newArgs = [];
        this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        if (this.callForm.parameterList.length > 0) { //有参数
          newArgs = getArgs(this.callForm.parameterList, this.decimals);
          if (newArgs.allParameter) {
            this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args,callback);
          }
        } else { //没参数
          this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs,callback);
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
      return await post('/','validateContractCall',[sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args])
          .then((response) => {
            if (response.result.success) {
              this.imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args,callback);
            } else {
              this.$message({message: this.$t('call.call6') + response.result.msg, type: 'error', duration: 2000});
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
      async imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args,callback) {
         return await post('/','imputedContractCallGas',[sender, value, contractAddress, methodName, methodDesc, args])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              this.callForm.gas = response.result.gasLimit;
              let contractConstructorArgsTypes = this.getContractMethodArgsTypes(contractAddress, methodName);
              let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes);
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
              if(callback instanceof Function){
                callback();
              }
            } else {
              this.$message({message: this.$t('call.call4') + response, type: 'error', duration: 2000});
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
      async getContractMethodArgsTypes(contractAddress, methodName) {
        PARAMETER.method = 'getContractMethodArgsTypes';
        PARAMETER.params =  [chainID(),contractAddress, methodName];
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
        PARAMETER.params = [chainID(), assetChainId,assetId, sender,password, contractAddress, value, methodName, methodDesc, args, gasLimit, price,remark];
        axios.post(LOCALHOST_API_URL, PARAMETER)
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
      async confirmCall(password) {
      let newArgs = [];
      if (this.callForm.parameterList.length > 0) {
          let newArgs = getArgs(this.callForm.parameterList);
          if (newArgs.allParameter) {
            this.callContract(2, 1, this.addressInfo.address, password, this.contractAddress, Number(Times(this.callForm.values, 100000000)),this.selectionData.name, this.selectionData.desc, newArgs.args, this.callForm.gas, this.callForm.price, this.callForm.addtion);
          }
      }else{
       this.callContract(2, 1, this.addressInfo.address, password, this.contractAddress, Number(Times(this.callForm.values, 100000000)),this.selectionData.name, this.selectionData.desc, newArgs, this.callForm.gas, this.callForm.price, this.callForm.addtion);
      }
      },

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
