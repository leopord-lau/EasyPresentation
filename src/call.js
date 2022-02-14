Function.prototype.mycall = function(context) {
  // 默认上下文为window
  context = context || window;
  // 添加一个属性用于保存当前调用call的函数
  context.fn = this;
  // 将arguments转变成数组并移除第一个参数（上下文）
  const args = [...arguments].slice(1);
  // 这样调用函数时该函数内部的this就指向调用者（context）;
  const result = context.fn(...args);
  delete context.fn;
  return result;
}

var value = 2;

var obj = {
    value: 1
}

function bar() {
  console.log(arguments);
  return {
    value: this.value,
  }
}

bar.mycall(null); // 2
bar.mycall(obj);  // 1