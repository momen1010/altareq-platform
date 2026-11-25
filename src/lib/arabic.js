// Arabic text helpers shared by the exercise engine (server and browser demo).

const TASHKEEL = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g; // harakat, shadda, sukun, superscript alef, Quranic marks
const TATWEEL = /\u0640/g;

/** Remove diacritics (tashkeel) and tatweel. */
export const stripTashkeel = s => String(s ?? '').replace(TASHKEEL, '').replace(TATWEEL, '');

/**
 * Normalise Arabic for lenient answer matching: no diacritics, one alef, one ya,
 * ta marbuta equals ha, hamza on waw/ya folded, digits unified, whitespace collapsed.
 */
export function normalizeArabic(s) {
  return stripTashkeel(s)
    .normalize('NFKC')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/[\u0649\u06CC]/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/\u0624/g, '\u0648')
    .replace(/\u0626/g, '\u064A')
    .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[.,،؛؟!?:;"'«»()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export const sameArabic = (a, b) => normalizeArabic(a) === normalizeArabic(b);
