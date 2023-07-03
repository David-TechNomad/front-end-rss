// deBounce
let deBounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
// throrrle
let throttle = (fn, delay) => {
  let flag = false;
  return function (...args) {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      fn(...args);
      flag = false;
    }, delay);
  };
};
// deepClone
let deepClone = (obj) => {
  let newObj;
  if (Object.prototype.toString.call(obj) === "[Object Object]") {
    newObj = Array.isArray ? [] : {};
    for (let key in obj) {
      newObj[key] =
        Object.prototype.toString.call(obj[key]) === "[Object Object]"
          ? deepClone(obj[key])
          : obj[key];
    }
  } else {
    newObj = obj;
  }
};
// instanceOf
let instance_of = (l, r) => {
  let o = r.prototype;
  l = l.__proto__;
  while (true) {
    if (l === null) return false;
    if (o === l) return true;
    l = l.__proto__;
  }
};
// mackNew
let mockNew = function () {
  let newObj = new Object();
  let fn = [].shift.call(arguments);
  newObj.__proto__ = fn.prototype;
  let res = fn.apply(newObj, arguments);
  return typeof res === "object" ? res : newObj;
};
// mockCreate
let mockCteate = function (obj) {
  function fn() {}
  fn.prototype = obj;
  return new fn();
};
// mockPromise
let mockPromise = function (resolve, reject) {
  this.status = "pending";
  this.msg = "";
  let self = this,
    process = arguments[0];
  process(
    function () {
      self.status = "fulfilled";
      self.msg = arguments[0];
    },
    function () {
      self.status = "rejected";
      self.msg = arguments[0];
    }
  );
  return this;
};
mockPromise.prototype.then = function (resolve, reject) {
  if (this.status === "fulfilled") {
    arguments[0](this.msg);
  }
  if (this.status === "rejected") {
    arguments[1](this.msg);
  }
};
let test = new mockPromise(function (resolve, reject) {
  resolve("test");
});
test.then(
  function (res) {
    console.log(res);
    console.log("is ok");
  },
  function (res) {
    console.log(res);
    console.log("is no ok");
  }
);
mockPromise.all = function (promises) {
  new mockPromise((resolve, reject) => {
    let res = [],
      index = 0;
    for (let i = 0; i < promises.length; i++) {
      promises[i].then((val) => {
        index++;
        res[i] = val;
        if (index === promises.length) {
          resolve(res);
        }
      }, reject);
    }
  });
};
mockPromise.all = function (promises) {
  new mockPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
Array.prototype.mockSome = function (fn, val) {
  if (typeof fn !== "function") {
    return false;
  }
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    let res = fn.call(val, arr[i], i, arr);
    if (res) return true;
  }
  return false;
};
Array.prototype.mockEvery = function (fn, val) {
  if (typeof fn !== "function") {
    return false;
  }
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    let res = fn.call(val, arr[i], i, arr);
    if (!res) return false;
  }
  return true;
};
Array.prototype.mockFlat = function (dep = 1) {
  return this.reduce((acc, item) => {
    acc.concat(
      Array.isArray(item) && dep > 0
        ? item.mockFlat(--dep)
        : Array.isArray(item)
        ? [item]
        : item
    );
  }, []);
};
class mockEvent {
  constructor() {
    this._events = this._events || new Map();
    this._maxListenners = this._maxListenners || 10;
  }
  emit(type, ...args) {
    let handler = null;
    handler = this._events.get(type);
    if (args.length > 0) {
      handler.apply(this, args);
    } else {
      handler.call(this, args);
    }
  }
  addListnner(type, fn) {
    if (!this._events.get(type)) {
      this._events.get(type, fn);
    }
  }
}
// 实例化
const emitter = new mockEvent();

// 监听一个名为arson的事件对应一个回调函数
emitter.addListener("arson", (man) => {
  console.log(`expel ${man}`);
});

// 我们触发arson事件,发现回调成功执行
emitter.emit("arson", "low-end"); // expel low-end
// binarySearch
function binarySearch(arr, target) {
  let max = arr.length - 1,
    min = 0;
  while (min <= max) {
    let min = Math.floor((max + min) / 2);
    if (target < arr[min]) {
      max = min--;
    } else if (target < arr[min]) {
      min = min++;
    } else {
      return min;
    }
  }
  return -1;
}
// mergeSort
let mergeSort = (arr) => {
  let len = arr.length;
  if (len < 2) return arr;
  let mid = Math.floor(len / 2),
    left = arr.slice(0, mid),
    right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
  function merge(left, right) {
    let res = [];
    while (left.length && right.length) {
      if (left[0] <= right[0]) {
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }
    while (left.length) {
      res.push(left.shift());
    }
    while (right.length) {
      res.push(right.shift());
    }
    return res;
  }
};
// bubleSort
let bubleSort = function (arr) {
  let temp,
    len = arr.length - 1,
    flagIndex = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let isSorted = true;
    for (let j = 0; j < len; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        flagIndex = j;
        isSorted = false;
      }
    }
    len = flagIndex;
    if (isSorted) break;
  }
  return arr;
};
