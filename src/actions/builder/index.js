
const glob = require('glob');
const path = require('path');
const glsl = require('rollup-plugin-glsl');
const rollup = require('rollup');
const cwd = process.cwd();

function getStudios(argv) {
  const studios = glob.sync(argv.glob, {
    ignore: 'node_modules/**',
  });
  return studios;
}

function complieGLSL(argv, studio) {
  const studioDir = path.join(cwd, studio);
  const entry = path.join(studioDir, argv.entry);
  const output = path.join(studioDir, argv.output, argv.entry);
  return rollup.rollup({
    input: entry,
    plugins: [
      glsl({
        include: 'demos/**/*.glsl',
      }),
    ],
  }).then(bundle => {
    return bundle.write({
      file: output,
      format: 'es',
      globals: ['THREE'],
    });
  }).catch(e => {
    console.log(e);
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
