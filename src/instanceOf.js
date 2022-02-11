const instanceOf = function(object, target) {
  // 取目标的原型对象
  const instance = target.prototype;
  // 取待检验的对象的隐式原型
  object = object.__proto__;
  while(true) {
    if(!object) return false;

    if(object === instance) return true;

    object = object.__proto__;
  }
}
