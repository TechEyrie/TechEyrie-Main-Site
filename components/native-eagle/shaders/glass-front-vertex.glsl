attribute float _thickness;
attribute float _peaks;
attribute vec3 tangent;

varying float vThickness;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vGlassColor;

#include <skinning_pars_vertex>

uniform float distancesFactor;
uniform float resetDistances;
uniform vec3 baseColor;
uniform vec3 peaksColor;
uniform float peaksFactor;

void main() {
  vThickness = mix(_thickness * distancesFactor, 0.1, resetDistances);
  vUv = uv;
  vGlassColor = mix(baseColor, peaksColor, clamp(_peaks * peaksFactor, 0., 1.));

  vec3 transformed = position;
  vec3 objectNormal = normal;
  vec3 objectTangent = tangent;

  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>

  vNormal = objectNormal;
  vTangent = objectTangent;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
  
}