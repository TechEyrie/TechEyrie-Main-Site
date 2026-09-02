#define pi 3.14159265358979323846

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying float vDist;
varying float vCurvature;
varying vec2 vUv;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D map;
uniform float envRefraction;
uniform float iorStart;
uniform float iorDelta;
uniform float refractionIridescence;
uniform float fringeCurve;
uniform float fringeMix;
uniform vec3 fringeColor;
uniform float useTransmittance;

uniform sampler2D envMap;

#define oneOverPi 0.3183098861837907
vec3 getEnvColor(vec3 ray) {
  vec2 uv = vec2(atan(ray.x, ray.z) * 0.5, asin(ray.y));
  uv = uv * oneOverPi + 0.5;
  uv.x = fract(uv.x);
  vec3 color = texture2D(envMap, uv).rgb;
  color = 1. - exp(-0.1 * color);
  return color;
}
uniform sampler2D colorsMap;

vec3 boostSaturation(vec3 rgb, float boost) {
  float maxC = max(rgb.r, max(rgb.g, rgb.b));
  float minC = min(rgb.r, min(rgb.g, rgb.b));
  float S = (maxC > 1e-6) ? ((maxC - minC) / maxC) : 0.;
  float Sp = clamp(S * boost, 0., 1.);
  float ratio = (S > 1e-6) ? (Sp / S) : 0.;
  return clamp(maxC - (maxC - rgb) * ratio, 0., 1.);
}

vec3 mixToColor(float f) {
  return texture2D(colorsMap, vec2(f, 0.)).rgb;
}

vec3 getIridescence(vec3 rd, vec3 n) {
  float thickness = 1. - abs(dot(n, rd));
  return texture2D(colorsMap, vec2(thickness * 0.3 + 0.08, 1.)).rgb;
}
#ifdef USE_NORMAL_MAP
  uniform sampler2D normalMap;
#endif

vec3 getNormal() {
  vec3 N = normalize(vNormal);
  #ifdef USE_NORMAL_MAP
    vec2 uv = vUv;
    vec3 mapN = normalize(texture2D(normalMap, uv).xyz * 2.0 - 1.0);
    vec3 T = normalize(vTangent);
    vec3 B = normalize(cross(N, T));
    mat3 tbn = mat3(T, B, N);
    vec3 newN = normalize(tbn * mapN);
    return normalize(mat3(modelMatrix) * newN);
  #else
    return normalize(mat3(modelMatrix) * N);
  #endif
}

float fresnelSchlick(vec3 ray, vec3 normal) {
  float cosTheta = abs(dot(normalize(ray), normal));
  float r0 = 0.04;
  return r0 + (1. - r0) * pow(1. - cosTheta, 5.);
}

void main() {
  vec3 normal = getNormal();
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float dotNormalView = dot(normal, viewDirection);

  vec3 refraction = refract(viewDirection, normal, 1. / iorStart);

  float transmittance = 1. - useTransmittance * fresnelSchlick(refraction, normal);

  vec4 clip = projectionMatrix * viewMatrix * vec4(vPosition + refraction * vDist, 1.0);
  clip.xy /= 1.25;
  vec2 uv = saturate(clip.xy / clip.w * 0.5 + 0.5);

  vec3 color = vec3(0.);
  float fringeness = pow(saturate(1. - abs(dotNormalView)), fringeCurve) * fringeMix;

  vec3 texel = texture2D(map, uv).rgb;

  vec3 ray = normalize(refraction);
  if (envRefraction > 0.) {
    texel += getEnvColor(ray) * envRefraction;
  }

  texel = mix(texel, fringeColor, fringeness);
  color += texel * transmittance * (1. + vCurvature * abs(dot(ray, normal)));

  vec3 iridescence = getIridescence(refraction, normal) - 1.; 
  color *= refractionIridescence * iridescence + 1.;

  gl_FragColor = vec4(color, 1.0);
}