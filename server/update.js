const fs = require("fs");
const path = require("path");
const async = require("async");
const moment = require("moment");
const Parser = require("rss-parser");
const Git = require("simple-git");
const _ = require("underscore");
const cloneDeep = require("clone-deep");

const utils = require("./utils");
const writemd = require("./writemd");
const fetch = require("./fetch");

const {
  RESP_PATH,
  RSS_PATH,
  LINKS_PATH,
  TAGS_PATH,
  README_PATH,
  README_TEMPLATE_PATH,
  TAGS_MD_PATH,
  TAGS_TEMPLATE_PATH,
  TIMELINE_MD_PATH,
  TIMELINE_TEMPLATE_PATH,
} = utils.PATH;

let rssJson = [];
let linksJson = [];

// 本次更新的 rss 和链接数据
let newData = {
  length: 0,
  titles: [],
  rss: {},
  links: {},
};

/**
 * 更新 git 仓库
 */
function handlerUpdate() {
  console.log(utils.getNowDate() + " - 开始更新抓取");

  Git(RESP_PATH).pull().exec(handlerFeed);
}

/**
 * 提交修改到 git 仓库
 */
function handlerCommit() {
  console.log(utils.getNowDate() + " - 完成抓取，即将上传");

  Git(RESP_PATH)
    .add("./*")
    .commit("更新: " + newData.titles.join("、"))
    .push(["-u", "origin", "main"], () => console.log("完成抓取和上传！"));
}

/**
 * 处理订阅源
 */
function handlerFeed() {
  rssJson = require(RSS_PATH);
  linksJson = require(LINKS_PATH);

  newData = {
    length: 0,
    titles: [],
    rss: {},
    links: {},
  };

  let parallels = [];

  rssJson.forEach((item, index) => {
    let jsonItem = linksJson[index] || {};

    parallels.push(function (cb) {
      fetch(newData, linksJson, index, jsonItem, item, cb);
    });
  });

  async.parallel(parallels, (err, result) => {
    if (newData.length) {
      fs.writeFileSync(LINKS_PATH, JSON.stringify(result, null, 2), "utf-8");
      writemd(newData);
      handlerCommit();
    } else {
      console.log(utils.getNowDate() + " - 无需更新");
    }
  });
}
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = Array.prototype.slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function () {
    _args.push(...arguments);
    return _adder;
  };

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b;
    });
  };
  return _adder;
}
function add() {
  let args = [...arguments];
  let adder = (...newArgs) => {
    args.push(...newArgs);
    return args;
  };
  adder.toString = () => {
    return args.reduce((a, b) => a + b);
  };
}
module.exports = handlerUpdate;
