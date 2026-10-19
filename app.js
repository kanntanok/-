/**
 * Lattice Rush - Crystal Lattice Speed Game
 * Developed with Three.js & Vanilla JS
 */

// --- DATA: CRYSTAL LATTICES DEFINITION ---
const LATTICE_DATA = [
  {
    id: 'sc',
    name: '単純立方格子',
    enName: 'Simple Cubic (SC)',
    coordinationNumber: 6,
    fillingRate: '52%',
    examples: 'α-ポロニウム(Po)',
    description: '単位格子の8つの頂点のみに原子が位置する最も基本的な結晶構造。',
    // Normalized atom positions [x, y, z] in [-0.5, 0.5]
    positions: [
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],  [0.5, -0.5, 0.5],  [-0.5, 0.5, 0.5],  [0.5, 0.5, 0.5]
    ],
    // Radius for space filling calculation (r relative to unit cell length a = 1)
    spaceRadius: 0.5
  },
  {
    id: 'bcc',
    name: '体心立方格子',
    enName: 'Body-Centered Cubic (BCC)',
    coordinationNumber: 8,
    fillingRate: '68%',
    examples: '鉄(Fe), ナトリウム(Na), タングステン(W)',
    description: '立方の8つの頂点に加え、立方体の中心に1つの原子が位置する構造。',
    positions: [
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],  [0.5, -0.5, 0.5],  [-0.5, 0.5, 0.5],  [0.5, 0.5, 0.5],
      [0, 0, 0] // Body center
    ],
    spaceRadius: Math.sqrt(3) / 4 // ~0.433
  },
  {
    id: 'fcc',
    name: '面心立方格子',
    enName: 'Face-Centered Cubic (FCC)',
    coordinationNumber: 12,
    fillingRate: '74%',
    examples: 'アルミニウム(Al), 銅(Cu), 金(Au), 銀(Ag)',
    description: '8つの頂点に加え、6つの面の中心それぞれに原子が位置する最密充填構造。',
    positions: [
      // Corners
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],  [0.5, -0.5, 0.5],  [-0.5, 0.5, 0.5],  [0.5, 0.5, 0.5],
      // Face centers
      [0, 0, -0.5], [0, 0, 0.5],   // Front / Back
      [0, -0.5, 0], [0, 0.5, 0],   // Bottom / Top
      [-0.5, 0, 0], [0.5, 0, 0]    // Left / Right
    ],
    spaceRadius: Math.sqrt(2) / 4 // ~0.3535
  },
  {
    id: 'nacl',
    name: '塩化ナトリウム型',
    enName: 'NaCl Structure',
    coordinationNumber: 6,
    fillingRate: 'イオン結晶',
    examples: '食塩(NaCl), 酸化マグネシウム(MgO)',
    description: '陽イオンと陰イオンがそれぞれ面心立方格子を形成し互いに入り組んだ構造。',
    positions: [
      // Na+ (Corners & Edges) - Tagged with color/type
      { pos: [-0.5, -0.5, -0.5], type: 'na' }, { pos: [0.5, -0.5, -0.5], type: 'na' },
      { pos: [-0.5, 0.5, -0.5], type: 'na' },  { pos: [0.5, 0.5, -0.5], type: 'na' },
      { pos: [-0.5, -0.5, 0.5], type: 'na' },  { pos: [0.5, -0.5, 0.5], type: 'na' },
      { pos: [-0.5, 0.5, 0.5], type: 'na' },   { pos: [0.5, 0.5, 0.5], type: 'na' },
      { pos: [0, 0, 0], type: 'na' },
      // Cl- (Face centers)
      { pos: [0, 0, -0.5], type: 'cl' }, { pos: [0, 0, 0.5], type: 'cl' },
      { pos: [0, -0.5, 0], type: 'cl' }, { pos: [0, 0.5, 0], type: 'cl' },
      { pos: [-0.5, 0, 0], type: 'cl' }, { pos: [0.5, 0, 0], type: 'cl' }
    ],
    spaceRadius: 0.25
  },
  {
    id: 'diamond',
    name: 'ダイヤモンド構造',
    enName: 'Diamond Structure',
    coordinationNumber: 4,
    fillingRate: '34%',
    examples: 'ダイヤモンド(C), シリコン(Si), ゲルマニウム(Ge)',
    description: 'FCC構造の内部にさらに4つの原子が四面体頂点配置で加わった強力な共有結合構造。',
    positions: [
      // Corners
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],  [0.5, -0.5, 0.5],  [-0.5, 0.5, 0.5],  [0.5, 0.5, 0.5],
      // Faces
      [0, 0, -0.5], [0, 0, 0.5], [0, -0.5, 0], [0, 0.5, 0], [-0.5, 0, 0], [0.5, 0, 0],
      // Internal tetrahedral sub-lattice
      [-0.25, -0.25, -0.25], [0.25, 0.25, -0.25], [-0.25, 0.25, 0.25], [0.25, -0.25, 0.25]
    ],
    spaceRadius: Math.sqrt(3) / 8
  }
];

