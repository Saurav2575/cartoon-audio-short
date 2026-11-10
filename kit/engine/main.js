import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import { buildSets } from './sets.js';
import { CHUNKS } from './words.js';
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, fxAt } from './story.js';

const W = 1080, H = 1920;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.08, 1500);
const rx = (a) => a * Math.PI / 180;

// ---------- 4-band Toon Ramp Material ----------
const grad = (() => {
  // 4 distinct stepped bands for softer, richer cell-shading
  const d = new Uint8Array([
    75, 75, 85, 255,      // deep shadow
    135, 135, 145, 255,   // soft shadow
    205, 205, 215, 255,   // mid-light
    255, 255, 255, 255    // highlight
  ]);
  const t = new THREE.DataTexture(d, 4, 1);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
})();
const toon = (opts) => new THREE.MeshToonMaterial({ gradientMap: grad, ...opts });
const texM = (c, rx_ = 1, ry_ = 1, color = '#ffffff') => toon({ map: P.tex(c, rx_, ry_), color });

const glowTexture = P.tex(P.radialGlow('255,210,120', 0.85));

const M = {
  plank: texM(P.planks(1), 2, 4),
  beam: texM(P.beam(2), 1, 2),
  stone: texM(P.stone(4), 2, 2),
  grass: texM(P.grass(6), 25, 25),
  stripedFields: texM(P.stripedFields(6), 12, 12),
  dirt: texM(P.dirt(7), 4, 25),
  wood: toon({ color: '#784a28' }),
  gold: toon({ color: '#f59e0b' }),
  navy: toon({ color: '#1e3a6e' }),
  red: toon({ color: '#c5282c' }),
  white: toon({ color: '#f8f9fa' }),
  trunk: toon({ color: '#5a3d24' }),
  poplar: toon({ color: '#4d7c38' }),
  bush: toon({ color: '#62923e' }),
  hill: toon({ color: '#6e9842' }),
  hillFar: toon({ color: '#7ea456' }),
  iron: toon({ color: '#2b2a2d' }),
};

// ---------- ink / normal-depth contract ----------
const ndMat = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`,
  side: THREE.DoubleSide,
});
const cardNd = (map) => new THREE.ShaderMaterial({
  uniforms: { map: { value: map } },
  vertexShader: `varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }`,
  side: THREE.DoubleSide,
});

// ---------- helpers ----------
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, opts = {}) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = opts.cast ?? true; m.receiveShadow = true; parent.add(m); return m;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const tbox = (w, h, d, t = 2) => {
  const g = box(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); }
  return g;
};

// ---------- sky ----------
const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, sunCol: { value: new THREE.Color() }, sunSize: { value: 0 } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, hor, sunDir, sunCol; uniform float sunSize; varying vec3 vP;
    void main(){ float h = clamp(vP.y,0.,1.); vec3 c = mix(hor, top, pow(h, .55)); if(vP.y<0.) c = hor;
      float s = dot(normalize(vP), normalize(sunDir)); c += sunCol * (smoothstep(1.-sunSize, 1.-sunSize*.6, s) + .35*pow(max(s,0.), 24.)*step(.001,sunSize));
      gl_FragColor = vec4(c,1.); }`,
}));
sky.userData.sky = true; scene.add(sky);

// ---------- softer lights ----------
const hemi = new THREE.HemisphereLight('#f0f5ff', '#8fa27a', 1.45); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff8ea', 1.25); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 5.5;
scene.add(sun); scene.add(sun.target);
scene.fog = new THREE.Fog('#ffffff', 40, 600);

// ---------- modular sets library ----------
const DECK = 0;
const SETS = buildSets(M, P, add, tbox, box, scene, glowTexture);

