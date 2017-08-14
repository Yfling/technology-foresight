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

  function resolve(value) {
    if (that.status === 'pending') {
      that.status = 'resolved';
      that.data = value;

      for (var i = 0; i < that.onResolvedCallback.length; i++) {
        that.onResolvedCallback[i](value);
      }
    }
  }
  function reject(reason) {
    if (that.status === 'pending') {
      that.status = 'reject';
      that.data = reason;
      for (var i = 0; i < that.onRejectedCallback.length; i++) {
        that.onRejectedCallback[i](reason);
      }
    }
  }

  // 考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且在出错后以catch到的值reject掉这个Promise
  try {
    executor(resolve, reject);  // 执行executor
  }
  catch(e) {
    reject(e);
  }
}
