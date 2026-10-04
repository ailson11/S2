/* =========================
   CURSOR PERSONALIZADO
========================= */
const cursor = document.getElementById('custom-cursor');
if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click-effect'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click-effect'));

  // Efeito ao passar por elementos interativos
  const interactives = document.querySelectorAll('a, button, .flip-card, .polaroid-card, input, #hero-heart');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
  });
}

/* =========================
   ANIMAÇÃO DE SCROLL (REVEAL)
========================= */
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Anima apenas uma vez
    }
  });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

/* =========================
   HEADER DINÂMICO
========================= */
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('shadow-md', 'py-2');
    header.classList.remove('py-4');
  } else {
    header.classList.remove('shadow-md', 'py-2');
    header.classList.add('py-4');
  }
});

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
    // Corções e tons de rosa misturados
    this.color = Math.random() > 0.5 ? '#fda4af' : '#fecdd3'; 
  }
  update() {
    this.y -= this.speedY;
    if (this.y < -10) {
      this.reset();
      this.y = canvas.height + 10;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =========================
   GALERIA INTERATIVA (DRAG & DROP)
========================= */
const draggables = document.querySelectorAll('.polaroid-card');
let maxZ = 50;

draggables.forEach(card => {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  // Touch & Mouse events
  card.addEventListener('mousedown', dragStart);
  card.addEventListener('touchstart', dragStart, {passive: true});

  function dragStart(e) {
    isDragging = true;
    maxZ++;
    card.style.zIndex = maxZ;
    card.style.transition = 'none'; // Remove delay ao arrastar

    if(e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }

    const transform = window.getComputedStyle(card).getPropertyValue('transform');
    let matrix = new WebKitCSSMatrix(transform);
    initialX = matrix.m41;
    initialY = matrix.m42;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault(); // Previne scroll ao arrastar
    
    let currentX, currentY;
    if(e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    let diffX = currentX - startX;
    let diffY = currentY - startY;

    card.style.transform = translate(${initialX + diffX}px, ${initialY + diffY}px) rotate(0deg) scale(1.05);
  }

  function dragEnd() {
    isDragging = false;
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    // Devolve uma rotação aleatória sutil
    const randomRotate = (Math.random() * 10 - 5).toFixed(1);
    const currentTransform = card.style.transform.replace(/rotate\(.?\)/, '').replace(/scale\(.?\)/, '');
    card.style.transform = ${currentTransform} rotate(${randomRotate}deg) scale(1);

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
  }
});

/* =========================
   LINHA DO TEMPO
========================= */
const timelineBtns = document.querySelectorAll('.timeline-btn');
const timelineContents = document.querySelectorAll('.timeline-content');

timelineBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    timelineBtns.forEach(b => {
      b.classList.remove('active', 'bg-rose-500', 'text-white', 'shadow-lg');
      b.classList.add('text-rose-500');
    });
    
    btn.classList.add('active', 'bg-rose-500', 'text-white', 'shadow-lg');
    btn.classList.remove('text-rose-500');

    timelineContents.forEach(content => {
      content.classList.add('hidden');
      content.classList.remove('active');
    });

    const targetId = btn.getAttribute('data-target');
    const targetContent = document.getElementById(targetId);
    targetContent.classList.remove('hidden');
    
    // Pequeno atraso para a animação CSS aplicar
    setTimeout(() => {
      targetContent.classList.add('active');
    }, 50);
  });
});

/* =========================
   CONTADOR DE BATIMENTOS
========================= */
const heartbeatCounter = document.getElementById('heartbeatCounter');
const heartbeatBtn = document.getElementById('heartbeat-btn');
let heartbeats = 1420800;
let beatInterval;

function startBeating() {
  beatInterval = setInterval(() => {
    heartbeats += Math.floor(Math.random() * 3) + 1; // Incremento dinâmico
    heartbeatCounter.textContent = heartbeats.toLocaleString('pt-BR');
  }, 1000);
}
startBeating();

// Interação extra ao clicar no botão do coração
heartbeatBtn.addEventListener('click', () => {
  heartbeats += 100; // Pulo grande de batimentos
  heartbeatCounter.textContent = heartbeats.toLocaleString('pt-BR');
  heartbeatCounter.classList.remove('scale-in');
  void heartbeatCounter.offsetWidth; // Reflow
  heartbeatCounter.classList.add('scale-in', 'text-rose-600');
  setTimeout(() => heartbeatCounter.classList.remove('text-rose-600'), 500);
  
  // Solta um mini coração
  createFallingHeart(true);
});

/* =========================
   CALCULADORA DO AMOR
========================= */
const btnCalcular = document.getElementById('btnCalcular');
const calcInput = document.getElementById('calcName');
const calcLoading = document.getElementById('calcLoading');
const calcResult = document.getElementById('calcResult');
const calcProgress = document.getElementById('calcProgress');

