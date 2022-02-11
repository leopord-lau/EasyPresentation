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

document.body.addEventListener('click', debounce3(()=> {
  console.log('log')
}, 2000))