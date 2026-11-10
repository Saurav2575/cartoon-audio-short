// Canvas2D painted textures (our own). All deterministic.
import * as THREE from './lib/three.module.js';

export const rng = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

const cv = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
};

export const tex = (c, rx = 1, ry = 1) => {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

export function planks(seed = 1) {
  const [c, g] = cv(512, 512), r = rng(seed), n = 8, w = 512 / n;
  for (let i = 0; i < n; i++) {
    const L = 50 + r() * 12, H = 28 + r() * 8;
    g.fillStyle = hsl(H, 42, L);
    g.fillRect(i * w, 0, w, 512);
    for (let k = 0; k < 12; k++) {
      g.strokeStyle = hsl(H - 4, 38, L - 12 - r() * 8, 0.45);
      g.lineWidth = 1 + r() * 2;
      g.beginPath();
      const x = i * w + 4 + r() * (w - 8);
      g.moveTo(x, 0);
      g.bezierCurveTo(x + r() * 6 - 3, 170, x + r() * 6 - 3, 340, x + r() * 4 - 2, 512);
      g.stroke();
    }
    const cut = r() * 512;
    g.fillStyle = 'rgba(35,22,12,.9)';
    g.fillRect(i * w, cut, w, 4);
    for (const y of [cut - 16, cut + 16]) {
      g.fillStyle = '#262018';
      g.beginPath();
      g.arc(i * w + w * 0.3, y, 2.5, 0, 7);
      g.arc(i * w + w * 0.7, y, 2.5, 0, 7);
      g.fill();
    }
    g.fillStyle = 'rgba(28,16,8,.95)';
    g.fillRect(i * w, 0, 3, 512);
  }
  return c;
}

export function beam(seed = 2, base = [30, 40, 38]) {
  const [c, g] = cv(256, 512), r = rng(seed);
  g.fillStyle = hsl(base[0], base[1], base[2]);
  g.fillRect(0, 0, 256, 512);
  for (let k = 0; k < 35; k++) {
    g.strokeStyle = hsl(base[0] - 3, base[1], base[2] - 8 - r() * 10, .4);
    g.lineWidth = 1.2 + r() * 2.5;
    g.beginPath();
    const x = r() * 256;
    g.moveTo(x, 0);
    g.bezierCurveTo(x + 8, 170, x - 8, 340, x + r() * 10 - 5, 512);
    g.stroke();
  }
  return c;
}

export function stone(seed = 4, hue = 36, sat = 14, lig = 66, bw = 128, bh = 64) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#423c34';
  g.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 512 / bh; row++) for (let col = -1; col < 512 / bw + 1; col++) {
    const x = col * bw + (row % 2) * bw / 2, y = row * bh, L = lig - 6 + r() * 12;
    g.fillStyle = hsl(hue + r() * 8 - 4, sat, L);
    g.beginPath();
    g.roundRect(x + 3, y + 3, bw - 6, bh - 6, 6);
    g.fill();
    g.fillStyle = hsl(hue, sat, L + 7, .5);
    g.fillRect(x + 6, y + 5, bw - 14, 5);
    g.fillStyle = hsl(hue, sat, L - 12, .45);
    g.fillRect(x + 6, y + bh - 10, bw - 12, 5);
  }
  return c;
}

/** Striped Agricultural European Fields (as seen in reference video) */
export function stripedFields(seed = 6) {
  const [c, g] = cv(512, 512), r = rng(seed);
  // diagonal or vertical field strips
  const bands = [
    '#588d3d', '#6ca648', '#88be57', '#9ec962', // lush greens
    '#d6b85a', '#e0c86e', '#caa84e',            // golden wheat
    '#826b9a', '#957eac', '#715888',            // lavender
    '#7fae4a', '#61963c'                        // clover
  ];
  const stripW = 32;
  for (let i = 0; i < 512 / stripW + 2; i++) {
    const col = bands[i % bands.length];
    g.fillStyle = col;
    g.fillRect(i * stripW, 0, stripW, 512);
    // subtle furrows / crop lines
    g.strokeStyle = 'rgba(0,0,0,0.08)';
    g.lineWidth = 2;
    for (let k = 4; k < stripW; k += 8) {
      g.beginPath();
      g.moveTo(i * stripW + k, 0);
      g.lineTo(i * stripW + k, 512);
      g.stroke();
    }
  }
  return c;
}

export function grass(seed = 6) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#6fa448';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = hsl(85 + r() * 20, 42, 38 + r() * 14, .45);
    g.beginPath();
    g.ellipse(r() * 512, r() * 512, 20 + r() * 50, 12 + r() * 30, r() * 3, 0, 7);
    g.fill();
  }
  for (let i = 0; i < 1200; i++) {
    const x = r() * 512, y = r() * 512;
    g.strokeStyle = hsl(80 + r() * 30, 45, 30 + r() * 25, .8);
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + r() * 4 - 2, y - 5 - r() * 7);
    g.stroke();
  }
  for (let i = 0; i < 40; i++) {
    g.fillStyle = ['#f5e57e', '#ffffff', '#e8a2c2'][i % 3];
    g.beginPath();
    g.arc(r() * 512, r() * 512, 2.6, 0, 7);
    g.fill();
  }
  return c;
}

export function dirt(seed = 7) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#b3946d';
  g.fillRect(0, 0, 512, 512);
  // wheel tracks / ruts
  g.fillStyle = '#9b7c55';
  g.fillRect(110, 0, 55, 512);
  g.fillRect(345, 0, 55, 512);
  for (let i = 0; i < 300; i++) {
    g.fillStyle = hsl(32 + r() * 10, 26, 42 + r() * 22, .5);
    g.beginPath();
    g.ellipse(r() * 512, r() * 512, 3 + r() * 14, 2 + r() * 8, r() * 3, 0, 7);
    g.fill();
  }
  return c;
}

/** Tent canvas striped fabric */
export function tentFabric(seed = 8) {
  const [c, g] = cv(256, 256);
  const n = 4, w = 256 / n;
  for (let i = 0; i < n; i++) {
    g.fillStyle = i % 2 === 0 ? '#b8262b' : '#f4eee0';
    g.fillRect(i * w, 0, w, 256);
    g.fillStyle = 'rgba(0,0,0,0.06)';
    g.fillRect(i * w + w - 4, 0, 4, 256);
  }
  return c;
}

/** Radial bloom glow for candles and lanterns */
export function radialGlow(col = '255,200,100', alpha = 0.8) {
  const [c, g] = cv(128, 128);
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(${col},${alpha})`);
  gr.addColorStop(0.2, `rgba(${col},${alpha * 0.7})`);
  gr.addColorStop(0.55, `rgba(${col},${alpha * 0.25})`);
  gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return c;
}

export function cloud(seed = 8) {
  const [c, g] = cv(512, 256);
  g.clearRect(0, 0, 512, 256);
  g.fillStyle = 'rgba(255, 255, 255, 0.92)';
  const lobes = [
    [160, 150, 65], [240, 130, 90], [320, 140, 80], [380, 160, 60],
    [200, 170, 55], [280, 170, 70]
  ];
  for (const [x, y, rad] of lobes) {
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

export function radial(col = '0,0,0', a = 0.55) {
  const [c, g] = cv(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(${col},${a})`);
  gr.addColorStop(0.55, `rgba(${col},${a * 0.6})`);
  gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return c;
}
