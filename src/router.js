import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'home',
      component: resolve => require(['@/views/contract/Contract.vue'], resolve)
    },
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/views/contract/Contract.vue'], resolve)
    },
    {
      path: '/contract',
      name: 'contract',
      component: resolve => require(['@/views/contract/Contract.vue'], resolve)
    },
    {
      path: '/contractInfo',
      name: 'contractInfo',
      component: resolve => require(['@/views/contract/ContractInfo.vue'], resolve)
    },
    {
      path: '/address',
      name: 'address',
      component: resolve => require(['@/views/users/Address.vue'], resolve)
    },
    {
      path: '/newAddress',
      name: 'newAddress',
      component: resolve => require(['@/views/users/NewAddress.vue'], resolve)
    },
    {
      path: '/importAddress',
      name: 'importAddress',
      component: resolve => require(['@/views/users/ImportAddress.vue'], resolve)
    },
    {
      path: '/setAlias',
      name: 'setAlias',
      component: resolve => require(['@/views/users/SetAlias.vue'], resolve)
    },
    {
      path: '/editPassword',
      name: 'editPassword',
      component: resolve => require(['@/views/users/EditPassword.vue'], resolve)
    },
    {
      path: '/nodeService',
      name: 'nodeService',
      component: resolve => require(['@/views/set/NodeService.vue'], resolve)
    },
    {
      path: '/set',
      name: 'seting',
      component: resolve => require(['@/views/set/Set.vue'], resolve)
    }


  ]
})
