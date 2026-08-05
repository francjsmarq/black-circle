/**
 * Configuração de comportamento — edita aqui, sem tocar nos componentes.
 */
export const config = {
  intro: {
    /** Mostrar a intro completa apenas na 1.ª visita (guardado em localStorage). */
    fullOnlyOnFirstVisit: true,
    /** Duração total da intro completa (segundos). */
    fullDuration: 21,
    /** Duração da versão curta em visitas repetidas (segundos). */
    shortDuration: 5,
    /** Chave de localStorage. */
    storageKey: "bc_intro_seen",
  },
  performance: {
    /** Limite de devicePixelRatio para o canvas 3D. */
    maxDpr: 1.75,
    /** Abaixo desta largura, versão simplificada do shader. */
    mobileBreakpoint: 768,
  },
};
