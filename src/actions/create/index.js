
const path = require('path');
const chalk = require('chalk');
const ejs = require('ejs');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const cwd = process.cwd();
const hasSpace = /\s/g;
// const fromDir = __dirname;
// const toDir = path.join(cwd, );

function putFiles(from, output, answer) {
  fse.copy(from, output)
  .then(() => {
    return new Promise((res, rej) => {
      const htmlPath = path.join(output, 'index.html');
      ejs.renderFile(htmlPath, answer, {}, (err, str) => {
        if (err) {
          console.log(err);
          rej(err);
        } else {
          fs.writeFile(htmlPath, str, 'utf8', () => {
            res(str);
            console.log('success');
          });
        }
      });
    });
  })
  .catch(err => {
    console.log('fail', err);
  });
}

module.exports = function(argv, rename) {
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: `${rename ? '重新' : ''}输入demo的名字，${chalk.yellow('例如: nosie-wave')}`,
      validate: function(input) {
        return !hasSpace.test(input);
      },
    },
  ]).then(answer => {
    const from = path.isAbsolute(argv.from) ? argv.from : path.join(cwd, argv.from);
    const output = path.isAbsolute(argv.output) ? path.join(argv.output, answer.name) : path.join(cwd, argv.output, answer.name);

    if (!fs.existsSync(output)) {
      putFiles(from, output, answer);
    } else {
      inquirer.prompt([
        {
          name: 'sure',
          type: 'confirm',
          message: `该目录已经存在，${chalk.red('确定覆盖: ' + answer.name) + ' ?'}`,
        },
      ]).then(ensure => {
        if (ensure.sure) {
          putFiles(from, output, answer);
        } else {
          module.exports(argv, true);
        }
      });
    }
  });
};
