# BLACK CIRCLE — Website institucional

Presença digital de um grupo empresarial privado. Intro cinematográfica 3D totalmente procedural (um único shader GLSL: gravitational lensing, anel de acreção, poeira cósmica), homepage editorial dark-luxury, smooth scroll, cursor personalizado e animações GSAP.

**Stack:** Next.js 14 · React 18 · TypeScript · Tailwind CSS · Three.js · React Three Fiber · GSAP + ScrollTrigger · Lenis · GLSL

**Zero assets externos** — tudo é gerado por código (shader, texturas CSS, áudio WebAudio, favicon SVG).

---

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm start          # servir o build
```

---

## Onde editar cada coisa

| O quê | Ficheiro |
|---|---|
| **Todos os textos** (hero, secções, manifesto, contactos, footer) | `lib/content.ts` |
| **Comportamento da intro** (duração, versão curta em visitas repetidas) | `lib/config.ts` |
| **Cores, tipografia, espaçamentos** | `tailwind.config.ts` + `app/globals.css` |
| **Shader do buraco negro** (fases, cores, intensidade) | `shaders/blackhole.ts` |
| **Áudio da intro** | `lib/audio.ts` |
| **SEO / Open Graph / schema** | `app/layout.tsx` + `lib/content.ts` (`site`) |

### Substituir o logótipo
1. **Favicon:** substitui `public/favicon.svg` (mantém o nome).
2. **Marca na nav/footer:** o símbolo é o `<span>` circular em `components/home/Nav.tsx` e `Footer.tsx` — troca por `<img src="/logo.svg" ... />` com o teu ficheiro em `public/`.
3. **Intro:** o símbolo é gerado pelo shader. Para sobrepor o teu logótipo real na Cena 4, adiciona um `<img>` dentro do bloco "Revelação tipográfica" em `components/intro/IntroExperience.tsx`.

### Substituir o áudio
`lib/audio.ts` gera um rumble procedural. Para usares um ficheiro real (`public/audio/rumble.ogg`), substitui a classe `DeepRumble` por um wrapper de `<audio loop>` mantendo a mesma API (`start`, `stop`, `setIntensity`). Continua a nunca fazer autoplay — só após clique no controlo de som.

### Ligar o formulário "Request Access"
Em `components/home/Contact.tsx`, dentro de `onSubmit`, liga o teu endpoint (API route do Next, Formspree, Resend, Supabase…). O comentário no código indica o ponto exato.

### Repor a intro completa (testes)
A intro completa mostra-se na 1.ª visita; depois usa a versão curta (`localStorage`). Para testar de novo: DevTools → Application → Local Storage → apaga `bc_intro_seen`. Para desativar este comportamento: `fullOnlyOnFirstVisit: false` em `lib/config.ts`.

---

## Intro — como funciona

`components/intro/IntroExperience.tsx` orquestra uma timeline GSAP que anima `uProgress` (0→1) partilhado por três camadas em conjunto:

1. **`shaders/blackhole.ts`** — backdrop fullscreen: gravitational lensing, disco de acreção com iluminação assimétrica tipo Interstellar (lado que "se aproxima" fica branco-quente, lado que "se afasta" fica bronze escuro — efeito Doppler, sem neons), photon ring, streaks radiais na travessia.
2. **`components/intro/Particles.tsx`** — campo real de poeira em 3D que a câmara atravessa fisicamente (não é um truque 2D), dando profundidade e movimento genuínos.
3. **`components/intro/CameraRig.tsx`** — câmara real com dolly para a frente, "punch" de FOV (efeito hyperspace) na travessia e um roll subtil na aproximação.

Post-processing real via `@react-three/postprocessing` (`components/intro/BlackHoleCanvas.tsx`): **Bloom** (brilho cinematográfico), **Chromatic Aberration** dinâmica (cresce com a aproximação e explode na travessia), **Vignette** e **film grain**. Desativado automaticamente em dispositivos de baixo desempenho para preservar a fluidez.

| Progresso | Cena |
|---|---|
| 0.00–0.07 | Escuridão total |
| 0.07–0.26 | Poeira cósmica surge |
| 0.26–0.52 | Formação do círculo + anel de energia |
| 0.52–0.76 | Aproximação (dolly da câmara, lensing, aberração cromática crescente) |
| 0.76–0.90 | Revelação — "BLACK CIRCLE / NOT EVERYONE GETS IN" |
| 0.90–1.00 | Travessia do portal — FOV punch, streaks, flash → homepage |

Interações: **clique/scroll/toque** acelera até ao fim · **Skip Intro** salta · **Esc** salta · parallax do cursor · som opt-in.

Para afinar a intensidade (bloom, aberração cromática, velocidade das partículas, cores do disco), os valores estão comentados em `shaders/blackhole.ts`, `components/intro/Particles.tsx`, `components/intro/CameraRig.tsx` e no `EffectsRig` dentro de `components/intro/BlackHoleCanvas.tsx`.

## Performance & fallbacks

- Intro carregada por `dynamic import` (Three.js fora do bundle inicial — First Load JS ≈ 145 kB).
- DPR limitado a 1.75; dispositivos fracos (poucos cores/memória/mobile) usam o shader simplificado (`uQuality = 0`).
- `prefers-reduced-motion` → versão 2D elegante em CSS, sem WebGL.
- Sem WebGL / erro de contexto → homepage imediata. A intro nunca bloqueia o acesso.
- Preloader: círculo fino que se completa (sem barras genéricas).

## Acessibilidade

HTML semântico, navegação por teclado (Enter/Espaço/Esc na intro), focus states visíveis, `aria-labels` nos controlos, cursor personalizado desativado em touch, contraste verificado sobre preto.

---

## Publicar na Vercel

1. Cria um repositório e faz push:
   ```bash
   git init && git add -A && git commit -m "Black Circle v1"
   git remote add origin https://github.com/<user>/black-circle.git
   git push -u origin main
   ```
2. Em [vercel.com](https://vercel.com) → **Add New Project** → importa o repositório. A Vercel deteta Next.js automaticamente (sem configuração extra).
3. Depois do primeiro deploy, define o domínio em **Settings → Domains** e atualiza `site.url` em `lib/content.ts` (usado no sitemap, robots, Open Graph e schema).

## Migração futura para CMS

Todo o conteúdo vive em `lib/content.ts`, com um export por "documento". Para Sanity/Strapi/Contentful/Supabase: cria coleções com a mesma forma dos exports e substitui os imports por fetches em Server Components — os componentes não precisam de mudar.

---

## Intro em vídeo (Kling AI ou outro)

A intro pode ser um vídeo em vez do buraco negro 3D. Está tudo pronto, só falta o ficheiro.

1. Gera o vídeo (16:9, até 15s; o último plano deve ser o logótipo, parado, sobre preto)
2. Guarda-o como `public/intro/intro.mp4`
3. Faz o deploy (`git add -A`, `git commit`, `git push`)

**Como se comporta**
- Toca sem som (os browsers só permitem autoplay sem som); o botão de som liga o áudio do vídeo se `videoHasAudio: true`, ou o rumble grave procedural se for `false`
- Skip por botão, clique, scroll, toque ou Esc
- Visitas repetidas: toca mais depressa (`videoRepeatSpeed` em `lib/config.ts`)
- Se o ficheiro faltar, falhar, demorar mais de 8s a arrancar ou o autoplay for bloqueado, usa automaticamente a intro 3D. Com "reduzir movimento" ativo, usa a versão simples. A intro nunca bloqueia o site
- Para voltar só à intro 3D: `mode: "shader"` em `lib/config.ts`

**Comprimir o vídeo (importante: ficheiros grandes carregam devagar)**
Objetivo: 4 a 8 MB. Com o `ffmpeg` instalado:
```
ffmpeg -i original.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an intro.mp4
```
(`-an` remove o áudio; se usares o som do vídeo, troca por `-c:a aac -b:a 128k` e põe `videoHasAudio: true`.)

**Opcionais** (em `lib/config.ts`): `videoSrcMobile` (versão vertical 9:16 para telemóvel) e `videoPoster` (imagem mostrada enquanto carrega).