// Clouds
const clouds = [];
const cgeo = new THREE.PlaneGeometry(12, 4.5);
const cmat = new THREE.MeshBasicMaterial({ map: P.tex(P.cloud(8)), transparent: true, depthWrite: false });
for (let i = 0; i < 9; i++) {
  const m = new THREE.Mesh(cgeo, cmat);
  const a = i * 0.7 + 0.3; m.position.set(Math.cos(a) * 320, 85 + (i % 3) * 18, Math.sin(a) * 320);
  m.scale.setScalar(4 + (i % 3) * 1.5); m.userData.sky = true; m.userData.ndSkip = true;
  scene.add(m); clouds.push(m);
}

// ---------- card pool ----------
const CARDS_N = 36;
const CM = 2.25;
const cardGeo = new THREE.PlaneGeometry(CM * 0.6, CM);
cardGeo.translate(0, CM / 2, 0);

const blobTex = P.tex(P.radialGlow('0,0,0', 0.55));
const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.52, depthWrite: false });
const blobGeo = new THREE.PlaneGeometry(1.0, 0.7);
blobGeo.rotateX(-Math.PI / 2);

const makeCard = () => {
  const cv = document.createElement('canvas'); cv.width = 600; cv.height = 1000;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshToonMaterial({ map: tex, transparent: true, alphaTest: 0.1, gradientMap: grad, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(cardGeo, mat); mesh.castShadow = true; mesh.receiveShadow = false;
  mesh.userData.nd = cardNd(tex); scene.add(mesh);

  const blob = new THREE.Mesh(blobGeo, blobMat);
  blob.userData.ndSkip = true; scene.add(blob);

  const painter = {
    g: ctx,
    w: cv.width,
    h: cv.height,
    clear: () => ctx.clearRect(0, 0, cv.width, cv.height),
    stroke: (pts, w, col) => {
      ctx.beginPath(); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    },
    poly: (pts, col, strokeW = 0, strokeCol = '#1a1622') => {
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.fillStyle = col; ctx.fill();
      if (strokeW) { ctx.lineWidth = strokeW; ctx.strokeStyle = strokeCol; ctx.lineJoin = 'round'; ctx.stroke(); }
    },
    dot: (x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); },
  };

  return { cv, ctx, tex, mat, mesh, blob, painter, key: null, draw(key, fn) {
    if (this.key === key) return;
    this.key = key; this.painter.clear(); fn(this.painter); this.tex.needsUpdate = true;
  }};
};

const cards = Array.from({ length: CARDS_N }, makeCard);
const getCard = (i) => cards[i % CARDS_N];

// ---------- post processing passes ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { colorSpace: THREE.SRGBColorSpace, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const rtInk = new THREE.WebGLRenderTarget(W, H, { colorSpace: THREE.SRGBColorSpace, type: THREE.HalfFloatType });

const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const fsQuad = new THREE.PlaneGeometry(2, 2);

// ink shader
const inkU = {
  tCol: { value: rtColor.texture }, tNd: { value: rtNd.texture },
  res: { value: new THREE.Vector2(W, H) }, px: { value: 2.4 }, flash: { value: 0 }, vig: { value: 0.18 }
};
const inkMat = new THREE.ShaderMaterial({
  uniforms: inkU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D tCol, tNd; uniform vec2 res; uniform float px, flash, vig; varying vec2 vUv;
    void main(){
      vec2 off = px / res;
      vec4 n0 = texture2D(tNd, vUv);
      vec4 nL = texture2D(tNd, vUv - vec2(off.x, 0.));
      vec4 nR = texture2D(tNd, vUv + vec2(off.x, 0.));
      vec4 nD = texture2D(tNd, vUv - vec2(0., off.y));
      vec4 nU = texture2D(tNd, vUv + vec2(0., off.y));
      float dEdge = (abs(n0.w - nL.w) + abs(n0.w - nR.w) + abs(n0.w - nD.w) + abs(n0.w - nU.w)) * 0.18;
      float nEdge = length(nL.xyz - nR.xyz) + length(nD.xyz - nU.xyz);
      float edge = smoothstep(0.25, 0.65, dEdge + nEdge * 0.6);
      vec4 c = texture2D(tCol, vUv);
      vec3 inkCol = vec3(0.08, 0.07, 0.11);
      c.rgb = mix(c.rgb, inkCol, edge * 0.82);
      vec2 p = vUv * 2. - 1.; float v = smoothstep(0.5, 1.45, length(p));
      c.rgb = mix(c.rgb, c.rgb * (1. - vig), v);
      if(flash > 0.) c.rgb = mix(c.rgb, vec3(1.), flash);
      gl_FragColor = c;
    }`
});
const inkScene = new THREE.Scene(); inkScene.add(new THREE.Mesh(fsQuad, inkMat));

// lens DOF
const dofU = {
  tCol: { value: rtInk.texture }, tNd: { value: rtNd.texture },
  focus: { value: 5.0 }, cinf: { value: 2.2 }, near: { value: 1.0 }, res: { value: new THREE.Vector2(W, H) }
};
const dofMat = new THREE.ShaderMaterial({
  uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D tCol, tNd; uniform float focus, cinf, near; uniform vec2 res; varying vec2 vUv;
    void main(){
      float d = texture2D(tNd, vUv).w;
      if (d <= 0.001) { gl_FragColor = texture2D(tCol, vUv); return; }
      float coc = clamp(abs(d - focus) / max(d, 0.01) * cinf, 0., 1.0);
      if (d < near) coc = max(coc, (near - d) * 0.6);
      if (coc < 0.08) { gl_FragColor = texture2D(tCol, vUv); return; }
      vec4 acc = vec4(0.); float tot = 0.;
      float rad = coc * 6.0;
      for(float i=0.; i<8.; i++){
        float a = i * 0.785398;
        vec2 of = vec2(cos(a), sin(a)) * rad / res;
        acc += texture2D(tCol, vUv + of); tot += 1.;
      }
      gl_FragColor = acc / tot;
    }`
});
const dofScene = new THREE.Scene(); dofScene.add(new THREE.Mesh(fsQuad, dofMat));

// ---------- HUD Canvas (Word-Synced Captions + Vignette + Bloom) ----------
const hudCanvas = document.createElement('canvas');
hudCanvas.width = W; hudCanvas.height = H;
const hudCtx = hudCanvas.getContext('2d');
const hudTex = new THREE.CanvasTexture(hudCanvas);
hudTex.colorSpace = THREE.SRGBColorSpace;
const hudScene = new THREE.Scene();
const hudCam = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0, 10);
hudCam.position.z = 1;
const hudMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, depthTest: false, depthWrite: false }));
hudScene.add(hudMesh);

