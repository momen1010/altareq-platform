// Runs before first paint so the saved language and theme don't flash.
(function () {
  try {
    var p = JSON.parse(localStorage.getItem('altareq-prefs')) || {};
    var lang = p.langSet && p.lang ? p.lang : 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (p.theme) document.documentElement.setAttribute('data-theme', p.theme);
  } catch (e) { /* storage blocked */ }
})();
