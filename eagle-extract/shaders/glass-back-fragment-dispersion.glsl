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
uniform sampler2D noiseMap;
uniform float envRefraction;
uniform float iorStart;
uniform float iorDelta;
uniform float refractionIridescence;
uniform float uvShiftFactor;
uniform float fringeCurve;
uniform float fringeMix;
uniform vec3 fringeColor;
uniform float seconds;
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

  vec3 refractionA = refract(viewDirection, normal, 1. / iorStart);
  vec3 refractionB = refract(viewDirection, normal, 1. / (iorStart + iorDelta));

  float transmittance = 1. - useTransmittance * fresnelSchlick(refractionA, normal);

  vec4 clipA = projectionMatrix * viewMatrix * vec4(vPosition + refractionA * vDist, 1.0);
  clipA.xy /= 1.25;
  vec4 clipB = projectionMatrix * viewMatrix * vec4(vPosition + refractionB * vDist, 1.0);
  clipB.xy /= 1.25;

  vec2 uvA = saturate(clipA.xy / clipA.w * 0.5 + 0.5);
  vec2 uvB = saturate(clipB.xy / clipB.w * 0.5 + 0.5);
  vec2 dUv = (uvB - uvA) * uvShiftFactor;
  vec2 noiseUv = fract(uvA * 777. + seconds);

  vec3 color = vec3(0.0);
  vec3 palAccum = vec3(0.0);

  float dq = 1. / float(samplesCount);
  float blue = texture2D(noiseMap, noiseUv).r;
  float mixFactor = blue * dq;
  vec2 uv;
  vec3 ray, texel, pal;
  float fringeness = pow(saturate(1. - abs(dotNormalView)), fringeCurve) * fringeMix;

  #pragma unroll_loop_start
  for (int i = 0; i < samplesCount; i++) {
    uv = uvA + dUv * mixFactor;
    texel = texture2D(map, uv).rgb;

    ray = normalize(mix(refractionA, refractionB, mixFactor));
    if (envRefraction > 0.) {
      texel += getEnvColor(ray) * envRefraction;
    }

    pal = mixToColor(mixFactor);
    palAccum += pal;

    texel = mix(texel, fringeColor, fringeness);
    color += texel * pal * transmittance * (1. + vCurvature * abs(dot(ray, normal)));
    mixFactor += dq;
  }
  #pragma unroll_loop_end

  color /= palAccum;

  vec3 iridescence = getIridescence(refractionA, normal) - 1.; 
  color *= refractionIridescence * iridescence + 1.;

  gl_FragColor = vec4(color, 1.0);
}