// --- GAME STATE ---
const gameState = {
  mode: 'quiz', // 'quiz' or 'build'
  currentStage: 0,
  totalStages: 10,
  score: 0,
  combo: 0,
  maxCombo: 0,
  startTime: 0,
  elapsedTime: 0,
  timerInterval: null,
  correctCount: 0,
  currentLattice: null,
  activeAtoms: [], // For build mode
  renderStyle: 'ball-stick', // 'ball-stick' or 'space-fill'
  history: []
};

// --- THREE.JS GLOBALS ---
let scene, camera, renderer, controls;
let atomGroup, wireframeBox;
let raycaster, mouse;

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  setupEventListeners();
});

function initThreeJS() {
  const container = document.getElementById('three-canvas-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e17);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(2.2, 1.8, 2.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 0.8);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x7000ff, 0.5);
  dirLight2.position.set(-5, -5, -5);
  scene.add(dirLight2);

  atomGroup = new THREE.Group();
  scene.add(atomGroup);

  // Unit cell bounding cube wireframe
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const boxMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4 });
  wireframeBox = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), boxMat);
  scene.add(wireframeBox);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onCanvasClick);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  document.getElementById('btn-mode-quiz').addEventListener('click', () => startGame('quiz'));
  document.getElementById('btn-mode-build').addEventListener('click', () => startGame('build'));
  
  document.getElementById('btn-toggle-style').addEventListener('click', toggleRenderStyle);
  document.getElementById('btn-reset-view').addEventListener('click', resetCameraView);
  
  document.getElementById('btn-submit-build').addEventListener('click', checkBuildAnswer);
  
  document.getElementById('btn-retry').addEventListener('click', () => startGame(gameState.mode));
  document.getElementById('btn-home').addEventListener('click', showTitleScreen);
}

// --- SCREEN NAVIGATION ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function showTitleScreen() {
  clearInterval(gameState.timerInterval);
  showScreen('screen-title');
}

// --- GAME LOGIC ---
function startGame(mode) {
  gameState.mode = mode;
  gameState.currentStage = 1;
  gameState.score = 0;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.correctCount = 0;
  gameState.elapsedTime = 0;
  gameState.history = [];
  
  document.getElementById('hud-mode').innerText = mode === 'quiz' ? 'QUIZ MODE' : 'BUILD MODE';
  document.getElementById('quiz-options').style.display = mode === 'quiz' ? 'grid' : 'none';
  document.getElementById('build-controls').style.display = mode === 'build' ? 'flex' : 'none';
  document.getElementById('target-info').style.display = mode === 'build' ? 'block' : 'none';

  showScreen('screen-game');
  onWindowResize();

  gameState.startTime = Date.now();
  gameState.timerInterval = setInterval(updateTimer, 10);

  loadStage();
}

function updateTimer() {
  gameState.elapsedTime = (Date.now() - gameState.startTime) / 1000;
  document.getElementById('hud-timer').innerText = gameState.elapsedTime.toFixed(3);
}

