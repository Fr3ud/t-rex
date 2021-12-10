varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
  vec3 color = vPosition;

  color = mix(uColor1, uColor2, vPosition.z * 0.5 + 0.5);
  gl_FragColor = vec4(color, 0.5);
}
