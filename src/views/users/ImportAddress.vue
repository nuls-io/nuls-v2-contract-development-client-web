<template>
  <div class="import_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar
                :backTitle="this.$route.query.address ? $t('address.address6') : $t('importAddress.importAddress0')"></BackBar>
        <h3 class="title" v-if="this.$route.query.address">{{this.$route.query.address}}</h3>
        <h3 class="title" v-else>{{$t('importAddress.importAddress1')}}</h3>
      </div>
    </div>
    <div class="w1200 mt_20 bg-white">
      <div class="radio" v-show="!this.$route.query.address">
        <el-radio v-model="importRadio" label="importKeystore" v-show="RUN_PATTERN">
          {{$t('importAddress.importAddress2')}}
        </el-radio>
        <el-radio v-model="importRadio" label="importKey" v-show="RUN_PATTERN">
          {{$t('importAddress.importAddress3')}}
        </el-radio>
      </div>

      <div class="w630" :class="this.$route.query.address ? 'mzt_20' : ''" v-show="importRadio==='importKey'">
        <el-form :model="importKeyForm" status-icon :rules="importKeyRules" ref="importKeyForm" class="mb_100">
          <el-form-item :label="$t('importAddress.importAddress5')" prop="key">
            <el-input type="textarea" v-model.trim="importKeyForm.key"></el-input>
          </el-form-item>
          <el-form-item :label="$t('importAddress.importAddress6')" prop="pass">
            <el-input type="password" v-model="importKeyForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('importAddress.importAddress7')" prop="checkPass">
            <el-input type="password" v-model="importKeyForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitForm('importKeyForm')">{{this.$route.query.address ?
              '重置密码':$t('importAddress.importAddress8')}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import BackBar from '@/components/BackBar'
  import Password from '@/components/PasswordBar'
  import {chainID, defaultAddressInfo,chainIdNumber, localStorageByAddressInfo} from '@/api/util'
  import {RUN_PATTERN, LOCALHOST_API_URL, PARAMETER} from '@/config.js'
  import axios from 'axios'

  export default {
    data() {
      let checkKey = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('importAddress.importAddress9')));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error(this.$t('importAddress.importAddress10')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('importAddress.importAddress11')));
        } else {
          if (this.importKeyForm.checkPass !== '') {
            this.$refs.importKeyForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('importAddress.importAddress12')));
        } else if (value !== this.importKeyForm.pass) {
          callback(new Error(this.$t('importAddress.importAddress13')));
        } else {
          callback();
        }
      };
      return {
        importRadio: this.$route.query.address ? 'importKey' : 'importKeystore',
        keystoreInfo: {},
        importKeyForm: {
          key: '',
          pass: '',
          checkPass: ''
        },
        importKeyRules: {
          pass: [
            {validator: validatePass, trigger: ['blur', 'change']}
          ],
          checkPass: [
            {validator: validateCheckPass, trigger: ['blur', 'change']}
          ],
          key: [
            {validator: checkKey, trigger: ['blur', 'change']}
          ]
        },
        RUN_PATTERN: RUN_PATTERN,//运行模式
      };
    },
    created() {
      if (!RUN_PATTERN) {
        this.importRadio = 'importKey';
      }
    },
    components: {
      BackBar,
      Password
    },
    methods: {

      /**
       *  获取密码框的密码
       * @param password
       **/
      passSubmit(password) {
      console.log(this.importKeyForm.key);
        PARAMETER.method = 'importAccountByPriKey';
        PARAMETER.params = [chainID(), this.importKeyForm.key, password, true];
        axios.post(LOCALHOST_API_URL, PARAMETER)
          .then((response) => {
            //console.log(response.data);
            if (response.data.hasOwnProperty('result')) {
              let newImportAddressInfo = defaultAddressInfo;
              newImportAddressInfo.address = response.data.result.address;
              //localStorageByAddressInfo(newImportAddressInfo);
               localStorage.setItem(chainIdNumber(), newImportAddressInfo.address);
              this.toUrl('address')
            }
          }).catch((err) => {
          console.log(err)
        });
      },

      /**
       * 私钥导入
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.importWallet()
          } else {
            return false;
          }
        });
      },

      /**
       * 导入私钥方法
       */
      importWallet() {
        PARAMETER.method = 'importAccountByPriKey';
        PARAMETER.params = [chainID(), this.importKeyForm.key, this.importKeyForm.pass, true];
        axios.post(LOCALHOST_API_URL, PARAMETER)
          .then((response) => {
            //console.log(response.data);
            if (response.data.hasOwnProperty('result')) {
              let newImportAddressInfo = defaultAddressInfo;
              newImportAddressInfo.address = response.data.result.address;
              //localStorageByAddressInfo(newImportAddressInfo);
               localStorage.setItem(chainIdNumber(), newImportAddressInfo.address);
              this.toUrl('address')
            }else{
                this.$message({message: this.$t('importAddress.importAddress18')+response.data.error.message, type: 'error', duration: 1000});
            }
          }).catch((err) => {
          console.log(err)
        });
        this.toUrl('address')
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
  @import "./../../assets/css/style";

  .import_address {
    .mt_20 {
      border: @BD1;
      .radio {
        width: 300px;
        text-align: center;
        margin: 50px auto;
      }
    }
  }
</style>
