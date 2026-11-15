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
const LITE    = mobileQuery.matches;
const DEV     = new URLSearchParams(location.search).has('dev');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateCamKeyframes() {
    if (mobileQuery.matches) {
        CAM_INTRO.pos.set(    0.0,  9.0,  6.0);
        CAM_INTRO.target.set( 0.0,  -1.4,  3.28);
        CAM_BROWSE.pos.set(   21.5,  1.0,  0.0);
        CAM_BROWSE.target.set( 0.0, -3.5,  0.0);
    } else {
        CAM_INTRO.pos.set(    0.00,  2.64,  2.17);
        CAM_INTRO.target.set( 0.00,  1.5,  2.08);
        CAM_BROWSE.pos.set(   5.2,   0.15,  8.2);
        CAM_BROWSE.target.set(2.1,  -0.35,  0.2);
    }
}
updateCamKeyframes();
mobileQuery.addEventListener('change', updateCamKeyframes);

// Scroll fractions (0 – 1 of .car-scroll-driver height) that define each phase
const SCROLL_CAM_START    = 0.12;   // camera starts moving
const SCROLL_CAM_END      = 0.52;   // camera reaches browse position
const SCROLL_BANNERS_SHOW = 0.42;   // banners begin fading in
const SCROLL_BANNERS_FULL = 0.72;   // banners fully visible
const WHEEL_QUIET_MS      = 180;
const FRESH_PUSH_MULT     = 2.0;
const FRESH_MIN_PX        = 30;
const FRESH_AFTER_DECAY   = 0.5;

// ─── DOM REFS ────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('car-canvas');
const heroTextEl    = document.getElementById('car-hero-text');
const bannersPanelEl = document.getElementById('projects-banners');
const projectsPageEl = document.getElementById('projects-page');
const driverEl       = document.querySelector('.car-scroll-driver');

const heightProbe = document.createElement('div');
heightProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none';
document.body.appendChild(heightProbe);

function stableHeight() {
    return heightProbe.offsetHeight || window.innerHeight;
}

// ─── RENDERER ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, stableHeight());
renderer.toneMapping        = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace   = THREE.SRGBColorSpace;

// ─── SCENE & CAMERA ──────────────────────────────────────────────────────────
const scene  = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / stableHeight(), 0.01, 200);
camera.position.copy(CAM_INTRO.pos);

// ─── ENVIRONMENT ─────────────────────────────────────────────────────────────
const pmrem   = new THREE.PMREMGenerator(renderer);
const roomEnv = new RoomEnvironment(renderer);
scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
pmrem.dispose();
roomEnv.dispose();

const ambient = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambient);

const topLight = new THREE.DirectionalLight(0xe8eeff, 0);
scene.add(topLight);
scene.add(topLight.target);

const backLight = new THREE.DirectionalLight(0xbdd0ff, 0);
backLight.position.set(-6, 2.6, -7);
scene.add(backLight);

const frontFill = new THREE.DirectionalLight(0xdfe6ff, 0);
frontFill.position.set(4, 1.5, 8);
scene.add(frontFill);

const toCar = { value: new THREE.Matrix4() };
const LIVERY_SILVER = new THREE.Color(0x8f8f8c);
const LIVERY_RED = new THREE.Color(0xd0343a);

