function createObject() {
  // 创建一个新对象
  const obj = {};
  // 获取构造函数，采用call方法使得arguments能够使用shift方法将第一个参数（构造函数）拿出来
  const Constructor = [].shift.call(arguments);
  // 将对象__proto__属性链接到构造函数的prototype属性中
  obj.__proto__ = Constructor.prototype;
  // 将构造函数中的this指向对象并传递参数
  const result = Constructor.apply(obj, arguments);
  // 确保返回值是一个对象
  return typeof ret === "object" ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;

}

const leo = createObject(Person, 'leo', 25)