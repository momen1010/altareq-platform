// Arabic text-to-speech through the browser's Web Speech API (no server, no key).
const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export const canSpeak = supported;

/** Speak Arabic text. Blanks (____) are skipped. Returns false when the browser has no speech support. */
export function speak(text, { rate = 0.85 } = {}) {
  if (!supported()) return false;
  const clean = String(text).replace(/_{2,}/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'ar-SA';
  u.rate = rate;
  const voice = synth.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
  if (voice) u.voice = voice;
  synth.speak(u);
  return true;
}
