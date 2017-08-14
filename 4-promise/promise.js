var promise = new Promise(function (resolve, reject) {

})


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

// 为了下文方便，我们顺便实现一个catch方法
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}
