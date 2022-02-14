Function.prototype.myapply = function(context, arr) {
  // 默认上下文为window
  context = context || window;
  // 添加一个属性用于保存当前调用call的函数
  context.fn = this;
  // 将arguments转变成数组并移除第一个参数（上下文）
  let result;
  if(!arr) {
    result = context.fn();
  } else {
    result = context.fn(arr);
  }
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

bar.myapply(obj, 1, 2, 3);  // 只有1被传入bar中
bar.myapply(obj, [1, 2, 3], [4, 5, 6]);  // 只有[1,2,3]被传入bar中