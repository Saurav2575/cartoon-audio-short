// Character & Prop Drawing Procedures for Cartoon Shorts
// Implements pure-white bean heads, distinct silhouettes, multi-expression reaction close-ups,
// comedic props as jokes (flip counter, blueprint, price tag, stamp), and animal swarms.

// export const INK = "#1a1622"; (already defined in toonbase)
export const PURE_WHITE = "#ffffff";
export const GOLD = "#f59e0b";
export const RED = "#dc2626";
export const NAVY = "#1e3a6e";
export const MARSHAL_RED = "#9b2226";
export const BOOT_BLACK = "#18181b";
export const BOOT_CUFF = "#c2410c";

/** PURE-WHITE STICKMAN BEAN HEAD */
export const drawStickmanHead = (p, cx, cy, rx, ry, opts = {}) => {
  const g = p.g;
  const { expr = "proud", tilt = 0, glasses = false, beard = false, sweat = false, blush = false, profile = false } = opts;
  
  g.save();
  g.translate(cx, cy);
  if (tilt) g.rotate(tilt * Math.PI / 180);

  // 1. Head shape (egg / smooth capsule)
  g.beginPath();
  g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  g.fillStyle = PURE_WHITE;
  g.fill();
  
  // Subtle shadow crescent on right edge
  g.save();
  g.clip();
  g.beginPath();
  g.ellipse(rx * 0.35, ry * 0.1, rx * 0.9, ry * 0.95, 0, 0, Math.PI * 2);
  g.fillStyle = "#ebe8e1";
  g.fill();
  g.beginPath();
  g.ellipse(-rx * 0.2, 0, rx * 0.9, ry * 0.95, 0, 0, Math.PI * 2);
  g.fillStyle = PURE_WHITE;
  g.fill();
  g.restore();

  // Dark ink outline
  g.lineWidth = 5.5;
  g.strokeStyle = INK;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.beginPath();
  g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  g.stroke();

  // 2. Eyebrows & Eyes
  const ex = rx * (profile ? 0.25 : 0.38), ey = -ry * 0.08;
  
  if (expr === "proud" || expr === "smug") {
    p.stroke([[-ex - 12, ey - 22], [-ex + 14, ey - 16]], 3.5, INK);
    p.stroke([[ex - 14, ey - 16], [ex + 12, ey - 22]], 3.5, INK);
    p.dot(-ex, ey, 4.5, INK);
    p.dot(ex, ey, 4.5, INK);
    // Smug smirk mouth
    p.stroke([[-ex * 0.4, ry * 0.42], [0, ry * 0.46], [ex * 0.8, ry * 0.34]], 3.5, INK);
  } else if (expr === "shock" || expr === "panic") {
    // High arched shock brows
    p.stroke([[-ex - 14, ey - 32], [-ex, ey - 38], [-ex + 12, ey - 32]], 3.5, INK);
    p.stroke([[ex - 12, ey - 32], [ex, ey - 38], [ex + 14, ey - 32]], 3.5, INK);
    // Huge wide-eyed circles with tiny dots
    g.beginPath(); g.ellipse(-ex, ey, 10, 14, 0, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill(); g.stroke();
    g.beginPath(); g.ellipse(ex, ey, 10, 14, 0, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill(); g.stroke();
    p.dot(-ex, ey, 3.8, INK);
    p.dot(ex, ey, 3.8, INK);
    // Open gasping mouth
    g.beginPath(); g.ellipse(0, ry * 0.46, 12, 18, 0, 0, Math.PI * 2); g.fillStyle = "#45161c"; g.fill(); g.stroke();
    if (sweat) {
      p.dot(rx + 12, -ry * 0.3, 5, "#38bdf8");
      p.dot(rx + 20, -ry * 0.1, 4, "#38bdf8");
      p.dot(-rx - 14, -ry * 0.2, 4.5, "#38bdf8");
    }
  } else if (expr === "pout" || expr === "furious") {
    // Angled furrowed brows
    p.stroke([[-ex - 12, ey - 14], [-ex + 14, ey - 24]], 4.5, INK);
    p.stroke([[ex - 14, ey - 24], [ex + 12, ey - 14]], 4.5, INK);
    p.dot(-ex, ey, 5, INK);
    p.dot(ex, ey, 5, INK);
    // Gritted zigzag mouth
    p.stroke([[-ex * 0.7, ry * 0.46], [-ex * 0.2, ry * 0.42], [ex * 0.2, ry * 0.48], [ex * 0.7, ry * 0.44]], 4, INK);
  } else if (expr === "laugh" || expr === "happy") {
    p.stroke([[-ex - 10, ey - 24], [-ex + 10, ey - 20]], 3.5, INK);
    p.stroke([[ex - 10, ey - 20], [ex + 10, ey - 24]], 3.5, INK);
    g.beginPath(); g.arc(-ex, ey + 2, 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.beginPath(); g.arc(ex, ey + 2, 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.beginPath(); g.ellipse(0, ry * 0.42, 16, 12, 0, 0, Math.PI); g.fillStyle = "#831843"; g.fill(); g.stroke();
    g.beginPath(); g.arc(0, ry * 0.42 + 6, 8, 0, Math.PI); g.fillStyle = "#f472b6"; g.fill();
  } else if (expr === "wink") {
    p.stroke([[-ex - 10, ey - 22], [-ex + 10, ey - 18]], 3.5, INK);
    p.stroke([[ex - 10, ey - 18], [ex + 10, ey - 22]], 3.5, INK);
    p.dot(-ex, ey, 5, INK);
    g.beginPath(); g.arc(ex, ey + 2, 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    p.stroke([[-ex * 0.4, ry * 0.44], [0, ry * 0.48], [ex * 0.8, ry * 0.38]], 3.5, INK);
  } else {
    // Normal / attentive
    p.stroke([[-ex - 10, ey - 18], [-ex + 10, ey - 18]], 3.2, INK);
    p.stroke([[ex - 10, ey - 18], [ex + 10, ey - 18]], 3.2, INK);
    p.dot(-ex, ey, 4.5, INK);
    p.dot(ex, ey, 4.5, INK);
    p.stroke([[-ex * 0.5, ry * 0.44], [0, ry * 0.48], [ex * 0.5, ry * 0.44]], 3.2, INK);
  }

  if (glasses) {
    g.lineWidth = 3.2; g.strokeStyle = "#27272a";
    g.beginPath(); g.arc(-ex, ey, 14, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(ex, ey, 14, 0, Math.PI * 2); g.stroke();
    p.stroke([[-ex + 14, ey], [ex - 14, ey]], 3, "#27272a");
  }

  if (blush) {
    p.dot(-rx * 0.55, ry * 0.22, 8, "#fca5a5");
    p.dot(rx * 0.55, ry * 0.22, 8, "#fca5a5");
  }

  g.restore();
};

/** IMPERIAL BICORNE HAT */
export const drawImperialBicorne = (p, cx, cy, w, opts = {}) => {
  const g = p.g;
  const { goldTrim = true, cockade = true, tilt = 0, plume = false, plumeCol = RED } = opts;
  const h = w * 0.48;

  g.save();
  g.translate(cx, cy);
  if (tilt) g.rotate(tilt * Math.PI / 180);

  // Hat shape (bicorn curve)
  const pts = [
    [-w * 0.5, h * 0.3],
    [-w * 0.42, -h * 0.45],
    [0, -h * 0.5],
    [w * 0.42, -h * 0.45],
    [w * 0.5, h * 0.3],
    [w * 0.25, h * 0.45],
    [0, h * 0.4],
    [-w * 0.25, h * 0.45]
  ];
  p.poly(pts, "#18181b", 5.5);

  if (goldTrim) {
    p.stroke([[-w * 0.48, h * 0.28], [-w * 0.4, -h * 0.42], [0, -h * 0.46], [w * 0.4, -h * 0.42], [w * 0.48, h * 0.28]], 3.5, GOLD);
  }

  if (cockade) {
    p.dot(0, -h * 0.15, 13, RED);
    p.dot(0, -h * 0.15, 9, PURE_WHITE);
    p.dot(0, -h * 0.15, 5, NAVY);
    p.stroke([[0, -h * 0.15], [0, h * 0.2]], 3, GOLD);
  }

  if (plume) {
    p.stroke([[w * 0.35, -h * 0.35], [w * 0.45, -h * 0.75], [w * 0.4, -h * 0.95]], 7, plumeCol);
  }

  g.restore();
};

/** NAPOLEON BONAPARTE Card */
export const drawNapoleon = (p, opts = {}) => {
  const { expr = "proud", pose = "proud", look = 0, tilt = 0, bob = 0, run = 0 } = opts;
  const cx = 300, sole = 975;

  // Legs & Boots
  const legY = sole - 225 - bob * 24;
  const kneeY = sole - 105;

  for (const s of [-1, 1]) {
    const lx = cx + s * 36;
    let legOffset = 0, kickY = 0;
    if (run) {
      legOffset = Math.sin(run * 6 + s * 1.6) * 38;
      kickY = Math.max(0, -Math.cos(run * 6 + s * 1.6) * 22);
    }

    p.stroke([[lx, legY], [lx + legOffset * 0.4, kneeY - kickY]], 18, "#f4f4f0");
    p.poly([[lx - 9, legY], [lx + 9, legY], [lx + 8 + legOffset * 0.4, kneeY - kickY], [lx - 8 + legOffset * 0.4, kneeY - kickY]], "#f4f4f0", 5);

    const footY = sole - 4 - kickY;
    const bootPts = [
      [lx - 12 + legOffset * 0.4, kneeY - kickY],
      [lx + 12 + legOffset * 0.4, kneeY - kickY],
      [lx + 14 + legOffset, footY],
      [lx + s * 26 + legOffset, footY],
      [lx - 14 + legOffset, footY]
    ];
    p.poly(bootPts, BOOT_BLACK, 5.5);

    p.poly([
      [lx - 13 + legOffset * 0.4, kneeY - kickY],
      [lx + 13 + legOffset * 0.4, kneeY - kickY],
      [lx + 13 + legOffset * 0.4, kneeY - kickY + 28],
      [lx - 13 + legOffset * 0.4, kneeY - kickY + 28]
    ], BOOT_CUFF, 4.5);

    p.dot(lx - s * 15 + legOffset, footY - 10, 4.5, GOLD);
  }

  // Torso
  const chinY = legY - 260;
  const coatPts = [
    [cx - 72, chinY + 46], [cx + 72, chinY + 46],
    [cx + 78, legY - 25], [cx + 86, legY + 25],
    [cx + 30, legY + 16], [cx, legY - 8], [cx - 30, legY + 16],
    [cx - 86, legY + 25], [cx - 78, legY - 25]
  ];
  p.poly(coatPts, NAVY, 6.5);

  p.poly([[cx - 30, chinY + 68], [cx + 30, chinY + 68], [cx + 25, legY - 12], [cx - 25, legY - 12]], "#f5f5ee", 4.5);
  for (let k = 0; k < 5; k++) p.dot(cx, chinY + 85 + k * 30, 4, GOLD);

  p.poly([[cx - 34, chinY + 42], [cx + 34, chinY + 42], [cx + 26, chinY + 70], [cx - 26, chinY + 70]], RED, 5);
  p.stroke([[cx - 30, chinY + 45], [cx + 30, chinY + 45]], 2.5, GOLD);

  for (const s of [-1, 1]) {
    p.poly([[cx + s * 60, chinY + 44], [cx + s * 78, chinY + 44], [cx + s * 80, chinY + 62], [cx + s * 58, chinY + 58]], GOLD, 4);
    p.stroke([[cx + s * 74, chinY + 62], [cx + s * 74, chinY + 74]], 3, GOLD);
  }

  // Arms & Poses
  if (pose === "proud") {
    p.stroke([[cx - 68, chinY + 54], [cx - 45, chinY + 120], [cx - 8, chinY + 115]], 14, NAVY);
    p.poly([[cx - 14, chinY + 105], [cx + 10, chinY + 105], [cx + 8, chinY + 130], [cx - 14, chinY + 130]], PURE_WHITE, 4.5);
    p.stroke([[cx + 68, chinY + 54], [cx + 86, chinY + 130], [cx + 72, chinY + 185]], 14, NAVY);
    p.dot(cx + 68, chinY + 185, 12, PURE_WHITE);
  } else if (pose === "side" || pose === "threeQuarter") {
    // 3/4 profile pose
    p.stroke([[cx - 40, chinY + 54], [cx + 10, chinY + 120], [cx + 50, chinY + 115]], 14, NAVY);
    p.dot(cx + 50, chinY + 115, 12, PURE_WHITE);
  } else if (pose === "gun" || pose === "aim") {
    p.stroke([[cx - 68, chinY + 54], [cx - 30, chinY + 110], [cx + 30, chinY + 95]], 13, NAVY);
    p.stroke([[cx + 68, chinY + 54], [cx + 90, chinY + 100], [cx + 60, chinY + 92]], 13, NAVY);
    p.stroke([[cx - 70, chinY + 115], [cx + 140, chinY + 80]], 9, "#7c4a24");
    p.stroke([[cx + 40, chinY + 87], [cx + 155, chinY + 78]], 6, "#71717a");
    p.dot(cx + 155, chinY + 78, 5, GOLD);
    p.dot(cx - 20, chinY + 104, 11, PURE_WHITE);
    p.dot(cx + 60, chinY + 92, 11, PURE_WHITE);
  } else if (pose === "panic" || pose === "shock" || pose === "fend") {
    p.stroke([[cx - 68, chinY + 54], [cx - 98, chinY + 10], [cx - 80, chinY - 45]], 14, NAVY);
    p.stroke([[cx + 68, chinY + 54], [cx + 98, chinY + 10], [cx + 80, chinY - 45]], 14, NAVY);
    p.dot(cx - 80, chinY - 45, 13, PURE_WHITE);
    p.dot(cx + 80, chinY - 45, 13, PURE_WHITE);
  } else if (pose === "run") {
    const aOff = Math.sin(run * 6) * 45;
    p.stroke([[cx - 68, chinY + 54], [cx - 95, chinY + 90 - aOff], [cx - 70, chinY + 140 - aOff]], 14, NAVY);
    p.stroke([[cx + 68, chinY + 54], [cx + 95, chinY + 90 + aOff], [cx + 70, chinY + 140 + aOff]], 14, NAVY);
    p.dot(cx - 70, chinY + 140 - aOff, 13, PURE_WHITE);
    p.dot(cx + 70, chinY + 140 + aOff, 13, PURE_WHITE);
  }

  const headCY = chinY - 45;
  drawStickmanHead(p, cx, headCY, 48, 56, { expr, tilt, sweat: expr === "panic" || expr === "shock" });
  drawImperialBicorne(p, cx, headCY - 42, 140, { goldTrim: true, cockade: true, tilt: tilt * 0.7 });
};

/** REACTION CLOSE-UP: NAPOLEON SHOCKED / SWEATING */
export const drawNapoleonCloseup = (p, opts = {}) => {
  const { expr = "shock", tilt = 0, sweat = true } = opts;
  const cx = 300, cy = 600;

  // Massive Torso collar
  p.poly([[cx - 160, cy + 240], [cx + 160, cy + 240], [cx + 175, 1000], [cx - 175, 1000]], NAVY, 8);
  p.poly([[cx - 70, cy + 240], [cx + 70, cy + 240], [cx + 50, 1000], [cx - 50, 1000]], "#f5f5ee", 6);
  p.poly([[cx - 85, cy + 230], [cx + 85, cy + 230], [cx + 70, cy + 280], [cx - 70, cy + 280]], RED, 6);

  // Big Head
  drawStickmanHead(p, cx, cy, 110, 128, { expr, tilt, sweat });
  // Big Bicorne Hat
  drawImperialBicorne(p, cx, cy - 105, 320, { goldTrim: true, cockade: true, tilt: tilt * 0.6 });
};

/** CHIEF OF STAFF BERTHIER Card */
export const drawBerthier = (p, opts = {}) => {
  const { expr = "proud", pose = "explain", tilt = 0, bob = 0 } = opts;
  const cx = 300, sole = 975;
  const legY = sole - 225 - bob * 20;
  const kneeY = sole - 105;

  for (const s of [-1, 1]) {
    const lx = cx + s * 34;
    p.stroke([[lx, legY], [lx, kneeY]], 16, "#f4f4f0");
    p.poly([[lx - 12, kneeY], [lx + 12, kneeY], [lx + 13, sole - 4], [lx + s * 22, sole - 4], [lx - 13, sole - 4]], BOOT_BLACK, 5);
  }

  const chinY = legY - 260;
  p.poly([[cx - 70, chinY + 45], [cx + 70, chinY + 45], [cx + 75, legY - 20], [cx + 80, legY + 20], [cx, legY - 5], [cx - 80, legY + 20], [cx - 75, legY - 20]], MARSHAL_RED, 6);
  p.poly([[cx - 25, chinY + 65], [cx + 25, chinY + 65], [cx + 20, legY - 10], [cx - 20, legY - 10]], "#f5f5ee", 4);

  // Arms: holding clipboard/quill
  if (pose === "explain") {
    p.stroke([[cx - 65, chinY + 54], [cx - 35, chinY + 115]], 13, MARSHAL_RED);
    p.poly([[cx - 50, chinY + 95], [cx - 15, chinY + 90], [cx - 10, chinY + 135], [cx - 45, chinY + 140]], "#78350f", 3);
    p.stroke([[cx + 65, chinY + 54], [cx + 40, chinY + 105]], 13, MARSHAL_RED);
    p.stroke([[cx + 40, chinY + 105], [cx + 35, chinY + 80]], 3, PURE_WHITE);
  } else if (pose === "shock") {
    p.stroke([[cx - 65, chinY + 54], [cx - 85, chinY + 15]], 13, MARSHAL_RED);
    p.stroke([[cx + 65, chinY + 54], [cx + 85, chinY + 15]], 13, MARSHAL_RED);
    p.dot(cx - 85, chinY + 15, 12, PURE_WHITE);
    p.dot(cx + 85, chinY + 15, 12, PURE_WHITE);
  }

  const headCY = chinY - 45;
  drawStickmanHead(p, cx, headCY, 46, 54, { expr, glasses: true, tilt, sweat: expr === "shock" || expr === "embarrassed", blush: expr === "embarrassed" });
  drawImperialBicorne(p, cx, headCY - 40, 130, { goldTrim: true, plume: true, plumeCol: RED, tilt: tilt * 0.7 });
};

/** FRENCH GRENADIER Card */
export const drawGrenadier = (p, opts = {}) => {
  const { expr = "proud", wave = false, sweat = false } = opts;
  const cx = 300, sole = 975;
  const legY = sole - 225, kneeY = sole - 105;

  for (const s of [-1, 1]) {
    const lx = cx + s * 34;
    p.stroke([[lx, legY], [lx, kneeY]], 16, "#f4f4f0");
    p.poly([[lx - 12, kneeY], [lx + 12, kneeY], [lx + 13, sole - 4], [lx + s * 22, sole - 4], [lx - 13, sole - 4]], BOOT_BLACK, 5);
  }

  const chinY = legY - 260;
  p.poly([[cx - 68, chinY + 45], [cx + 68, chinY + 45], [cx + 72, legY], [cx - 72, legY]], NAVY, 6);
  // White crossbelts
  p.stroke([[cx - 60, chinY + 48], [cx + 60, legY - 10]], 8, PURE_WHITE);
  p.stroke([[cx + 60, chinY + 48], [cx - 60, legY - 10]], 8, PURE_WHITE);

  if (wave) {
    p.stroke([[cx - 65, chinY + 54], [cx - 105, chinY + 20], [cx - 85, chinY - 40]], 13, NAVY);
    p.stroke([[cx + 65, chinY + 54], [cx + 105, chinY + 20], [cx + 85, chinY - 40]], 13, NAVY);
    p.dot(cx - 85, chinY - 40, 12, PURE_WHITE);
    p.dot(cx + 85, chinY - 40, 12, PURE_WHITE);
  } else {
    // Holding musket
    p.stroke([[cx - 65, chinY + 54], [cx - 45, chinY + 115]], 13, NAVY);
    p.stroke([[cx + 65, chinY + 54], [cx + 45, chinY + 115]], 13, NAVY);
    p.stroke([[cx + 55, chinY - 80], [cx + 55, sole - 10]], 6, "#713f12");
  }

  const headCY = chinY - 45;
  drawStickmanHead(p, cx, headCY, 44, 52, { expr, sweat });
  // Tall Bearskin Hat
  p.poly([[cx - 40, headCY - 30], [cx + 40, headCY - 30], [cx + 36, headCY - 145], [cx - 36, headCY - 145]], "#18181b", 5.5);
  p.stroke([[cx + 36, headCY - 100], [cx + 45, headCY - 140]], 5, RED);
};

/** FLUFFY BUNNY Card */
export const drawBunny = (p, opts = {}) => {
  const { cx = 300, cy = 600, s = 1.0, expr = "cute", chew = 0, carrot = true, run = 0 } = opts;
  const g = p.g;

  g.save();
  g.translate(cx, cy);
  g.scale(s, s);

  // Fluffy round body
  g.beginPath();
  g.ellipse(0, 0, 55, 48, 0, 0, Math.PI * 2);
  g.fillStyle = PURE_WHITE;
  g.fill();
  g.lineWidth = 5;
  g.strokeStyle = INK;
  g.stroke();

  // Fluffy cotton tail
  g.beginPath(); g.arc(-55, 10, 16, 0, Math.PI * 2); g.fillStyle = PURE_WHITE; g.fill(); g.stroke();

  // Head
  const headX = 35, headY = -25;
  g.beginPath();
  g.ellipse(headX, headY, 34, 32, 0, 0, Math.PI * 2);
  g.fillStyle = PURE_WHITE;
  g.fill();
  g.stroke();

  // Long ears with pink inner
  for (const [ex, rot] of [[headX - 12, -0.2], [headX + 8, 0.15]]) {
    g.save();
    g.translate(ex, headY - 26);
    g.rotate(rot);
    g.beginPath(); g.ellipse(0, -32, 12, 38, 0, 0, Math.PI * 2); g.fillStyle = PURE_WHITE; g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, -32, 6, 26, 0, 0, Math.PI * 2); g.fillStyle = "#fbcfe8"; g.fill();
    g.restore();
  }

  // Black dot eye & pink twitching nose
  p.dot(cx + headX + 12, cy + headY - 6, 5, INK);
  p.dot(cx + headX + 28, cy + headY + 4, 4, "#f472b6");

  // Carrot munching
  if (carrot) {
    p.poly([[headX + 22, headY + 12], [headX + 58, headY + 28], [headX + 54, headY + 38]], "#ea580c", 3);
    p.stroke([[headX + 56, headY + 33], [headX + 70, headY + 36]], 3.5, "#16a34a");
    p.dot(headX + 10, headY - 45, 8, RED); // tiny heart
  }

  g.restore();
};

/** REACTION CLOSE-UP: BOOTS WITH CLIMBING BUNNIES */
export const drawBootClimbCloseup = (p, opts = {}) => {
  const cx = 300, sole = 920;
  // Giant leather boots
  for (const s of [-1, 1]) {
    const lx = cx + s * 110;
    p.poly([[lx - 55, 150], [lx + 55, 150], [lx + 65, sole], [lx + s * 95, sole], [lx - 65, sole]], BOOT_BLACK, 8);
    p.poly([[lx - 60, 150], [lx + 60, 150], [lx + 60, 260], [lx - 60, 260]], BOOT_CUFF, 6);
  }

  // 4 cute bunnies swarming and climbing up the leather
  drawBunny(p, { cx: cx - 120, cy: 750, s: 1.2, carrot: false });
  drawBunny(p, { cx: cx - 40,  cy: 520, s: 1.0, carrot: false });
  drawBunny(p, { cx: cx + 110, cy: 680, s: 1.3, carrot: true });
  drawBunny(p, { cx: cx + 45,  cy: 390, s: 0.9, carrot: false });
};

/** FRENCH FARMER PIERRE Card */
export const drawFarmer = (p, opts = {}) => {
  const { expr = "jolly", tilt = 0 } = opts;
  const cx = 300, sole = 975;
  const legY = sole - 225, kneeY = sole - 105;

  for (const s of [-1, 1]) {
    const lx = cx + s * 34;
    p.stroke([[lx, legY], [lx, kneeY]], 16, "#52525b");
    p.poly([[lx - 12, kneeY], [lx + 12, kneeY], [lx + 13, sole - 4], [lx + s * 22, sole - 4], [lx - 13, sole - 4]], "#713f12", 5);
  }

  const chinY = legY - 260;
  p.poly([[cx - 72, chinY + 45], [cx + 72, chinY + 45], [cx + 78, legY], [cx - 78, legY]], "#92400e", 6);
  // Patched burlap apron
  p.poly([[cx - 40, chinY + 80], [cx + 40, chinY + 80], [cx + 45, legY + 10], [cx - 45, legY + 10]], "#d97706", 4.5);

  // Arms holding giant carrot
  p.stroke([[cx - 65, chinY + 54], [cx - 20, chinY + 110]], 13, "#92400e");
  p.stroke([[cx + 65, chinY + 54], [cx + 20, chinY + 110]], 13, "#92400e");
  // Giant Carrot
  p.poly([[cx - 15, chinY + 80], [cx + 35, chinY + 155], [cx + 15, chinY + 165], [cx - 25, chinY + 95]], "#ea580c", 4.5);
  p.stroke([[cx - 20, chinY + 85], [cx - 45, chinY + 60]], 4, "#16a34a");

  const headCY = chinY - 45;
  drawStickmanHead(p, cx, headCY, 48, 54, { expr: "happy", blush: true, tilt });
  // Floppy French Beret
  p.poly([[cx - 55, headCY - 30], [cx + 55, headCY - 30], [cx + 30, headCY - 75], [cx - 65, headCY - 65]], RED, 5.5);
};

/** DRAFTING BLUEPRINT Card */
export const drawBlueprint = (p, opts = {}) => {
  const cx = 300, cy = 500, w = 520, h = 760;
  const g = p.g;

  p.poly([[cx - w/2, cy - h/2], [cx + w/2, cy - h/2], [cx + w/2, cy + h/2], [cx - w/2, cy + h/2]], "#1e40af", 6);
  
  g.lineWidth = 1; g.strokeStyle = "rgba(255,255,255,0.25)";
  for (let x = cx - w/2 + 30; x < cx + w/2; x += 30) {
    g.beginPath(); g.moveTo(x, cy - h/2); g.lineTo(x, cy + h/2); g.stroke();
  }
  for (let y = cy - h/2 + 30; y < cy + h/2; y += 30) {
    g.beginPath(); g.moveTo(cx - w/2, y); g.lineTo(cx + w/2, y); g.stroke();
  }

  g.lineWidth = 2.5; g.strokeStyle = "#ffffff";
  g.strokeRect(cx - w/2 + 18, cy - h/2 + 18, w - 36, h - 36);

  g.fillStyle = "#ffffff"; g.textAlign = "center";
  g.font = "bold 26px sans-serif";
  g.fillText("TAME RABBIT SYLLOGISM", cx, cy - h/2 + 65);
  
  g.font = "18px sans-serif";
  g.fillText("BERTHIER PROCUREMENT DEPT. (1807)", cx, cy - h/2 + 95);
  g.beginPath(); g.moveTo(cx - w/2 + 40, cy - h/2 + 110); g.lineTo(cx + w/2 - 40, cy - h/2 + 110); g.stroke();

  g.font = "bold 20px sans-serif";
  g.fillText("PREMISE 1: CAGE OPENS", cx, cy - h/2 + 160);
  g.lineWidth = 3; g.strokeStyle = "#ffffff";
  g.strokeRect(cx - 70, cy - h/2 + 185, 140, 90);
  for (let i = -50; i <= 50; i += 25) {
    g.beginPath(); g.moveTo(cx + i, cy - h/2 + 185); g.lineTo(cx + i, cy - h/2 + 275); g.stroke();
  }
  g.beginPath(); g.arc(cx + 70, cy - h/2 + 230, 35, 0, Math.PI * 0.5); g.stroke();

  p.stroke([[cx, cy - h/2 + 295], [cx, cy - h/2 + 345]], 4, "#ffffff");
  p.poly([[cx - 10, cy - h/2 + 335], [cx + 10, cy - h/2 + 335], [cx, cy - h/2 + 355]], "#ffffff", 0);

  g.fillText("PREMISE 2: HUMAN = CARROT", cx, cy - h/2 + 395);
  p.poly([[cx - 50, cy - h/2 + 440], [cx + 50, cy - h/2 + 470], [cx + 40, cy - h/2 + 490], [cx - 60, cy - h/2 + 455]], "#ffffff", 3);
  p.stroke([[cx - 55, cy - h/2 + 445], [cx - 85, cy - h/2 + 430]], 3, "#ffffff");
  p.stroke([[cx - 55, cy - h/2 + 445], [cx - 80, cy - h/2 + 455]], 3, "#ffffff");

  p.stroke([[cx, cy - h/2 + 515], [cx, cy - h/2 + 565]], 4, "#ffffff");
  p.poly([[cx - 10, cy - h/2 + 555], [cx + 10, cy - h/2 + 555], [cx, cy - h/2 + 575]], "#ffffff", 0);

  g.font = "bold 24px sans-serif";
  g.fillText("CONCLUSION: CHARGE THE EMPEROR!", cx, cy - h/2 + 625);
  g.font = "italic 18px sans-serif";
  g.fillText("(EXPECTING DELICIOUS LUNCH)", cx, cy - h/2 + 655);
};

/** MECHANICAL FLIP SIGNBOARD Card */
export const drawFlipBoard = (p, opts = {}) => {
  const cx = 300, cy = 500, w = 500, h = 340;
  const g = p.g;
  const { topText = "TREATY OF TILSIT", subText = "JULY", num = "1807" } = opts;

  p.poly([[cx - w/2, cy - h/2], [cx + w/2, cy - h/2], [cx + w/2, cy + h/2], [cx - w/2, cy + h/2]], "#78350f", 7);
  p.poly([[cx - w/2 + 20, cy - h/2 + 20], [cx + w/2 - 20, cy - h/2 + 20], [cx + w/2 - 20, cy + h/2 - 20], [cx - w/2 + 20, cy + h/2 - 20]], "#1c1917", 4);

  for (const [bx, by] of [[-w/2 + 32, -h/2 + 32], [w/2 - 32, -h/2 + 32], [-w/2 + 32, h/2 - 32], [w/2 - 32, h/2 - 32]]) {
    p.dot(cx + bx, cy + by, 7, GOLD);
  }

  p.poly([[cx - w/2 + 40, cy - h/2 + 35], [cx + w/2 - 40, cy - h/2 + 35], [cx + w/2 - 40, cy - h/2 + 95], [cx - w/2 + 40, cy - h/2 + 95]], "#065f46", 3);
  g.fillStyle = "#ffffff"; g.textAlign = "center";
  g.font = "bold 24px sans-serif";
  g.fillText(topText, cx, cy - h/2 + 73);

  g.fillStyle = GOLD;
  g.font = "bold 20px sans-serif";
  g.fillText(subText, cx, cy - h/2 + 135);

  const numW = 85, numH = 120, gap = 12;
  const startX = cx - ((num.length * (numW + gap) - gap) / 2) + numW/2;
  
  for (let i = 0; i < num.length; i++) {
    const tx = startX + i * (numW + gap), ty = cy + 45;
    p.poly([[tx - numW/2, ty - numH/2], [tx + numW/2, ty - numH/2], [tx + numW/2, ty + numH/2], [tx - numW/2, ty + numH/2]], PURE_WHITE, 4.5);
    g.fillStyle = "#09090b"; g.font = "bold 70px monospace"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(num[i], tx, ty - 2);
    p.stroke([[tx - numW/2, ty], [tx + numW/2, ty]], 3, "#18181b");
  }
};

/** COMIC IMPACT STAMP: "FOOD." */
export const drawFoodStamp = (p, opts = {}) => {
  const cx = 300, cy = 500, w = 440, h = 260;
  const g = p.g;

  g.save();
  g.translate(cx, cy);
  g.rotate(-0.12);

  // Red rubber stamp border with rough corners
  g.lineWidth = 14;
  g.strokeStyle = "#dc2626";
  g.strokeRect(-w/2, -h/2, w, h);

  g.fillStyle = "#dc2626";
  g.font = "900 130px 'Arial Black', Impact, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("FOOD.", 0, 10);

  // Splatter dots
  for (const [sx, sy, r] of [[-w/2 - 20, -30, 8], [w/2 + 18, 40, 9], [80, h/2 + 24, 7], [-100, -h/2 - 18, 6]]) {
    g.beginPath(); g.arc(sx, sy, r, 0, Math.PI * 2); g.fill();
  }

  g.restore();
};

/** FARMER CRATE PRICE TAG Card */
export const drawFarmerPriceTag = (p, opts = {}) => {
  const cx = 300, cy = 500, w = 480, h = 320;
  const g = p.g;

  p.poly([[cx - w/2, cy - h/2], [cx + w/2, cy - h/2], [cx + w/2, cy + h/2], [cx - w/2, cy + h/2]], "#fef3c7", 6);
  g.lineWidth = 2.5; g.strokeStyle = "#92400e";
  g.strokeRect(cx - w/2 + 14, cy - h/2 + 14, w - 28, h - 28);

  g.fillStyle = "#78350f"; g.textAlign = "center";
  g.font = "bold 32px sans-serif";
  g.fillText("TAME FARM RABBITS", cx, cy - h/2 + 70);

  g.fillStyle = RED;
  g.font = "900 64px sans-serif";
  g.fillText("5 SOUS EACH", cx, cy - h/2 + 155);

  g.fillStyle = "#451a03";
  g.font = "italic bold 24px sans-serif";
  g.fillText("*LOVES CARROTS & HUMAN COMPANIONSHIP*", cx, cy - h/2 + 230);
};

// Bunny swarm charge
export const drawBunnySwarm = (p, opts = {}) => {
  const { count = 18, spreadX = 260, spreadY = 160 } = opts;
  for (let i = 0; i < count; i++) {
    const rx = ((i * 47) % spreadX) - spreadX / 2;
    const ry = 420 + ((i * 31) % spreadY);
    drawBunny(p, { cx: 300 + rx, cy: ry, s: 0.65 + (i % 3) * 0.15, carrot: i % 4 === 0 });
  }
};

// Symmetrical ranks of soldiers
export const drawSoldierRank = (p, opts = {}) => {
  const { count = 5, spacing = 85, wave = false } = opts;
  const startX = 300 - ((count - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) {
    drawGrenadier(p, { wave, expr: wave ? "panic" : "proud", sweat: wave });
  }
};

// Compatibility aliases
export const napoleonCard = drawNapoleon;
export const napoleonCloseupCard = drawNapoleonCloseup;
export const berthierCard = drawBerthier;
export const grenadierCard = drawGrenadier;
export const bunnyCard = drawBunny;
export const bootClimbCard = drawBootClimbCloseup;
export const bunnySwarmCard = drawBunnySwarm;
export const soldierRankCard = drawSoldierRank;
export const farmerCard = drawFarmer;
export const blueprintCard = drawBlueprint;
export const flipBoardCard = drawFlipBoard;
export const foodStampCard = drawFoodStamp;
export const farmerPriceTagCard = drawFarmerPriceTag;
export const fxDust = (p, opts = {}) => {
  const { cx = 300, cy = 500, r = 40 } = opts;
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    p.dot(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.5, r * 0.45, "rgba(230,230,230,0.85)");
  }
};
