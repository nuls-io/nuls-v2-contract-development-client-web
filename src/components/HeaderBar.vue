<template>
    <div class="header">
        <div class="w1200">
            <div class="logo">
                <img class="click" @click="toUrl('home')" :src=logoSvg>
            </div>
            <div class="nav">
                <el-menu mode="horizontal" :default-active="navActives($route.path)" @select="handleSelect">
                    <!--<el-menu-item index="home">{{$t('nav.wallet')}}</el-menu-item>-->
                    <el-menu-item index="contract" :disabled="defaultAddress ===''||defaultAddress ===null">
                        {{$t('nav.contracts')}}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="tool">
                <el-menu mode="horizontal" :default-active="navActive" @select="handleSelect">
                    <!--
                      <el-submenu index="address" class="user" :disabled="addressList.length === 0">
                        <template slot="title"><i class="iconfont iconzhanghu"></i></template>
                        <el-menu-item v-for="item of addressList" :key="item.address" :index="item.address">
                          <i class="iconfont iconwo" :class="item.address === defaultAddress ? '' : 'transparent' "></i>
                          <font v-show="!item.alias"> {{item.addresss}} | </font><span
                                v-show="item.alias">{{item.alias}} | </span><span>{{item.balance}}</span>
                        </el-menu-item>
                      </el-submenu>
                     -->
                    <el-submenu index="set">
                        <template slot="title">{{$t('nav.set')}}</template>
                        <el-menu-item index="address">{{$t('nav.addressList')}}</el-menu-item>
                        <el-menu-item index="nodeService">{{$t('nav.nodeList')}}</el-menu-item>
                        <el-menu-item index="seting">{{$t('public.about')}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="lang">
                        <template slot="title">{{this.lang ==="en" ? "Eng":"中文"}}</template>
                        <el-menu-item index="cn">中文</el-menu-item>
                        <el-menu-item index="en">English</el-menu-item>
                    </el-submenu>
                    <!-- <li class="el-menu-item">|</li>
                     <el-menu-item index="24" disabled>{{$t('nav.help')}}</el-menu-item>-->
                </el-menu>

            </div>
        </div>
        <div class="cb"></div>
    </div>

</template>

<script>
    import axios from 'axios'
    import logoSvg from './../assets/img/logo-beta.svg'
    import {chainID, chainIdNumber} from '@/api/util'
    import {LOCALHOST_API_URL} from '@/config.js'

    export default {
        data() {
            return {
                logoSvg: logoSvg, //logo
                navActive: '/',//菜单选中
                addressList: [], //地址列表
                lang: 'cn', //语言选择
                defaultAddress: '',//默认地址
            };
        },
        components: {},
        created() {
            this.getAddressList();
        },
        mounted() {
            setInterval(() => {
                let info = JSON.parse(localStorage.getItem(chainIdNumber()));
                if (info && info.address) {
                    this.defaultAddress = info.address;
                }
            }, 600);

        },
        methods: {

            /**
             * 菜单导航
             * @param key
             * @param keyPath
             */
            handleSelect(key, keyPath) {
                if (keyPath.length > 1) {
                    if (keyPath[0] === "address") {
                        console.log(key, 'key');
                        localStorage.setItem(chainIdNumber(), key);
                        this.getAddressList();
                    } else if (keyPath[0] === "set") {
                        this.$router.push({
                            name: keyPath[1]
                        })
                    } else if (keyPath[0] === "lang") {
                        this.selectLanguage(key)
                    }
                } else {
                    this.$router.push({
                        name: key
                    })
                }
            },

            /**
             * 导航栏的选中
             * @param val
             **/
            navActives(val) {
                if (val.indexOf('/transfer') === 0) {
                    return 'transfer'
                } else if (val.indexOf('/consensus') === 0) {
                    return 'consensus'
                } else if (val.indexOf('/contract') === 0) {
                    return 'contract'
                } else {
                    return 'home'
                }
            },

            /**
             * 获取账户列表
             */
            async getAddressList() {
                let parameter = {};
                let addressList = [];
                let isExist = false;
                parameter.method = 'getAccountList';
                parameter.params = [chainID(), 1, 10];
                parameter.id = 54898;
                parameter.jsonrpc = '2.0';
                await axios.post(LOCALHOST_API_URL, parameter).then((response) => {
                    if (response.data.hasOwnProperty('result')) {
                        addressList = response.data.result.list;
                    }
                }).catch((err) => {
                    console.log(err)
                });

                if (addressList.length > 0) {
                    let info = JSON.parse(localStorage.getItem(chainIdNumber()));
                    if (info && info.address) {
                        this.defaultAddress = info.address;
                    }
                    for (let item  of addressList) {
                        // item.address = superLong(item.address, 8);
                        if (item.address == this.defaultAddress) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        localStorage.removeItem(chainIdNumber());
                        this.defaultAddress = '';
                    }
                    if (this.defaultAddress == '' || this.defaultAddress == null || !isExist) {
                        this.$router.push({
                            name: "address"
                        })
                    }
                } else {
                    localStorage.removeItem(chainIdNumber());
                    this.defaultAddress = '';
                    this.$router.push({
                        name: "newAddress",
                        query: {'address': ''}
                    })
                }
            },

            /**
             * 语言切换
             * @param e
             */
            selectLanguage(e) {
                this.lang = e;
                this.$i18n.locale = this.lang;
            },

            /**
             * 连接跳转
             * @param name
             */
            toUrl(name) {
                this.$router.push({
                    name: name
                })
            },
        },
        watch: {}
    }
</script>

<style lang="less">
    @import "./../assets/css/style";

    .header {
        border-bottom: 1px solid @Dcolour;
        height: 80px;

        .logo {
            width: 120px;
            float: left;

            img {
                margin: 20px 0 0 0;
                width: 100%;
            }
        }

        .nav {
            width: 600px;
            margin: 10px 0 0 0;
            float: left;
        }

        .tool {
            width: 340px;
            margin: 10px 0 0 0;
            float: right;
            background-color: #e6a23c;

            .user {
                .el-submenu__title {
                    .el-icon-arrow-down {
                        margin: 35px 0 0 -16px
                    }
                }
            }
        }
    }
</style>
