
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const includeReg = /['"]#include\s+<(\w+)>;?['"]/;
const includesReg = /['"]#include\s+<(\w+)>;?['"]/g;

function getStudios(argv) {
  const files = glob.sync(argv.glob);
  const studios = [];
  files.forEach(file => {
    const dir = path.dirname(file);
    if (studios.indexOf(dir) === -1) studios.push(dir);
  });
  return studios;
}

function complieGLSL(argv, studio) {
  return new Promise((resolve, reject) => {
    const studioDir = path.join(cwd, studio);
    const entry = path.join(studioDir, argv.entry);
    const output = path.join(studioDir, argv.output, argv.entry);

    try {
      const rawShader = fs.readFileSync(entry, {encoding: 'utf-8'});
      let shaderString = rawShader;
      const includes = rawShader.match(includesReg);
      const includeMap = includes.map(include => {
        const filename = include.match(includeReg)[1];
        const file = path.join(studioDir, filename + '.glsl');
        return {
          include,
          file,
        };
      });
      includeMap.forEach(config => {
        const glsl = fs.readFileSync(config.file, {encoding: 'utf-8'});
        shaderString = shaderString.replace(config.include, JSON.stringify(glsl));
      });

      fs.writeFile(output, shaderString, function(err) {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
}

function processStudios(argv, studios) {
  return Promise.all(studios.map(studio => {
    return complieGLSL(argv, studio);
  }));
}

module.exports = function(argv, studio) {
  const studios = studio !== undefined ? [studio] : getStudios(argv);
  processStudios(argv, studios).then(() => {
    console.log('compile success');
  });
};
