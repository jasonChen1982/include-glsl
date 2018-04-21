#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');
const yargs = require('yargs');
const utils = require('./utils/utils');

utils.updateCheck();

yargs
.commandDir('cmds')
.demandCommand()
.version(pkg.version)
.help('h')
.alias('h', 'help')
.wrap(80)
.argv;
