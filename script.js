"use strict";

/* =====================================
   FUNÇÕES AUXILIARES
===================================== */

const reduzirMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function selecionar(seletor) {
  return document.querySelector(seletor);
}

function selecionarTodos(seletor) {
  return document.querySelectorAll(seletor);
}

/* =====================================
   CURSOR DE CORAÇÃO
===================================== */

const cursor = selecionar("#cursor-coracao");

if (cursor) {
  document.addEventListener("pointermove", (evento) => {
    if (evento.pointerType === "touch") return;

    cursor.style.left = `${evento.clientX}px`;
    cursor.style.top = `${evento.clientY}px`;
  });
}

/* =====================================
   PARTÍCULAS DO FUNDO
===================================== */

const particleCanvas = document.createElement("canvas");
const particleContainer = selecionar("#particleCanvas");

let contexto = null;
let particulas = [];
let larguraTela = window.innerWidth;
let alturaTela = window.innerHeight;
let animacaoParticulas = null;

if (particleContainer) {
  particleContainer.appendChild(particleCanvas);
  contexto = particleCanvas.getContext("2d");
}

function redimensionarCanvas() {
  if (!contexto) return;

  larguraTela = window.innerWidth;
  alturaTela = window.innerHeight;

  const escala = Math.min(window.devicePixelRatio || 1, 2);

  particleCanvas.width = larguraTela * escala;
  particleCanvas.height = alturaTela * escala;

  particleCanvas.style.width = `${larguraTela}px`;
  particleCanvas.style.height = `${alturaTela}px`;

  contexto.setTransform(escala, 0, 0, escala, 0, 0);

  particulas = Array.from({ length: 45 }, () => ({
    x: Math.random() * larguraTela,
    y: Math.random() * alturaTela,
    tamanho: Math.random() * 2.5 + 1,
    velocidade: Math.random() * 0.35 + 0.1,
    opacidade: Math.random() * 0.4 + 0.1
  }));
}

function animarParticulas() {
  if (!contexto || reduzirMovimento) return;

  contexto.clearRect(0, 0, larguraTela, alturaTela);

  particulas.forEach((particula) => {
    particula.y -= particula.velocidade;

    if (particula.y < -5) {
      particula.y = alturaTela + 5;
      particula.x = Math.random() * larguraTela;
    }

    contexto.beginPath();
    contexto.arc(
      particula.x,
      particula.y,
      particula.tamanho,
      0,
      Math.PI * 2
    );

    contexto.fillStyle =
      `rgba(244, 100, 140, ${particula.opacidade})`;

    contexto.fill();
  });

  animacaoParticulas = requestAnimationFrame(animarParticulas);
}

if (contexto) {
  redimensionarCanvas();

  window.addEventListener("resize", redimensionarCanvas);

  if (!reduzirMovimento) {
    animarParticulas();
  }
}

/* =====================================
   CHUVA DE CORAÇÕES
===================================== */

const containerCoracoes = selecionar("#container-coracoes");

function criarCoracao() {
  if (!containerCoracoes || reduzirMovimento) return;

  // Evita acumular muitos elementos no celular.
  if (containerCoracoes.childElementCount >= 35) return;

  const coracao = document.createElement("span");

  coracao.className = "coracao-caindo";
  coracao.textContent = "♥";
  coracao.setAttribute("aria-hidden", "true");

  coracao.style.left = `${Math.random() * 100}%`;
  coracao.style.fontSize = `${12 + Math.random() * 17}px`;
  coracao.style.animationDuration = `${5 + Math.random() * 5}s`;
  coracao.style.opacity = `${0.3 + Math.random() * 0.5}`;

  containerCoracoes.appendChild(coracao);

  coracao.addEventListener("animationend", () => {
    coracao.remove();
  }, { once: true });
}

if (!reduzirMovimento) {
  criarCoracao();

  window.setInterval(criarCoracao, 850);
}

/* =====================================
   ANIMAÇÕES AO ROLAR A PÁGINA
===================================== */

const elementosRevelar = selecionarTodos(".revelar");

