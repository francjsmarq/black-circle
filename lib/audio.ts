/**
 * Rumble cinematográfico procedural (WebAudio).
 * Sem ficheiros de áudio, sem autoplay — criado apenas após gesto do utilizador.
 * Para usar um ficheiro real, substitui esta classe por um <audio> com o teu .mp3/.ogg
 * e mantém a mesma API (start / stop / setIntensity).
 */
export class DeepRumble {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private intensity = 0;

  async start() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.gain = master;

    // Sub grave em movimento lento
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 38;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.5;
    osc.connect(oscGain).connect(master);
    osc.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 7;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start();

    // Textura atmosférica: ruído filtrado
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 140;
    filter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.22;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();

    // fade-in suave
    master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.5);
    this.intensity = 1;
  }

  /** 0..1 — cresce com a aproximação ao círculo. */
  setIntensity(v: number) {
    if (!this.ctx || !this.gain) return;
    const target = 0.06 + 0.2 * Math.min(Math.max(v, 0), 1);
    this.gain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.4);
  }

  async stop() {
    if (!this.ctx || !this.gain) return;
    this.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    const ctx = this.ctx;
    setTimeout(() => ctx.close().catch(() => undefined), 1500);
    this.ctx = null;
    this.gain = null;
  }

  get running() {
    return !!this.ctx;
  }
}
