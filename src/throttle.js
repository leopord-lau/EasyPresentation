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


document.body.addEventListener('click', throttle3(()=> {
  console.log('log')
}, 2000))