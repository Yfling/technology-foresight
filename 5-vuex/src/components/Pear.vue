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
      msg: 'pear components',
      price: 15
    }
  },
  methods: {
    addOne() {
      this.$store.commit('increment', this.price)
    },
    minusOne() {
      this.$store.commit('decrement', this.price)
    }
  },
  components: {
    // Apple
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
