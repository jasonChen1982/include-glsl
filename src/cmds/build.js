'use strict';

const chokidar = require('chokidar');
const path = require('path');
const builder = require('../actions/builder/index');
const cwd = process.cwd();

exports.command = 'build';
exports.desc = '构建studio的源代码并生成shader文件到js目录';
exports.builder = yargs => {
  return yargs
    .option('entry', {
      alias: 'e',
      describe: '入口文件',
      default: './shader.js',
    })
    .option('output', {
      alias: 'o',
      describe: '输出目录',
      default: '../js',
    })
    .option('glob', {
      alias: 'g',
      describe: '具体监听哪些目录',
      default: '**/studio/*',
    })
    .option('watch', {
      alias: 'w',
      describe: '是否监听文件变动',
      default: false,
    })
    .option('root', {
      alias: 'r',
      describe: '监听的根目录',
      default: './demos',
    });
};
exports.handler = function(argv) {
  const {watch, root, glob} = argv;
  if (watch) {
    const rootDir = path.join(cwd, root);
    const watcher = chokidar.watch(glob, {
      cwd: rootDir,
    });
    watcher.on('change', file => {
      const studio = path.dirname(path.join(root, file));
      builder(argv, studio);
    });
    watcher.on('ready', () => {
      watcher.on('add', file => {
        const studio = path.dirname(path.join(root, file));
        builder(argv, studio);
      });
    });
  }
  builder(argv);
};