function liveryMaterial(gloss, wing) {
    const m = new THREE.MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: gloss ? 0.4 : 0.62,
        metalness: 0.12,
        envMapIntensity: gloss ? 1.0 : 0.6,
    });
    if (wing) m.defines = { WING: 1 };
    m.onBeforeCompile = (sh) => {
        sh.uniforms.uSilver = { value: LIVERY_SILVER };
        sh.uniforms.uRed = { value: LIVERY_RED };
        sh.uniforms.uToCar = toCar;
        sh.vertexShader = sh.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vCarPos;\nvarying vec3 vCarNrm;\nuniform mat4 uToCar;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nmat4 carM = uToCar * modelMatrix;\nvCarPos = (carM * vec4(position, 1.0)).xyz;\nvCarNrm = mat3(carM) * normal;');
        sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vCarPos;\nvarying vec3 vCarNrm;\nuniform vec3 uSilver;\nuniform vec3 uRed;')
            .replace('#include <color_fragment>', [
                '#include <color_fragment>',
                '{',
                '  float ax = abs(vCarPos.x); float y = vCarPos.y; float z = vCarPos.z;',
                '  float paint = 0.0;',
                '  vec3 cn = normalize(vCarNrm) * (gl_FrontFacing ? 1.0 : -1.0);',
                '  float outward = cn.x * sign(vCarPos.x);',
                '  #ifdef WING',
                '  if (z > 1.20 && ax > 0.60 && outward > 0.35) {',
                '    float line = 0.10 + (1.84 - z) * 0.27;',
                '    paint = y < line ? 1.0 : (y < line + 0.045 ? 2.0 : 0.0);',
                '  }',
                '  #else',
                '  if (z > 1.45 && ax < 0.22 && y < 0.40) {',
                '    float line = 0.105 + (1.93 - z) * 0.10;',
                '    paint = y < line ? 1.0 : (y < line + 0.04 ? 2.0 : 0.0);',
                '  }',
                '  if (z < -0.30 && ax > 0.40 && y > 0.40 && outward > 0.35) {',
                '    float line = 0.60 + (-0.30 - z) * 0.05;',
                '    paint = y < line ? 1.0 : (y < line + 0.045 ? 2.0 : 0.0);',
                '  }',
                '  #endif',
                '  if (paint > 1.5) diffuseColor.rgb = uRed;',
                '  else if (paint > 0.5) diffuseColor.rgb = uSilver;',
                '}',
            ].join('\n'));
    };
    return m;
}

const CAR_MATERIALS = {
    body_gloss: liveryMaterial(true, false),
    wing: liveryMaterial(true, true),
    body_matte: liveryMaterial(false, false),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9, metalness: 0.0, envMapIntensity: 0.4 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x8a8a8c, roughness: 0.35, metalness: 0.9, envMapIntensity: 1.0 }),
    dark_metal: new THREE.MeshStandardMaterial({ color: 0x0e0e0f, roughness: 0.4, metalness: 0.8, envMapIntensity: 0.9 }),
    keep: new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.5, metalness: 0.0, envMapIntensity: 0.6 }),
};

function numberDecal() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const g = c.getContext('2d');
    g.font = 'italic 900 210px "Arial Black", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = 26;
    g.strokeStyle = '#d0343a';
    g.strokeText('30', 256, 138);
    g.fillStyle = '#f2f2f0';
    g.fillText('30', 256, 138);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.13, 0.065),
        new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6, metalness: 0.0, polygonOffset: true, polygonOffsetFactor: -4 })
    );
    mesh.position.set(0, 0.7303, -0.1058);
    mesh.rotation.x = -0.172;
    return mesh;
}

// ─── LOAD MODEL ──────────────────────────────────────────────────────────────
let carModel   = null;
let modelLoaded = false;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/libs/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

