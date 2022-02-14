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

## 深克隆

我们最常用的是`JSON.parse(JSON.stringify(obj))`这样的方式来实现克隆，但是这个方式其实存在一些局限。

比如：
- 无法实现对函数 、`RegExp`等特殊对象的克隆
- 会抛弃原始对象的构造函数, 并指向`Object`
- 当对象循环引用时，会报错

## `instanceOf`

根据[原型链](https://blog.csdn.net/qq_42880714/article/details/104389847)的知识，我们能很快能知道根据对象的`__proto__`属性就能找到其构造函数。
```js
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
```

## `new` 操作符

`new`的作用：
- 创建一个新对象
- 将`this`执行创建的新对象
- 创建的新对象会被链接到该函数的`prototype`对象上（新对象的`__proto__`属性指向函数的`prototype`）;
- 利用函数的call方法，将原本指向window的绑定对象this指向了obj。（这样一来，当我们向函数中再传递实参时，对象的属性就会被挂载到obj上。）

```js
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
```


