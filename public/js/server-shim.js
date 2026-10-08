// Liga o sistema (interface) ao banco de dados do servidor.
// O sistema usa a mesma API de banco (collection/doc/set/delete/onSnapshot); aqui ela é atendida pela API REST + tempo real (SSE).
window.PV_SERVER = true;
(function () {
  const cache = {};       // { colecao: Map(id -> objeto) }
  const carregando = {};  // promessas de carga por coleção
  const subsCol = {}, subsDoc = {};
  let mePromise = null;

  function getCsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)pv_csrf=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  async function api(method, url, body) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    const csrf = getCsrfToken();
    if (csrf && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
      headers['X-CSRF-Token'] = csrf;
    }
    const r = await fetch(url, { method, credentials: 'same-origin', headers, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) { location.href = '/login'; throw new Error('Sessão expirada'); }
    if (!r.ok) { let m = r.statusText; try { m = (await r.json()).erro || m; } catch (e) { } const e = new Error(m); e.status = r.status; throw e; }
    return r.json();
  }
  function quemSou() { if (!mePromise) mePromise = api('GET', '/api/auth/me').then(u => { window.PV_ME = u; return u; }); return mePromise; }
  const clone = o => JSON.parse(JSON.stringify(o));
  const snapCol = c => { const m = cache[c] || new Map(); return { size: m.size, empty: !m.size, docs: [...m.entries()].map(([id, v]) => ({ id, exists: true, data: () => clone(v) })) }; };
  const snapDoc = (c, id) => { const v = cache[c] && cache[c].get(id); return { id, exists: v !== undefined, data: () => (v === undefined ? undefined : clone(v)) }; };
  // várias alterações seguidas viram uma única atualização de tela
  const pend = new Map(); let agendado = false;
  function avisar(c, id) {
    if (!pend.has(c)) pend.set(c, new Set()); pend.get(c).add(id);
    if (agendado) return; agendado = true;
    setTimeout(() => { agendado = false; const lote = [...pend.entries()]; pend.clear();
      lote.forEach(([c, ids]) => {
        (subsCol[c] || []).forEach(cb => { try { cb(snapCol(c)); } catch (e) { console.error(e); } });
        ids.forEach(id => (subsDoc[c + '/' + id] || []).forEach(cb => { try { cb(snapDoc(c, id)); } catch (e) { console.error(e); } }));
      }); }, 40);
  }
  async function carregar(c, forcar) {
    if (cache[c] && !forcar) return cache[c];
    if (!carregando[c] || forcar) carregando[c] = api('GET', '/api/db/' + encodeURIComponent(c)).then(l => { const m = new Map(); l.forEach(x => { const { id, ...r } = x; m.set(id, { ...r, id }); }); cache[c] = m; return m; }).catch(e => { cache[c] = cache[c] || new Map(); console.warn('Sem acesso a', c, e.message); return cache[c]; });
    return carregando[c];
  }
  function erroAviso(e) { const m = e && e.status === 403 ? 'Seu perfil não tem permissão para alterar esta área.' : 'Não foi possível salvar: ' + (e && e.message || 'erro'); try { (window.toast || alert)(m, true); } catch (x) { alert(m); } }
  function docRef(c, id) {
    return {
      id,
      async set(obj) { await carregar(c); const antes = cache[c].get(id); cache[c].set(id, clone({ ...obj, id })); avisar(c, id); try { await api('PUT', `/api/db/${encodeURIComponent(c)}/${encodeURIComponent(id)}`, obj); } catch (e) { if (antes) cache[c].set(id, antes); else cache[c].delete(id); avisar(c, id); erroAviso(e); throw e; } },
      async update(obj) { await carregar(c); return this.set({ ...(cache[c].get(id) || {}), ...obj }); },
      async delete() { await carregar(c); const antes = cache[c].get(id); cache[c].delete(id); avisar(c, id); try { await api('DELETE', `/api/db/${encodeURIComponent(c)}/${encodeURIComponent(id)}`); } catch (e) { if (antes) cache[c].set(id, antes); avisar(c, id); erroAviso(e); throw e; } },
      async get() { await carregar(c); return snapDoc(c, id); },
      onSnapshot(cb, err) { const k = c + '/' + id; (subsDoc[k] = subsDoc[k] || []).push(cb); carregar(c).then(() => cb(snapDoc(c, id))).catch(e => err && err(e)); return () => { subsDoc[k] = subsDoc[k].filter(x => x !== cb); }; }
    };
  }
  const db = {
    collection(c) { return { doc: id => docRef(c, id), async get() { await carregar(c); return snapCol(c); }, onSnapshot(cb, err) { (subsCol[c] = subsCol[c] || []).push(cb); carregar(c).then(() => cb(snapCol(c))).catch(e => err && err(e)); return () => { subsCol[c] = subsCol[c].filter(x => x !== cb); }; } }; },
    doc(p) { const [c, id] = String(p).split('/'); return docRef(c, id); }
  };
  // tempo real: alterações feitas em outros aparelhos aparecem sozinhas
  function conectar() {
    const es = new EventSource('/api/stream');
    es.onmessage = ev => { try { const m = JSON.parse(ev.data); if (!cache[m.colecao] || (window.PV_ME && m.origem === PV_ME.id && m.op !== 'delete' && JSON.stringify(cache[m.colecao].get(m.id)) === JSON.stringify({ ...m.dados, id: m.id }))) return; if (m.op === 'delete') cache[m.colecao].delete(m.id); else cache[m.colecao].set(m.id, { ...m.dados, id: m.id }); avisar(m.colecao, m.id); } catch (e) { } };
    es.onerror = () => { /* o navegador reconecta sozinho */ };
  }
  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: /\.csv$/i.test(filename) ? 'text/csv;charset=utf-8' : /\.json$/i.test(filename) ? 'application/json' : 'application/octet-stream' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename || 'arquivo'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }
  };
  window.claude = {
    server: true,
    async use(cap) {
      await quemSou();
      if (cap === 'db') { if (!window.__pvSSE) { window.__pvSSE = 1; conectar(); } return db; }
      if (cap === 'downloads') return downloads;
      if (cap === 'user') return { id: PV_ME.id, name: PV_ME.nome, can: async p => p === 'data.write' ? (PV_ME.podeEscrever || []).length > 0 : true };
      return null;
    }
  };
  quemSou().catch(() => { });
})();