function loadModel() {
    if (modelLoaded) return;
    modelLoaded = true;

    gltfLoader.load(
        'modules/CR30-Painted.glb',

        (gltf) => {
            carModel = gltf.scene;

            carModel.traverse((child) => {
                if (child.isMesh) {
                    child.material      = CAR_MATERIALS[child.material.name] || CAR_MATERIALS.body_matte;
                    child.castShadow    = !LITE;
                    child.receiveShadow = !LITE;
                }
            });
            carModel.add(numberDecal());

            // Auto-centre and scale so the longest axis ≈ 5 world units
            const box    = new THREE.Box3().setFromObject(carModel);
            const center = box.getCenter(new THREE.Vector3());
            const size   = box.getSize(new THREE.Vector3());
            const scale  = 5 / Math.max(size.x, size.y, size.z);

            carModel.scale.setScalar(scale);
            carModel.position.sub(center.multiplyScalar(scale));

            scene.add(carModel);
            carModel.updateMatrixWorld(true);
            toCar.value.copy(carModel.matrixWorld).invert();
            const floorY = new THREE.Box3().setFromObject(carModel).min.y;
            mirror.position.y = floorY;
            mirror.visible = true;
            if (catcher) {
                catcher.position.y = floorY + 0.004;
                catcher.visible = true;
            }
            lightsOnStart = performance.now() + 250;
            forceFrames = 3;
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

let targetT = 0;
let slowT = 0;
let lastE = -1;
let lastOn = -1;
let lightsOnStart = 0;
let shadowKey = '';
let lastShadowTime = 0;
const SHADOW_MIN_INTERVAL_MS = 220;
let forceFrames = 3;
let catcher = null;

const GLINTS = [
    [ 0.00, 0.34,  1.25, 0.38, 0.13, 0.14, 0.16],
    [ 0.00, 0.46,  0.35, 0.50, 0.10, 0.11, 0.125],
    [ 0.00, 1.00, -0.75, 0.50, 0.09, 0.10, 0.115],
    [ 0.68, 0.13,  1.50, 0.19, 0.24, 0.24, 0.25],
    [-0.68, 0.13,  1.50, 0.19, 0.24, 0.24, 0.25],
    [ 0.68, 0.25,  1.48, 0.09, 0.19, 0.02, 0.025],
    [-0.68, 0.25,  1.48, 0.09, 0.19, 0.02, 0.025],
    [ 0.00, 0.17,  1.78, 0.10, 0.17, 0.02, 0.025],
    [ 0.46, 0.54, -0.72, 0.18, 0.22, 0.22, 0.23],
    [-0.46, 0.54, -0.72, 0.18, 0.22, 0.22, 0.23],
    [ 0.46, 0.66, -0.72, 0.09, 0.18, 0.02, 0.025],
    [-0.46, 0.66, -0.72, 0.09, 0.18, 0.02, 0.025],
];

const floorMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
        uToCar: toCar,
        uStrength: { value: 0 },
        uGlintPos: { value: GLINTS.map((g) => new THREE.Vector4(g[0], g[1], g[2], g[3])) },
        uGlintCol: { value: GLINTS.map((g) => new THREE.Vector3(g[4], g[5], g[6])) },
    },
    vertexShader: [
        'varying vec3 vWorld;',
        'varying vec2 vPlane;',
        'void main() {',
        '  vec4 w = modelMatrix * vec4(position, 1.0);',
        '  vWorld = w.xyz;',
        '  vPlane = uv;',
        '  gl_Position = projectionMatrix * viewMatrix * w;',
        '}',
    ].join('\n'),
    fragmentShader: [
        '#define GLINT_COUNT ' + GLINTS.length,
        'uniform mat4 uToCar;',
        'uniform float uStrength;',
        'uniform vec4 uGlintPos[GLINT_COUNT];',
        'uniform vec3 uGlintCol[GLINT_COUNT];',
        'varying vec3 vWorld;',
        'varying vec2 vPlane;',
        'void main() {',
        '  vec3 P = (uToCar * vec4(vWorld, 1.0)).xyz;',
        '  vec3 C = (uToCar * vec4(cameraPosition, 1.0)).xyz;',
        '  vec3 D = normalize(P - C);',
        '  vec3 R = vec3(D.x, -D.y, D.z);',
        '  vec3 acc = vec3(0.0);',
        '  for (int i = 0; i < GLINT_COUNT; i++) {',
        '    vec3 v = uGlintPos[i].xyz - P;',
        '    float t = max(dot(v, R), 0.0);',
        '    float d = length(v - R * t);',
        '    float s = uGlintPos[i].w * 0.8 + 0.045 * t;',
        '    acc += uGlintCol[i] * exp(-(d * d) / (s * s)) * exp(-0.3 * t);',
        '  }',
        '  float fade = smoothstep(0.42, 0.10, distance(vPlane, vec2(0.5)));',
        '  vec3 base = vec3(0.010, 0.012, 0.016);',
        '  gl_FragColor = vec4(base + acc * uStrength, fade);',
        '  #include <tonemapping_fragment>',
        '  #include <colorspace_fragment>',
        '}',
    ].join('\n'),
});

const mirror = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), floorMaterial);
mirror.rotation.x = -Math.PI / 2;
mirror.visible = false;
scene.add(mirror);

if (!LITE) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    topLight.castShadow = true;
    topLight.shadow.mapSize.set(2048, 2048);
    topLight.shadow.camera.left = -5;
    topLight.shadow.camera.right = 5;
    topLight.shadow.camera.top = 5;
    topLight.shadow.camera.bottom = -5;
    topLight.shadow.camera.near = 0.5;
    topLight.shadow.camera.far = 30;
    topLight.shadow.bias = -0.0004;
    topLight.shadow.normalBias = 0.02;
    topLight.shadow.radius = 6;
    catcher = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), new THREE.ShadowMaterial({ opacity: 0.6 }));
    catcher.rotation.x = -Math.PI / 2;
    catcher.receiveShadow = true;
    catcher.visible = false;
    scene.add(catcher);
}

function smoother(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
}

