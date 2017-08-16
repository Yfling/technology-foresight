<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="addOne">add one</button>
    <button @click="minusOne">minus one</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'apple components',
      price: 5
    }
  },
  methods: {
    // 价格增加
    addOne() {
      // 通过this.$store.commit触发main.js里面的increment方法
      this.$store.commit('increment', this.price)
    },
    // 价格减少
    minusOne() {
      // 通过this.$store.commit触发main.js里面的decrement方法
      this.$store.commit('decrement', this.price)
    }
  },
  components: {
    // Apple
  }
}
</script>

<style>

</style>