// Offscreen transition buffer for seamless crossfade dissolves
const transCanvas = document.createElement('canvas');
transCanvas.width = W; transCanvas.height = H;
const transCtx = transCanvas.getContext('2d');
let lastShotId = null;

function drawSubtitles(f, S) {
  hudCtx.clearRect(0, 0, W, H);
  const t = f / 30;

  // 1. Soft Vignette Overlay
  const vigGrad = hudCtx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.74);
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, 'rgba(12,10,18,0.24)');
  hudCtx.fillStyle = vigGrad;
  hudCtx.fillRect(0, 0, W, H);

  // 2. Light Preset Color Grade Tint
  const L = lightFor(S, f);
  if (L.gradeTint) {
    hudCtx.fillStyle = L.gradeTint;
    hudCtx.fillRect(0, 0, W, H);
  }

  // 3. Transition Overlay (Whip-pan speed lines or White Flash)
  const transFrames = 8;
  if (f >= S.a && f < S.a + transFrames) {
    const p = (f - S.a) / transFrames;
    if (S.trans === 'whiteFlash') {
      hudCtx.fillStyle = `rgba(255, 255, 255, ${(1 - p) * 0.85})`;
      hudCtx.fillRect(0, 0, W, H);
    } else if (S.trans === 'whipPan') {
      hudCtx.save();
      hudCtx.fillStyle = `rgba(255, 255, 255, ${(1 - p) * 0.28})`;
      for (let k = 0; k < 6; k++) {
        const y = 300 + k * 240;
        hudCtx.fillRect(0, y, W, 8);
      }
      hudCtx.restore();
    }
  }

  // 4. Word-Synced Captions (1-2 Words at a time)
  // Find active 1-2 word chunk
  const chunk = CHUNKS.find(c => t >= c.s - 0.04 && t <= c.e + 0.08);
  if (!chunk) return;

  hudCtx.save();
  hudCtx.textAlign = 'center';
  hudCtx.textBaseline = 'middle';

  // Bold rounded sans-serif: 88px (in range 84-96px)
  hudCtx.font = "900 88px 'Arial Rounded MT Bold', system-ui, -apple-system, sans-serif";

  // Position: 68-72% of frame height (default 0.70 = 1344px), adjustable within 62-78% per shot
  const captionYRatio = S.captionY !== undefined ? S.captionY : 0.70;
  const posY = H * captionYRatio;

  // Soft shadow
  hudCtx.shadowColor = 'rgba(0, 0, 0, 0.70)';
  hudCtx.shadowBlur = 18;
  hudCtx.shadowOffsetY = 5;

  // Thick dark stroke: 11px (in range 10-12px)
  hudCtx.lineWidth = 11;
  hudCtx.strokeStyle = '#141218';
  hudCtx.lineJoin = 'round';
  hudCtx.miterLimit = 2;

  // Pure white text fill
  hudCtx.strokeText(chunk.text, W / 2, posY);
  hudCtx.fillStyle = '#ffffff';
  hudCtx.fillText(chunk.text, W / 2, posY);

  hudCtx.restore();
}