btnCalcular.addEventListener('click', () => {
  const name = calcInput.value.trim().toLowerCase();
  
  if(name === '') {
    alert("Digite o nome dela primeiro, Amor! ❤️");
    return;
  }
  
  btnCalcular.classList.add('hidden');
  calcResult.classList.add('hidden');
  calcLoading.classList.remove('hidden');
  calcProgress.style.width = '0%';

  setTimeout(() => {
    calcLoading.classList.add('hidden');
    calcResult.classList.remove('hidden');
    
    setTimeout(() => {
      calcProgress.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
      calcProgress.style.width = '100%';
    }, 100);
    
  }, 2500); // 2.5s de suspense
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
  'Heloísa, você é uma parte muito bonita da minha história. Vou adorar contar aos nossos filhos há quanto tempo nos conhecemos e pelo que passamos. ❤️'
];

surpriseButton.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * surpriseMessages.length);
  surpriseMessage.innerHTML = `
    <i class="fa-solid fa-heart-pulse text-rose-500 text-5xl mb-6 heartbeat"></i>
    <p class="font-serif text-2xl md:text-3xl text-gray-800 leading-relaxed italic">"${surpriseMessages[randomIndex]}"</p>
  `;
  
  surpriseMessage.classList.remove('hidden');
  surpriseButton.classList.add('hidden'); // Esconde o botão após abrir
  
  setTimeout(() => {
    surpriseMessage.classList.remove('scale-95');
    surpriseMessage.classList.add('scale-100');
  }, 50);

  // Solta fogos de corações
  for(let i=0; i<15; i++) setTimeout(createFallingHeart, i * 150);
});

/* =========================
   QUIZ
========================= */
const quizOptions = document.querySelectorAll('.quiz-option');
const quizResult = document.getElementById('quizResult');

quizOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const isCorrect = option.dataset.correct === 'true';
    
    quizOptions.forEach((button) => {
      button.disabled = true;
      button.classList.add('cursor-not-allowed');
      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      } else {
        button.classList.add('wrong');
      }
    });

    quizResult.classList.remove('hidden', 'bg-green-50', 'bg-red-50');
    
    if (isCorrect) {
      quizResult.classList.add('bg-green-50', 'border', 'border-green-200');
      quizResult.innerHTML = <span class="text-green-600 font-bold block mb-2">Acertou! ❤️</span><span class="text-gray-700 text-base">Mas mesmo essa resposta ainda não consegue explicar tudo.</span>;
      for(let i=0; i<5; i++) setTimeout(createFallingHeart, i * 200);
    } else {
      quizResult.classList.add('bg-red-50', 'border', 'border-red-200');
      quizResult.innerHTML = <span class="text-red-500 font-bold block mb-2">Quase... ❤️</span><span class="text-gray-700 text-base">A resposta certa era a letra C.</span>;
    }
    
    quizResult.classList.add('scale-in');
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

  // Acordes suaves e românticos
  const frequencies = [261.63, 329.63, 392.00, 523.25]; 
  frequencies.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = index % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    
    const startTime = audioContext.currentTime + (index * 0.1);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.02, startTime + 1); // Ataque suave
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 4); // Decaimento longo

    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 4.5);
  });
}

musicButton.addEventListener('click', () => {
  if (!isPlaying) {
    isPlaying = true;
    musicButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    musicButton.classList.add('bg-rose-500', 'text-white');
    musicButton.classList.remove('bg-rose-100', 'text-rose-500');
    
    playSoftChord();
    musicInterval = setInterval(playSoftChord, 3500);
  } else {
    isPlaying = false;
    musicButton.innerHTML = '<i class="fa-solid fa-music"></i>';
    musicButton.classList.remove('bg-rose-500', 'text-white');
    musicButton.classList.add('bg-rose-100', 'text-rose-500');
    clearInterval(musicInterval);
  }
});

/* =========================
   CHUVA DE CORAÇÕES
========================= */
const rainButton = document.getElementById('rainButton');

function createFallingHeart(fromCenter = false) {
  const heart = document.createElement('div');
  heart.classList.add('falling-heart');
  heart.innerHTML = Math.random() > 0.4 ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-solid fa-sparkling-heart"></i>';
  
  if(fromCenter) {
    heart.style.left = '50vw';
    heart.style.top = '50vh';
  } else {
    heart.style.left = Math.random() * 100 + 'vw';
  }
  
  const size = Math.random() * 1.5 + 0.8;
  heart.style.transform = scale(${size});
  
  const duration = Math.random() * 2 + 3;
  heart.style.animationDuration = duration + 's';
  
  document.body.appendChild(heart);
  
  setTimeout(() => heart.remove(), duration * 1000);
}

rainButton.addEventListener('click', () => {
  const btnIcon = rainButton.querySelector('i');
  btnIcon.classList.add('fa-spin');
  setTimeout(() => btnIcon.classList.remove('fa-spin'), 1000);

  // Explosão em ondas
  for(let i = 0; i < 40; i++) {
    setTimeout(() => createFallingHeart(), i * 50);
  }
});