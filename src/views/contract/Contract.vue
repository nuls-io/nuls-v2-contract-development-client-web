<template>
  <div class="contract">
    <h3 class="title">
      {{defaultAddress}}
      <span v-show="addressInfo.alias"> | {{addressInfo.alias}}</span>
      <i class="iconfont icon-fuzhi clicks"></i>
    </h3>
    <el-tabs v-model="contractActive" class="w1200" @tab-click="handleClick">
      <el-tab-pane :label="$t('contract.contract1')" name="contractFirst">
        <div class="my_contract">
          <el-table :data="myContractData" stripe border>
            <el-table-column :label="$t('contract.contract2')" align="center" min-width="220">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 3">{{scope.row.contractAddress}}</span>
                <span class="click" @click="toUrl('contractInfo',scope.row.contractAddress,0,'first')"
                      v-if="scope.row.status !== 3">{{scope.row.contractAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.contractName')" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.alias}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.status')" align="center">
              <template slot-scope="scope"><span>{{ $t('contractStatus.'+scope.row.status) }}</span></template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('public.time')" align="center">
              <template slot-scope="scope">
                     <span>{{scope.row.createTime |convertTime}}</span>
               </template>
            </el-table-column>
            <el-table-column :label="$t('public.operation')" align="center">
              <template slot-scope="scope">
                <label class="tab_bn" v-if="scope.row.status ===3 || scope.row.status ===-1">--</label>
                <label class="click tab_bn" v-else @click="toUrl('contractInfo',scope.row.contractAddress,0,'fourth')">{{$t('contract.contract4')}}</label>
                <i class="el-icon-star-on font20 transparent" v-show="scope.row.creater === addressInfo.address"></i>
                <el-tooltip :content="$t('public.cancelCollection')" placement="top"
                            v-show="scope.row.creater !== addressInfo.address">
                  <i class="el-icon-star-on font20 clicks" @click="cancelCollection(scope.row.contractAddress)"></i>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
          <div class="pages">
            <div class="page-total">
              {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
              {{$t('public.total')}} {{pageTotal}}
            </div>
            <el-pagination v-show="pageTotal > pageSize" @current-change="myContractPages" class="fr"
                           :current-page="pageIndex"
                           :page-size="pageSize"
                           background
                           layout=" prev, pager, next, jumper"
                           :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('contract.contract10')" name="contractSecond">
        <Deploy :addressInfo="addressInfo">
        </Deploy>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {chainIdNumber,connectToExplorer,timestampToTime} from '@/api/util'
  import Deploy from './Deploy'

  export default {
    data() {
      return {
        addressInfo: {},//地址信息
        contractActive: 'contractSecond',
        //我的合约
        myContractData: [],
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        currentPage4: 0,
        searchContract: '',//搜索合约
        isCollection: false,//是否收藏
        contractInfo: {},//合约详情
        modelData: [],//合约方法列表
        defaultAddress: '',//默认地址
      };
    },
    created() {
      this.addressInfo.address = localStorage.getItem(chainIdNumber());
      this.defaultAddress = localStorage.getItem(chainIdNumber());
    },
    mounted() {
       if(this.addressInfo.address){
             this.getMyContractByAddress(this.addressInfo.address);
       }
      setInterval(() => {
        this.defaultAddress = localStorage.getItem(chainIdNumber());
        if(this.addressInfo.address){
               this.getMyContractByAddress(this.addressInfo.address);
        }
      }, 8000);
    },
    filters :{
        convertTime(value){
            return timestampToTime(value);
        }
    },
    components: {
      Deploy,
    },
    watch: {
      defaultAddress(val, old) {
        if (val !== old && old) {
          this.getMyContractByAddress(val);
        }
      }
    },
    methods: {

      /**
       * tab 切换
       * @param tab
       **/
      handleClick(tab) {
        if (tab.name === 'contractSecond') {
          this.searchContract = '';
          this.isCollection = false;
          this.contractInfo = {};
          this.modelData = [];
          if(!this.addressInfo.address){
             this.$message({message: this.$t('error.ac_0052'), type: 'error', duration: 1000});
          }
        } else if (tab.name === 'contractFirst') {
          this.addressInfo.address = localStorage.getItem(chainIdNumber());
          if(this.addressInfo.address){
               this.getMyContractByAddress(this.addressInfo.address);
          }else{
            this.$message({message: this.$t('error.ac_0052'), type: 'error', duration: 1000});
          }

        }
      },

      /**
       * 获取合约列表根据地址
       * @param address
       **/
      async getMyContractByAddress(address) {
        await this.$post('/', 'getAccountContractList', [this.pageIndex, this.pageSize, address, false, false])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              this.myContractData = response.result.list;
              this.pageTotal = response.result.totalCount;
            } else {
              this.$message({message: this.$t('contract.contract11') + response.error.data, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('contract.contract12') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 合约列表分页
       * @param val
       **/
      myContractPages(val) {
        this.pageIndex = val;
        this.getMyContractByAddress(this.addressInfo.address);
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       * @param type
       * @param activeName
       */
      toUrl(name, parms, type = 0, activeName) {
        if (type.toString() === '0') {
          if (name === 'contractInfo') {
            this.$router.push({
              name: name,
              query: {contractAddress: parms, activeName: activeName}
            });
          } else {
            this.$router.push({
              name: name
            });
          }
        } else {
          connectToExplorer(name, parms)
        }
      },

    }
  };
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .contract {
    background-color: @Bcolour1;
    .el-tabs {
      margin: 30px auto 0;
      .search {
        min-height: 500px;
        border: @BD1;
        margin: 20px 0 0 0;
        .search-div {
          text-align: center;
          margin: 20px 0 0 0;
          .search-input {
            width: 400px;
          }
          .search-button {
            width: 120px;
            margin: 0 20px;
            padding: 9px;
          }
        }
        .contract-info {
          width: 625px;
          padding: 0;
          margin: 20px auto 30px;
          .contract-address {
            line-height: 20px;
            padding: 0.5rem 0 0 0;
            p, h6 {
              padding: 0;
            }
            p {
              margin: 0.5rem 0 0 5rem;
            }
            h6 {
              margin: 0.5rem 0 0 0.2rem;
              line-height: 22px;
              i {
                float: right;
                margin: 0 0 0 1rem;
                font-size: 1.4rem;
              }
            }
            .overflow {
              width: 25rem;
            }
          }
        }
      }

    }
  }
</style>
