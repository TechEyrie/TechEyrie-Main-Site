attribute float _dist;
attribute float _convexity;
attribute float _concavity;
attribute vec3 tangent;

#include <skinning_pars_vertex>

varying float vDist;
varying float vCurvature;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec2 vUv;

uniform float convexityFactor;
uniform float concavityFactor;
uniform float distancesFactor;
uniform float resetDistances;

#define defaultDist 2.

void main() {
  float dist = _dist;
#ifdef USE_DEFAULT_DIST
  dist = defaultDist;
#endif
  vDist = mix(dist * distancesFactor, 0.1, resetDistances);
  vCurvature = _convexity * convexityFactor - _concavity * concavityFactor;
  vUv = uv;

  vec3 transformed = position;
  vec3 objectNormal = normal;
  vec3 objectTangent = tangent;

  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vNormal = -objectNormal;
  vTangent = objectTangent;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
  gl_Position.xy /= 1.25;
}