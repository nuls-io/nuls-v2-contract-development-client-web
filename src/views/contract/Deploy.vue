<template>
  <div class="deploy" v-loading="deployLoading">
    <div class="select_resource">
      <el-radio-group v-model="resource" @change="changeRadio">
        <el-radio label="1">{{ $t('deploy.deploy2') }}</el-radio>
        <el-radio label="0">{{ $t('deploy.deploy1') }}</el-radio>
      </el-radio-group>
    </div>

    <el-form :model="deployForm" :rules="deployRules" ref="deployForm" status-icon @submit.native.prevent>
      <div class="modes bg-white w1200">
        <div class="parameter" style="padding-top: 1rem">
          <el-form-item :label="$t('deploy.deploy21')" prop="alias">
            <el-input v-model="deployForm.alias" autocomplete="off">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="HEX" prop="hex" v-show="resource ==='0'" class="hex">
          <el-input type="textarea" :rows="10" v-model.trim="deployForm.hex" @change="getParameter"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <div class="upload_jar" v-show="resource==='1'">
          <input type="file" id="fileId" class="hidden">
          <div class="click upload tc" @click="uploadJar">
            <i class="el-icon-upload2 font30"></i>
            <p class="font14">{{ $t('deploy.deploy3') }}</p>
            <p class="font12" v-show="fileName">{{ $t('deploy.deploy4') }}:{{ fileName }}</p>
          </div>
          <div class="parameter" v-if="autoLoad==='1'">{{ $t('deploy.deploy23') }}</div>
        </div>

        <div class="parameter" v-if="deployForm.parameterList">
          <el-form-item v-for="(domain, index) in deployForm.parameterList" :label="domain.name"
                        :key="domain.name"
                        :prop="'parameterList.' + index + '.value'"
                        :rules="{required: domain.required,message:domain.name+$t('call.call2'), trigger: 'blur'}"
          >
            <el-input v-model.trim="domain.value">
            </el-input>
          </el-form-item>
        </div>
        <div class="w500" v-show="deployForm.hex" style="padding-bottom: 2rem">
          <el-form-item :label="$t('call.call3')" class="senior">
            <el-switch v-model="deployForm.senior">
            </el-switch>
          </el-form-item>
          <div v-if="deployForm.senior" class="senior-div bg-white">
            <el-form-item label="Gas Limit" prop="gas">
              <el-input v-model.number="deployForm.gas" type="number">
              </el-input>
            </el-form-item>
            <el-form-item label="Price" prop="price">
              <el-input v-model.number="deployForm.price" type="number">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('public.contractInfo')" prop="addtion">
              <el-input type="textarea" :rows="3" maxlength="200" show-word-limit
                        v-model="deployForm.addtion">
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item class="form-next">
        <el-button type="success" @click="submitTestDeploy('deployForm',tipSuccess)" v-loading="testLoad"
                   :disabled="testLoad">
          {{ $t('deploy.deploy5') }}
        </el-button>
        <br/>
        <div class="mb_20"></div>
        <el-button @click="submitDeploy('deployForm')" v-loading="load" :disabled="load">{{ $t('deploy.deploy6') }}
        </el-button>
      </el-form-item>
    </el-form>
    <Password ref="password" @passwordSubmit="confirmDeployWrapper">
    </Password>
  </div>
</template>

<script>
import nuls from 'nuls-sdk-js'
import sdk from 'nuls-sdk-js/lib/api/sdk'
import utils from 'nuls-sdk-js/lib/utils/utils'
import {
  getNulsBalance,
  // countFee,
  // inputsOrOutputs,
  getContractConstructor,
  // validateTx,
  // broadcastTx,
} from '@/api/requestData'
import Password from '@/components/PasswordBar'
import {getArgs, chainID} from '@/api/util'
import {LOCALHOST_API_URL, PARAMETER} from '@/config.js'
import axios from 'axios'

