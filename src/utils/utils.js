
const chalk = require('chalk');
const updateNotifier = require('update-notifier');

exports.updateCheck = function() {
  const pkg = require('../../package.json');
  const notifier = updateNotifier({pkg});

  if (notifier.update) {
    console.log(chalk.gray(' (current: ' + notifier.update.current + ')'));
  }
};
