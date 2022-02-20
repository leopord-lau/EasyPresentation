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

```js
function deepCopy(obj) {
  if(typeof obj !== 'object') {
    return obj;
  };

  let cloneObj = obj.constructor=== Array ? [] : {};
  for(let property in obj) {
    cloneObj[property] = typeof obj[property] === 'object' ? deepCopy(obj[property]) : obj[property];
  }
  return cloneObj;
}
```


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
```


## 实现`call`方法

我们都很清楚`call`这个方法就是用于修改`this`指向，但是有些同学可能不太懂其原理，我们来手写一个`call`方法帮助深入了解其原理。

```js
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
```

## 实现`apply`方法
`apply`原理与`call`很相似，唯一不同就是传参问题，`apply`方法的第二个参数是所有参数组合成的数组，而`call`方法除了第一个参数是`context`外，其他都是传入的参数。

```js
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
```

## 实现`bind`方法

相对于`call`和`apply`而言，`bind`方法的返回值是一个改变了`this`的函数（即非立即调用）。**当返回的函数被当作构造函数使用时，`this`失效，但是传入的参数依旧有效。**

> bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

```js
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
```

## 实现`Object.create`方法
`Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

>语法：`Object.create(proto[, propertiesObject])`
>`proto` : 必须。表示新建对象的原型对象，即该参数会被赋值到目标对象(即新对象，或说是最后返回的对象)的原型上。该参数可以是`null`， 对象， 函数的`prototype`属性 （创建空的对象时需传`null` , 否则会抛出`TypeError`异常）
>`propertiesObject` : 可选。 添加到新创建对象的可枚举属性（即其自身的属性，而不是原型链上的枚举属性）对象的属性描述符以及相应的属性名称。这些属性对应`Object.defineProperties()`的第二个参数，**创建非空对象的属性描述符默认是为`false`的，而构造函数或字面量方法创建的对象属性的描述符默认为`true`**。

`new`关键词是通过构造函数来创建对象, 添加的属性是在自身实例下。
`Object.create()`创建对象的另一种方式，可以理解为继承一个对象, 添加的属性是在原型下。

```js
// new Object() 方式创建
var a = {  rep : 'apple' }
var b = new Object(a)
console.log(b) // {rep: "apple"}
console.log(b.__proto__) // {}
console.log(b.rep) // {rep: "apple"}

// Object.create() 方式创建
var a = { rep: 'apple' }
var b = Object.create(a)
console.log(b)  // {}
console.log(b.__proto__) // {rep: "apple"}
console.log(b.rep) // {rep: "apple"}
```

上面讲了这么多`Object.create`的知识，下面我们实现一下该方法：
```js
Object.prototype.mycreate = function(proto, propertiesObject) {
  function F() {};
  F.prototype = proto;
  const obj = new F();
  if(propertiesObject) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj
}
```
实现原理就是通过创建一个空构造函数并把其`prototype`指向传入的对象，最后返回该构造函数的实例。


## 实现`promise`
```js
const statusMap = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
}

class MyPromise{
  constructor(handler) {
    if(Object.prototype.toString.call(handler) !== '[object Function]') {
      throw new Error('the first parameter should be a function');
    }
    this.status = statusMap.PENDING;
    this.result = null;
    // 用于执行then方法
    this.fulfilledQueues = [];
    this.rejectedQueues = [];

    try{
      // 执行两个方法
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch(err) {
      this._reject(err);
    }
  }

  _resolve(val) {
    if(this.status !== statusMap.PENDING) return;

    const run = () => {
      this.status = statusMap.FULFILLED;
      this.result = val;
      let cb;
      while(cb = this.fulfilledQueues.shift()) {
        cb(val);
      }
    }
    setTimeout(() => run(), 0);
  }

  _reject(err) {
    if(this.status !== statusMap.PENDING) return;

    const run = () => {
      this.status = statusMap.REJECTED;
      this.result = err;
      let cb;
      while(cb = this.rejectedQueues.shift()) {
        cb(err);
      }
    }

    setTimeout(() => run(), 0);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejeceted) {
  const { status, result } = this;

  return new MyPromise((onFulfilledNext, onRejecetedNext) => {
    let fulfilled = value => {
      try {
        if(Object.prototype.toString.call(onFulfilled) !== '[object Function]') {
          onFulfilledNext(value);
        } else {
          let res = onFulfilled(value);

          // 返回结果还是MyPromise的实例
          if(res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejecetedNext);
          } else {
            onFulfilledNext(res);
          }
        }
      } catch(e) {
        onRejecetedNext(e);
      }
    }

    let rejected = error => {
      try {
        if(Object.prototype.toString.call(onRejeceted) !== '[Object Function]') {
          onRejecetedNext(error);
        } else {
          let res = onRejeceted(error);

          // 返回结果还是MyPromise的实例
          if(res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejecetedNext);
          } else {
            onFulfilledNext(res);
          }
        }
      } catch(e) {
        onRejecetedNext(e);
      }
    }

    switch(status) {
      case statusMap.PENDING:
        this.fulfilledQueues.push(fulfilled);
        this.rejectedQueues.push(rejected)
        break;

      case statusMap.FULFILLED:
        this.fulfilledQueues.push(fulfilled);
        break;
      
      case statusMap.REJECTED:
        this.rejectedQueues.push(rejected);
        break;
    }
  })
}
```

