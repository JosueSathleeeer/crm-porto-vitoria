try {
  const th = localStorage.getItem('pv_theme');
  if (th) document.documentElement.dataset.theme = th;
} catch (e) {}
