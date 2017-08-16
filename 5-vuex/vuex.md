# vuex的简单demo的思路详解

---
先在这里把vuex的解释贴上来，摘自[Vuex官方文档](https://vuex.vuejs.org/zh-cn/intro.html)：

## vuex是什么？
>Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-t ravel 调试、状态快照导入导出等高级调试功能。

## 什么是“状态管理模式”
让我们从一个简单的 Vue 计数应用开始：
```javascript
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```
这个状态自管理应用包含以下几个部分：

- state，驱动应用的数据源；
- view，以声明方式将state映射到视图；
- actions，响应在view上的用户输入导致的状态变化。

以下是一个表示“单向数据流”理念的极简示意：
![](https://vuex.vuejs.org/zh-cn/images/flow.png)

但是，当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

这就是 Vuex 背后的基本思想，借鉴了 Flux、Redux、和 The Elm Architecture。与其他模式不同的是，Vuex 是专门为 Vue.js 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。

![](https://vuex.vuejs.org/zh-cn/images/vuex.png)

## 什么情况下我应该使用 Vuex？

虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 global event bus 就足够您所需了。但是，如果您需要构建是一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：

>Flux 架构就像眼镜：您自会知道什么时候需要它。

---
以上是vue官网对vuex的解释，下面我们开始是实际的来做一个关于vuex的小demo

## 1. 引入Vuex并实例化store
1. 引入vuex
2. 实例化store
3. 在new Vue的是时候写进去，全局化实例store，这样我们可以在每个组件中，通过`this.$store.state.变量名`的方式使用
4. 在App.vue里面引用子组件，在本例中是引用apple.vue & pear.vue
5. 在子组件中通过$store.commit触发main.js中mutations（无法处理异步数据）中的函数来修改数据，或者在子组件中通过$store.dispatch触发main.js里面的actions（可以处理异步数据）中的函数来修改数据
代码如下：
main.js
``` javascript
// 引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 实例化store
let store = new Vuex.Store({
  // state 全局使用的数据
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
  },
  // mutation 与 action 的区别：
  // 1.actions不能直接更改store.state里面的数据
  // 2.需要间接的触发mutation,
  // 3.actions里面可以做一些异步的操作及处理
  // actions: {
  //   increase(context, price) {
  //     context.commit('increment', price)
  //   }
  // }
})

// 全局化实例store
new Vue({
  el: '#app',
  router: VRouter,
  store: store,  // 把store放在全局的实例化对象里面
  template: '<App/>',
  components: { App }
})

```

App.vue:

``` html
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
      // 调用store里面的数据
      return this.$store.state.totalPrice
    }
  }
}
</script>

<style>
/*to do */
</style>

```

Apple.vue
```html
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
/*to do*/
</style>
```

Pear.vue:
```html
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
      // 通过this.$store.commit触发main.js里面的increment方法
      this.$store.commit('increment', this.price)
    },
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
```
这样一个demo就算完成
效果图：
![](https://github.com/Yfling/technology-foresight/blob/master/5-vuex/img/2017-08-16%2017_41_41.gif?raw=true)
在前面，我们使用mutations来做数据交互的，这里同样也可以使用actions,更改后的代码如下：
main.js
``` javascript
// 引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 实例化store
let store = new Vuex.Store({
  // state 全局使用的数据
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
  },
  // mutation 与 action 的区别：
  // 1.actions不能直接更改store.state里面的数据
  // 2.需要间接的触发mutation,
  // 3.actions里面可以做一些异步的操作及处理,例如从api接口获取数据之类的
  actions: {  // 新增代码
    increase(context, price) {
      context.commit('increment', price)
    },
    decrease(context, price) {
      context.commit('decrement', price)
    }
  }
})
//.....
```
Apple.vue更改后的代码(通过dispatch触发数据修改)
```html
<!-- some code -->
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
      this.$store.dispatch('increase', this.price)
    },
    // 价格减少
    minusOne() {
      this.$store.dispatch('decrease', this.price)
    }
  },
  components: {
    // Apple
  }
}
</script>
<!-- some code -->
```
虽然这样看上去代码好像增多了，但是在是文档规定了，mutations里面只能对直接的数据操作，如果你想调取后端的API请求数据，或者其他起步请求，就必须要用actions了，然后通过actions来处发mutations的更改。
