<template>
    <div class="contract-info bg-gray">

        <div class="bg-white">
            <div class="w1200">
                <BackBar :backTitle="$t('nav.contracts')"></BackBar>
                <h3 class="title">{{contractAddress}}<i class="iconfont icon-fuzhi clicks"></i></h3>
            </div>
        </div>

        <div class="w1200 mt_20">
            <div class="card_long">
                <h5 class="card-title font18">
                    {{$t('public.basicData')}}
                    <!-- <span class="font14 fr fred click" v-show="isCancel" @click="cancelContract">
                       {{$t('contractInfo.contractInfo1')}}
                     </span> -->
                </h5>
                <ul>
                    <li>{{$t('public.usableBalance')}}<label>{{contractInfo.balance}}<span
                            class="fCN">{{addressInfo.symbol}}</span></label></li>
                    <li>{{$t('contractInfo.contractInfo2')}}<label>{{contractInfo.txCount}}</label></li>
                    <li>
                        {{$t('contractInfo.contractInfo3')}}
                        <label>
                            <u class="click td" @click="toUrl('contractsInfo',contractInfo.creater,1)">
                                {{contractInfo.creater}}
                            </u>
                            at TxID
                            <u class="click td" @click="toUrl('transactionInfo',contractInfo.createTxHash,1)">{{contractInfo.createTxHashs}}</u>
                        </label>
                    </li>
                    <li>{{$t('contractInfo.contractInfo4')}}<label>{{contractInfo.symbol}}</label></li>
                </ul>
            </div>
            <div class="cb"></div>
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-bottom:100px">
                <el-tab-pane :label="$t('home.home2')" name="first">
                    <!--
                      <SelectBar v-model="contractsTypeRegion" :typeOptions="contractsStatusOptions" typeName="type"
                                 @change="changeType">
                      </SelectBar>
                    -->
                    <el-table :data="contractTxData" stripe border style="width: 100%;margin-top: 14px">
                        <el-table-column label="" width="30">
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('public.height')" width="80" align="left">
                            <template slot-scope="scope">
                                <span class="cursor-p click">{{ scope.row.blockHeight }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('contractInfo.contractInfo5')" width="100"
                                         align="left">
                            <template slot-scope="scope"><span>{{ $t('type.'+scope.row.type) }}</span></template>
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('contractInfo.contractInfo6')" width="180"
                                         align="left">
                            <template slot-scope="scope"><span>{{scope.row.contractMethod}}</span></template>
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('contractInfo.contractInfo15')" width="80"
                                         align="left">
                            <template slot-scope="scope"><span class="click"
                                                               @click="showContractArgs(scope.row.txHash,scope.row.type)">View</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="TXID" min-width="300" align="left">
                            <template slot-scope="scope">
                <span class="cursor-p click td" @click="toUrl('transactionInfo',scope.row.txHash,1)">
                  {{ scope.row.txHashs }}
                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('contractInfo.contractInfo16')" width="80"
                                         align="left">
                            <template slot-scope="scope"><span class="click"
                                                               @click="showContractResult(scope.row.txHash)">View</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" :label="$t('public.time')" width="160" align="left">
                        </el-table-column>
                        <el-table-column :label="$t('public.fee')" width="140" align="left">
                            <template slot-scope="scope">{{scope.row.fees}}</template>
                        </el-table-column>
                    </el-table>
                    <div class="pages">
                        <div class="page-total">
                            {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1)
                            *pageSize}}-{{pageIndex*pageSize}}
                            {{$t('public.total')}} {{pageTotal}}
                        </div>
                        <el-pagination v-show="pageTotal > pageSize" @current-change="contractTxPages" class="fr"
                                       :current-page="pageIndex"
                                       :page-size="pageSize"
                                       background
                                       layout=" prev, pager, next, jumper"
                                       :total="pageTotal">
                        </el-pagination>
                    </div>

                </el-tab-pane>
                <!--<el-tab-pane label="合约代码" name="second">
                  <CodeInfo></CodeInfo>
                </el-tab-pane>-->
                <el-tab-pane :label="$t('contractInfo.contractInfo6')" name="third">
                    <el-table :data="modeList" stripe border style="width: 100%" class="mzt_20 mb_100">
                        <el-table-column label="" width="30">
                        </el-table-column>
                        <el-table-column prop="name" :label="$t('contractInfo.contractInfo6')" width="280" align="left">
                        </el-table-column>
                        <el-table-column prop="height" :label="$t('contractInfo.contractInfo7')" min-width="280"
                                         align="left">
                            <template slot-scope="scope">
                <span>
                  {{scope.row.desc}}
                </span>
                                <!--<span v-for="item in scope.row.params" :key="item.name">
                                      {"type":"{{item.type}}","name":"{{item.name}}","required":{{item.required}}}-
                                </span>-->
                            </template>
                        </el-table-column>
                        <el-table-column prop="returnType" :label="$t('contractInfo.contractInfo8')" width="140"
                                         align="left">
                        </el-table-column>
                        <el-table-column prop="payable" :label="$t('contractInfo.contractInfo17')" width="100"
                                         align="left">
                            <template slot-scope="scope">
                <span>
                  {{scope.row.payable.toString()}}
                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="payableMultyAsset" :label="$t('contractInfo.contractInfo18')" width="140"
                                         align="left">
                            <template slot-scope="scope">
                <span>
                  {{scope.row.payableMultyAsset.toString()}}
                </span>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <el-tab-pane :label="$t('type.16')" name="fourth" class="bg-white">
                    <div class="w630" style="padding-bottom: 50px">
                        <Call :modelList="modelData" :contractAddress="contractAddress" :decimals="decimals"></Call>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <!-- 展示合约参数 -->
            <el-dialog title="" :visible.sync="viewArgsDialog" class="dialog_tran">
                <div class="dialog-info scroll">
                    <json-viewer
                            :value="contractArgs"
                            :expand-depth="5"
                            copyable
                            boxed
                    ></json-viewer>
                </div>
            </el-dialog>

            <!-- 展示合约结果 -->
            <el-dialog title="" :visible.sync="viewResultDialog" class="dialog_tran">
                <div class="dialog-info scroll">
                    <json-viewer
                            :value="contractResult"
                            :expand-depth="5"
                            copyable
                            boxed
                    ></json-viewer>
                </div>
            </el-dialog>
        </div>
        <Password ref="password" @passwordSubmit="passSubmit"></Password>
    </div>

