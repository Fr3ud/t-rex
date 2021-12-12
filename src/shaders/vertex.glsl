varying vec3 vPosition;

uniform float uTime;

void main() {
  vPosition = position;

  vec3 pos = position;
  pos.x += sin(uTime) * 0.01;
  pos.y += cos(uTime) * 0.01;
  pos.z += cos(uTime) * 0.01;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}
