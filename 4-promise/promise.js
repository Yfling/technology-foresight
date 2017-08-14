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

  executor(resolve, reject);  // 执行executor并传入相应的参数
}
