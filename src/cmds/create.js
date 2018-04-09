'use strict';

const creater = require('../actions/create/index');
const path = require('path');
const cwd = process.cwd();
const from = path.join(__dirname, '../actions/create/template');
const output = path.join(cwd, './demos');

exports.command = 'create';
exports.desc = '初始化一个demo模版到相应的分类';
exports.builder = yargs => {
  return yargs
    .option('from', {
      alias: 'f',
      describe: '入口文件',
      default: from,
    })
    .option('output', {
      alias: 'o',
      describe: '输出目录',
      default: output,
    });
};
exports.handler = function(argv) {
  creater(argv);
};
