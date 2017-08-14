# Promise实现思路讲解

## Promise实现的主要模块：
1. Promise只有一个then方法
2. then方法会返回一个新的Promise
3. 不同Promise之间可以相互调用
4. Promise的初始状态为pending,它可以由此状态转换为fulfilled(resolved/rejected),一旦状态确定，就不可以再次转换为其他状态。


## 实现具体思路
#### 1. 实现一个Promise的构造函数
```javascript
// Promise构造函数接收一个executor函数，executor函数执行完同步或异步操作后，调用它的两个参数resolve和reject
var promise = new Promise(function(resolve, reject) {
  /*
    如果操作成功，调用resolve并传入value
    如果操作失败，调用reject并传入reason
  */
})

```

```javascript
// Promise的构造函数：
// Promise构造函数接收一个executor函数，executor函数执行完同步或异步操作后，调用它的两个参数resolve和reject
function Promise(executor) {
  var that = this;
  that.status = 'pending';  // promise的当前状态
  that.data = undefined;  // 用于存放promise的值
  that.onResolvedCallback = [];  // Promise resolve时的回调函数集，因为在Promise结束之前可能有多个回调添加到它上面
  that.onRejectedCallback = [];  // Promise reject时的回掉函数集，因为在Promise结束之前可能有多个回调添加到它上面

  //
  function resolve(value) {
    // 如果是Promise,直接调用then方法
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }

    // 异步执行所有的回调函数
    setTimeout(function() {
      if (that.status === 'pending') {
        that.status = 'resolved';
        that.data = value;

        for (var i = 0; i < that.onResolvedCallback.length; i++) {
          that.onResolvedCallback[i](value);
        }
      }
    })
  }

  //
  function reject(reason) {
    // 异步执行所有的回调函数
    setTimeout(function() {
      if (that.status === 'pending') {
        that.status = 'reject';
        that.data = reason;
        for (var i = 0; i < that.onRejectedCallback.length; i++) {
          that.onRejectedCallback[i](reason);
        }
      }
    })
  }

  // 考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且在出错后以catch到的值reject掉这个Promise
  try {
    executor(resolve, reject);  // 执行executor
  }
  catch(e) {
    reject(e);
  }
}
```
#### 2.实现then方法
```javascript
/**
 * then方法
 * @param  {Object} onResolve  Promise成功后的回调
 * @param  {Object} onRejected Promise失败后的回调
 * @return {Promise}  返回一个Promise对象
 */
Promise.prototype.then = function(onResolved, onRejected) {
  var that = this;
  var promise2;  // 初始化定义返回后的promise对象

  // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
  onResolved = typeof onResolved === 'function' ? onResolved : function(value) {return value}；
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason};

  if (that.status === 'resolved') {
    // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
    // 因为考虑到有可能throw，所以我们将其包在try/catch块里
    return promise2 = new Promise(function(resolve, reject) {
      // 异步执行onResolved
      setTimeout(function() {
        try {
          var x = onResolved(that.data);
          // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          else {
            resolve(x);  // 否则，以它的返回值作为promise2的结果
          }
        }
        catch (e) {
          reject(e);  // 如果出错，以捕获到的错误作为primise2的结果
        }
      })
    })
  }

  if (that.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      // 异步执行onRejected
      setTimeout(function() {
        try {
          var x = onRejected(that.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          // 此处没有else?
        }
        catch (e) {
          reject(e);
        }
      })
    })
  }

  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
  // 只能等到Promise的状态确定后，才能确实如何处理。
  // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
  // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释

  // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
  if (that.status === 'pending') {
    return promise2 = new Promise(function(resolve, reject) {
      that.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(that.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          // 此处没有else
        }
        catch (e) {
          reject(e);
        }
      })

      that.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(that.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          // 此处没有else
        }
        catch (e) {
          reject(e);
        }
      })
    })
  }
}
```

#### 3.不同Promise之间的交互(实现值的穿透)
想要实现的效果：
我们希望下面这段代码
```javascript
new Promise(resolve=>resolve(8))
  .then()
  .catch()
  .then(function(value) {
    alert(value)
  })
```
跟下面这段代码的行为是一样的
```javascript
new Promise(resolve=>resolve(8))
  .then(function(value){
    return value
  })
  .catch(function(reason){
    throw reason
  })
  .then(function(value) {
    alert(value)
  })
```
所以如果想要把then的实参留空且让值可以穿透到后面，意味着then的两个参数的默认值分别为function(value) {return value}，function(reason) {throw reason}。
所以我们只需要把then里判断onResolved和onRejected的部分改成如下即可：
```javascript
onResolved = typeof onResolved === 'function' ? onResolved : function(value) {return value}
onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason}
```
于是Promise神奇的值的穿透也没有那么黑魔法，只不过是then默认参数就是把值往后传或者抛

**不同Promise的交互**

关于不同Promise间的交互，其实标准里是有说明的，其中详细指定了如何通过then的实参返回的值来决定promise2的状态，我们只需要按照标准把标准的内容转成代码即可。
