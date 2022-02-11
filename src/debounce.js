const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay)
  }
}

document.body.addEventListener('click', debounce(()=> {
  console.log('log')
}, 5000))