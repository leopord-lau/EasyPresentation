const statusMap = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
}

class MyPromise{
  constructor(handler) {
    if(Object.prototype.toString.call(handler) !== '[object Function]') {
      throw new Error('the first parameter should be a function');
    }
    this.status = statusMap.PENDING;
    this.result = null;
    // 用于执行then方法
    this.fulfilledQueues = [];
    this.rejectedQueues = [];

    try{
      // 执行两个方法
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch(err) {
      this._reject(err);
    }
  }

  _resolve(val) {
    if(this.status !== statusMap.PENDING) return;

    const run = () => {
      this.status = statusMap.FULFILLED;
      this.result = val;
      let cb;
      while(cb = this.fulfilledQueues.shift()) {
        cb(val);
      }
    }
    setTimeout(() => run(), 0);
  }

  _reject(err) {
    if(this.status !== statusMap.PENDING) return;

    const run = () => {
      this.status = statusMap.REJECTED;
      this.result = err;
      let cb;
      while(cb = this.rejectedQueues.shift()) {
        cb(err);
      }
    }

    setTimeout(() => run(), 0);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejeceted) {
  const { status, result } = this;

  return new MyPromise((onFulfilledNext, onRejecetedNext) => {
    let fulfilled = value => {
      try {
        if(Object.prototype.toString.call(onFulfilled) !== '[object Function]') {
          onFulfilledNext(value);
        } else {
          let res = onFulfilled(value);

          // 返回结果还是MyPromise的实例
          if(res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejecetedNext);
          } else {
            onFulfilledNext(res);
          }
        }
      } catch(e) {
        onRejecetedNext(e);
      }
    }

    let rejected = error => {
      try {
        if(Object.prototype.toString.call(onRejeceted) !== '[Object Function]') {
          onRejecetedNext(error);
        } else {
          let res = onRejeceted(error);

          // 返回结果还是MyPromise的实例
          if(res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejecetedNext);
          } else {
            onFulfilledNext(res);
          }
        }
      } catch(e) {
        onRejecetedNext(e);
      }
    }

    switch(status) {
      case statusMap.PENDING:
        this.fulfilledQueues.push(fulfilled);
        this.rejectedQueues.push(rejected)
        break;

      case statusMap.FULFILLED:
        this.fulfilledQueues.push(fulfilled);
        break;
      
      case statusMap.REJECTED:
        this.rejectedQueues.push(rejected);
        break;
    }
  })
}