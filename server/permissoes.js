// Perfis (atores), departamentos e regras de acesso aos dados
// Coleções do sistema (cada uma é uma "tabela" lógica guardada em documentos)
const COLECOES = ['atletas', 'lesoes', 'avaliacoes', 'hidratacao', 'energia', 'testes', 'maturacao', 'bemestar', 'pse', 'micro', 'macro', 'planos', 'jogos', 'config'];

const PAPEIS = {
  admin: { nome: 'Administrador', desc: 'Acesso total, inclusive usuários, departamentos e auditoria' },
  gestor: { nome: 'Gestor / Coordenação', desc: 'Lê e altera todos os módulos; vê usuários e auditoria' },
  funcionario: { nome: 'Funcionário', desc: 'Lê todos os módulos e altera os do seu departamento' },
  atleta: { nome: 'Atleta', desc: 'Responde bem-estar e PSE e vê apenas os próprios dados' }
};

// Departamentos padrão criados no primeiro uso (podem ser editados na administração)
const DEPARTAMENTOS_PADRAO = [
  { id: 'diretoria', nome: 'Diretoria', descricao: 'Consulta de todos os módulos', colecoes: [] },
  { id: 'comissao_tecnica', nome: 'Comissão técnica', descricao: 'Treinadores e auxiliares', colecoes: ['atletas', 'jogos', 'micro', 'macro', 'planos', 'pse', 'bemestar', 'config'] },
  { id: 'preparacao_fisica', nome: 'Preparação física / Fisiologia', descricao: 'Avaliações físicas, maturação, carga e planejamento', colecoes: ['atletas', 'testes', 'maturacao', 'pse', 'bemestar', 'micro', 'macro', 'planos', 'config'] },
  { id: 'fisioterapia', nome: 'Fisioterapia / DM', descricao: 'Departamento médico e lesões', colecoes: ['atletas', 'lesoes', 'bemestar', 'config'] },
  { id: 'nutricao', nome: 'Nutrição', descricao: 'Composição corporal, hidratação e energia', colecoes: ['atletas', 'avaliacoes', 'hidratacao', 'energia', 'config'] },
  { id: 'administrativo', nome: 'Administrativo', descricao: 'Cadastro de atletas', colecoes: ['atletas', 'config'] }
];

// coleções que o atleta pode ler (somente os próprios registros nas coleções com atletaId)
const ATLETA_LEITURA = ['atletas', 'micro', 'bemestar', 'pse', 'jogos', 'config'];
const ATLETA_ESCRITA = ['bemestar', 'pse'];

function podeEscrever(usuario, colecao, dados, idDoc) {
  if (!COLECOES.includes(colecao)) return false;
  if (usuario.papel === 'admin' || usuario.papel === 'gestor') return true;
  if (usuario.papel === 'funcionario') return (usuario.colecoesEscrita || []).includes(colecao);
  if (usuario.papel === 'atleta') {
    if (!ATLETA_ESCRITA.includes(colecao) || !usuario.atleta_id) return false;
    const aid = dados ? dados.atletaId : null;
    return aid === usuario.atleta_id && String(idDoc || '').includes(usuario.atleta_id);
  }
  return false;
}
function podeLer(usuario, colecao) {
  if (!COLECOES.includes(colecao)) return false;
  if (usuario.papel === 'atleta') return ATLETA_LEITURA.includes(colecao);
  return true;
}
// filtra o que o atleta pode ver
function filtrarParaAtleta(usuario, colecao, lista) {
  if (usuario.papel !== 'atleta') return lista;
  const aid = usuario.atleta_id;
  if (colecao === 'atletas') { const eu = lista.find(a => a.id === aid); return eu ? [eu] : []; }
  if (colecao === 'bemestar' || colecao === 'pse') return lista.filter(r => r.atletaId === aid);
  if (colecao === 'micro') return lista;
  if (colecao === 'jogos') return lista.map(j => ({ id: j.id, data: j.data, categoria: j.categoria, adversario: j.adversario, competicao: j.competicao, relacionados: (j.relacionados || []).filter(r => r.atletaId === aid) }));
  if (colecao === 'config') return lista.filter(c => c.id === 'dm').map(c => ({ id: c.id, profissionais: c.profissionais || [], capa: c.capa || {} }));
  return [];
}
module.exports = { COLECOES, PAPEIS, DEPARTAMENTOS_PADRAO, podeEscrever, podeLer, filtrarParaAtleta };