function loadStage() {
  // Update HUD
  document.getElementById('hud-stage').innerText = `${gameState.currentStage} / ${gameState.totalStages}`;
  document.getElementById('hud-score').innerText = gameState.score;
  
  // Pick random crystal lattice
  const lattice = LATTICE_DATA[Math.floor(Math.random() * LATTICE_DATA.length)];
  gameState.currentLattice = lattice;
  gameState.history.push(lattice);

  if (gameState.mode === 'quiz') {
    renderLattice3D(lattice, gameState.renderStyle);
    setupQuizOptions(lattice);
  } else {
    // Build Mode: Display target prompt and load candidate atom mesh nodes
    document.getElementById('target-name').innerText = `${lattice.name} (${lattice.enName})`;
    setupBuildModeStage(lattice);
  }

  resetCameraView();
}

// --- 3D RENDERING LOGIC ---
function renderLattice3D(lattice, style) {
  // Clear existing atoms
  while (atomGroup.children.length > 0) {
    const obj = atomGroup.children[0];
    atomGroup.remove(obj);
  }

  const positions = lattice.positions;
  const isSpaceFill = style === 'space-fill';
  const radius = isSpaceFill ? lattice.spaceRadius : 0.12;

  positions.forEach((p) => {
    let pos = Array.isArray(p) ? p : p.pos;
    let type = Array.isArray(p) ? 'default' : p.type;

    let color = 0x00f0ff;
    if (type === 'cl') color = 0x7000ff;
    if (type === 'na') color = 0xffb700;

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.3,
      roughness: 0.2,
      emissive: color,
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    atomGroup.add(mesh);
  });
}

function setupQuizOptions(correctLattice) {
  const container = document.getElementById('quiz-options');
  container.innerHTML = '';

  // Get options including correct one
  let options = [...LATTICE_DATA].sort(() => Math.random() - 0.5);
  
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt.name;
    btn.addEventListener('click', () => checkQuizAnswer(opt, btn));
    container.appendChild(btn);
  });
}

function checkQuizAnswer(selected, btnElement) {
  const isCorrect = selected.id === gameState.currentLattice.id;
  
  if (isCorrect) {
    btnElement.classList.add('correct');
    handleSuccess();
  } else {
    btnElement.classList.add('wrong');
    // Add penalty time
    gameState.startTime -= 3000;
    handleFailure();
  }

  setTimeout(() => {
    nextStage();
  }, 700);
}

// --- BUILD MODE LOGIC ---
let candidatePositions = [];

function setupBuildModeStage(targetLattice) {
  while (atomGroup.children.length > 0) {
    atomGroup.remove(atomGroup.children[0]);
  }

  // Create a grid of candidate atom sites (3x3x3 lattice points)
  candidatePositions = [];
  const coords = [-0.5, 0, 0.5];

  coords.forEach(x => {
    coords.forEach(y => {
      coords.forEach(z => {
        // Also add internal tetrahedral sites for diamond if needed
        candidatePositions.push([x, y, z]);
      });
    });
  });

  if (targetLattice.id === 'diamond') {
    candidatePositions.push([-0.25, -0.25, -0.25], [0.25, 0.25, -0.25], [-0.25, 0.25, 0.25], [0.25, -0.25, 0.25]);
  }

  // Randomly activate some positions to start
  gameState.activeAtoms = [];
  candidatePositions.forEach((pos) => {
    const isActive = Math.random() > 0.5;
    createInteractiveAtom(pos, isActive);
  });
}

