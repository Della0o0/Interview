/* 
  自定义Promise函数模块 IFFE

*/
(function (window) {
  /* 
    Promise构造函数
    参数：执行器函数 excutor （同步执行）
  */
  function Promise(excutor) {
    const self = this;
    self.status = "pending"; //给promise对象指定status属性，初始值为pending
    self.data = undefined; //给promise对象指定一个用于存储结果数据的属性
    self.callbacks = []; //每个元素的结构: { onResolved(){},onRejected(){} }

    // 两个用于改变promise状态的函数
    function resolve(value) {
      // 如果当前状态不是pending 直接结束
      // BUG:这里的self 这样调用指向window
      if(self.status != 'pending') {return};
      //将状态改为resolved
      self.status = "resolved";
      //保存value数据
      self.data = value;
      // 如果有待执行callback函数，立即异步执行回调
      if (self.callbacks.length > 0) {
        // 放到队列执行所有成功的回调
        setTimeout(() => {
          self.callbacks.forEach((callbacksObj) => {
            callbacksObj.onResolved(value);
          });
        }, 0);
      }
    }
    function reject(reason) {
      // 如果当前状态不是pending 直接结束
      if(self.status != 'pending') {return};
      //将状态改为rejected
      self.status = "rejected";
      //保存value数据
      self.data = reason;
      // 如果有待执行callback函数，立即异步执行回调
      if (self.callbacks.length > 0) {
        // 放到队列执行所有成功的回调
        setTimeout(() => {
          self.callbacks.forEach((callbacksObj) => {
            callbacksObj.onRejected(reason);
          });
        }, 0);
      }
    }

    // 立即同步执行
    try {
      excutor(resolve, reject);
    } catch (error) {
      // 如果执行器抛出异常，promise对象变为rejected状态
      reject(err)

    }
  }
  /* 
    Promise原型对象的then()
    指定成功和失败的回调函数
    返回一个新的promise对象
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this;
    // 假设状态还是pending状态 把两个函数存起来
    self.callbacks.push({
      onResolved,
      onRejected
    })



  };
  /* 
    Promise原型对象的catch()
    指定失败的回调函数
    返回一个新的promise对象
  */
  Promise.prototype.catch = function (onRejected) {};

  /* 
    Promise函数对象的方法：resolve
    返回一个指定结果value的成功的promise
  */
  Promise.resolve = function (value) {};
  /* 
    Promise函数对象的方法：reject
    返回一个指定结果value的成功的promise
  */
  Promise.reject = function (reason) {};
  /* 
    Promise函数对象的方法：all
    参数：promises
    返回一个promise ， 只能当所有promise都成功时才成功，否则只要有一个失败就失败
  */
  Promise.all = function (promises) {};
  /* 
    Promise函数对象的方法：race
    参数：promises
    返回一个promise ， 其结果由先完成的promise决定
  */
  Promise.race = function (promises) {};

  // 向外暴露Promise函数
  window.Promise = Promise
})(window);
