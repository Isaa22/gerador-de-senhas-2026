// script.js - lógica de geração com matemática e personalização

// Elementos DOM
const senhaSpan = document.getElementById('senhaGerada');
const tamanhoInput = document.getElementById('tamanho');
const fonteSelect = document.getElementById('fonte');
const tamanhoFonteInput = document.getElementById('tamanhoFonte');
const gerarBtn = document.getElementById('gerarBtn');
const copiarBtn = document.getElementById('copiarBtn');
const limparBtn = document.getElementById('limparBtn');
const aleatorioBtn = document.getElementById('aleatorioBtn');

// Checkboxes
const maiusculasCb = document.getElementById('maiusculas');
const minusculasCb = document.getElementById('minusculas');
const numerosCb = document.getElementById('numeros');
const especiaisCb = document.getElementById('especiais');
const objetosCb = document.getElementById('objetos');
const nomesCb = document.getElementById('nomes');

// Elementos de estatística
const combinacoesSpan = document.getElementById('combinacoes');
const entropiaSpan = document.getElementById('entropia');

// Conjuntos de caracteres
const LETRAS_MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LETRAS_MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const DIGITOS = '0123456789';
const ESPECIAIS = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
// Objetos (emojis / símbolos)
const OBJETOS = ['🌟', '🚀', '⚡', '🔥', '🌈', '🍕', '🎸', '💎', '🌍', '🍀', '⭐', '🌀', '🎯', '📘', '🔒', '🛡️'];
// Nomes comuns (lista reduzida)
const NOMES = ['Ana', 'João', 'Maria', 'Pedro', 'Lucas', 'Mariana', 'Carlos', 'Beatriz', 'Rafael', 'Julia', 'Felipe', 'Camila', 'André', 'Larissa', 'Gustavo', 'Fernanda'];

// Função principal para gerar senha
function gerarSenha() {
    // 1. Coletar configurações
    let tamanho = parseInt(tamanhoInput.value) || 16;
    if (tamanho < 4) tamanho = 4;
    if (tamanho > 64) tamanho = 64;
    tamanhoInput.value = tamanho;

    const usarMaiusculas = maiusculasCb.checked;
    const usarMinusculas = minusculasCb.checked;
    const usarNumeros = numerosCb.checked;
    const usarEspeciais = especiaisCb.checked;
    const usarObjetos = objetosCb.checked;
    const usarNomes = nomesCb.checked;

    // 2. Construir pool de caracteres
    let pool = '';
    let descricao = '';

    if (usarMaiusculas) { pool += LETRAS_MAIUSCULAS; descricao += 'Maiúsculas '; }
    if (usarMinusculas) { pool += LETRAS_MINUSCULAS; descricao += 'Minúsculas '; }
    if (usarNumeros) { pool += DIGITOS; descricao += 'Números '; }
    if (usarEspeciais) { pool += ESPECIAIS; descricao += 'Especiais '; }
    if (usarObjetos) { pool += OBJETOS.join(''); descricao += 'Objetos '; }
    if (usarNomes) { pool += NOMES.join(''); descricao += 'Nomes '; }

    // Se nenhuma opção marcada, usar padrão (maiúsculas+minúsculas+números)
    if (pool.length === 0) {
        pool = LETRAS_MAIUSCULAS + LETRAS_MINUSCULAS + DIGITOS;
        descricao = 'Maiúsculas+Minúsculas+Números';
        maiusculasCb.checked = true;
        minusculasCb.checked = true;
        numerosCb.checked = true;
    }

    // 3. Montar lista de "unidades" (caracteres ou palavras)
    let unidades = [];
    let poolBase = '';
    if (usarMaiusculas) poolBase += LETRAS_MAIUSCULAS;
    if (usarMinusculas) poolBase += LETRAS_MINUSCULAS;
    if (usarNumeros) poolBase += DIGITOS;
    if (usarEspeciais) poolBase += ESPECIAIS;

    if (poolBase.length > 0) {
        for (let ch of poolBase) {
            unidades.push(ch);
        }
    }

    if (usarObjetos) {
        for (let obj of OBJETOS) {
            unidades.push(obj);
        }
    }

    if (usarNomes) {
        for (let nome of NOMES) {
            unidades.push(nome);
        }
    }

    if (unidades.length === 0) {
        unidades = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    }

    // Gerar senha
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
        const idx = Math.floor(Math.random() * unidades.length);
        resultado += unidades[idx];
    }

    while (resultado.length < tamanho) {
        const fallback = poolBase.length > 0 ? poolBase : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        resultado += fallback[Math.floor(Math.random() * fallback.length)];
    }
    if (resultado.length > tamanho) {
        resultado = resultado.slice(0, tamanho);
    }

    senha = resultado;

    // Aplicar fonte e tamanho
    const fonte = fonteSelect.value;
    const tamanhoFonte = tamanhoFonteInput.value + 'px';
    senhaSpan.style.fontFamily = fonte;
    senhaSpan.style.fontSize = tamanhoFonte;
    senhaSpan.textContent = senha;

    // Atualizar estatísticas
    atualizarEstatisticas(unidades, tamanho);

    return senha;
}

