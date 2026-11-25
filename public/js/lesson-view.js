// Renders a written lesson (see src/data/lesson-content.js) as a clean reading page.
import { esc, L } from './state.js';

const X = (en, ar) => L({ en, ar });

const table = tb => `<div class="lv-tablewrap"><table class="lv-table"><thead><tr>${tb.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${tb.rows.map(r => `<tr>${r.map((c, i) => `<td dir="auto"${i === 0 ? ' class="lv-first"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

export function lessonHTML(c) {
  return `<article class="lv" dir="rtl" lang="ar">
    <div class="lv-goals"><b>${X('By the end of this lesson', 'بنهاية هذا الدرس ستكون قادرًا على أن')}</b><ul>${c.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>
    ${c.sections.map(s => `<section class="lv-sec"><h3>${esc(s.h)}</h3>
      ${(s.p || []).map(p => `<p>${esc(p)}</p>`).join('')}
      ${s.table ? table(s.table) : ''}
      ${s.examples?.length ? `<ul class="lv-ex">${s.examples.map(e => `<li><span class="lv-ar">${esc(e.ar)}</span><span class="lv-note">${esc(e.note)}</span></li>`).join('')}</ul>` : ''}
      ${s.tip ? `<p class="lv-tip"><b>${X('Note', 'ملحوظة')}:</b> ${esc(s.tip)}</p>` : ''}</section>`).join('')}
    ${c.mistakes?.length ? `<section class="lv-sec lv-mist"><h3>${X('Common mistakes', 'أخطاء شائعة')}</h3>${c.mistakes.map(m => `<div class="lv-m">
      ${m.wrong ? `<p class="lv-wrong">✗ ${esc(m.wrong)}</p>` : ''}${m.right ? `<p class="lv-right">✓ ${esc(m.right)}</p>` : ''}<p class="lv-why">${esc(m.why)}</p></div>`).join('')}</section>` : ''}
    <section class="lv-sec lv-sum"><h3>${X('Summary', 'خلاصة الدرس')}</h3><ul>${c.summary.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${c.review ? `<p class="lv-rev">${esc(c.review)}</p>` : ''}</section>
  </article>`;
}