## 数组扁平化
Array的方法flat很多浏览器还未能实现，而且浏览器支持的flat方法不能处理嵌套的数组。写一个flat方法，实现扁平化嵌套数组。

```js
// 最简单的方案
Array.prototype.flat = function (arr) {
  return arr
    .toString()
    .split(',')
    .map((item) => +item);
};

Array.prototype.flat = function (arr) {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

```

## 数组去重

对于去除1次以上的重复item，可以使用`Set`。
```js
function delRepeat(arr) {
  return Array.from(new Set(arr));
}
```

但是去除2次以上就不能用`set`了。
```js
// 已知数组
var arr = [1,1,1,1,1,1,1,3,3,3,3,3,5,5];

// 方法一
function delRepeat(arr) {
  arr = arr.sort();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 2]) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}

// 方法二
function delRepeat(arr) {
  var newArr = [];
  var obj = {};
  arr.map((item) => {
    if (obj[item]) {
      obj[item] += 1;
    } else {
      obj[item] = 1;
    }
    obj[item] <= 2 ? newArr.push(item) : '';
  });
  return newArr;
}
```

## 实现冒泡排序

原理：比较两个相邻的元素，将值大的元素交换到右边.

流程：

依次比较相邻的两个数，将比较小的数放在前面，比较大的数放在后面。

1. 第一次比较：首先比较第一和第二个数，将小数放在前面，将大数放在后面。

2. 比较第2和第3个数，将小数 放在前面，大数放在后面。

2. ......

3. 如此继续，知道比较到最后的两个数，将小数放在前面，大数放在后面，重复步骤，直至全部排序完成

4. 在上面一趟比较完成后，最后一个数一定是数组中最大的一个数，所以在比较第二趟的时候，最后一个数是不参加比较的。

5. 在第二趟比较完成后，倒数第二个数也一定是数组中倒数第二大数，所以在第三趟的比较中，最后两个数是不参与比较的。

6. 依次类推，每一趟比较次数减少依次。

冒泡排序总的平均时间复杂度为：O(n2) ,时间复杂度和数据状况无关。

升序：
```js
function bubbleSort(array) {
  const length = array.length;
  for(let i = 0; i < length - 1; i++) {
    for(let j = 0; j < length - 1 - i; j++) {
      if(array[j] > array[j + 1]) {
        let temp = array[j + 1];
        array[j + 1] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}
```
对于降序而言就是将`if`判断中的条件改成 `array[j] < array[j + 1]`。

## 实现快速排序

流程：

1. 先从数列中取出一个数作为基准数

2. 分区过程，将比这个数大的数全放到它的右边，小于或等于它的数全放到它的左边

3. 再对左右区间重复第二步，直到各区间只有一个数

时间复杂度：

最好：O(n log_{2} n)
最坏：O(n^2)
平均：O(n log_{2} n)

```js
function quickSort(array, left, right) {
  let index;

  if(array.length > 1) {
    index = split(array, left, right);
    if(left < index - 1) {
      quickSort(array, left, index - 1);
    }
    if(index < right) {
      quickSort(array, index, right);
    }
  }
  return array;
}

function split(array, left, right) {
  let mid = array[(left + right) >> 1];
  while(left <= right) {
    while(array[left] < mid) {
      left++;
    }
    while(array[right] > mid) {
      right--;
    }
    if(left <= right) {
      swap(array, left, right);
      left++;
      right--;
    }
  }
  return left;
}

function swap(array, left, right) {
  let temp = array[right];
  array[right] = array[left];
  array[left] = temp;
}
```

## 插入排序

将数组的第一个数认为是有序数组，从后往前（从前往后）扫描该有序数组，把数组中其余`n-1`个数，根据数值的大小，插入到有序数组中，直至数组中的所有数有序排列为止。这样的话，`n`个元素需要进行`n-1`趟排序。

```js
function insertionSort(array) {
  const length = array.length;
  let prevIndex, current;
  // 从索引1开始
  for(let i = 1; i < length; i++) {
    prevIndex = i - 1;
    current = array[i];
    // 当前的值比前一个小
    while(prevIndex >= 0 && array[prevIndex] > current) {
      array[prevIndex + 1] = array[prevIndex];
      prevIndex--;
    }
    array[prevIndex + 1] = current;
  }
  return array;
}
```

**代码地址：[https://github.com/leopord-lau/EasyPresentation](https://github.com/leopord-lau/EasyPresentation)**