</template>

<script>
    import nuls from 'nuls-sdk-js'
    import moment from 'moment'
    import BackBar from '@/components/BackBar'
    // import SelectBar from '@/components/SelectBar';
    import Call from './Call'
    import {timesDecimals, getLocalTime, superLong, connectToExplorer, chainIdNumber, chainID} from '@/api/util'
    import {getNulsBalance, inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'
    import Password from '@/components/PasswordBar'
    import {LOCALHOST_API_URL, PARAMETER} from '@/config.js'
    import axios from 'axios'

    export default {
        data() {
            return {
                activeName: this.$route.query.activeName ? this.$route.query.activeName : 'first',
                addressInfo: {},//账户信息
                contractAddress: this.$route.query.contractAddress,//合约地址
                contractInfo: {},//合约详情
                isCancel: false,
                //合约交易类型
                contractsStatusOptions: [
                    {value: 0, label: '0'},
                    {value: 15, label: '15'},
                    {value: 16, label: '16'},
                    {value: 17, label: '17'},
                    {value: 18, label: '18'},
                ],
                contractsTypeRegion: 0,
                contractTxData: [],//合约交易列表
                pageIndex: 1, //页码
                pageSize: 10, //每页条数
                pageTotal: 0,//总页数
                modeList: [],//合约方法列表
                modelData: [],//合约方法列表
                decimals: 0,//合约精度系数
                defaultAddress: '',//默认地址
                viewArgsDialog: false, //合约参数数据显示
                viewResultDialog: false, //合约结果数据显示
                contractArgs: '',//合约参数
                contractResult: '',//合约结果
            };
        },
        created() {
            this.addressInfo = JSON.parse(localStorage.getItem(chainIdNumber()));
            if (!this.addressInfo) {
                this.addressInfo = {};
            }
            if (this.addressInfo.address) {
                this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
            }
        },
        mounted() {
            this.contractInfoByAddress(this.contractAddress);
            this.contractTxList(this.pageIndex, this.pageSize, 0, this.contractAddress);
            setInterval(() => {
                let info = JSON.parse(localStorage.getItem(chainIdNumber()));
                if (info && info.address) {
                    this.defaultAddress = info.address;
                }
                this.contractInfoByAddress(this.contractAddress);
                this.contractTxList(this.pageIndex, this.pageSize, 0, this.contractAddress);
            }, 8000);
        },
        beforeDestroy() {

        },
        components: {
            BackBar,
            Call,
            Password,
        },
        watch: {
            addressInfo(val, old) {
                if (val.address !== old.address && old.address) {
                    this.addressInfo = val;
                    this.isCancel = this.addressInfo.address === this.contractInfo.creater;
                    this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
                }
            }
        },
        methods: {

            handleClick(tab) {
                console.log(tab.name);
            },

            /**
             * 合约详情根据合约地址
             * @param address
             **/
            async contractInfoByAddress(address) {
                await this.$post('/', 'getContract', [address])
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            response.result.createTxHashs = superLong(response.result.createTxHash, 5);
                            response.result.balance = timesDecimals(response.result.balance);
                            this.contractInfo = response.result;
                            //解决重载的问题
                            for (let item in response.result.methods) {
                                response.result.methods[item].keys = item;
                            }
                            this.modelData = (function () {
                                var methodsFilter = [];
                                var methods = response.result.methods;
                                for (var i = 0; i < methods.length; i++) {
                                    if (methods[i].name != '<init>' && !methods[i].event) {
                                        methodsFilter.push(methods[i]);
                                    }
                                }
                                return methodsFilter;
                            })();
                            this.decimals = response.result.decimals;
                            this.modeList = response.result.methods;
                            this.isCancel = this.addressInfo.address === this.contractInfo.creater
                        } else {
                            this.$message({
                                message: this.$t('contractInfo.contractInfo9') + response.error,
                                type: 'error',
                                duration: 1000
                            });
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            message: this.$t('contractInfo.contractInfo10') + error,
                            type: 'error',
                            duration: 1000
                        });
                    });
            },

            /**
             * 合约交易列表
             * @param pageIndex
             * @param pageSize
             * @param type
             * @param address
             **/
            async contractTxList(pageIndex, pageSize, type, address) {
                await this.$post('/', 'getContractTxList', [pageIndex, pageSize, type, address])
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            for (let item of response.result.list) {
                                item.time = moment(getLocalTime(item.time * 1000)).format('YYYY-MM-DD HH:mm:ss');
                                item.txHashs = superLong(item.txHash, 20);
                                item.fees = timesDecimals(item.fee.value);
                            }
                            this.contractTxData = response.result.list;
                            this.pageTotal = response.result.totalCount;
                        } else {
                            this.$message({
                                message: this.$t('contractInfo.contractInfo11') + response.error,
                                type: 'error',
                                duration: 1000
                            });
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            message: this.$t('contractInfo.contractInfo12') + error,
                            type: 'error',
                            duration: 1000
                        });
                    });
            },

            /**
             *  根据数据类型排序
             **/
            changeType(type) {
                this.contractsTypeRegion = parseInt(type);
            },

            /**
             *  合约交易记录分页
             **/
            contractTxPages(val) {
                this.pageIndex = val;
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
                        this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 1000});
                    }
                }).catch((error) => {
                    this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
                });
            },

            /**
             * 验证删除合约交易
             */
            async validateContractDelete(sender, contractAddress) {
                return await this.$post('/', 'validateContractDelete', [sender, contractAddress])
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            return response.result;
                        } else {
                            return {success: false, data: response.error};
                        }
                    })
                    .catch((error) => {
                        return {success: false, data: error};
                    });
            },

            /**
             * 注销合约
             **/
            cancelContract() {
                if (this.addressInfo.encrypted) {
                    this.$refs.password.showPassword(true);
                } else {
                    this.passSubmit();
                }
            },

            /**
             *  获取密码框的密码
             * @param password
             **/
            async passSubmit(password) {
                const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
                let pub = this.addressInfo.pub;
                const newAddressInfo = nuls.importByKey(chainID(), pri, password);
                if (newAddressInfo.address === this.addressInfo.address) {
                    let amount = 0;
                    let transferInfo = {
                        fromAddress: this.addressInfo.address,
                        assetsChainId: chainID(),
                        assetsId: 1,
                        amount: amount,
                        fee: 100000
                    };
                    let contractDelete = {
                        chainId: chainID(),
                        sender: this.addressInfo.address,
                        contractAddress: this.contractAddress
                    };
                    let deleteValidateResult = await this.validateContractDelete(contractDelete.sender, contractDelete.contractAddress);
                    if (!deleteValidateResult.success) {
                        this.$message({
                            message: this.$t('contractInfo.contractInfo13') + deleteValidateResult.msg,
                            type: 'error',
                            duration: 3000
                        });
                        return;
                    }
                    let remark = '';
                    let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 17);
                    let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 17, contractDelete);
                    let txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
                    //验证并广播交易
                    await validateAndBroadcast(txhex).then((response) => {
                        if (response.success) {
                            this.$router.push({
                                name: "txList"
                            })
                        } else {
                            this.$message({
                                message: this.$t('error.' + response.data.code),
                                type: 'error',
                                duration: 3000
                            });
                        }
                    }).catch((err) => {
                        this.$message({message: this.$t('public.err1') + err, type: 'error', duration: 1000});
                    });
                } else {
                    this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
                }
            },


            /**
             * 连接跳转
             * @param name
             * @param params
             * @param type
             */
            toUrl(name, params, type = 0) {
                if (type === 0) {
                    let newQuery = {hash: params};
                    this.$router.push({
                        name: name,
                        query: newQuery
                    })
                } else {
                    connectToExplorer(name, params)
                }
            },

            showContractArgs(txHash, type) {
                PARAMETER.method = 'getContractExecuteArgsInfo';
                PARAMETER.params = [chainID(), txHash, type];
                axios.post(LOCALHOST_API_URL, PARAMETER)
                    .then((response) => {
                        if (response.data.hasOwnProperty("result")) {
                            this.contractArgs = response.data.result.args;
                        } else {
                            this.contractArgs = this.$t('transaciontInfo.info1');
                        }
                        this.viewArgsDialog = true;
                    })
                    .catch((error) => {
                        this.$message({
                            message: this.$t('transaciontInfo.info1') + error,
                            type: 'error',
                            duration: 2000
                        });
                    });
            },

            showContractResult(txHash) {
                PARAMETER.method = 'getContractExecuteResultInfo';
                PARAMETER.params = [chainID(), txHash];
                axios.post(LOCALHOST_API_URL, PARAMETER)
                    .then((response) => {
                        if (response.data.hasOwnProperty("result")) {
                            this.contractResult = response.data.result.contractResult;
                        } else {
                            this.contractResult = this.$t('transaciontInfo.info1');
                        }
                        this.viewResultDialog = true;
                    })
                    .catch((error) => {
                        this.$message({
                            message: this.$t('transaciontInfo.info1') + error,
                            type: 'error',
                            duration: 2000
                        });
                    });
            },

        }
    };
</script>

<style lang="less">
    @import "./../../assets/css/style";

    .contract-info {
        background-color: @Bcolour1;

        .card_long {
            height: 140px;
        }

        .el-tabs {
            margin: 30px auto 0;
        }
    }
</style>

