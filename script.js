/* =========================
   PARTÍCULAS
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
  constructor() {
    this.reset();
  }

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
    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();


/* =========================
   CARTÕES
========================= */

const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


/* =========================
   SURPRESA
========================= */

const surpriseButton =
  document.getElementById('surpriseButton');

const surpriseMessage =
  document.getElementById('surpriseMessage');

const surpriseMessages = [
  'Se eu pudesse escolher uma pessoa para encontrar em todas as vidas, escolheria você. ❤️',

  'Você é uma daquelas pessoas que fazem a vida parecer mais bonita simplesmente por existir.',

  'Meu lugar favorito é qualquer lugar onde eu possa estar com você.',

  'Talvez eu não consiga explicar tudo que sinto, mas espero que você consiga sentir através de cada pequeno gesto.',

  'Entre tantas pessoas no mundo, meu coração escolheu você. E eu escolheria você de novo.',

  'Heloísa, você é uma parte muito bonita da minha história. Vou adorar contar aos nossos filhos a quanto tempos nos conhecemos e pelo o que passamos. ❤️'
];

surpriseButton.addEventListener('click', () => {
  const randomIndex =
    Math.floor(Math.random() * surpriseMessages.length);

  surpriseMessage.innerHTML = `
    <i class="fa-solid fa-heart text-rose-400 text-4xl mb-5"></i>

    <p class="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed">
      ${surpriseMessages[randomIndex]}
    </p>
  `;

  surpriseMessage.classList.remove('hidden');
  surpriseMessage.classList.add('animate-fade-in');
});


/* =========================
   QUIZ
========================= */

const quizOptions =
  document.querySelectorAll('.quiz-option');

const quizResult =
  document.getElementById('quizResult');

quizOptions.forEach((option) => {
  option.addEventListener('click', () => {

    const correct =
      option.dataset.correct === 'true';

    quizOptions.forEach((button) => {
      button.disabled = true;

      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      }
    });

    if (correct) {

      option.classList.add('correct');

      quizResult.innerHTML = `
        <span class="text-rose-500">
          Acertou! ❤️
        </span>
        <br>
        <span class="text-gray-600 text-base">
          Mas mesmo essa resposta ainda não consegue explicar tudo.
        </span>
      `;

    } else {

      option.classList.add('wrong');

      quizResult.innerHTML = `
        <span class="text-rose-500">
          Quase... ❤️
        </span>
        <br>
        <span class="text-gray-600 text-base">
          A resposta certa é: mais do que consigo explicar.
        </span>
      `;
    }

    quizResult.classList.remove('hidden');
  });
});


/* =========================
   CONTADOR DE BATIMENTOS
========================= */

const heartbeatCounter =
  document.getElementById('heartbeatCounter');

let heartbeats = 1420800;

function updateHeartbeat() {

  heartbeats++;

  heartbeatCounter.textContent =
    heartbeats.toLocaleString('pt-BR');

  heartbeatCounter.classList.add('heartbeat');

  setTimeout(() => {
    heartbeatCounter.classList.remove('heartbeat');
  }, 1200);
}

setInterval(updateHeartbeat, 800);


/* =========================
   MÚSICA AMBIENTE
========================= */

const musicButton =
  document.getElementById('musicButton');

let audioContext = null;
let isPlaying = false;
let musicInterval = null;

function playSoftChord() {

  if (!audioContext) {
    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const frequencies = [
    261.63,
    329.63,
    392.00
  ];

  frequencies.forEach((frequency, index) => {

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const startTime =
      audioContext.currentTime + index * 0.05;

    gain.gain.setValueAtTime(
      0,
      startTime
    );

    gain.gain.linearRampToValueAtTime(
      0.035,
      startTime + 0.4
    );

    gain.gain.linearRampToValueAtTime(
      0,
      startTime + 2.5
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 2.6);
  });
}

musicButton.addEventListener('click', () => {

  if (!isPlaying) {

    isPlaying = true;

    musicButton.innerHTML =
      '<i class="fa-solid fa-pause"></i>';

    playSoftChord();

    musicInterval =
      setInterval(playSoftChord, 2800);

  } else {

    isPlaying = false;

    musicButton.innerHTML =
      '<i class="fa-solid fa-music"></i>';

    clearInterval(musicInterval);
  }
});


/* =========================
   MOVIMENTO SUAVE DOS CARDS
========================= */

document.querySelectorAll('.flip-card')
  .forEach((card) => {

    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('flipped')) {
        card.style.transform = 'translateY(-4px)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

  });