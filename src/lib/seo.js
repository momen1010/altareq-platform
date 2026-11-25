// Server-rendered <head> tags, sitemap.xml and robots.txt.
// Shared by the Node server (per request) and the demo build (pre-rendered pages).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SITE = {
  title: 'ال طارق: منصة تعليم اللغة العربية',
  description: 'دورات منظمة في النحو والصرف والبلاغة والإملاء والخط العربي، بشرح واضح وشهادات موثقة.',
};

const STATIC = {
  '/': SITE,
  '/explore': { title: 'استكشف الدورات · ال طارق', description: 'تصفح دورات اللغة العربية: النحو والصرف والبلاغة والإملاء والخط والقراءة والأدب، ودورات العربية لغير الناطقين.' },
  '/teach': { title: 'درّس على منصة ال طارق', description: 'أنشئ دورتك في اللغة العربية، ووصّلها للمتعلمين، واربح من كل اشتراك.' },
  '/terms': { title: 'شروط الاستخدام · ال طارق', description: 'الشروط التي تنطبق عند استخدامك منصة ال طارق.' },
  '/privacy': { title: 'سياسة الخصوصية · ال طارق', description: 'ما البيانات التي تجمعها منصة ال طارق وكيف تُستخدم.' },
  '/refunds': { title: 'سياسة الاسترداد · ال طارق', description: 'متى وكيف تسترد ثمن دورة على منصة ال طارق.' },
};

/** Paths that should not be indexed. */
export const PRIVATE_PREFIXES = ['/api/', '/learn/', '/learning', '/cart', '/orders', '/account', '/studio', '/admin', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/certificates', '/dev/', '/notifications', '/n/', '/mentor/', '/parent/'];

/** Work out the meta tags for a path. `findCourse(slug)` returns a published course row or null. */
export function metaFor(path, { baseUrl, findCourse }) {
  const url = baseUrl + (path === '/' ? '/' : path.replace(/\/$/, ''));
  const base = { url, image: `${baseUrl}/og.png`, type: 'website', robots: 'index,follow' };
  const m = /^\/courses\/([a-z0-9-]+)\/?$/.exec(path);
  if (m) {
    const c = findCourse(m[1]);
    if (c) {
      return {
        ...base, type: 'article',
        title: `${c.title_ar || c.title_en} · ال طارق`,
        description: c.summary_ar || c.summary_en || SITE.description,
        jsonLd: {
          '@context': 'https://schema.org', '@type': 'Course', name: c.title_ar || c.title_en, description: c.summary_ar || c.summary_en,
          inLanguage: ['ar', 'en'], url,
          provider: { '@type': 'Organization', name: 'ال طارق', sameAs: baseUrl },
          offers: { '@type': 'Offer', price: c.price, priceCurrency: 'EGP', category: c.price ? 'Paid' : 'Free' },
          ...(c.instructor_name ? { instructor: { '@type': 'Person', name: c.instructor_name } } : {}),
        },
      };
    }
    return { ...base, ...SITE, robots: 'noindex', status: 404 };
  }
  const page = STATIC[path.replace(/\/$/, '') || '/'];
  if (page) return { ...base, ...page };
  const priv = PRIVATE_PREFIXES.some(p => path.startsWith(p));
  return { ...base, ...SITE, robots: 'noindex', status: priv ? 200 : 404 };
}

/** Inject meta tags into the SPA shell (replaces <title> and the <!--meta--> marker). */
export function renderShell(html, meta) {
  const tags = [
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${meta.robots}">`,
    `<link rel="canonical" href="${esc(meta.url)}">`,
    `<meta property="og:site_name" content="ال طارق">`,
    `<meta property="og:type" content="${meta.type}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(meta.url)}">`,
    `<meta property="og:image" content="${esc(meta.image)}">`,
    `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="ar_EG"><meta property="og:locale:alternate" content="en_US">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n');
  return html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`).replace('<!--meta-->', tags);
}

export function sitemapXml(baseUrl, courses) {
  const urls = [
    ...['/', '/explore', '/teach', '/terms', '/privacy', '/refunds'].map(p => ({ loc: baseUrl + p, lastmod: null })),
    ...courses.map(c => ({ loc: `${baseUrl}/courses/${c.slug}`, lastmod: (c.updated_at || '').slice(0, 10) || null })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
    `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}

export function robotsTxt(baseUrl) {
  return `User-agent: *\nAllow: /\n${PRIVATE_PREFIXES.map(p => `Disallow: ${p}`).join('\n')}\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}
