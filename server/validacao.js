// Validação e sanitização de dados por coleção no servidor
// Garante integridade, limites de payload e previne dados corrompidos ou maliciosos

const { COLECOES } = require('./permissoes');

// Limites máximos de tamanho
const MAX_STRING_PADRAO = 5000;
const MAX_FOTO_BASE64_BYTES = 2.5 * 1024 * 1024; // 2.5 MB para imagens em base64
const MAX_OBS_BYTES = 20000; // 20 KB para notas clínicas / observações

function ehString(val) {
  return typeof val === 'string';
}

function ehNumeroOuNulo(val) {
  return val === null || val === undefined || (typeof val === 'number' && !isNaN(val)) || (typeof val === 'string' && !isNaN(Number(val)));
}

function sanitizarTexto(txt, maxLen = MAX_STRING_PADRAO) {
  if (txt === null || txt === undefined) return '';
  return String(txt).trim().slice(0, maxLen);
}

function validarFotoBase64(foto) {
  if (!foto) return true;
  if (typeof foto !== 'string') return false;
  // Deve ser data URL de imagem ou URL
  if (foto.startsWith('data:image/')) {
    if (foto.length > MAX_FOTO_BASE64_BYTES) return false;
    return true;
  }
  return foto.length < 2000;
}

/**
 * Valida o payload de acordo com a coleção.
 * Retorna { valido: boolean, erro?: string, sanitizado?: object }
 */
function validarColecao(colecao, id, dados) {
  if (!COLECOES.includes(colecao)) {
    return { valido: false, erro: 'Coleção desconhecida: ' + colecao };
  }

  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return { valido: false, erro: 'Os dados do registro devem ser um objeto JSON.' };
  }

  const payload = { ...dados };

  // Validação geral de tamanho do JSON
  try {
    const serialized = JSON.stringify(payload);
    if (serialized.length > 5 * 1024 * 1024) { // 5 MB por documento
      return { valido: false, erro: 'Tamanho do registro excede o limite permitido (5MB).' };
    }
  } catch (e) {
    return { valido: false, erro: 'Dados inválidos para serialização JSON.' };
  }

  // Validações específicas por coleção
  switch (colecao) {
    case 'atletas': {
      if (!payload.nome || sanitizarTexto(payload.nome).length < 2) {
        return { valido: false, erro: 'O atleta deve ter um nome válido (mínimo 2 caracteres).' };
      }
      payload.nome = sanitizarTexto(payload.nome, 120);
      if (payload.foto && !validarFotoBase64(payload.foto)) {
        return { valido: false, erro: 'A foto enviada excede o limite máximo permitido (2.5MB).' };
      }
      break;
    }

    case 'bemestar': {
      if (!payload.atletaId) {
        return { valido: false, erro: 'Identificador do atleta (atletaId) é obrigatório no bem-estar.' };
      }
      if (payload.sono !== undefined && !ehNumeroOuNulo(payload.sono)) return { valido: false, erro: 'Valor de sono inválido.' };
      if (payload.dor !== undefined && payload.escalaDor !== undefined && !ehNumeroOuNulo(payload.escalaDor)) {
        return { valido: false, erro: 'Escala de dor inválida.' };
      }
      break;
    }

    case 'pse': {
      if (!payload.atletaId) {
        return { valido: false, erro: 'Identificador do atleta (atletaId) é obrigatório no PSE.' };
      }
      if (payload.pse !== undefined) {
        const val = Number(payload.pse);
        if (isNaN(val) || val < 0 || val > 10) return { valido: false, erro: 'O valor da PSE deve estar entre 0 e 10.' };
      }
      if (payload.duracao !== undefined) {
        const d = Number(payload.duracao);
        if (isNaN(d) || d < 0 || d > 600) return { valido: false, erro: 'Duração da sessão inválida.' };
      }
      break;
    }

    case 'lesoes': {
      if (!payload.atletaId && !payload.atletaNome) {
        return { valido: false, erro: 'Registro de lesão deve estar vinculado a um atleta.' };
      }
      break;
    }

    case 'jogos': {
      if (payload.categoria && sanitizarTexto(payload.categoria).length > 50) {
        return { valido: false, erro: 'Categoria inválida.' };
      }
      break;
    }

    default:
      break;
  }

  return { valido: true, sanitizado: payload };
}

// Validação de complexidade de senha
function validarComplexidadeSenha(senha) {
  if (!senha || typeof senha !== 'string') {
    return { valido: false, erro: 'A senha é obrigatória.' };
  }
  if (senha.length < 8) {
    return { valido: false, erro: 'A senha precisa ter pelo menos 8 caracteres.' };
  }
  // Pelo menos 1 letra e 1 número
  const temLetra = /[a-zA-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  if (!temLetra || !temNumero) {
    return { valido: false, erro: 'A senha deve conter letras e pelo menos um número.' };
  }
  return { valido: true };
}

module.exports = {
  validarColecao,
  validarComplexidadeSenha,
  validarFotoBase64
};
