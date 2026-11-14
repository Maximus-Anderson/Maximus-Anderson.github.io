// car-viewer.js — Three.js FSAE car viewer
// Scroll-driven: front-wing close-up → car left / project banners right
import * as THREE from 'three';
import { GLTFLoader }      from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }     from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ─── CAMERA KEYFRAMES ────────────────────────────────────────────────────────
const CAM_INTRO  = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
const CAM_BROWSE = { pos: new THREE.Vector3(), target: new THREE.Vector3() };

const mobileQuery = window.matchMedia('(max-width: 600px)');

function updateCamKeyframes() {
    if (mobileQuery.matches) {
        CAM_INTRO.pos.set(    0.0,  9.0,  6.0);
        CAM_INTRO.target.set( 0.0,  -1.4,  3.28);
        CAM_BROWSE.pos.set(   21.5,  1.0,  0.0);
        CAM_BROWSE.target.set( 0.0, -3.5,  0.0);
    } else {
        CAM_INTRO.pos.set(    0.00,  2.64,  2.17);
        CAM_INTRO.target.set( 0.00,  1.5,  2.08);
        CAM_BROWSE.pos.set(   6.0,   4.0,   9.0);
        CAM_BROWSE.target.set(2.0,   0.0,   0.0);
    }
}
updateCamKeyframes();
mobileQuery.addEventListener('change', updateCamKeyframes);

// Scroll fractions (0 – 1 of .car-scroll-driver height) that define each phase
const SCROLL_CAM_START    = 0.12;   // camera starts moving
const SCROLL_CAM_END      = 0.52;   // camera reaches browse position
const SCROLL_BANNERS_SHOW = 0.42;   // banners begin fading in
const SCROLL_BANNERS_FULL = 0.72;   // banners fully visible
const SWEEP_RATIO         = 0.45;   // list px per page-scroll px (lower = slower sweep)
const SCROLL_TAIL_PX      = 60;     // scroll runway after the sweep before the footer
const SCROLL_PAUSE_PX     = 300;
const GATE_RELEASE_MULT   = 1.6;
const GATE_DECAY          = 0.9;
const GATE_IDLE_MS        = 120;
const GATE_BACKSTOP_MS    = 600;

// ─── DOM REFS ────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('car-canvas');
const heroTextEl    = document.getElementById('car-hero-text');
const bannersPanelEl = document.getElementById('projects-banners');
const projectsPageEl = document.getElementById('projects-page');

// ─── RENDERER ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobileQuery.matches ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping        = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace   = THREE.SRGBColorSpace;

// ─── SCENE & CAMERA ──────────────────────────────────────────────────────────
const scene  = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
camera.position.copy(CAM_INTRO.pos);

// ─── ENVIRONMENT ─────────────────────────────────────────────────────────────
const pmrem   = new THREE.PMREMGenerator(renderer);
const roomEnv = new RoomEnvironment(renderer);
scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
pmrem.dispose();
roomEnv.dispose();

// ─── LIGHTS ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x6688cc, 0.35);
rimLight.position.set(-5, 2, -4);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
fillLight.position.set(0, -3, 3);
scene.add(fillLight);

// ─── CARBON FIBRE MATERIAL ───────────────────────────────────────────────────
const carbonMat = new THREE.MeshStandardMaterial({
    color:           0x0d0d0d,   // near-black
    roughness:       0.36,        // some sheen
    metalness:       0.12,
    envMapIntensity: 1.3,
});

// ─── LOAD MODEL ──────────────────────────────────────────────────────────────
let carModel   = null;
let modelBaseY = 0;
let modelLoaded = false;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/libs/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

function loadModel() {
    if (modelLoaded) return;
    modelLoaded = true;

    gltfLoader.load(
        'modules/CR30-Optimized.glb',

        (gltf) => {
            carModel = gltf.scene;

            carModel.traverse((child) => {
                if (child.isMesh) {
                    child.material      = carbonMat;
                    child.castShadow    = false;
                    child.receiveShadow = false;
                }
            });

            // Auto-centre and scale so the longest axis ≈ 5 world units
            const box    = new THREE.Box3().setFromObject(carModel);
            const center = box.getCenter(new THREE.Vector3());
            const size   = box.getSize(new THREE.Vector3());
            const scale  = 5 / Math.max(size.x, size.y, size.z);

            carModel.scale.setScalar(scale);
            carModel.position.sub(center.multiplyScalar(scale));

            modelBaseY = carModel.position.y;
            scene.add(carModel);
        },
        undefined,
        (err) => console.error('[car-viewer] Load error:', err)
    );
}

// ─── SCROLL ANIMATION ────────────────────────────────────────────────────────
const targetCamPos  = new THREE.Vector3().copy(CAM_INTRO.pos);
const targetCamLook = new THREE.Vector3().copy(CAM_INTRO.target);
const lerpedCamPos  = new THREE.Vector3().copy(CAM_INTRO.pos);
const lerpedCamLook = new THREE.Vector3().copy(CAM_INTRO.target);

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp01(v, start, end) {
    return Math.max(0, Math.min(1, (v - start) / (end - start)));
}

