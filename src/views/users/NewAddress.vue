<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('address.address0')" v-show="ifAddressInfo"></BackBar>
        <h3 class="title">
          <font v-if="!isBackups">{{$t('newAddress.newAddress0')}} </font>
          <font v-else>{{$t('newAddress.newAddress1')}} </font>
          <font v-show="newAddressInfo.address">: {{newAddressInfo.address}}
            <i class="iconfont iconfuzhi clicks" @click="copy(newAddressInfo.address)"></i>
          </font>
        </h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <ul class="step" v-show="false">
        <li>
          <p class="dotted Ndotted"></p>
        </li>
        <li>
          <p class="ico"><i class="el-icon-view Ncolor"></i></p>
          <h6 class="Ncolor">{{$t('newAddress.newAddress2')}}</h6>
        </li>
        <li>
          <p class="dotted" :class="!isFirst ? 'Ndotted':''"></p>
        </li>
        <li>
          <p class="ico"><i class="el-icon-location-outline" :class="!isFirst ? 'Ncolor':''"></i></p>
          <h6 :class="!isFirst ? 'Ncolor':''">{{$t('newAddress.newAddress3')}}</h6>
        </li>
        <li>
          <p class="dotted"></p>
        </li>
      </ul>
      <div class="cb"></div>

      <div class="w630" v-show="isFirst">
        <div class="tip bg-gray">
          <p><i></i>{{$t('newAddress.newAddress4')}}</p>
          <p><i></i>{{$t('newAddress.newAddress5')}}</p>
        </div>
        <div class="cb"></div>
        <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" class="mb_20">
          <el-form-item :label="$t('newAddress.newAddress6')" prop="pass">
            <el-input type="password" v-model="passwordForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('newAddress.newAddress7')" prop="checkPass">
            <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="" prop="agreement">
            <el-checkbox-group v-model="passwordForm.agreement">
              <el-checkbox :label="$t('newAddress.newAddress8')" name="agreement"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitPasswordForm('passwordForm')" :disabled="!passwordForm.agreement">
              {{$t('newAddress.newAddress10')}}
            </el-button>
            <el-button type="text" @click="toUrl('importAddress')">{{$t('newAddress.newAddress11')}}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="step_tow w630" v-show="!isFirst">
        <h3 class="title" v-show="false">
          {{$t('newAddress.newAddress12')}}：
          <span>{{newAddressInfo.address}}</span>
          <i class="iconfont iconfuzhi clicks" @click="copy(newAddressInfo.address)"></i>
        </h3>
        <div class="tip bg-gray">
          <p>{{$t('newAddress.newAddress13')}}</p>
          <!--  <p>{{$t('newAddress.newAddress14')}}</p>
            <p>{{$t('newAddress.newAddress15')}}</p>-->
        </div>

        <div class="btn mb_20">
          <el-button type="success" @click="backKeystore" v-show="false">{{$t('newAddress.newAddress16')}}
          </el-button>
          <el-button type="text" @click="backKey">{{$t('newAddress.newAddress17')}}</el-button>
          <el-button type="info" @click="goWallet" v-show="false">{{$t('newAddress.newAddress18')}}</el-button>
        </div>
      </div>

    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog :title="$t('newAddress.newAddress19')" width="40%"
               :visible.sync="keyDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <span>{{$t('newAddress.newAddress20')}}</span>
      <p class="bg-white">
        {{newAddressInfo.pri}}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="copy(newAddressInfo.pri)">{{$t('newAddress.newAddress21')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'
  import {copys, chainID, chainIdNumber, addressInfo, defaultAddressInfo, localStorageByAddressInfo} from '@/api/util'
  import {RUN_PATTERN, LOCALHOST_API_URL, PARAMETER} from '@/config.js'
  import axios from 'axios'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress22')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('newAddress.newAddress23')));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePassTwo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress24')));
        } else if (value !== this.passwordForm.pass) {
          callback(new Error(this.$t('newAddress.newAddress25')));
        } else {
          callback();
        }
      };
      return {
        isFirst: true,//第一步
        isBackups: false,//备份账户
        keyDialog: false, //key弹框
        ifAddressInfo: localStorage.hasOwnProperty(chainIdNumber),//判断是否账户地址
        passwordForm: {
          pass: 'nuls123456',
          checkPass: 'nuls123456',
          agreement: true,
        },
        passwordRules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePassTwo, trigger: 'blur'}
          ],
          agreement: [
            {required: true, message: this.$t('newAddress.newAddress29'), trigger: 'change'}
          ]
        },
        newAddressInfo: {}, //新建的地址信息
        backType: 0,//备份类型 0：keystore备份 1：明文私钥备份
        RUN_PATTERN: RUN_PATTERN,//运行模式
      };
    },
    created() {
      let backAddressInfo = this.$route.query.backAddressInfo;
      if (backAddressInfo) {
        this.isFirst = false;
        this.isBackups = true;
        this.newAddressInfo.address = backAddressInfo.address;
        this.newAddressInfo.aesPri = backAddressInfo.aesPri;
      }
    },
    mounted() {
    },
    components: {
      Password,
      BackBar
    },
    methods: {

      /**
       * 创建地址
       * @param formName
       */
      submitPasswordForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            PARAMETER.method = 'createAccount';
            PARAMETER.params = [chainID(), this.passwordForm.pass];
            axios.post(LOCALHOST_API_URL, PARAMETER)
              .then((response) => {
                //console.log(response.data);
                if (response.data.hasOwnProperty('result')) {
                  let newAddressInfo = defaultAddressInfo;
                  newAddressInfo.address = response.data.result.address;
                  this.newAddressInfo = newAddressInfo;
                  this.isFirst = false;
                  this.getAddressList();
                }
              }).catch((err) => {
              console.log(err)
            })
          } else {
            return false;
          }
        });
      },

      /**
       * 获取账户列表
       */
      async getAddressList() {
        let accountList = await addressInfo();
        if (accountList.length === 1) {
          localStorage.setItem(chainIdNumber(), this.newAddressInfo.address)
        }
      },

      /**
       * 备份keystore
       **/
      backKeystore() {
        this.backType = 0;
        this.$refs.password.showPassword(true);
      },

      /**
       * 备份私钥
       **/
      backKey() {
        this.backType = 1;
        this.$refs.password.showPassword(true)
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      passSubmit(password) {
        if (this.backType === 1) {
          PARAMETER.method = 'exportPriKeyByAddress';
          PARAMETER.params = [chainID(), this.newAddressInfo.address, password];
          axios.post(LOCALHOST_API_URL, PARAMETER)
            .then((response) => {
              //console.log(response.data.result);
              if (response.data.hasOwnProperty('result')) {
                this.newAddressInfo.pri = response.data.result.privateKey;
                this.keyDialog = true;
              }
            }).catch((err) => {
            console.log(err);
          })
        }
      },

      /**
       * 进入钱包
       */
      goWallet() {
        this.toUrl('home');
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

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
        this.keyDialog = false;
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .new_address {
    .new {
      border: @BD1;
      .step {
        height: 50px;
        margin: 100px 140px 0 140px;
        li {
          float: left;
          width: 20%;
          height: 50px;
          text-align: center;
          .dotted {
            margin: 20px 0 0 0;
            border-bottom: 2px dotted @Dcolour;
          }
          .Ndotted {
            border-bottom-color: @Ncolour;
          }
          .Ncolor {
            color: @Ncolour;
          }
          .ico {
            i {
              font-size: 30px;
            }
          }
        }
      }
      .tip {
        margin: 40px auto;
        padding: 20px 30px;
        p {
          i {
            width: 5px;
            height: 5px;
            display: block;
            float: left;
            margin: 9px 10px 0 0;
            border-radius: 5px;
            background: #000000;
          }
        }
      }
      .step_tow {
        .title {
          height: 30px;
          line-height: 30px;
          margin: 40px auto 0;
        }
        .tip {
          margin: 40px auto;
        }
        .btn {
          .el-button--info {
            margin: 50px 0 20px 0 !important;
          }
        }
      }
    }
  }

</style>
