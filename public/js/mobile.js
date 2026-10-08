// Porto Vitória · navegação para celular (barra inferior + menu completo)
(function () {
  if (!window.matchMedia) return;
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = { home: ic('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'), users: ic('<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-6"/>'), clip: ic('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/>'), cal: ic('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'), menu: ic('<path d="M3 6h18M3 12h18M3 18h18"/>') };
  const ir = k => { try { (window.UNI && UNI.go ? UNI.go : go)(k); } catch (e) { location.hash = k; } fecharMenu(); window.scrollTo(0, 0); };
  const bar = document.createElement('nav'); bar.className = 'pvm-bar'; bar.setAttribute('aria-label', 'Menu rápido');
  const atalhos = [['inicio', 'Início', I.home], ['atletas', 'Atletas', I.users], ['mon-be', 'Monitorar', I.clip], ['cal', 'Calendário', I.cal]];
  bar.innerHTML = atalhos.map(([k, n, s]) => `<button data-k="${k}">${s}<span>${n}</span></button>`).join('') + `<button data-k="__menu">${I.menu}<span>Menu</span></button>`;
  const veil = document.createElement('div'); veil.className = 'pvm-veil';
  const dr = document.createElement('aside'); dr.className = 'pvm-drawer'; dr.setAttribute('aria-label', 'Menu completo');
  document.body.append(bar, veil, dr);
  function abrirMenu() {
    let itens = []; try { itens = NAV; } catch (e) { }
    const me = window.PV_ME || {}, atual = (window.S && S.view) || '';
    dr.innerHTML = `<div class="hd"><img src="/img/escudo.png" alt=""><div><b>Porto Vitória</b><small>${me.nome || ''}${me.papelNome ? ' · ' + me.papelNome : ''}</small></div></div>` +
      itens.map(n => n.sub && n.sub.length ? `<details ${n.sub.some(s => s[0] === atual) ? 'open' : ''}><summary>${n.ic || ''}${n.n}</summary>${n.sub.map(([k, t]) => `<button class="sb ${k === atual ? 'on' : ''}" data-k="${k}">${t}</button>`).join('')}</details>` : `<button class="it" data-k="${n.k}">${n.ic || ''}${n.n}</button>`).join('') +
      `<details><summary>⚙️ Configurações</summary><button class="sb" data-k="config-geral">Geral</button><button class="sb" data-k="config-forms">Formulários dos atletas</button><button class="sb" data-go-url="/admin">Usuários e segurança</button></details><button class="it" data-sair="1">🚪 Sair</button>`;
    dr.classList.add('on'); veil.classList.add('on');
  }
  function fecharMenu() { dr.classList.remove('on'); veil.classList.remove('on'); }
  bar.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; if (b.dataset.k === '__menu') abrirMenu(); else ir(b.dataset.k); });
  dr.addEventListener('click', e => { const b = e.target.closest('[data-k],[data-go-url],[data-sair]'); if (!b) return; if (b.dataset.goUrl) location.href = b.dataset.goUrl; else if (b.dataset.sair) (window.sairPV || (() => location.href = '/login'))(); else ir(b.dataset.k); });
  veil.addEventListener('click', fecharMenu);
  setInterval(() => { const v = (window.S && S.view) || ''; bar.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === v || (b.dataset.k === 'mon-be' && v.startsWith('mon-')) || (b.dataset.k === 'atletas' && (v === 'atl-mapa' || v === 'importar')))); }, 700);
})();
