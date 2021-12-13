<template>
    <div class="contract">
        <h3 class="title">
            {{defaultAddress}}
            <span v-show="addressInfo.alias"> | {{addressInfo.alias}}</span>
            <i class="iconfont icon-fuzhi clicks"></i>
        </h3>
        <el-tabs v-model="contractActive" class="w1200" @tab-click="handleClick" style="margin-bottom:100px">
            <el-tab-pane :label="$t('contract.contract1')" name="contractFirst" v-loading="myContractDataLoading">
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
                        <el-table-column :label="$t('contract.contract16')" align="center">
                            <template slot-scope="scope"><span>{{ $t('contractType.'+scope.row.tokenType) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('public.status')" align="center">
                            <template slot-scope="scope"><span>{{ $t('contractStatus.'+scope.row.status) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('public.time')" width="170" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime |convertTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('public.operation')" align="center">
                            <template slot-scope="scope">
                                <label class="tab_bn" v-if="scope.row.status ===3 || scope.row.status ===-1">--</label>
                                <label class="click tab_bn" v-else
                                       @click="toUrl('contractInfo',scope.row.contractAddress,0,'fourth')">{{$t('contract.contract4')}}</label>
                                <i class="el-icon-star-on font20 transparent"
                                   v-show="scope.row.creater === addressInfo.address"></i>
                                <el-tooltip :content="$t('public.cancelCollection')" placement="top"
                                            v-show="scope.row.creater !== addressInfo.address">
                                    <i class="el-icon-star-on font20 clicks"
                                       @click="cancelCollection(scope.row.contractAddress)"></i>
                                </el-tooltip>

                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pages">
                        <div class="page-total">
                            {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1)
                            *pageSize}}-{{pageIndex*pageSize}}
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
            <el-tab-pane :label="$t('contract.contract5')" name="contractSecond">
                <div class="bg-white w1200 search">
                    <div class="search-div">
                        <el-input :placeholder="$t('contract.contract6')" v-model.trim="searchContract"
                                  class="search-input">
                        </el-input>
                        <el-button type="success" class="search-button" @click="searchContractByAddress">
                            {{$t('contract.contract7')}}
                        </el-button>
                        <u class="click td" @click="toUrl('contracts','',1)">{{$t('contract.contract8')}}</u>
                    </div>
                    <div class="contract-info bg-gray" v-show="contractInfo.contractAddress">
                        <div class="contract-address font16">
                            <div>
                                <p class="fl">{{$t('contract.contract9')}}:</p>
                                <h6 class="fl font16">
                                    {{contractInfo.contractAddress}}
                                    <i class="font18" :class="isCollection ? 'el-icon-star-on' : 'el-icon-star-off'"
                                       @click="collection(contractInfo.contractAddress)"
                                       v-show="contractInfo.creater !== addressInfo.address"
                                    ></i>
                                </h6>
                            </div>
                            <div class="cb"></div>
                            <div>
                                <p class="fl">{{$t('public.contractName')}}:</p>
                                <h6 class="fl font16">{{contractInfo.alias}}</h6>
                            </div>
                            <div class="cb"></div>
                            <div v-show="contractInfo.remark">
                                <p class="fl">{{$t('public.contractInfo')}}:</p>
                                <h6 class="fl font16 overflow">{{contractInfo.remark}}</h6>
                            </div>
                        </div>
                        <Call :modelList="modelData" :contractAddress="contractInfo.contractAddress"
                              :decimals="decimals">
                        </Call>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('contract.contract10')" name="contractThird">
                <Deploy :addressInfo="addressInfo">
                </Deploy>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {chainIdNumber, myContractList, connectToExplorer, timestampToTime} from '@/api/util'
    import Deploy from './Deploy'
    import Call from './Call'

    export default {
        data() {
            return {
                addressInfo: {},//地址信息
                contractActive: 'contractFirst',
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
                decimals: 0,//合约精度系数
                defaultAddress: '',//默认地址
                myCollectionList: [],//收藏合约列表
                myContractDataLoading: true,//我的合约加载动画
            };
        },
        created() {
            this.addressInfo = JSON.parse(localStorage.getItem(chainIdNumber()));
            if (!this.addressInfo) {
                this.addressInfo = {};
            }
            if (!this.addressInfo.address) {
                this.$message({message: this.$t('error.ac_0052'), type: 'error', duration: 1000});
            }
            this.myCollectionList = myContractList(this.addressInfo.address);
            this.defaultAddress = this.addressInfo.address;
        },
        mounted() {
            if (this.addressInfo.address) {
                this.myCollectionList = myContractList(this.addressInfo.address);
                this.getMyContractByAddress(this.addressInfo.address);
            }
            setInterval(() => {
                let info = JSON.parse(localStorage.getItem(chainIdNumber()));
                if (info && info.address) {
                    this.defaultAddress = info.address;
                }
                this.myCollectionList = myContractList(this.addressInfo.address);
                if (this.addressInfo.address) {
                    this.getMyContractByAddress(this.addressInfo.address);
                }
            }, 8000);
        },
        filters: {
            convertTime(value) {
                return timestampToTime(value);
            }
        },
        components: {
            Deploy,
            Call,
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
                    if (!this.addressInfo.address) {
                        this.$message({message: this.$t('error.ac_0052'), type: 'error', duration: 1000});
                    }
                } else if (tab.name === 'contractFirst') {
                    this.addressInfo = JSON.parse(localStorage.getItem(chainIdNumber()));
                    if (this.addressInfo.address) {
                        this.getMyContractByAddress(this.addressInfo.address);
                    } else {
                        this.$message({message: this.$t('error.ac_0052'), type: 'error', duration: 1000});
                    }
                }
            },

            /**
             * 获取合约列表根据地址
             * @param address
             **/
            async getMyContractByAddress(address) {
                await this.$post('/', 'getAccountContractList', [this.pageIndex, this.pageSize, address, -1, false])
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            //this.myContractData = response.result.list;
                            // this.pageTotal = response.result.totalCount;
                            let collectionList = myContractList(this.addressInfo.address);
                            if (response.result.list.length !== 0) {
                                let myContractList = [];
                                for (let item of response.result.list) {
                                    myContractList.push(item.contractAddress)
                                }
                                let newContractList = [...myContractList, ...collectionList];
                                this.getContractListById(this.pageIndex, this.pageSize, collectionList.length + response.result.totalCount, newContractList);
                            } else {
                                this.getContractListById(this.pageIndex, this.pageSize, collectionList.length, collectionList);
                            }
                            this.myContractDataLoading = false;
                        } else {
                            this.$message({
                                message: this.$t('contract.contract11') + response.error.data,
                                type: 'error',
                                duration: 1000
                            });
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
             * 获取智能合约列表
             * @param pageIndex
             * @param pageSize
             * @param totalCount
             * @param contractAddressList
             **/
            async getContractListById(pageIndex, pageSize, totalCount, contractAddressList) {
                await this.$post('/', 'getContractListById', [pageIndex, pageSize, totalCount, contractAddressList])
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            this.myContractData = response.result.list;
                            this.pageTotal = response.result.totalCount;
                        } else {
                            this.$message({
                                message: this.$t('contract.contract11') + response.error.message,
                                type: 'error',
                                duration: 1000
                            });
                        }
                    })
                    .catch((error) => {
                        this.$message({message: this.$t('contract.contract12') + error, type: 'error', duration: 1000});
                    });
            },

            /**
             * 搜索合约
             **/
            async searchContractByAddress() {
                if (this.searchContract.length > 30) {
                    await this.$post('/', 'getContract', [this.searchContract])
                        .then((response) => {
                            if (response.hasOwnProperty("result")) {
                                this.contractInfo = response.result;
                                //解决重载的问题
                                for (let item in response.result.methods) {
                                    response.result.methods[item].keys = item;
                                }
                                this.modelData = (function () {
                                    var methodsFilter = [];
                                    var methods = response.result.methods;
                                    for (var i = 0; i < methods.length; i++) {
                                        if(methods[i].name!='<init>' && !methods[i].event){
                                            methodsFilter.push(methods[i]);
                                        }
                                    }
                                    return methodsFilter;
                                })();
                                this.decimals = response.result.decimals;
                                let contractList = this.myCollectionList;
                                if (contractList.length !== 0 && contractList.includes(this.contractInfo.contractAddress)) {
                                    this.isCollection = true;
                                } else {
                                    this.isCollection = false;
                                }
                            } else {
                                this.$message({
                                    message: this.$t('contract.contract13') + response.error.message,
                                    type: 'error',
                                    duration: 1000
                                });
                            }
                        })
                        .catch((error) => {
                            this.$message({
                                message: this.$t('contract.contract14') + error,
                                type: 'error',
                                duration: 1000
                            });
                        });
                } else {
                    this.$message({message: this.$t('contract.contract15'), type: 'error', duration: 1000});
                }
            },

            /**
             * 收藏合约
             * @param contractAddress
             **/
            collection(contractAddress) {
                this.isCollection = !this.isCollection;
                let contractList = myContractList(this.addressInfo.address);
                if (contractList.length !== 0) {
                    if (contractList.includes(contractAddress)) {
                        for (let [index, elem] of contractList.entries()) {
                            if (elem === contractAddress) {
                                contractList.splice(index, 1);
                            }
                        }
                    } else {
                        contractList.push(contractAddress);
                    }
                } else {
                    contractList.push(contractAddress);
                }
                localStorage.setItem(this.addressInfo.address, JSON.stringify(contractList));
            },

            /**
             * 取消收藏合约
             * @param contractAddress
             **/
            cancelCollection(contractAddress) {
                let contractList = myContractList(this.addressInfo.address);
                if (contractList.includes(contractAddress)) {
                    for (let [index, elem] of contractList.entries()) {
                        if (elem === contractAddress) {
                            contractList.splice(index, 1);
                        }
                    }
                }
                localStorage.setItem(this.addressInfo.address, JSON.stringify(contractList));
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