if ("IntersectionObserver" in window && !reduzirMovimento) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elementosRevelar.forEach((elemento) => {
    observador.observe(elemento);
  });
} else {
  elementosRevelar.forEach((elemento) => {
    elemento.classList.add("visivel");
  });
}

/* =====================================
   CARTÕES QUE VIRAM
===================================== */

const cartoes = selecionarTodos(".flip-card");

cartoes.forEach((cartao) => {
  cartao.addEventListener("click", () => {
    const virou = cartao.classList.toggle("flipped");

    cartao.setAttribute("aria-pressed", String(virou));
  });
});

/* =====================================
   GALERIA ARRASTÁVEL
===================================== */

const polaroids = selecionarTodos(".arrastavel");

let polaroidArrastada = null;
let ponteiroAtivo = null;
let posicaoInicialX = 0;
let posicaoInicialY = 0;
let esquerdaInicial = 0;
let topoInicial = 0;
let zIndexAtual = 10;
let arrastou = false;

polaroids.forEach((polaroid) => {
  polaroid.style.zIndex = String(++zIndexAtual);

  polaroid.addEventListener("pointerdown", (evento) => {
    // Não arrasta com o botão direito do mouse.
    if (evento.pointerType === "mouse" && evento.button !== 0) {
      return;
    }

    polaroidArrastada = polaroid;
    ponteiroAtivo = evento.pointerId;
    arrastou = false;

    const caixa = polaroid.getBoundingClientRect();

    posicaoInicialX = evento.clientX;
    posicaoInicialY = evento.clientY;
    esquerdaInicial = caixa.left;
    topoInicial = caixa.top;

    polaroid.classList.add("em-arraste");
    polaroid.style.zIndex = String(++zIndexAtual);

    // Permite acompanhar o dedo enquanto a foto é movida.
    polaroid.style.touchAction = "none";
    polaroid.setPointerCapture(evento.pointerId);

    evento.preventDefault();
  });

  polaroid.addEventListener("pointermove", (evento) => {
    if (
      !polaroidArrastada ||
      polaroidArrastada !== polaroid ||
      evento.pointerId !== ponteiroAtivo
    ) {
      return;
    }

    const diferencaX = evento.clientX - posicaoInicialX;
    const diferencaY = evento.clientY - posicaoInicialY;

    if (Math.abs(diferencaX) > 3 || Math.abs(diferencaY) > 3) {
      arrastou = true;
    }

    if (!arrastou) return;

    const limiteEsquerdo = Math.max(
      0,
      window.innerWidth - polaroid.offsetWidth
    );

    const limiteSuperior = Math.max(
      0,
      window.innerHeight - polaroid.offsetHeight
    );

    const novaEsquerda = Math.min(
      limiteEsquerdo,
      Math.max(0, esquerdaInicial + diferencaX)
    );

    const novoTopo = Math.min(
      limiteSuperior,
      Math.max(0, topoInicial + diferencaY)
    );

    polaroid.style.position = "fixed";
    polaroid.style.left = `${novaEsquerda}px`;
    polaroid.style.top = `${novoTopo}px`;
    polaroid.style.margin = "0";
    polaroid.style.transform = "rotate(0deg)";
  });

  function finalizarArraste(evento) {
    if (
      polaroidArrastada !== polaroid ||
      (evento && evento.pointerId !== ponteiroAtivo)
    ) {
      return;
    }

    polaroid.classList.remove("em-arraste");
    polaroid.style.touchAction = "pan-y";

    if (polaroid.hasPointerCapture(ponteiroAtivo)) {
      polaroid.releasePointerCapture(ponteiroAtivo);
    }

    polaroidArrastada = null;
    ponteiroAtivo = null;
  }

  polaroid.addEventListener("pointerup", finalizarArraste);
  polaroid.addEventListener("pointercancel", finalizarArraste);

  // Evita que arrastar a imagem provoque uma seleção de texto.
  polaroid.addEventListener("dragstart", (evento) => {
    evento.preventDefault();
  });
});

/* =====================================
   CONTADOR DE BATIMENTOS
===================================== */

const heartbeatCounter = selecionar("#heartbeatCounter");