let baseScrollable = 0;
let sweepStartY    = 0;
let sweepExtra     = 0;
let checkpointY    = 0;
let gatePassed     = false;
let locked         = false;
let lastWheelTime  = 0;
let lastTouchTime  = 0;
let lockTime       = 0;
let momentumRef    = 0;

function updateDriverExtent() {
    const driver = document.querySelector('.car-scroll-driver');
    if (!driver || !bannersPanelEl || driver.offsetParent === null) return;
    driver.style.height = '';
    baseScrollable = Math.max(1, driver.offsetHeight - window.innerHeight);
    sweepExtra = Math.max(0, bannersPanelEl.scrollHeight - bannersPanelEl.clientHeight);
    const introPx = SCROLL_BANNERS_FULL * baseScrollable;
    driver.style.height =
        (window.innerHeight + introPx + SCROLL_PAUSE_PX + sweepExtra / SWEEP_RATIO + SCROLL_TAIL_PX) + 'px';
    checkpointY = driver.offsetTop + introPx;
    sweepStartY = checkpointY + SCROLL_PAUSE_PX;
    driver.dataset.morphY = driver.offsetTop + SCROLL_CAM_START * baseScrollable;
}

function getScrollFraction() {
    const driver = document.querySelector('.car-scroll-driver');
    if (!driver || baseScrollable <= 0) return 0;
    return Math.max(0, Math.min(1, (window.scrollY - driver.offsetTop) / baseScrollable));
}

function onScroll() {
    const t    = getScrollFraction();
    const camT = easeInOut(clamp01(t, SCROLL_CAM_START, SCROLL_CAM_END));

    targetCamPos.lerpVectors(CAM_INTRO.pos,    CAM_BROWSE.pos,    camT);
    targetCamLook.lerpVectors(CAM_INTRO.target, CAM_BROWSE.target, camT);

    // Hero text fades out in the first half of the transition
    if (heroTextEl) {
        heroTextEl.style.opacity = String(Math.max(0, 1 - camT * 2.2));
    }

    if (bannersPanelEl) {
        const bannerT = easeInOut(clamp01(t, SCROLL_BANNERS_SHOW, SCROLL_BANNERS_FULL));
        bannersPanelEl.style.opacity       = String(bannerT);
        bannersPanelEl.style.pointerEvents = bannerT > 0.05 ? 'all' : 'none';

        bannersPanelEl.scrollTop = Math.min(sweepExtra, Math.max(0, (window.scrollY - sweepStartY) * SWEEP_RATIO));
    }
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function gateActive() {
    return projectsPageEl && projectsPageEl.classList.contains('active') && checkpointY > 0;
}

function onScrollGated() {
    if (gateActive()) {
        if (window.scrollY < checkpointY - 4) {
            gatePassed = false;
            locked = false;
        } else if (!gatePassed && window.scrollY > checkpointY + 1) {
            const now = performance.now();
            if (!locked) {
                locked = true;
                lockTime = now;
                momentumRef = 0;
                window.scrollTo({ top: checkpointY, left: 0, behavior: 'instant' });
            } else if (now - lastTouchTime > 1500 && now - lockTime > GATE_BACKSTOP_MS) {
                gatePassed = true;
                locked = false;
            } else {
                window.scrollTo({ top: checkpointY, left: 0, behavior: 'instant' });
            }
        }
    }
    onScroll();
}

window.addEventListener('scroll', onScrollGated, { passive: true });

window.addEventListener('wheel', (e) => {
    const now = performance.now();
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (gateActive() && !gatePassed && dy > 0 && window.scrollY + dy >= checkpointY) {
        const freshPush = dy > momentumRef * GATE_RELEASE_MULT;
        const paused    = now - lastWheelTime > GATE_IDLE_MS;
        const tooLong   = now - lockTime > GATE_BACKSTOP_MS;
        if (locked && (freshPush || paused || tooLong)) {
            gatePassed = true;
            locked = false;
        } else {
            if (!locked) { lockTime = now; momentumRef = dy; }
            else momentumRef = Math.max(dy, momentumRef * GATE_DECAY);
            e.preventDefault();
            locked = true;
            window.scrollTo({ top: checkpointY, left: 0, behavior: 'instant' });
        }
    }
    lastWheelTime = now;
}, { passive: false });

window.addEventListener('touchstart', () => {
    lastTouchTime = performance.now();
    if (gateActive() && !gatePassed && locked) {
        gatePassed = true;
        locked = false;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    lastTouchTime = performance.now();
    if (gateActive() && !gatePassed && window.scrollY >= checkpointY - 1) {
        if (!locked) {
            locked = true;
            lockTime = performance.now();
            momentumRef = 0;
        }
        e.preventDefault();
        window.scrollTo({ top: checkpointY, left: 0, behavior: 'instant' });
    }
}, { passive: false });

window.addEventListener('keydown', (e) => {
    if (gateActive() && !gatePassed && locked
        && ['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar'].includes(e.key)) {
        gatePassed = true;
        locked = false;
    }
});

window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateDriverExtent();
    gatePassed = window.scrollY >= checkpointY - 2;
    locked = false;
    onScroll();
});

