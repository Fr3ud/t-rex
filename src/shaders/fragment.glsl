varying vec3 vPosition;

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);
  color = vPosition;

  gl_FragColor = vec4(color, 1.0);
}
