# EasyPresentation
手写常见面试题


## 防抖
防抖函数原理：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

有两种情况：
- 点击之后立即执行
- 点击之后非立即执行

```js
// 非立即执行
const debounce1 = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay)
  }
}

// 立即执行
const debounce2 = (fn, delay) => {
  let timer = null;
  let emitNow = true;
  return (...args) => {
    if(timer) clearTimeout(timer);
    if(emitNow) {
      fn.apply(this, args);
      emitNow = false;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        emitNow = true;
      }, delay)
    }
  }
}

// 通过参数控制是否立即执行
const debounce3 = (fn, delay, isImmediate) => {
  let timer = null;
  let emitNow = true;
  return (...args) => {
    if(timer) clearTimeout(timer);
    
    if(isImmediate) {
      if(emitNow) {
        fn.apply(this, args);
        emitNow = false;
      } else {
        timer = setTimeout(() => {
          fn.apply(this, args);
          emitNow = true;
        }, delay)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay)
    }
  }
}
```

## 节流
防抖函数原理:规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

有两种情况：
- 点击之后立即执行
- 点击之后非立即执行
```js
// 非立即执行
const throttle1 = (fn, delay) => {
  let isEmit = false;
  return (...args) => {
    if(isEmit) return;
    isEmit = true;
    
    setTimeout(() => {
      fn.apply(this, args);
      isEmit = false;
    }, delay);
  }
}

// 立即执行
const throttle2 = (fn, delay) => {
  let isEmit = false;
  return (...args) => {
    if(isEmit) return;
    isEmit = true;

    fn.apply(this,args);
    setTimeout(() => {
      isEmit = false;
    },delay);
  }
}

// 通过参数控制是否立即执行
const throttle3 = (fn, delay, isImmediate) => {
  let isEmit = false;
  return (...args) => {
    if(isEmit) return;
    isEmit = true;
    
    if(isImmediate) {
      fn.apply(this, args);
      setTimeout(() => {
        isEmit = false;
      },delay);
    } else {
      setTimeout(() => {
        fn.apply(this, args);
        isEmit = false;
      }, delay);
    }
  }
}
```