// Estatísticas: combinações e entropia
function atualizarEstatisticas(unidades, comprimento) {
    const conjuntoUnico = new Set(unidades);
    const qtd = conjuntoUnico.size;
    if (qtd === 0) {
        combinacoesSpan.textContent = 'Combinações: -';
        entropiaSpan.textContent = 'Entropia: - bits';
        return;
    }
    const combinacoes = Math.pow(qtd, comprimento);
    const entropia = comprimento * Math.log2(qtd);
    let combStr;
    if (combinacoes > 1e12) {
        combStr = combinacoes.toExponential(3);
    } else {
        combStr = combinacoes.toLocaleString();
    }
    combinacoesSpan.textContent = `Combinações: ${combStr}`;
    entropiaSpan.textContent = `Entropia: ${entropia.toFixed(1)} bits`;
}

// Função para copiar senha
function copiarSenha() {
    const senha = senhaSpan.textContent;
    if (senha && senha !== 'Clique em "Gerar"') {
        navigator.clipboard.writeText(senha).then(() => {
            alert('Senha copiada!');
        }).catch(() => {
            const range = document.createRange();
            range.selectNode(senhaSpan);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            alert('Senha copiada!');
        });
    } else {
        alert('Nenhuma senha para copiar.');
    }
}

// Função limpar
function limparSenha() {
    senhaSpan.textContent = 'Clique em "Gerar"';
    combinacoesSpan.textContent = 'Combinações: -';
    entropiaSpan.textContent = 'Entropia: - bits';
    senhaSpan.style.fontFamily = "'Segoe UI', sans-serif";
    senhaSpan.style.fontSize = '24px';
    fonteSelect.value = "'Segoe UI', sans-serif";
    tamanhoFonteInput.value = '24';
}

// Função aleatório
function gerarAleatorio() {
    const checks = [maiusculasCb, minusculasCb, numerosCb, especiaisCb, objetosCb, nomesCb];
    let ativos = 0;
    do {
        for (let cb of checks) {
            cb.checked = Math.random() > 0.5;
            if (cb.checked) ativos++;
        }
    } while (ativos < 2 || ativos > 5);

    const tamanhoAleatorio = Math.floor(Math.random() * 20) + 10;
    tamanhoInput.value = tamanhoAleatorio;

    const fontes = ["'Segoe UI', sans-serif", "'Courier New', monospace", "'Georgia', serif", "'Arial', sans-serif", "'Times New Roman', serif", "'Verdana', sans-serif"];
    const fonteRand = fontes[Math.floor(Math.random() * fontes.length)];
    fonteSelect.value = fonteRand;

    const tamanhoFonteRand = Math.floor(Math.random() * 20) + 16;
    tamanhoFonteInput.value = tamanhoFonteRand;

    gerarSenha();
}

// Event listeners
gerarBtn.addEventListener('click', gerarSenha);
copiarBtn.addEventListener('click', copiarSenha);
limparBtn.addEventListener('click', limparSenha);
aleatorioBtn.addEventListener('click', gerarAleatorio);

// Inicialização
window.addEventListener('load', () => {
    maiusculasCb.checked = true;
    minusculasCb.checked = true;
    numerosCb.checked = true;
    especiaisCb.checked = false;
    objetosCb.checked = false;
    nomesCb.checked = false;
    tamanhoInput.value = 16;
    fonteSelect.value = "'Segoe UI', sans-serif";
    tamanhoFonteInput.value = '24';
    gerarSenha();
});