// ---------- light placement ----------
const applyLight = (L, f) => {
  hemi.color.set(L.sky); hemi.groundColor.set(L.ground); hemi.intensity = L.hemi;
  sun.color.set(L.sun); sun.intensity = L.sunI;
  const a = rx(L.az), e = rx(L.el);
  sun.position.set(Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)).multiplyScalar(100);
  scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
  skyU.top.value.set(L.skyTop); skyU.hor.value.set(L.skyHor);
  skyU.sunDir.value.copy(sun.position).normalize(); skyU.sunCol.value.set(L.sunDisc || L.sun);
  skyU.sunSize.value = L.sunSize || 0;
};

const placeSun = (L, target) => {
  sun.target.position.copy(target);
  const a = rx(L.az), e = rx(L.el);
  sun.position.copy(target).add(new THREE.Vector3(Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)).multiplyScalar(50));
  const ext = L.shadowExt || 20;
  sun.shadow.camera.left = -ext; sun.shadow.camera.right = ext; sun.shadow.camera.top = ext; sun.shadow.camera.bottom = -ext;
  sun.shadow.camera.near = 5; sun.shadow.camera.far = 130;
  sun.shadow.camera.updateProjectionMatrix();
};

const worldState = (S, f) => {
  // Modular set selection
  Object.entries(SETS).forEach(([name, grp]) => {
    grp.visible = (S.set === name);
  });

  // Dynamic set animators
  if (S.set === 'cageBattery' && SETS.cageBattery.userData.cageDoors) {
    const rot = S.doorsOpen ? -Math.PI * 0.65 : 0;
    SETS.cageBattery.userData.cageDoors.forEach(d => { d.rotation.x = rot; });
  }

  if (S.set === 'fieldRoad' && SETS.fieldRoad.userData.banners) {
    SETS.fieldRoad.userData.banners.forEach((b, i) => {
      b.rotation.y = Math.sin(f * 0.1 + i) * 0.12;
    });
  }

  if (S.set === 'carriageStation' && SETS.carriageStation.userData.carriage) {
    const car = SETS.carriageStation.userData.carriage;
    if (f < 1000) {
      car.position.set(1.4, DECK, -1.8);
      car.rotation.y = -0.25;
    } else {
      car.position.set(0, DECK, -4.5);
      car.rotation.y = 0;
    }
  }
};