export default {
  name: "deploy",
  data() {
    let validateAlias = (rule, value, callback) => {
      let patrn = /^(?!_)(?!.*?_$)[a-z0-9_]+$/;
      if (value === '') {
        callback(new Error(this.$t('deploy.deploy19')));
      } else if (!patrn.exec(value)) {
        callback(new Error(this.$t('deploy.deploy20')));
      } else {
        callback();
      }
    };

    let validateGas = (rule, value, callback) => {
      if (!value) {
        //callback(new Error(this.$t('deploy.deploy8')));
        callback();
      } else if (value < 1) {
        this.deployForm.gas = 1;
        callback();
      } else if (value > 10000000) {
        this.deployForm.gas = 10000000;
        callback();
      } else {
        callback();
      }
    };

    let validatePrice = (rule, value, callback) => {
      if (!value) {
        this.deployForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        callback();
      } else if (value < sdk.CONTRACT_MINIMUM_PRICE) {
        this.deployForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        callback();
      } else {
        callback();
      }
    };

    return {
      //选择部署
      resource: '1',
      //自动加载jar包
      autoLoad: '0',
      //部署表单
      deployForm: {
        alias: '',
        hex: '',
        parameterList: [],
        senior: false,
        gas: '',
        price: '',
        addtion: '',
      },
      deployRules: {
        alias: [
          {validator: validateAlias, trigger: 'blur'}
        ],
        hex: [
          {required: true, message: this.$t('deploy.deploy7'), trigger: 'blur'},
        ],
        gas: [
          {type: 'number', validator: validateGas, trigger: 'blur'},
        ],
        price: [
          {type: 'number', validator: validatePrice, trigger: 'blur'},
        ]
      },
      createAddress: '',//创建合约地址
      contractCreateTxData: {},//组装创建合约交易
      balanceInfo: {},//账户余额信息
      isTestSubmit: false,//测试合约
      fileName: '',//jar文件名
      deployLoading: false,//获取参数加载动画
      testLoad: false,
      load: false,
    };
  },
  props: {
    addressInfo: Object,
  },
  components: {
    Password,
  },
  created() {
    this.autoLoad = '0';
    this.isTestSubmit = false;
    this.createAddress = this.addressInfo.address;
    if (this.createAddress) {
      this.getBalanceByAddress(nuls.verifyAddress(this.addressInfo.address).chainId, 1, this.createAddress);
    }
    this.getDefaultContract();
  },
  mounted() {
    //this.getTxInfoByHash(this.hash);
  },
  watch: {
    addressInfo(val, old) {
      if (val.address !== old.address && old.address) {
        this.createAddress = val.address;
        this.getBalanceByAddress(nuls.verifyAddress(this.addressInfo.address).chainId, 1, this.createAddress);
      }
    },
    fileName(val, old) {
      if (val !== old && old) {
        this.deployForm.parameterList = [];
        this.deployForm.gas = '';
        this.deployForm.price = '';
        this.deployForm.alias = '';
      }
    }
  },
  methods: {

    /**
     * 选择部署智能合约方式
     * @param e
     */
    changeRadio(e) {
      this.resource = e;
    },

    /**
     * 提示合约测试通过
     **/
    tipSuccess() {
      this.$message({message: this.$t('deploy.deploy16'), type: 'success', duration: 2000});
    },

    /**
     * hex码 有值获取参数
     */
    async getParameter() {
      if (this.deployForm.hex.length > 500) {
        this.deployLoading = true;
        let parameter = await getContractConstructor(this.deployForm.hex);
        if (parameter.success) {
          this.deployLoading = false;
          if (parameter.data.length !== 0) {
            this.deployForm.parameterList = parameter.data
          } else {
            // this.changeParameter();
          }
        } else {
          this.$message({
            message: this.$t('deploy.deploy10') + parameter.data.message,
            type: 'error',
            duration: 2000
          });
          this.deployLoading = false;
        }
      } else {
        this.fileName = '';
        this.deployForm = {
          alias: '',
          hex: '',
          parameterList: [],
          senior: false,
          gas: '',
          price: '',
          addtion: '',
        };
      }
    },

    /**
     * 验证创建合约交易
     * @param createAddress
     * @param gasLimit
     * @param price
     * @param contractCode
     * @param args
     */
    async validateContractCreate(createAddress, gasLimit, price, contractCode, args, callback) {
      PARAMETER.method = 'validateContractCreate';
      PARAMETER.params = [chainID(), createAddress, gasLimit, price, contractCode, args];
      return axios.post(LOCALHOST_API_URL, PARAMETER)
          .then(async (response) => {
            if (response.data.hasOwnProperty("result")) {
              await this.imputedContractCreateGas(createAddress, contractCode, args, callback);
            } else {
              this.$message({
                message: this.$t('deploy.deploy11') + response.data.error.message,
                type: 'error',
                duration: 2000
              });
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('deploy.deploy12') + error, type: 'error', duration: 2000});
          });
    },

    /**
     * 预估创建合约交易的gas
     * @param createAddress
     * @param contractCode
     * @param args
     * @param alias
     */
    async imputedContractCreateGas(createAddress, contractCode, args, callback) {
      PARAMETER.method = 'imputedContractCreateGas';
      PARAMETER.params = [chainID(), createAddress, contractCode, args];
      return axios.post(LOCALHOST_API_URL, PARAMETER)
          .then(async (response) => {
            if (response.data.hasOwnProperty("result")) {
              this.deployForm.gas = response.data.result.gasLimit;
              await this.makeCreateData(response.data.result.gasLimit, createAddress, contractCode, args, this.deployForm.alias, callback);
            } else {
              this.$message({
                message: this.$t('deploy.deploy13') + response.data.error.message,
                type: 'error',
                duration: 2000
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: this.$t('deploy.deploy14') + error.message,
              type: 'error',
              duration: 2000
            });
          });
    },

    /**
     * 组装构造函数的参数类型
     * @param constructor
     */
    makeContractConstructorArgsTypes(constructor) {
      let args = constructor;
      let length = args.length;
      let contractConstructorArgsTypes = new Array(length);
      let arg;
      for (let i = 0; i < length; i++) {
        arg = args[i];
        contractConstructorArgsTypes[i] = arg.type;
      }
      return contractConstructorArgsTypes;
    },

    /**
     * 组装创建合约交易的txData
     * @param createAddress
     * @param gasLimit
     * @param contractCode
     * @param args
     * @param alias
     */
    async makeCreateData(gasLimit, createAddress, contractCode, args, alias, callback) {
      let contractCreate = {};
      contractCreate.chainId = chainID();
      contractCreate.sender = createAddress;
      contractCreate.gasLimit = gasLimit;
      contractCreate.price = sdk.CONTRACT_MINIMUM_PRICE;
      contractCreate.contractCode = contractCode;
      contractCreate.alias = alias;
      let constructor = this.deployForm.parameterList;
      let contractConstructorArgsTypes = this.makeContractConstructorArgsTypes(constructor);
      if (args.length !== 0) {
        contractCreate.args = await utils.twoDimensionalArray(args, contractConstructorArgsTypes);
      } else {
        contractCreate.args = null;
      }
      contractCreate.contractAddress = sdk.getStringContractAddress(chainID());
      if (!contractCreate.chainId || !contractCreate.contractAddress || !contractCreate.contractCode || !contractCreate.gasLimit || !contractCreate.price || !contractCreate.sender) {
        this.$message({message: this.$t('deploy.deploy15'), type: 'error', duration: 2000});
      } else {
        this.isTestSubmit = true;
        this.contractCreateTxData = contractCreate;
        if (callback instanceof Function) {
          await callback();
          console.log("callback");
        }
      }
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
        this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 2000});
      });
    },

    /**
     * 测试部署合约
     * @param formName
     **/
    async submitTestDeploy(formName, callback) {
      this.deployForm.price = sdk.CONTRACT_MINIMUM_PRICE;
      let newArgs = getArgs(this.deployForm.parameterList);
      if (!this.deployForm.alias || !newArgs.allParameter) {
        this.$message({message: this.$t('error.10013'), type: 'error', duration: 2000});
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.testLoad = true;
          if (newArgs.allParameter) {
            await this.validateContractCreate(this.createAddress, sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.deployForm.hex, newArgs.args, callback);
          }
          this.testLoad = false;
        } else {
          return false;
        }
      });
    },


    /**
     * 部署合约
     * @param formName
     **/
    async submitDeploy(formName) {
      this.deployForm.price = sdk.CONTRACT_MINIMUM_PRICE;
      let newArgs = getArgs(this.deployForm.parameterList);
      if (!this.deployForm.alias || !newArgs.allParameter) {
        this.$message({message: this.$t('error.10013'), type: 'error', duration: 2000});
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.load = true;
          if (newArgs.allParameter) {
            await this.validateContractCreate(this.createAddress, sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.deployForm.hex, newArgs.args, this.showPassword);
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
    async showPassword() {
      if (this.addressInfo.encrypted) {
        this.$refs.password.showPassword(true);
      } else {
        await this.confirmDeploy();
      }
      this.isTestSubmit = false;
    },

    /**
     *  获取密码框的密码
     * @param password
     **/
    async confirmDeployWrapper(password) {
      this.load = true;
      await this.confirmDeploy(password);
      this.load = false
    },

    async confirmDeploy(password) {
      let newArgs = getArgs(this.deployForm.parameterList);
      if (newArgs.allParameter) {
        PARAMETER.method = 'createContract';
        PARAMETER.params = [chainID(), chainID(), 1, this.addressInfo.address, password, this.deployForm.hex, this.deployForm.alias, newArgs.args, this.deployForm.gas, this.deployForm.price, this.deployForm.addtion];
        await axios.post(LOCALHOST_API_URL, PARAMETER)
            .then(async (response) => {
              if (response.data.hasOwnProperty('result')) {
                this.$message({
                  message: this.$t('deploy.deploy24') + response.data.result.contractAddress,
                  type: 'success',
                  duration: 2000
                });
                await this.getDefaultContract();
              } else {
                this.$message({
                  message: this.$t('deploy.deploy25') + response.data.error.message,
                  type: 'error',
                  duration: 2000
                });
              }

            }).catch((err) => {
              console.log(err)
            });
      }
    },

    /**
     * jar 上传包
     * @returns {Promise<void>}
     */
    async uploadJar() {
      let _this = this;
      _this.autoLoad = '0';
      let obj = document.getElementById("fileId");
      obj.click();
      obj.onchange = function () {
        if (this.value !== '') {
          let file = obj.files[0];
          _this.fileName = file.name;
          //获取文件流
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (async () => {
            PARAMETER.method = 'uploadContractJar';
            PARAMETER.params = [chainID(), reader.result];
            await axios.post(LOCALHOST_API_URL, PARAMETER)
                .then(async (response) => {
                  if (response.data.hasOwnProperty("result")) {
                    _this.deployForm.hex = response.data.result.code;
                    await _this.getParameter();
                  } else {
                    this.$message({
                      message: response.data.error.message,
                      type: 'error',
                      duration: 2000
                    });
                  }
                }).catch((err) => {
                  this.$message({message: err, type: 'error', duration: 2000});
                })
          });
        }
      }
    },

    async getDefaultContract() {
      PARAMETER.method = 'getDefaultContractCode';
      PARAMETER.params = [];
      await axios.post(LOCALHOST_API_URL, PARAMETER)
          .then(async (response) => {
            if (response.data.hasOwnProperty("result")) {
              if (response.data.result.haveJarFile) {
                this.autoLoad = '1';
                this.deployForm.hex = response.data.result.codeHex;
                this.deployForm.alias = '';
                this.deployForm.gas = '';
                this.deployForm.price = '';
                this.deployForm.addtion = '';
                this.fileName = response.data.result.fileName;
                await this.getParameter();
              }
            } else {
              this.$message({message: response.data.error.message, type: 'error', duration: 2000});
            }
          }).catch((err) => {
            this.$message({message: err, type: 'error', duration: 2000});
          })
    },
  }
}
</script>

<style lang="less">
@import "./../../assets/css/style";

.deploy {
  margin: 20px auto 100px;

  .modes {
    margin: 10px auto 0;

    .hex {
      margin: 0 20px -10px 20px;
    }

    .upload_jar {
      padding: 5px 0;

      .upload {
        width: 200px;
        height: 200px;
        margin: 0 auto 0;
        padding: 50px 0 0 0;
        border: @BD1;

        i {

        }

        p {
          line-height: 30px;
        }
      }
    }

    .parameter {
      width: 500px;
      margin: 20px auto 0;
      padding: 0 0 10px 0;
    }
  }

  .senior {
    margin: 0 0 0 0;

    .el-form-item__label {
      line-height: 40px;
      position: absolute;
      right: 390px;
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
      margin: 0 0 15px 0;

      .el-form-item__label {
        line-height: 24px;
      }
    }
  }
}
</style>