// ─── RENDER LOOP ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let   isActive = projectsPageEl
    ? projectsPageEl.classList.contains('active')
    : true;

let rafId = null;

function animate() {
    rafId = requestAnimationFrame(animate);

    // Smooth lazy-follow camera
    lerpedCamPos.lerp(targetCamPos,   0.055);
    lerpedCamLook.lerp(targetCamLook, 0.055);
    camera.position.copy(lerpedCamPos);
    camera.lookAt(lerpedCamLook);

    // Subtle idle float
    if (carModel) {
        carModel.position.y = modelBaseY + Math.sin(clock.getElapsedTime() * 0.65) * 0.022;
    }

    renderer.render(scene, camera);
}

function syncLoop() {
    const shouldRun = isActive && !document.hidden;
    if (shouldRun && rafId === null) {
        rafId = requestAnimationFrame(animate);
    } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
}

syncLoop();
document.addEventListener('visibilitychange', syncLoop);

// ─── PAGE VISIBILITY ─────────────────────────────────────────────────────────
// Canvas lives outside .page divs (to avoid transform:fixed containment bug),
// show/hide it and pause rendering when projects page is inactive.
function syncCanvasVisibility() {
    if (!projectsPageEl) return;
    const active = projectsPageEl.classList.contains('active');
    isActive = active;
    syncLoop();

    canvas.style.display = active ? 'block' : 'none';

    // Hero text and banners also live outside .page divs, so hide them explicitly
    if (heroTextEl) {
        heroTextEl.style.display = active ? '' : 'none';
    }
    if (bannersPanelEl) {
        bannersPanelEl.style.display = active ? '' : 'none';
    }

    if (active) {
        loadModel();
        updateDriverExtent();
        gatePassed = window.scrollY >= checkpointY - 2;
        locked = false;
        onScroll();
        lerpedCamPos.copy(targetCamPos);
        lerpedCamLook.copy(targetCamLook);
    }
}

syncCanvasVisibility();

if (projectsPageEl) {
    new MutationObserver(syncCanvasVisibility)
        .observe(projectsPageEl, { attributes: true, attributeFilter: ['class'] });
}

// ─── RESIZE ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateDriverExtent();
    onScroll();
});

// ─── DEV CAMERA CONTROLS ─────────────────────────────────────────────────────
//  W/S   — zoom camera forward / back  (Z axis)
//  A/D   — orbit camera left / right   (X axis)
//  Q/E   — raise / lower camera        (Y axis)
//  I/K   — pan view toward front / rear of car  (shifts target + camera together)
//  U/O   — pan view left / right
//  L     — log current pos + lookAt to console  (copy into CAM_INTRO or CAM_BROWSE)
//
// Hold Shift to move 5× faster.
if (new URLSearchParams(location.search).has('dev')) (function devControls() {
    const STEP = 0.08;
    const held = new Set();

    window.addEventListener('keydown', (e) => held.add(e.key));
    window.addEventListener('keyup',   (e) => held.delete(e.key));

    const devLook = new THREE.Vector3().copy(CAM_INTRO.target);

    function tickDev() {
        requestAnimationFrame(tickDev);
        if (!isActive) return;

        const s = held.has('Shift') ? STEP * 5 : STEP;
        let moved = false;

        // W/S/A/D/Q/E — orbit camera around look target (zoom/strafe/raise)
        if (held.has('w') || held.has('W')) { lerpedCamPos.z -= s; moved = true; }
        if (held.has('s') || held.has('S')) { lerpedCamPos.z += s; moved = true; }
        if (held.has('a') || held.has('A')) { lerpedCamPos.x -= s; moved = true; }
        if (held.has('d') || held.has('D')) { lerpedCamPos.x += s; moved = true; }
        if (held.has('q') || held.has('Q')) { lerpedCamPos.y -= s; moved = true; }
        if (held.has('e') || held.has('E')) { lerpedCamPos.y += s; moved = true; }
        // I/K and U/O — pan both camera AND target together (shifts which part of car is centred)
        if (held.has('i') || held.has('I')) { lerpedCamPos.z -= s; devLook.z -= s; moved = true; }
        if (held.has('k') || held.has('K')) { lerpedCamPos.z += s; devLook.z += s; moved = true; }
        if (held.has('u') || held.has('U')) { lerpedCamPos.x -= s; devLook.x -= s; moved = true; }
        if (held.has('o') || held.has('O')) { lerpedCamPos.x += s; devLook.x += s; moved = true; }

        if (moved) {
            // Override the lerp targets so the camera snaps to key input
            targetCamPos.copy(lerpedCamPos);
            targetCamLook.copy(devLook);
        }

        if (held.has('l') || held.has('L')) {
            held.delete('l'); held.delete('L');
            const p = lerpedCamPos;
            const t = devLook;
            console.log(
                `%c[car-viewer] Camera snapshot — copy into CAM_INTRO or CAM_BROWSE:`,
                'color:#d0343a;font-weight:bold'
            );
            console.log(
                `pos:    new THREE.Vector3(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}),\n` +
                `target: new THREE.Vector3(${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}),`
            );
        }
    }

    tickDev();
})();