function createInteractiveAtom(pos, active) {
  const geo = new THREE.SphereGeometry(0.12, 24, 24);
  const mat = new THREE.MeshStandardMaterial({
    color: active ? 0x00f0ff : 0x334455,
    transparent: true,
    opacity: active ? 1.0 : 0.25,
    wireframe: !active
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.userData = { pos: pos, active: active };
  atomGroup.add(mesh);
}

function onCanvasClick(event) {
  if (gameState.mode !== 'build') return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(atomGroup.children);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    const currentState = clickedMesh.userData.active;
    const newState = !currentState;

    clickedMesh.userData.active = newState;
    clickedMesh.material.color.setHex(newState ? 0x00f0ff : 0x334455);
    clickedMesh.material.opacity = newState ? 1.0 : 0.25;
    clickedMesh.material.wireframe = !newState;
  }
}

function checkBuildAnswer() {
  const targetPosList = gameState.currentLattice.positions.map(p => Array.isArray(p) ? p : p.pos);
  
  // Get positions of active atoms
  const currentActivePos = atomGroup.children
    .filter(m => m.userData.active)
    .map(m => m.userData.pos);

  // Check equality
  const isMatch = comparePositions(targetPosList, currentActivePos);

  if (isMatch) {
    handleSuccess();
  } else {
    gameState.startTime -= 3000;
    handleFailure();
  }

  setTimeout(() => {
    nextStage();
  }, 700);
}

function comparePositions(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const eps = 0.01;

  return arr1.every(p1 => {
    return arr2.some(p2 => {
      return Math.abs(p1[0] - p2[0]) < eps &&
             Math.abs(p1[1] - p2[1]) < eps &&
             Math.abs(p1[2] - p2[2]) < eps;
    });
  });
}

// --- COMBO & SCORE ---
function handleSuccess() {
  gameState.correctCount++;
  gameState.combo++;
  if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

  const basePoints = 1000;
  const comboBonus = gameState.combo * 200;
  gameState.score += basePoints + comboBonus;

  // Trigger Combo UI Animation
  if (gameState.combo >= 2) {
    const comboEl = document.getElementById('hud-combo');
    document.getElementById('combo-count').innerText = gameState.combo;
    comboEl.classList.add('active');
    setTimeout(() => comboEl.classList.remove('active'), 600);
  }

  // Confetti effect on high combo
  if (gameState.combo % 3 === 0 && typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  }
}

function handleFailure() {
  gameState.combo = 0;
}

function nextStage() {
  if (gameState.currentStage >= gameState.totalStages) {
    finishGame();
  } else {
    gameState.currentStage++;
    loadStage();
  }
}

function toggleRenderStyle() {
  gameState.renderStyle = gameState.renderStyle === 'ball-stick' ? 'space-fill' : 'ball-stick';
  document.getElementById('btn-toggle-style').innerText = 
    gameState.renderStyle === 'ball-stick' ? '🔮 充填モデル切替' : '⚾ ボール＆スティック切替';

  if (gameState.currentLattice && gameState.mode === 'quiz') {
    renderLattice3D(gameState.currentLattice, gameState.renderStyle);
  }
}

function resetCameraView() {
  camera.position.set(2.2, 1.8, 2.5);
  controls.target.set(0, 0, 0);
  controls.update();
}

// --- RESULT & SUMMARY ---
function finishGame() {
  clearInterval(gameState.timerInterval);
  showScreen('screen-result');

  document.getElementById('res-score').innerText = gameState.score.toLocaleString();
  document.getElementById('res-time').innerText = `${gameState.elapsedTime.toFixed(2)}s`;
  
  const accuracy = Math.round((gameState.correctCount / gameState.totalStages) * 100);
  document.getElementById('res-accuracy').innerText = `${accuracy}%`;
  document.getElementById('res-maxcombo').innerText = gameState.maxCombo;

  // Calculate Rank
  let rank = 'C';
  if (gameState.score > 12000) rank = 'S';
  else if (gameState.score > 9000) rank = 'A';
  else if (gameState.score > 6000) rank = 'B';
  
  const rankEl = document.getElementById('res-rank');
  rankEl.innerText = rank;
  rankEl.className = `stat-value rank-${rank.toLowerCase()}`;

  // Populate Recap
  const recapContainer = document.getElementById('recap-list');
  recapContainer.innerHTML = '';
  
  const uniqueLattices = [...new Set(gameState.history)];
  uniqueLattices.forEach(lat => {
    const item = document.createElement('div');
    item.className = 'recap-item';
    item.innerHTML = `<strong>${lat.name} (${lat.enName})</strong>: 配位数 ${lat.coordinationNumber} | 充填率: ${lat.fillingRate} <br><span style="color:var(--text-muted);">${lat.description}</span>`;
    recapContainer.appendChild(item);
  });

  // Victory Confetti
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
  }
}