let batimentos = 1420800;

function atualizarBatimentos() {
  if (!heartbeatCounter) return;

  batimentos += 1;

  heartbeatCounter.textContent =
    batimentos.toLocaleString("pt-BR");
}

if (heartbeatCounter) {
  heartbeatCounter.textContent =
    batimentos.toLocaleString("pt-BR");

  window.setInterval(atualizarBatimentos, 1000);
}

/* =====================================
   SURPRESA ROMÂNTICA
===================================== */

const surpriseButton = selecionar("#surpriseButton");
const surpriseMessage = selecionar("#surpriseMessage");

const mensagensSurpresa = [
  "Se eu pudesse escolher uma pessoa para encontrar em todas as vidas, escolheria você. ❤️",

  "Você é uma daquelas pessoas que fazem a vida parecer mais bonita simplesmente por existir.",

  "Meu lugar favorito é qualquer lugar onde eu possa estar com você.",

  "Talvez eu não consiga explicar tudo o que sinto, mas espero que você consiga sentir através de cada pequeno gesto.",

  "Entre tantas pessoas no mundo, meu coração escolheu você. E eu escolheria você de novo.",

  "Heloísa, você é uma parte muito bonita da minha história. Eu te amo! ❤️",

  "Se meu coração pudesse escrever, tenho certeza de que seu nome estaria em todas as páginas."
];

let ultimaMensagem = -1;

if (surpriseButton && surpriseMessage) {
  surpriseButton.addEventListener("click", () => {
    let indice;

    do {
      indice = Math.floor(Math.random() * mensagensSurpresa.length);
    } while (mensagensSurpresa.length > 1 && indice === ultimaMensagem);

    ultimaMensagem = indice;

    // Cria os elementos sem inserir texto do usuário como HTML.
    surpriseMessage.replaceChildren();

    const coracao = document.createElement("span");
    coracao.className = "coracao-mensagem";
    coracao.textContent = "♥";
    coracao.setAttribute("aria-hidden", "true");

    const texto = document.createElement("p");
    texto.textContent = mensagensSurpresa[indice];

    surpriseMessage.append(coracao, texto);
    surpriseMessage.classList.remove("oculto");

    surpriseButton.textContent = "Abrir outra mensagem ♥";

    if (!reduzirMovimento) {
      for (let i = 0; i < 12; i++) {
        window.setTimeout(criarCoracao, i * 100);
      }
    }
  });
}

/* =====================================
   QUIZ DO CASAL
===================================== */

const quizOptions = selecionarTodos(".opcao-quiz");
const quizResult = selecionar("#quizResult");
const quizReset = selecionar("#quizReset");

function responderQuiz(opcaoEscolhida) {
  const correta = opcaoEscolhida.dataset.correct === "true";

  quizOptions.forEach((opcao) => {
    opcao.disabled = true;

    if (opcao.dataset.correct === "true") {
      opcao.classList.add("correta");
    } else if (opcao === opcaoEscolhida && !correta) {
      opcao.classList.add("errada");
    }
  });

  if (!quizResult) return;

  quizResult.textContent = correta
    ? "Acertou, meu amor! ❤️ Mas até essa resposta é pequena perto de tudo o que sinto por você."
    : "Quase! ❤️ A resposta certa é: mais do que consigo explicar.";

  if (quizReset) {
    quizReset.classList.remove("oculto");
  }
}

quizOptions.forEach((opcao) => {
  opcao.addEventListener("click", () => {
    responderQuiz(opcao);
  });
});

if (quizReset) {
  quizReset.addEventListener("click", () => {
    quizOptions.forEach((opcao) => {
      opcao.disabled = false;
      opcao.classList.remove("correta", "errada");
    });

    if (quizResult) {
      quizResult.textContent = "";
    }

    quizReset.classList.add("oculto");
  });
}

/* =====================================
   MÚSICA
===================================== */

// Primeiro tenta tocar o arquivo sua-musica.mp3.
// Se ele não estiver disponível, usa uma melodia
// suave gerada pelo navegador.

const musicButton = selecionar("#musicButton");
const musicLabel = selecionar("#musicLabel");
const musica = selecionar("#musica-fundo");

