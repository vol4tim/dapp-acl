import Vue from 'vue'
import Router from 'vue-router'
import Info from '@/components/Info'
import View from '@/components/View'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'info',
      component: Info
    },
    {
      path: '/view/:address',
      name: 'view',
      component: View,
      props: true
    }
  ]
})
