#define pi 3.14159265358979323846

varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPosition;
varying float vThickness;
varying vec2 vUv;
varying vec3 vGlassColor;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform float envReflection;
uniform sampler2D map;
uniform float colorFactor;
uniform float iorStart;
uniform float iorDelta;
uniform float reflectionIridescence;
uniform float colorBoost;
uniform float decayFactor;
uniform float maxColorValue;
uniform float useTransmittance;
uniform float fringeCurve;
uniform float fringeMix;
uniform vec3 fringeColor;
uniform float colorCurve;
uniform float colorCurveR;
uniform float colorCurveG;
uniform float colorCurveB;

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
  float cosTheta = abs(dot(ray, normal));
  return 0.04 + 0.96 * pow(1. - cosTheta, 5.);
}

void main() {
  vec3 normal = getNormal();
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  vec3 refraction = refract(viewDirection, normal, 1. / iorStart);
  vec4 clip = projectionMatrix * viewMatrix * vec4(vPosition + refraction * vThickness, 1.0);
  clip.xy /= 1.25;
  vec2 uv = saturate(clip.xy / clip.w * 0.5 + 0.5);

  float transmittance = 1. - useTransmittance * fresnelSchlick(refraction, normal);

  vec3 color = texture2D(map, uv).rgb * transmittance;

  float fringeness = fringeMix * pow(saturate(1. - abs(dot(viewDirection, normal))), fringeCurve);
  color = mix(color, fringeColor, fringeness);

  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = (color - luminance) * colorBoost + luminance;
  color = max(color, 0.);

  float decay = exp(-vThickness * decayFactor);
  color *= mix(vGlassColor, vec3(1.), decay);

  vec3 iridescence = getIridescence(viewDirection, normal) - 1.; 
  iridescence = reflectionIridescence * iridescence + 1.;

  color *= colorFactor;
  if (color.r < 1.) {
    color.r = pow(color.r, colorCurve * colorCurveR);
  }
  if (color.g < 1.) {
    color.g = pow(color.g, colorCurve * colorCurveG);
  }
  if (color.b < 1.) {
    color.b = pow(color.b, colorCurve * colorCurveB);
  }

  float fresnel = fresnelSchlick(viewDirection, normal);
  vec3 ray = reflect(viewDirection, normal);
  color += getEnvColor(ray) * envReflection * fresnel * iridescence;

  color = clamp(color, 0., maxColorValue);

  gl_FragColor = vec4(color, 1.0);
}