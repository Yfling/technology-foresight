<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- <router-view></router-view> -->
    totalPrice: {{ totalPrice }}
    <apple></apple>
    <pear></pear>
  </div>
</template>

<script>
import Apple from './components/Apple'
import Pear from './components/Pear'

export default {
  components: {
    Apple: Apple ,
    Pear
  },
  computed: {
    totalPrice() {
      return this.$store.state.totalPrice
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