function updateStudio() {
    slowT += (targetT - slowT) * 0.03;
    if (Math.abs(targetT - slowT) < 0.0002) slowT = targetT;
    const e = smoother(Math.max(0, Math.min(1, slowT)));
    if (Math.abs(e - lastE) > 0.0003) {
        lastE = e;
        document.documentElement.style.setProperty('--e', e.toFixed(4));
    }
    let on = 0;
    if (lightsOnStart) {
        on = REDUCED ? 1 : smoother(Math.max(0, Math.min(1, (performance.now() - lightsOnStart) / 2000)));
    }
    if (Math.abs(on - lastOn) > 0.002 || (on === 1 && lastOn !== 1)) {
        lastOn = on;
        document.documentElement.style.setProperty('--on', on.toFixed(3));
    }
    ambient.intensity = 0.03 + 0.05 * on;
    topLight.intensity = 2.7 * on;
    backLight.intensity = 1.0 * on;
    frontFill.intensity = 0.22 * on;
    topLight.position.set(-1.5 + 2.7 * e, 7.2, -1.2 - 3.0 * e);
    topLight.target.position.set(1.0 * e, 0, 0);
    floorMaterial.uniforms.uStrength.value = 0.4 * on;
    if (!LITE) {
        const key = Math.round(e * 25) + '|' + Math.round(on * 12) + '|' + (carModel ? 1 : 0);
        const now = performance.now();
        const settled = slowT === targetT && on === 1;
        if (key !== shadowKey && (settled || now - lastShadowTime > SHADOW_MIN_INTERVAL_MS)) {
            shadowKey = key;
            lastShadowTime = now;
            renderer.shadowMap.needsUpdate = true;
        }
    }
    return on < 1 && lightsOnStart > 0;
}

let baseScrollable = 0;
let driverTop      = 0;
let endY           = 0;
let listOpen       = false;
let savedListTop   = 0;
let lastWheelTime  = 0;
let openTimer      = 0;
let wheelPeak      = 0;
let wheelDecayed   = false;
let wheelTrough    = 0;
let wheelSign      = 0;
let holdUp         = false;
let wheelBound     = false;

function updateDriverExtent() {
    if (!driverEl || !bannersPanelEl || driverEl.offsetParent === null) return;
    const h = stableHeight();
    driverEl.style.height = '';
    baseScrollable = Math.max(1, driverEl.offsetHeight - h);
    const introPx = SCROLL_BANNERS_FULL * baseScrollable;
    driverEl.style.height = (h + introPx) + 'px';
    driverTop = driverEl.offsetTop;
    endY = driverTop + introPx;
    driverEl.dataset.morphY = driverTop + SCROLL_CAM_START * baseScrollable;
}

function getScrollFraction() {
    if (baseScrollable <= 0) return 0;
    return Math.max(0, Math.min(1, (window.scrollY - driverTop) / baseScrollable));
}

function atEnd() {
    return endY > 0 && window.scrollY >= endY - 2;
}

function setListOpen(open) {
    if (open === listOpen || !bannersPanelEl) return;
    listOpen = open;
    bannersPanelEl.style.overflowY = open ? 'auto' : 'hidden';
}

function syncList() {
    clearTimeout(openTimer);
    if (!atEnd()) { setListOpen(false); return; }
    if (listOpen) return;
    const wait = WHEEL_QUIET_MS - (performance.now() - lastWheelTime);
    if (wait <= 0) setListOpen(true);
    else openTimer = setTimeout(syncList, wait);
}