function drawActors(list, cam) {
  cards.forEach((c) => { c.mesh.visible = c.blob.visible = false; });
  list.forEach((a, i) => {
    const c = getCard(i);
    c.draw(a.key, a.draw);
    c.mesh.visible = true; c.mesh.position.set(a.x, a.y, a.z);
    const s = a.s || 1; c.mesh.scale.set(s * (a.flip ? -1 : 1), s, s);
    c.mesh.rotation.set(0, Math.atan2(cam.position.x - a.x, cam.position.z - a.z) + (a.yaw || 0), a.roll || 0);
    c.mat.color.set(a.tint || '#ffffff'); c.mat.opacity = a.alpha ?? 1;
    c.mesh.castShadow = a.shadow !== false;
    c.mesh.renderOrder = a.order || 2;
    if (a.blob !== false && a.y < DECK + 0.5) {
      c.blob.visible = true; c.blob.position.set(a.x, (a.ground ?? DECK) + 0.02, a.z); c.blob.scale.set(0.95 * s, 0.6 * s, 1);
    }
  });
}

const swapForNd = (on) => {
  scene.traverse((o) => {
    if (!o.isMesh) return;
    if (on) {
      o.userData.mat0 = o.material;
      if (o.userData.ndSkip) { o.userData.vis0 = o.visible; o.visible = false; return; }
      if (o === sky || o.userData.sky) { o.userData.vis0 = o.visible; o.visible = false; return; }
      o.material = o.userData.nd || ndMat;
    } else {
      o.material = o.userData.mat0; if (o.userData.vis0 !== undefined) { o.visible = o.userData.vis0; delete o.userData.vis0; }
    }
  });
};

window.renderFrame = (f) => {
  const S = shotAt(f), L = lightFor(S, f), C = camAt(f);
  applyLight(L, f);
  
  // Camera staging with optional whip-pan offset
  let camX = C.pos[0], lookX = C.look[0];
  if (S.trans === 'whipPan' && f >= S.a && f < S.a + 6) {
    const wp = (1.0 - (f - S.a) / 6.0) ** 2;
    camX += wp * 1.8; lookX += wp * 1.8;
  }
  camera.position.set(camX, C.pos[1], C.pos[2]);
  camera.up.set(0, 1, 0);
  camera.lookAt(lookX, C.look[1], C.look[2]);
  camera.rotateZ(rx(C.roll || 0));
  camera.fov = C.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();

  worldState(S, f);
  placeSun(L, new THREE.Vector3(...(C.shadowAt || C.look)));
  drawActors([...actorsAt(f, T), ...fxAt(f, T)], camera);
  sky.position.copy(camera.position);
  for (const c of clouds) c.quaternion.copy(camera.quaternion);
  
  // pass A: colour
  renderer.setRenderTarget(rtColor); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera);
  
  // pass B: normal + depth
  const fog = scene.fog; scene.fog = null; const sm = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.shadowMap.autoUpdate = false;
  swapForNd(true); renderer.setRenderTarget(rtNd); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera); swapForNd(false);
  scene.fog = fog; renderer.shadowMap.enabled = sm; renderer.shadowMap.autoUpdate = true;
  
  // pass C: ink + grade
  const D = dofAt(f);
  inkU.px.value = 2.4; inkU.flash.value = C.flash || 0; inkU.vig.value = L.vig ?? 0.18;
  renderer.setRenderTarget(rtInk); renderer.render(inkScene, fsCam);
  
  // pass D: lens DOF to screen
  dofU.focus.value = D.focus; dofU.cinf.value = D.cinf; dofU.near.value = D.near ?? 1;
  renderer.setRenderTarget(null); renderer.render(dofScene, fsCam);

  // pass E: HUD Subtitles + Bloom + Vignette
  drawSubtitles(f, S);
  hudTex.needsUpdate = true;
  renderer.autoClear = false;
  renderer.render(hudScene, hudCam);
  renderer.autoClear = true;

  return true;
};

window.TOTAL = TOTAL;
window.ready = true;
