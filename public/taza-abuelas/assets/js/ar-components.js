// ── Elementos principales ──
const scene        = document.querySelector('a-scene');
const overlay      = document.getElementById('loading-overlay');
const startOverlay = document.getElementById('start-overlay');
const startBtn     = document.getElementById('start-btn');
const hint         = document.getElementById('hint');
const target       = document.querySelector('[mindar-image-target]');
const audioBtn     = document.getElementById('audio-btn');
const orbitPivot   = document.getElementById('orbit-pivot');
const audio        = document.getElementById('audio-detect');

let audioUnlocked   = false;
let userMuted       = false;
let isTargetVisible = false;

// ── 1. Inicialización de AR ──
scene.addEventListener('arReady', () => {
  overlay.classList.add('hidden');
  startOverlay.style.display = 'flex';
});

// NUEVO: Detectar si la cámara falla o los permisos son denegados
scene.addEventListener('arError', (ev) => {
  console.error("Error al iniciar MindAR:", ev);
  overlay.innerHTML = '<p style="color:#ff6b6b; font-weight:bold; text-align:center; padding:20px;">No se pudo acceder a la cámara.<br>Por favor, revisa los permisos y recarga la página.</p>';
});

// ── 2. Botón de Iniciar (Desbloquea Audio) ──
startBtn.addEventListener('click', () => {
  // Al hacer tap, forzamos la carga y desbloqueo del audio
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audioUnlocked = true;
  }).catch((err) => {
    console.warn("Audio autoplay bloqueado:", err);
    audioUnlocked = true;
  });
  
  startOverlay.style.display = 'none';
  audioBtn.style.display = 'flex';
});

// ── 3. Control manual de Audio ──
audioBtn.addEventListener('click', () => {
  userMuted = !userMuted;
  if (userMuted) {
    audioBtn.textContent = '🔇';
    audio.pause();
  } else {
    audioBtn.textContent = '🔊';
    if (isTargetVisible) {
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }
});

// ── 4. Eventos del Marcador ──
target.addEventListener('targetFound', () => {
  isTargetVisible = true;
  hint.classList.add('hidden');
  orbitPivot.setAttribute('orbit-animation', 'paused', false);

  if (audioUnlocked && !userMuted) {
    if (audio.ended) audio.currentTime = 0;
    audio.play().catch(() => {});
  }
});

target.addEventListener('targetLost', () => {
  isTargetVisible = false;
  hint.classList.remove('hidden');
  orbitPivot.setAttribute('orbit-animation', 'paused', true);
  audio.pause();
});

// ── 5. Lógica del Panel de Calibración ──
document.getElementById('cal-btn').addEventListener('click', function() {
  document.getElementById('cal-panel').style.display = 'block';
  this.style.display = 'none';
});

document.querySelector('#cal-panel .close').addEventListener('click', function() {
  this.parentElement.style.display = 'none';
  document.getElementById('cal-btn').style.display = 'block';
});

document.getElementById('in-r').addEventListener('input', function() {
  document.getElementById('v-r').textContent = this.value;
  document.getElementById('panuelo').setAttribute('position', this.value + ' 0 0');
});

document.getElementById('in-z').addEventListener('input', function() {
  document.getElementById('v-z').textContent = this.value;
  let p = document.getElementById('orbit-center');
  p.setAttribute('position', { x: 0, y: p.getAttribute('position').y, z: parseFloat(this.value) });
});

document.getElementById('in-h').addEventListener('input', function() {
  document.getElementById('v-h').textContent = this.value;
  let p = document.getElementById('orbit-center');
  p.setAttribute('position', { x: 0, y: parseFloat(this.value), z: p.getAttribute('position').z });
});

document.getElementById('in-s').addEventListener('input', function() {
  document.getElementById('v-s').textContent = this.value;
  document.getElementById('panuelo').setAttribute('width', this.value);
  document.getElementById('panuelo').setAttribute('height', this.value);
});

document.getElementById('in-sp').addEventListener('input', function() {
  document.getElementById('v-sp').textContent = this.value;
  document.getElementById('orbit-pivot').setAttribute('orbit-animation', 'speed', this.value);
});

document.getElementById('chk-debug').addEventListener('change', function() {
  document.getElementById('debug-cup').setAttribute('visible', this.checked);
});

document.getElementById('in-br').addEventListener('input', function() {
  document.getElementById('v-br').textContent = this.value;
  document.getElementById('ar-base').setAttribute('radius', this.value);
});

document.getElementById('in-by').addEventListener('input', function() {
  document.getElementById('v-by').textContent = this.value;
  document.getElementById('ar-base').setAttribute('position', { x: 0, y: parseFloat(this.value), z: 0 });
});