let tocando = false;
let modoSintetizador = false;
let audioContext = null;
let intervaloMusical = null;
let geracaoAudio = 0;

function atualizarBotaoMusica(ativo) {
  if (!musicButton) return;

  musicButton.setAttribute("aria-pressed", String(ativo));
  musicButton.setAttribute(
    "aria-label",
    ativo ? "Pausar música" : "Tocar música"
  );

  if (musicLabel) {
    musicLabel.textContent = ativo ? "Pausar música" : "Tocar música";
  }
}

function pararMelodia() {
  if (intervaloMusical !== null) {
    clearInterval(intervaloMusical);
    intervaloMusical = null;
  }
}

function tocarAcorde() {
  if (!audioContext || audioContext.state !== "running") return;

  const frequencias = [261.63, 329.63, 392.00];
  const inicio = audioContext.currentTime;

  frequencias.forEach((frequencia, indice) => {
    const oscilador = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscilador.type = "sine";
    oscilador.frequency.value = frequencia;

    const momento = inicio + indice * 0.08;

    volume.gain.setValueAtTime(0.0001, momento);
    volume.gain.exponentialRampToValueAtTime(0.035, momento + 0.35);
    volume.gain.exponentialRampToValueAtTime(0.0001, momento + 2.2);

    oscilador.connect(volume);
    volume.connect(audioContext.destination);

    oscilador.start(momento);
    oscilador.stop(momento + 2.3);
  });
}

async function iniciarMelodia() {
  const AudioContextAPI =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextAPI) {
    throw new Error("Este navegador não oferece suporte ao áudio.");
  }

  if (!audioContext) {
    audioContext = new AudioContextAPI();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  modoSintetizador = true;
  tocarAcorde();

  pararMelodia();
  intervaloMusical = window.setInterval(tocarAcorde, 2800);
}

function pararAudio() {
  if (musica) {
    musica.pause();
  }

  pararMelodia();
  tocando = false;
  atualizarBotaoMusica(false);
}

async function alternarMusica() {
  if (tocando) {
    pararAudio();
    return;
  }

  const tentativaAtual = ++geracaoAudio;

  // Tenta primeiro a música escolhida pelo usuário.
  if (musica && musica.querySelector("source")) {
    try {
      musica.volume = 0.6;

      // Se o arquivo já falhou, não insiste nele.
      if (musica.error) {
        throw new Error("Arquivo de música indisponível.");
      }

      await musica.play();

      if (tentativaAtual !== geracaoAudio) {
        musica.pause();
        return;
      }

      modoSintetizador = false;
      tocando = true;
      atualizarBotaoMusica(true);
      return;
    } catch (erro) {
      if (tentativaAtual !== geracaoAudio) return;

      // Arquivo ausente ou incompatível: tenta a melodia alternativa.
      musica.pause();
      musica.currentTime = 0;
    }
  }

  try {
    await iniciarMelodia();

    if (tentativaAtual !== geracaoAudio) {
      pararMelodia();
      return;
    }

    tocando = true;
    atualizarBotaoMusica(true);
  } catch (erro) {
    pararAudio();

    if (musicLabel) {
      musicLabel.textContent = "Áudio indisponível";
    }

    console.error("Não foi possível iniciar o áudio:", erro);
  }
}

if (musicButton) {
  musicButton.addEventListener("click", alternarMusica);
}

if (musica) {
  musica.addEventListener("ended", () => {
    tocando = false;
    atualizarBotaoMusica(false);
  });

  musica.addEventListener("error", () => {
    // O fallback será acionado quando o usuário apertar o botão.
    console.info(
      "Arquivo de música não encontrado. Uma melodia alternativa está disponível."
    );
  });
}

document.addEventListener("visibilitychange", () => {
  // Não interrompe a música automaticamente ao trocar de aplicativo.
  // O navegador pode suspender o áudio em segundo plano.
});

/* =====================================
   INICIALIZAÇÃO
===================================== */

atualizarBotaoMusica(false);

console.info("Site de Heloísa carregado com sucesso! ❤️");