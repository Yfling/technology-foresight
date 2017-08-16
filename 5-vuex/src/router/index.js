import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Apple from '../components/Apple'
import Pear from '../components/Pear'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '../components/Apple'
    },
    {
      path: '../components/Apple',
      component: Apple
    },
    {
      path: '../components/Pear',
      component: Pear
    }
  ]
})
