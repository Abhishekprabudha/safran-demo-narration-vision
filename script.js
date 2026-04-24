const video = document.getElementById('demoVideo');
const narrationAudio = document.getElementById('narrationAudio');
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startButton');
const replayButton = document.getElementById('replayButton');
const toggleNarrationButton = document.getElementById('toggleNarrationButton');
const toggleVideoMuteButton = document.getElementById('toggleVideoMuteButton');
const captionText = document.getElementById('captionText');
const voiceStatus = document.getElementById('voiceStatus');
const pulseDot = document.getElementById('pulseDot');

const narrationCues = [
  {
    start: 0,
    end: 12,
    caption: 'AIonOS opens with Safran\'s production floor and shows how existing CCTV feeds can be turned into one live operational cockpit.',
  },
  {
    start: 12,
    end: 24,
    caption: 'The vision layer watches every zone continuously, converting camera footage into counts, movement patterns, congestion signals, and station-level status.',
  },
  {
    start: 24,
    end: 37,
    caption: 'From there, supervisors see operations control in one place: active lines, work-in-progress, hand-off delays, dwell time, and emerging bottlenecks.',
  },
  {
    start: 37,
    end: 50,
    caption: 'The same agents measure productivity by tracking cycle adherence, idle windows, queue build-up, staffing imbalance, and asset utilisation across the floor.',
  },
  {
    start: 50,
    end: 64,
    caption: 'Safety and compliance are monitored at the same time, with PPE checks, restricted-area breaches, unsafe motion, and escalation triggers backed by visual evidence.',
  },
  {
    start: 64,
    end: 79,
    caption: 'Instead of just showing footage, the cockpit recommends action: rebalance work, intervene at a delayed station, inspect an exception, or validate a compliance breach.',
  },
  {
    start: 79,
    end: 93,
    caption: 'Managers can move from camera view to decision view, using AI reasoning to understand why throughput is slipping and what to change next.',
  },
  {
    start: 93,
    end: 107,
    caption: 'Taken together, Safran Vision Agents turn CCTV into a production intelligence layer for operations control, productivity improvement, safety, and compliance.',
  },
];

let currentCueIndex = -1;
let narrationEnabled = true;
let userStarted = false;

function updateCue(force = false) {
  const time = narrationAudio.currentTime || video.currentTime;
  const nextIndex = narrationCues.findIndex(cue => time >= cue.start && time < cue.end);

  if (nextIndex === -1) return;
  if (!force && nextIndex === currentCueIndex) return;

  currentCueIndex = nextIndex;
  captionText.textContent = narrationCues[nextIndex].caption;
  pulseDot.style.background = narrationEnabled ? 'var(--accent-3)' : '#8796ac';
}

function syncVideoToNarration() {
  if (!narrationEnabled) return;

  const drift = Math.abs(video.currentTime - narrationAudio.currentTime);
  if (drift > 0.35) {
    video.currentTime = narrationAudio.currentTime % (video.duration || narrationAudio.currentTime || 1);
  }
}

async function startExperience() {
  userStarted = true;
  startOverlay.classList.add('hidden');

  narrationAudio.currentTime = 0;
  video.currentTime = 0;

  try {
    await Promise.all([video.play(), narrationAudio.play()]);
    voiceStatus.textContent = 'Narration status: MP3 playback active';
  } catch {
    voiceStatus.textContent = 'Narration status: click replay if playback was blocked';
  }

  updateCue(true);
}

async function replayNarration() {
  currentCueIndex = -1;
  narrationAudio.currentTime = 0;
  video.currentTime = 0;

  try {
    await Promise.all([video.play(), narrationAudio.play()]);
  } catch {
    // controls remain visible for manual retry
  }

  updateCue(true);
}

function toggleNarration() {
  narrationEnabled = !narrationEnabled;

  if (!narrationEnabled) {
    narrationAudio.pause();
    toggleNarrationButton.textContent = 'Resume narration';
    voiceStatus.textContent = 'Narration status: paused';
    captionText.textContent = 'Narration paused. Video continues inline.';
    pulseDot.style.background = '#8796ac';
    return;
  }

  toggleNarrationButton.textContent = 'Pause narration';
  voiceStatus.textContent = 'Narration status: MP3 playback active';
  narrationAudio.currentTime = video.currentTime;
  narrationAudio.play().catch(() => {});
  updateCue(true);
}

function toggleVideoMute() {
  video.muted = !video.muted;
  toggleVideoMuteButton.textContent = video.muted ? 'Keep video muted' : 'Mute video audio';
}

startButton.addEventListener('click', startExperience);
replayButton.addEventListener('click', replayNarration);
toggleNarrationButton.addEventListener('click', toggleNarration);
toggleVideoMuteButton.addEventListener('click', toggleVideoMute);

narrationAudio.addEventListener('timeupdate', () => {
  if (!userStarted || !narrationEnabled) return;
  syncVideoToNarration();
  updateCue(false);
});

narrationAudio.addEventListener('ended', () => {
  if (!userStarted || !narrationEnabled) return;
  narrationAudio.currentTime = 0;
  narrationAudio.play().catch(() => {});
});

video.addEventListener('timeupdate', () => {
  if (!userStarted || narrationEnabled) return;
  updateCue(false);
});

narrationAudio.addEventListener('loadedmetadata', () => {
  captionText.textContent = `Ready to begin the ${Math.round(narrationAudio.duration)}-second narrated walkthrough.`;
  voiceStatus.textContent = 'Narration status: ready (repo MP3)';
});
