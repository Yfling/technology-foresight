// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VRouter from './router'
import Vuex from 'vuex'
import Apple from './components/Apple'
import Pear from './components/Pear'

Vue.use(Vuex)
Vue.use(VRouter)

// 实例化store
let store = new Vuex.Store({
  state: {
    totalPrice: 0
  },
  mutations: {
    increment(state, price) {
      state.totalPrice += price;
    },
    decrement(state, price) {
      if (state.totalPrice <= 0) {
        state.totalPrice = 0;
        console.log('已经减到最小值')
      }
      else {
        state.totalPrice -= price;
      }
    }
  }
})

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: VRouter,
  store: store,
  template: '<App/>',
  components: { App }
})
