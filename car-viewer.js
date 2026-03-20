// car-viewer.js — Three.js FSAE car viewer
// Scroll-driven: front-wing close-up → car left / project banners right
import * as THREE from 'three';
import { GLTFLoader }      from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }     from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ─── CAMERA KEYFRAMES ────────────────────────────────────────────────────────
// Tweak these values after the model loads to frame the car correctly.
// Axes: X = right,  Y = up,  Z = toward the viewer
// The car probably faces -Z (SolidWorks front view), front wing near -Z extremity.

const CAM_INTRO = {
    // Front wing close-up (user-tuned)
    pos:    new THREE.Vector3( 0.00,  2.64,  2.17),
    target: new THREE.Vector3( 0.00,  0.00,  2.08),
};

const CAM_BROWSE = {
    // 3/4 view from outside — car on left half of screen.
    pos:    new THREE.Vector3( 7.0,  4.0,  9.0),
    target: new THREE.Vector3( 3.0,  0.0,  0.0),
};

// Scroll fractions (0 – 1 of .car-scroll-driver height) that define each phase
const SCROLL_CAM_START    = 0.18;   // camera starts moving
const SCROLL_CAM_END      = 0.52;   // camera reaches browse position
const SCROLL_BANNERS_SHOW = 0.42;   // banners begin fading in
const SCROLL_BANNERS_FULL = 0.60;   // banners fully visible

// ─── DOM REFS ────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('car-canvas');
const heroTextEl    = document.getElementById('car-hero-text');
const bannersPanelEl = document.getElementById('projects-banners');
const projectsPageEl = document.getElementById('projects-page');

// ─── RENDERER ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping        = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace   = THREE.SRGBColorSpace;

// ─── SCENE & CAMERA ──────────────────────────────────────────────────────────
const scene  = new THREE.Scene();
// No background — site's #000 shows through the alpha canvas.

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
camera.position.copy(CAM_INTRO.pos);

// ─── ENVIRONMENT (soft studio light for carbon) ───────────────────────────────
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
// All meshes receive this material. Adjust color/roughness to taste.
const carbonMat = new THREE.MeshStandardMaterial({
    color:           0x0d0d0d,   // near-black
    roughness:       0.36,        // some sheen
    metalness:       0.12,
    envMapIntensity: 1.3,
});

// ─── LOAD MODEL ──────────────────────────────────────────────────────────────
let carModel  = null;
let modelBaseY = 0;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/libs/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
    'modules/CR30-Attempt_4-Render.glb',

    (gltf) => {
        carModel = gltf.scene;

        // Apply carbon material to every mesh
        carModel.traverse((child) => {
            if (child.isMesh) {
                child.material        = carbonMat;
                child.castShadow      = false;
                child.receiveShadow   = false;
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

        console.log('[car-viewer] Loaded — size:', size, '→ scale:', scale.toFixed(3));
        console.log('[car-viewer] Adjust CAM_INTRO / CAM_BROWSE in car-viewer.js to reframe.');
    },

    (xhr) => console.log(`[car-viewer] ${Math.round((xhr.loaded / xhr.total) * 100)}%`),
    (err) => console.error('[car-viewer] Load error:', err)
);

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

function getScrollFraction() {
    const driver = document.querySelector('.car-scroll-driver');
    if (!driver) return 0;
    const scrollable = driver.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.max(0, Math.min(1, (window.scrollY - driver.offsetTop) / scrollable));
}

function onScroll() {
    const t    = getScrollFraction();
    const camT = easeInOut(clamp01(t, SCROLL_CAM_START, SCROLL_CAM_END));

    // Drive camera keyframes
    targetCamPos.lerpVectors(CAM_INTRO.pos,    CAM_BROWSE.pos,    camT);
    targetCamLook.lerpVectors(CAM_INTRO.target, CAM_BROWSE.target, camT);

    // Hero text fades out in the first half of the transition
    if (heroTextEl) {
        heroTextEl.style.opacity = String(Math.max(0, 1 - camT * 2.2));
    }

    // Banners fade in
    if (bannersPanelEl) {
        const bannerT = easeInOut(clamp01(t, SCROLL_BANNERS_SHOW, SCROLL_BANNERS_FULL));
        bannersPanelEl.style.opacity       = String(bannerT);
        bannersPanelEl.style.pointerEvents = bannerT > 0.05 ? 'all' : 'none';
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ─── RENDER LOOP ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let   isActive = projectsPageEl
    ? projectsPageEl.classList.contains('active')
    : true;

function animate() {
    requestAnimationFrame(animate);
    if (!isActive) return;

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

animate();

// ─── PAGE VISIBILITY ─────────────────────────────────────────────────────────
// Canvas lives outside .page divs (to avoid transform:fixed containment bug),
// so we explicitly show/hide it and pause rendering when projects page is inactive.
function syncCanvasVisibility() {
    if (!projectsPageEl) return;
    const active = projectsPageEl.classList.contains('active');
    canvas.style.display = active ? 'block' : 'none';
    isActive = active;
    if (active) {
        onScroll();
        lerpedCamPos.copy(targetCamPos);
        lerpedCamLook.copy(targetCamLook);
    }
}

// Set initial visibility on load
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
});

// ─── DEV CAMERA CONTROLS ─────────────────────────────────────────────────────
// Use these in the browser to dial in CAM_INTRO / CAM_BROWSE values without
// pushing code each time. Press L to log the current position to the console.
//
//  W/S   — zoom camera forward / back  (Z axis)
//  A/D   — orbit camera left / right   (X axis)
//  Q/E   — raise / lower camera        (Y axis)
//  I/K   — pan view toward front / rear of car  (shifts target + camera together)
//  U/O   — pan view left / right
//  L     — log current pos + lookAt to console  (copy into CAM_INTRO or CAM_BROWSE)
//
// Hold Shift to move 5× faster.
(function devControls() {
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
            held.delete('l'); held.delete('L'); // fire once per press
            const p = lerpedCamPos;
            const t = devLook;
            console.log(
                `%c[car-viewer] Camera snapshot — copy into CAM_INTRO or CAM_BROWSE:`,
                'color:#ff5555;font-weight:bold'
            );
            console.log(
                `pos:    new THREE.Vector3(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}),\n` +
                `target: new THREE.Vector3(${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}),`
            );
        }
    }

    tickDev();
})();
