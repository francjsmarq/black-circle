/**
 * BLACK CIRCLE — shader procedural do buraco negro (versão cinematográfica).
 * Backdrop fullscreen: campo de estrelas com gravitational lensing, disco de
 * acreção com iluminação assimétrica (efeito Doppler, à Interstellar), photon
 * ring, e rajada de streaks radiais na travessia do portal. O grão de filme,
 * o bloom real e a aberração cromática de câmara ficam a cargo do
 * post-processing (ver components/intro/BlackHoleCanvas.tsx).
 *
 * uProgress (0 → 1) percorre toda a sequência cinematográfica:
 *   0.00–0.07  escuridão
 *   0.07–0.26  poeira cósmica surge
 *   0.26–0.52  formação do círculo + anel de energia
 *   0.52–0.76  aproximação (zoom, distorção, intensidade)
 *   0.76–0.90  revelação do símbolo (estável)
 *   0.90–1.00  travessia do portal (streaks + flash + preto)
 */

export const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uMouse;      // -1..1 parallax
  uniform vec2  uRes;
  uniform float uQuality;    // 1.0 completo, 0.0 simplificado
  uniform float uAmbient;    // 1.0 = modo "presença viva" da homepage

  // ---------- utilitários ----------
  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.15;
      a *= 0.52;
    }
    return v;
  }

  // fbm com domain warp — dá filamentos mais orgânicos ao anel
  float fbmWarp(vec2 p) {
    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2)), fbm(p + 3.2 * q + vec2(8.3, 2.8)));
    return fbm(p + 3.8 * r);
  }

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float phase(float a, float b, float x) {
    return smoothstep(a, b, x);
  }

  // Campo de estrelas / poeira metálica em camadas
  float stars(vec2 uv, float density, float t) {
    float acc = 0.0;
    for (float i = 1.0; i <= 3.0; i++) {
      vec2 p = uv * (18.0 * i) + vec2(i * 47.3, i * 91.7);
      p *= rot(t * 0.008 * i);
      vec2 g = floor(p);
      vec2 f = fract(p) - 0.5;
      float h = hash21(g);
      if (h < density / i) {
        vec2 off = (vec2(hash21(g + 3.1), hash21(g + 7.7)) - 0.5) * 0.7;
        float d = length(f - off);
        float tw = 0.75 + 0.25 * sin(t * (0.6 + h * 2.0) + h * 40.0);
        acc += smoothstep(0.06, 0.0, d) * tw * (0.5 + 0.5 * h) / i;
      }
    }
    return acc;
  }

  // Amostra a cena (fundo + estrelas) num uv já "dobrado" pela gravidade
  vec3 scene(vec2 suv, float dust, float t) {
    // fundo: preto ligeiramente elevado com nebulosa quase invisível
    float neb = fbm(suv * 1.4 + vec2(0.0, t * 0.01)) * 0.035;
    vec3 col = vec3(0.012, 0.012, 0.014) + vec3(neb * 0.9, neb * 0.9, neb);
    // poeira / fragmentos metálicos
    float s = stars(suv, 0.14, t) * dust;
    col += vec3(0.92, 0.91, 0.88) * s * 0.85;   // branco frio / prata
    col += vec3(0.63, 0.55, 0.40) * s * 0.10;   // toque metálico
    return col;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * uRes) / min(uRes.x, uRes.y);
    float t = uTime;
    float P = uProgress;

    // ---------- fases ----------
    float pDust    = phase(0.07, 0.26, P);
    float pForm    = phase(0.26, 0.52, P);
    float pNear    = phase(0.52, 0.76, P);
    float pEnter   = phase(0.90, 1.00, P);

    // ---------- câmara (zoom do backdrop; a aproximação real é feita pela câmara 3D das partículas) ----------
    float zoom = mix(1.0, 0.5, pNear);
    zoom = mix(zoom, 0.05, pEnter * pEnter);
    uv *= zoom;
    uv += uMouse * 0.028 * zoom;

    // modo ambiente (homepage): círculo pequeno, calmo, sem drama
    if (uAmbient > 0.5) {
      pDust = 1.0; pForm = 1.0; pNear = 0.0; pEnter = 0.0;
      uv *= 1.65;
      uv += uMouse * 0.02;
    }

    float d = length(uv);

    // ---------- geometria do buraco ----------
    float holeR = mix(0.0001, 0.155, pForm);
    holeR *= 1.0 + 0.012 * sin(t * 0.7);

    // ---------- gravitational lensing ----------
    float mass = holeR * holeR * (2.6 + 2.6 * pNear);
    float dd = max(d * d, 0.0006);
    float dust = pDust * (0.85 + 0.35 * pNear);

    vec3 bg;
    if (uQuality > 0.5) {
      float bendR = mass / dd * 0.996;
      float bendG = mass / dd;
      float bendB = mass / dd * 1.004;
      bg.r = scene(uv * (1.0 + bendR), dust, t).r;
      bg.g = scene(uv * (1.0 + bendG), dust, t).g;
      bg.b = scene(uv * (1.0 + bendB), dust, t).b;
    } else {
      bg = scene(uv * (1.0 + mass / dd), dust, t);
    }

    vec3 col = bg;

    // ---------- anel de acreção ----------
    vec2 auv = uv * vec2(1.0, 1.28);
    float ad = length(auv);
    float ang = atan(auv.y, auv.x);

    // ruído periódico em ângulo (cos/sin) para não haver costura onde atan() dá a volta
    float a2 = ang + t * 0.1;
    vec2 swirlP = vec2(cos(a2), sin(a2)) * 2.6 + vec2(ad * 9.0 - t * 0.4);
    float swirlDetail = uQuality > 0.5 ? fbmWarp(swirlP) : fbm(swirlP);

    float ring = smoothstep(holeR * 2.5, holeR * 1.1, ad)
               * smoothstep(holeR * 0.97, holeR * 1.16, ad);
    ring *= (0.4 + 0.85 * swirlDetail) * pForm;
    ring *= 1.0 + 1.1 * pNear;

    // photon ring: linha fina e brilhante junto ao horizonte
    float photon = smoothstep(0.016, 0.0, abs(d - holeR * 1.055)) * pForm;
    photon *= 0.85 + 0.6 * pNear;

    // ---------- iluminação assimétrica (efeito Doppler / beaming) ----------
    // um lado do disco "aproxima-se" da câmara e brilha muito mais quente/branco;
    // o lado oposto "afasta-se", mais escuro e âmbar-bronze. Sem neons — só
    // contraste de temperatura, como um disco de acreção real seria observado.
    float side = 0.5 + 0.5 * sin(ang + 1.1);           // 0 = lado escuro, 1 = lado brilhante
    float beaming = pow(side, 1.6);
    vec3 hot   = vec3(0.90, 0.89, 0.85);                // prata quente, não branco solar
    vec3 warm  = vec3(0.68, 0.58, 0.42);                // champagne / âmbar metálico
    vec3 dim   = vec3(0.27, 0.24, 0.21);                // bronze escuro, sem cair a preto
    vec3 ringCol = mix(dim, mix(warm, hot, beaming), 0.4 + 0.6 * beaming);
    float ringIntensity = mix(0.6, 1.15, beaming);

    col += ringCol * ring * 0.55 * ringIntensity;
    col += hot * photon * (0.6 + 0.5 * beaming);

    // brilho difuso controlado à volta do círculo (glow)
    float glow = exp(-abs(d - holeR * 1.4) * 8.5) * pForm * 0.16 * (1.0 + pNear);
    col += mix(warm, hot, beaming) * glow;

    // reflexos metálicos a atravessar (aproximação)
    if (uQuality > 0.5) {
      float streak = smoothstep(0.5, 0.0, abs(fract(uv.x * 2.0 + uv.y * 0.6 + t * 0.35) - 0.5))
                   * smoothstep(0.0, 0.35, pNear) * 0.035 * (1.0 - pEnter);
      col += vec3(0.9, 0.9, 0.92) * streak * smoothstep(holeR * 3.5, holeR * 1.4, d);
    }

    // ---------- horizonte de eventos: mais escuro que o fundo ----------
    float horizon = smoothstep(holeR * 1.02, holeR * 0.9, d);
    col = mix(col, vec3(0.0), horizon);

    // vinheta suave (a vinheta principal fica no post-processing)
    col *= 1.0 - 0.22 * smoothstep(0.4, 1.2, d);

    // ---------- rajada de streaks radiais na travessia (efeito "warp") ----------
    float warpNoise = noise(vec2(ang * 46.0, floor(t * 3.0)));
    float streaksBurst = smoothstep(0.52, 1.0, warpNoise) * pEnter * pEnter;
    col += vec3(0.97, 0.95, 0.91) * streaksBurst * 0.55;

    // ---------- flash final da travessia ----------
    float flash = smoothstep(0.90, 0.965, P) * (1.0 - smoothstep(0.965, 1.0, P));
    col += vec3(0.88, 0.87, 0.84) * flash * 0.5;
    col *= 1.0 - smoothstep(0.955, 1.0, P);

    // escuridão inicial (Cena 1: silêncio visual total)
    float dark = phase(0.02, 0.10, P);
    if (uAmbient > 0.5) dark = 1.0;
    col *= dark;

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;
