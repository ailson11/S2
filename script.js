// Cursor Personalizado de Coração
const cursor = document.getElementById('cursor-coracao');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Música de Fundo
const btnMusica = document.getElementById('btn-musica');
const musica = document.getElementById('musica-fundo');
let tocando = false;

btnMusica.addEventListener('click', () => {
    if (tocando) {
        musica.pause();
        btnMusica.textContent = "🎵 Tocar Nossa Música";
    } else {
        musica.play();
        btnMusica.textContent = "⏸️ Pausar Música";
    }
    tocando = !tocando;
});

// Chuva de Corações Dinâmica
function criarCoracao() {
    const coracao = document.createElement('div');
    coracao.classList.add('coracao-caindo');
    coracao.textContent = '❤️';
    coracao.style.left = Math.random() * 100 + 'vw';
    coracao.style.animationDuration = Math.random() * 3 + 2 + 's';
    
    document.getElementById('container-coracoes').appendChild(coracao);
    
    setTimeout(() => {
        coracao.remove();
    }, 5000);
}
setInterval(criarCoracao, 300);

// Contador de Batimentos (Fictício, atualiza a cada segundo)
let batimentos = 35467200; // Valor base
const displayBatimentos = document.getElementById('contador-batimentos');
setInterval(() => {
    batimentos += Math.floor(Math.random() * 3) + 1;
    displayBatimentos.textContent = batimentos.toLocaleString('pt-BR');
}, 1000);

// Calculadora do Amor
function calcularAmor() {
    const resultado = document.getElementById('resultado-amor');
    resultado.style.opacity = 0;
    setTimeout(() => {
        // Sempre 100% para Ailson e Heloísa!
        resultado.textContent = "Compatibilidade: 1000%! Vocês nasceram um para o outro! ❤️";
        resultado.style.transition = "opacity 0.5s";
        resultado.style.opacity = 1;
    }, 300);
}

// Quiz
function responderQuiz(correto) {
    const resultado = document.getElementById('resultado-quiz');
    if (correto) {
        resultado.textContent = "Acertou, meu amor! ❤️ Ninguém faz igual.";
        resultado.style.color = "#ff3366";
    } else {
        resultado.textContent = "Errou! Tente de novo! 😂";
        resultado.style.color = "#333";
    }
}

// Botão Surpresa
document.getElementById('btn-surpresa').addEventListener('click', () => {
    const msg = document.getElementById('mensagem-surpresa');
    msg.classList.remove('escondido');
    msg.style.animation = "pulsar 1s infinite alternate";
    
    // Intensifica a chuva de corações
    for(let i = 0; i < 30; i++) {
        setTimeout(criarCoracao, i * 100);
    }
});

// Animação de Scroll (Revelar seções)
const secoes = document.querySelectorAll('.animar-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
        }
    });
}, { threshold: 0.1 });

secoes.forEach(secao => {
    observer.observe(secao);
});

// Lógica de Arrastar Polaroids
const polaroids = document.querySelectorAll('.arrastavel');
let dragElemento = null;
let offset = [0, 0];
let zIndexAtual = 10;

polaroids.forEach(polaroid => {
    polaroid.addEventListener('mousedown', (e) => {
        dragElemento = polaroid;
        dragElemento.style.zIndex = ++zIndexAtual;
        offset = [
            dragElemento.offsetLeft - e.clientX,
            dragElemento.offsetTop - e.clientY
        ];
    });
});

document.addEventListener('mouseup', () => {
    dragElemento = null;
});

document.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (dragElemento) {
        const mousePosition = { x: e.clientX, y: e.clientY };
        dragElemento.style.left = (mousePosition.x + offset[0]) + 'px';
        dragElemento.style.top = (mousePosition.y + offset[1]) + 'px';
        dragElemento.style.position = 'absolute';
    }
});