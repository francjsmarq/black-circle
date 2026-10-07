/**
 * Configuração de comportamento — edita aqui, sem tocar nos componentes.
 */
export const config = {
  intro: {
    /** Mostrar a intro completa apenas na 1.ª visita (guardado em localStorage). */
    fullOnlyOnFirstVisit: true,
    /** Duração total da intro completa (segundos). */
    fullDuration: 3,
    /** Duração da versão curta em visitas repetidas (segundos). */
    shortDuration: 2,
    /** Chave de localStorage. */
    storageKey: "bc_intro_seen",

    /**
     * Tipo de intro:
     *  - "video"  → toca o vídeo em videoSrc (se faltar ou falhar, cai para o "shader")
     *  - "shader" → intro procedural 3D (buraco negro), sem vídeo
     */
    mode: "shader" as "video" | "shader",
    /** Vídeo principal (desktop). Coloca o ficheiro em public/intro/intro.mp4 */
    videoSrc: "/intro/intro.mp4",
    /** Vídeo vertical opcional para telemóvel (ex: "/intro/intro-mobile.mp4"). null = usa o principal. */
    videoSrcMobile: null as string | null,
    /** Imagem mostrada enquanto o vídeo carrega (ex: "/intro/poster.jpg"). null = fundo preto. */
    videoPoster: null as string | null,
    /** true se o vídeo tem som próprio (o botão de som liga/desliga o áudio do vídeo). */
    videoHasAudio: false,
    /** Velocidade do vídeo em visitas repetidas (1 = normal). */
    videoRepeatSpeed: 2.5,
    /** Se o vídeo não começar a tocar neste tempo (ms), usa a intro 3D. */
    videoStartTimeoutMs: 8000,
  },
  performance: {
    /** Limite de devicePixelRatio para o canvas 3D. */
    maxDpr: 1.75,
    /** Abaixo desta largura, versão simplificada do shader. */
    mobileBreakpoint: 768,
  },
};
