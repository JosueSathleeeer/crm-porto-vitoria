document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const form = document.getElementById('f');
    const userField = document.getElementById('u');
    if (splash) splash.classList.add('out');
    if (form) form.hidden = false;
    if (userField) userField.focus();
  }, 1100);

  const verBtn = document.getElementById('ver');
  if (verBtn) {
    verBtn.addEventListener('click', () => {
      const i = document.getElementById('s');
      if (i) i.type = i.type === 'password' ? 'text' : 'password';
    });
  }

  const form = document.getElementById('f');
  if (form) {
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const e = document.getElementById('e');
      const b = document.getElementById('b');
      if (e) e.textContent = '';
      const login = (document.getElementById('u')?.value || '').trim();
      const senha = document.getElementById('s')?.value || '';
      if (!login || !senha) {
        if (e) e.textContent = 'Informe usuário e senha.';
        return;
      }
      if (b) {
        b.disabled = true;
        b.textContent = 'Entrando…';
      }
      try {
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, senha })
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.erro || 'Não foi possível entrar.');
        location.href = j.usuario.trocarSenha ? '/admin#senha' : j.destino;
      } catch (x) {
        if (e) e.textContent = x.message;
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
      } finally {
        if (b) {
          b.disabled = false;
          b.textContent = 'Entrar';
        }
      }
    });
  }
});
