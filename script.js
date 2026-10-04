/* =========================
   PARTÍCULAS DE FUNDO
========================= */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.4 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = Math.random() * 100;
  }
  update() {
    this.y -= this.speedY;
    this.life += 0.5;
    if (this.y < -10) {
      this.reset();
      this.y = canvas.height + 10;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =========================
   CARTÕES DE MOTIVOS
========================= */
const flipCards = document.querySelectorAll('.flip-card');
flipCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
  // Hover effect
  card.addEventListener('mouseenter', () => {
    if (!card.classList.contains('flipped')) card.style.transform = 'translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* =========================
   NOVA INTERAÇÃO 1: LINHA DO TEMPO
========================= */
const timelineBtns = document.querySelectorAll('.timeline-btn');
const timelineContents = document.querySelectorAll('.timeline-content');

timelineBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active de todos os botões
    timelineBtns.forEach(b => b.classList.remove('active', 'bg-rose-500', 'text-white'));
    // Adiciona classe base para inativos
    timelineBtns.forEach(b => b.classList.add('text-rose-500'));
    
    // Adiciona active no clicado
    btn.classList.add('active', 'bg-rose-500', 'text-white');
    btn.classList.remove('text-rose-500');

    // Esconde todos os textos
    timelineContents.forEach(content => {
      content.classList.add('hidden');
      content.classList.remove('animate-fade-in');
    });

    // Mostra o texto alvo
    const targetId = btn.getAttribute('data-target');
    const targetContent = document.getElementById(targetId);
    targetContent.classList.remove('hidden');
    // Força reflow para reativar animação
    void targetContent.offsetWidth; 
    targetContent.classList.add('animate-fade-in');
  });
});

/* =========================
   CONTADOR DE BATIMENTOS
========================= */
const heartbeatCounter = document.getElementById('heartbeatCounter');
let heartbeats = 1420800;
setInterval(() => {
  heartbeats++;
  heartbeatCounter.textContent = heartbeats.toLocaleString('pt-BR');
  heartbeatCounter.classList.add('heartbeat');
  setTimeout(() => heartbeatCounter.classList.remove('heartbeat'), 1200);
}, 800);

/* =========================
   NOVA INTERAÇÃO 2: CALCULADORA DO AMOR
========================= */
const btnCalcular = document.getElementById('btnCalcular');
const calcInput = document.getElementById('calcName');
const calcLoading = document.getElementById('calcLoading');
const calcResult = document.getElementById('calcResult');
const calcProgress = document.getElementById('calcProgress');

btnCalcular.addEventListener('click', () => {
  if(calcInput.value.trim() === '') {
    alert("Digite o nome dela primeiro! ❤️");
    return;
  }
  
  // Esconde botão e mostra loading
  btnCalcular.classList.add('hidden');
  calcResult.classList.add('hidden');
  calcLoading.classList.remove('hidden');
  calcProgress.style.width = '0%';

  // Simula um processamento (2 segundos)
  setTimeout(() => {
    calcLoading.classList.add('hidden');
    calcResult.classList.remove('hidden');
    calcResult.classList.add('animate-fade-in');
    
    // Anima a barra de progresso até 100%
    setTimeout(() => {
      calcProgress.style.transition = 'width 1.5s ease-in-out';
      calcProgress.style.width = '100%';
    }, 100);
    
  }, 2000);
});

/* =========================
   SURPRESA
========================= */
const surpriseButton = document.getElementById('surpriseButton');
const surpriseMessage = document.getElementById('surpriseMessage');
const surpriseMessages = [
  'Se eu pudesse escolher uma pessoa para encontrar em todas as vidas, escolheria você. ❤️',
  'Você é uma daquelas pessoas que fazem a vida parecer mais bonita simplesmente por existir.',
  'Meu lugar favorito é qualquer lugar onde eu possa estar com você.',
  'Talvez eu não consiga explicar tudo que sinto, mas espero que você consiga sentir através de cada pequeno gesto.',
  'Entre tantas pessoas no mundo, meu coração escolheu você. E eu escolheria você de novo.',
  'Heloísa, você é uma parte muito bonita da minha história. Vou adorar contar aos nossos filhos a quanto tempos nos conhecemos e pelo o que passamos. ❤️'
];

surpriseButton.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * surpriseMessages.length);
  surpriseMessage.innerHTML = `
    <i class="fa-solid fa-heart text-rose-400 text-4xl mb-5"></i>
    <p class="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed">${surpriseMessages[randomIndex]}</p>
  `;
  surpriseMessage.classList.remove('hidden');
  surpriseMessage.classList.add('animate-fade-in');
});

/* =========================
   QUIZ
========================= */
const quizOptions = document.querySelectorAll('.quiz-option');
const quizResult = document.getElementById('quizResult');

quizOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const correct = option.dataset.correct === 'true';
    quizOptions.forEach((button) => {
      button.disabled = true;
      if (button.dataset.correct === 'true') button.classList.add('correct');
    });

    if (correct) {
      option.classList.add('correct');
      quizResult.innerHTML = <span class="text-rose-500">Acertou! ❤️</span><br><span class="text-gray-600 text-base">Mas mesmo essa resposta ainda não consegue explicar tudo.</span>;
    } else {
      option.classList.add('wrong');
      quizResult.innerHTML = <span class="text-rose-500">Quase... ❤️</span><br><span class="text-gray-600 text-base">A resposta certa é: mais do que consigo explicar.</span>;
    }
    quizResult.classList.remove('hidden');
    quizResult.classList.add('animate-fade-in');
  });
});

/* =========================
   MÚSICA AMBIENTE
========================= */
const musicButton = document.getElementById('musicButton');
let audioContext = null;
let isPlaying = false;
let musicInterval = null;

function playSoftChord() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();

  const frequencies = [261.63, 329.63, 392.00];
  frequencies.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const startTime = audioContext.currentTime + index * 0.05;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.035, startTime + 0.4);
    gain.gain.linearRampToValueAtTime(0, startTime + 2.5);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(startTime);
    osc.stop(startTime + 2.6);
  });
}

musicButton.addEventListener('click', () => {
  if (!isPlaying) {
    isPlaying = true;
    musicButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playSoftChord();
    musicInterval = setInterval(playSoftChord, 2800);
  } else {
    isPlaying = false;
    musicButton.innerHTML = '<i class="fa-solid fa-music"></i>';
    clearInterval(musicInterval);
  }
});

/* =========================
   NOVA INTERAÇÃO 3: CHUVA DE CORAÇÕES
========================= */
const rainButton = document.getElementById('rainButton');

function createFallingHeart() {
  const heart = document.createElement('div');
  heart.classList.add('falling-heart');
  // Pode variar entre coração preenchido ou brilhante
  heart.innerHTML = Math.random() > 0.5 ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-solid fa-sparkling-heart"></i>';
  
  // Posição aleatória na largura da tela
  heart.style.left = Math.random() * 100 + 'vw';
  
  // Tamanho aleatório
  const size = Math.random() * 1.5 + 0.5; // 0.5 a 2
  heart.style.transform = scale(${size});
  
  // Duração da queda aleatória (entre 3s e 6s)
  const duration = Math.random() * 3 + 3;
  heart.style.animationDuration = duration + 's';
  
  document.body.appendChild(heart);
  
  // Remove o coração do DOM depois que a animação termina
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

rainButton.addEventListener('click', () => {
  // Cria 30 corações disparados em intervalos pequenos para dar um efeito de "explosão"
  for(let i = 0; i < 30; i++) {
    setTimeout(createFallingHeart, i * 100);
  }
});