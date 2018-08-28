
const glsl = require('glslify');

console.log(glsl(`
precision mediump float;
varying vec3 vpos;
void main () {
  gl_FragColor = vec4(noise(vpos*25.0),1);
}
`));