function onScroll() {
    if (!isActive) return;
    const t    = getScrollFraction();
    const camT = easeInOut(clamp01(t, SCROLL_CAM_START, SCROLL_CAM_END));

    targetCamPos.lerpVectors(CAM_INTRO.pos,    CAM_BROWSE.pos,    camT);
    targetCamLook.lerpVectors(CAM_INTRO.target, CAM_BROWSE.target, camT);
    targetT = camT;

    if (heroTextEl) {
        heroTextEl.style.opacity = String(Math.max(0, 1 - camT * 2.2));
    }

    if (bannersPanelEl) {
        const bannerT = easeInOut(clamp01(t, SCROLL_BANNERS_SHOW, SCROLL_BANNERS_FULL));
        bannersPanelEl.style.opacity       = String(bannerT);
        bannersPanelEl.style.pointerEvents = bannerT > 0.05 ? 'all' : 'none';
        if (bannerT === 0 && bannersPanelEl.scrollTop !== 0) bannersPanelEl.scrollTop = 0;
    }

    syncList();
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

window.addEventListener('scroll', onScroll, { passive: true });

function onWheel(e) {
    if (!isActive || !bannersPanelEl) return;
    const now   = performance.now();
    const dy    = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (dy === 0) return;
    const mag   = Math.abs(dy);
    const sign  = dy > 0 ? 1 : -1;
    const fromRest = now - lastWheelTime > WHEEL_QUIET_MS || sign !== wheelSign;
    let fresh = fromRest;
    if (fromRest) {
        wheelPeak = mag;
        wheelTrough = mag;
        wheelDecayed = false;
    } else {
        if (mag >= wheelPeak) {
            wheelPeak = mag;
            wheelTrough = mag;
            wheelDecayed = false;
        }
        if (mag < wheelPeak * FRESH_AFTER_DECAY) wheelDecayed = true;
        if (wheelDecayed && mag >= FRESH_MIN_PX && mag > wheelTrough * FRESH_PUSH_MULT) {
            fresh = true;
            wheelPeak = mag;
            wheelTrough = mag;
            wheelDecayed = false;
        }
        wheelTrough = Math.min(wheelTrough, mag);
    }
    lastWheelTime = now;
    wheelSign = sign;
    if (fresh) holdUp = false;
    if (!atEnd()) return;

    if (dy > 0) {
        if (!listOpen) {
            if (fresh) setListOpen(true);
            else { syncList(); return; }
        }
        e.preventDefault();
        bannersPanelEl.scrollTop += dy;
        return;
    }

    if (listOpen && bannersPanelEl.scrollTop > 0) {
        e.preventDefault();
        bannersPanelEl.scrollTop += dy;
        holdUp = true;
    } else if (holdUp) {
        e.preventDefault();
    }
}

function bindWheel(on) {
    if (on === wheelBound) return;
    wheelBound = on;
    if (on) window.addEventListener('wheel', onWheel, { passive: false });
    else window.removeEventListener('wheel', onWheel, { passive: false });
}

window.addEventListener('keydown', (e) => {
    if (!isActive || !listOpen || !atEnd() || !bannersPanelEl) return;
    const p = bannersPanelEl;
    const room = p.scrollHeight - p.clientHeight - p.scrollTop;
    let step = 0;
    if (e.key === 'ArrowDown') step = 60;
    else if (e.key === 'PageDown' || e.key === ' ') step = p.clientHeight * 0.8;
    else if (e.key === 'End') step = room;
    else if (e.key === 'ArrowUp') step = -60;
    else if (e.key === 'PageUp') step = -p.clientHeight * 0.8;
    else if (e.key === 'Home') step = -p.scrollTop;
    if ((step > 0 && room > 1) || (step < 0 && p.scrollTop > 0)) {
        e.preventDefault();
        p.scrollTop += step;
    }
});

window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateDriverExtent();
    onScroll();
});

// ─── RENDER LOOP ─────────────────────────────────────────────────────────────
let   isActive = projectsPageEl
    ? projectsPageEl.classList.contains('active')
    : true;

let rafId = null;

function animate() {
    rafId = requestAnimationFrame(animate);

    lerpedCamPos.lerp(targetCamPos,   0.055);
    lerpedCamLook.lerp(targetCamLook, 0.055);
    const moving = lerpedCamPos.distanceToSquared(targetCamPos) > 1e-7
        || lerpedCamLook.distanceToSquared(targetCamLook) > 1e-7
        || Math.abs(targetT - slowT) > 0;
    const fading = updateStudio();
    if (!(moving || fading || DEV || forceFrames > 0)) return;
    if (forceFrames > 0) forceFrames--;

    camera.position.copy(lerpedCamPos);
    camera.lookAt(lerpedCamLook);
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
    if (isActive && !active && bannersPanelEl) savedListTop = bannersPanelEl.scrollTop;
    isActive = active;
    bindWheel(active);
    document.body.classList.toggle('studio', active);
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
        onScroll();
        if (atEnd() && bannersPanelEl) {
            clearTimeout(openTimer);
            setListOpen(true);
            bannersPanelEl.scrollTop = savedListTop;
        }
        lerpedCamPos.copy(targetCamPos);
        lerpedCamLook.copy(targetCamLook);
        slowT = targetT;
        forceFrames = 3;
    }
}

syncCanvasVisibility();

if (projectsPageEl) {
    new MutationObserver(syncCanvasVisibility)
        .observe(projectsPageEl, { attributes: true, attributeFilter: ['class'] });
}

// ─── RESIZE ──────────────────────────────────────────────────────────────────
let lastW = window.innerWidth;
let lastH = stableHeight();

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = stableHeight();
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateDriverExtent();
    onScroll();
    forceFrames = 3;
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
