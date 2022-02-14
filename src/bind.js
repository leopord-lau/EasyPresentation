Function.prototype.mybind = function(context) {
  if(typeof this !== 'function') {
    throw new Error('Uncaught TypeError: not a function')
  }

  const args = [...arguments].slice(1);
  // 用于记录当前传入的函数的prototype;
  let Transit = function() {};
  const _ = this;
  const FunctionToBind = function() {
    const bindArgs = [...arguments];
    return _.apply(this instanceof Transit ? this : context, args.concat(bindArgs));
  }
  // 记录当前传入的函数的prototype;
  Transit.prototype = this.prototype;
  FunctionToBind.prototype = new Transit();
  return FunctionToBind;
}