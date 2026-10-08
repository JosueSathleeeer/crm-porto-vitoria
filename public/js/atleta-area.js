document.addEventListener('DOMContentLoaded', () => {
  const hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const fmt = d => d.split('-').reverse().join('/');
  const get = u =>
    fetch(u, { credentials: 'same-origin' }).then(r => {
      if (r.status === 401) location.href = '/login';
      return r.json();
    });

  const sairBtn = document.getElementById('sair');
  if (sairBtn) {
    sairBtn.addEventListener('click', () => {
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        location.href = '/login';
      });
    });
  }

  (async () => {
    try {
      const me = await get('/api/auth/me');
      if (me.papel !== 'atleta') {
        location.href = '/app';
        return;
      }
      if (!me.atletaId) {
        const hist = document.getElementById('hist');
        if (hist) hist.innerHTML = '<tr><td colspan="6">Seu usuário ainda não está ligado a um atleta. Fale com o administrador.</td></tr>';
        return;
      }
      const [ats, be, pse, micro] = await Promise.all([
        get('/api/db/atletas'),
        get('/api/db/bemestar'),
        get('/api/db/pse'),
        get('/api/db/micro')
      ]);

      const a = ats[0] || {};
      const nomeEl = document.getElementById('nome');
      const infoEl = document.getElementById('info');
      const tBe = document.getElementById('tBe');
      const tPse = document.getElementById('tPse');

      if (nomeEl) nomeEl.textContent = a.nome || me.nome;
      if (infoEl) infoEl.textContent = [a.categoria, a.posDetalhe || a.posicao, a.numero ? '#' + a.numero : ''].filter(Boolean).join(' · ');
      if (tBe) tBe.href = '/formulario#form=bemestar&aid=' + encodeURIComponent(me.atletaId);
      if (tPse) tPse.href = '/formulario#form=pse&aid=' + encodeURIComponent(me.atletaId);

      const beH = be.find(r => r.data === hoje);
      const pH = pse.filter(r => r.data === hoje);
      if (beH) {
        const s = document.getElementById('sBe');
        if (s) {
          s.textContent = 'Respondido hoje ✓';
          s.classList.add('ok');
        }
      }
      if (pH.length) {
        const s = document.getElementById('sPse');
        if (s) {
          s.textContent = pH.length + ' sessão(ões) respondida(s) ✓';
          s.classList.add('ok');
        }
      }

      const dias = [...Array(14)].map((_, i) => new Date(Date.parse(hoje) - i * 864e5).toISOString().slice(0, 10));
      const hist = document.getElementById('hist');
      if (hist) {
        hist.innerHTML =
          dias
            .map(d => {
              const b = be.find(r => r.data === d);
              const p = pse.filter(r => r.data === d);
              const ua = p.reduce((s, r) => s + (+r.pse || 0) * (+r.duracao || 0), 0);
              if (!b && !p.length) return '';
              return `<tr><td>${fmt(d)}</td><td>${b ? `<span class="tag g">Respondido</span>` : '<span class="tag">—</span>'}</td><td>${
                b && b.dor && b.dor !== 'Normal' ? `<span class="tag r">${b.escalaDor ?? ''} ${b.localDor || ''}</span>` : '—'
              }</td><td>${p.map(r => r.pse).join(' / ') || '—'}</td><td>${p.map(r => r.duracao).join(' / ') || '—'}</td><td><b>${
                ua || '—'
              }</b></td></tr>`;
            })
            .join('') || '<tr><td colspan="6" class="muted">Nenhuma resposta nos últimos 14 dias.</td></tr>';
      }

      const ses = micro.filter(s => s.categoria === a.categoria && s.data === hoje && s.tipo !== 'folga');
      const hojeEl = document.getElementById('hoje');
      if (hojeEl) {
        hojeEl.innerHTML = ses.length
          ? ses
              .map(
                s =>
                  `<div style="padding:6px 0;border-bottom:1px solid #eee"><b>${s.hora || ''} · ${
                    s.tipo === 'jogo' ? 'Jogo' + (s.adversario ? ' x ' + s.adversario : '') : s.titulo || 'Treino'
                  }</b><br><small class="muted">${s.duracao ? s.duracao + ' min' : ''}${
                    s.pse != null ? ' · PSE planejada ' + s.pse : ''
                  }</small></div>`
              )
              .join('')
          : '<span class="muted">Nenhuma sessão planejada para hoje.</span>';
      }
    } catch (err) {
      console.error('Erro na área do atleta:', err);
    }
  })();
});
