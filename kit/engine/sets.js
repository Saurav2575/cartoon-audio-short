// Modular 3D Sets Library for Cartoon Shorts
import * as THREE from './lib/three.module.js';

export function buildSets(M, P, add, tbox, box, scene, glowTexture) {
  const DECK = 0;
  const sets = {};

  // ==========================================
  // 1. FIELD ROAD (Vanishing Point Landscape)
  // ==========================================
  const fieldRoad = new THREE.Group();
  fieldRoad.name = 'set_fieldRoad';
  scene.add(fieldRoad);
  sets.fieldRoad = fieldRoad;

  // Agricultural fields & highway
  const ground = add(new THREE.PlaneGeometry(1600, 1600), M.stripedFields, 0, DECK, 0, fieldRoad, { cast: false });
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;

  const road = add(new THREE.PlaneGeometry(7.0, 1600), M.dirt, 0, DECK + 0.015, 0, fieldRoad, { cast: false });
  road.rotation.x = -Math.PI / 2; road.receiveShadow = true;

  // Distant French Chateau / Castle
  const chateau = new THREE.Group(); chateau.position.set(0, DECK, -280); fieldRoad.add(chateau);
  add(tbox(48, 22, 16, 4), M.stone, 0, 11, 0, chateau);
  for (const tx of [-24, 24]) {
    add(new THREE.CylinderGeometry(5.5, 6, 26, 16), M.stone, tx, 13, 0, chateau);
    add(new THREE.ConeGeometry(7, 12, 16), M.navy, tx, 32, 0, chateau);
  }
  add(tbox(20, 6, 18, 3), M.navy, 0, 25, 0, chateau);

  // Receding tree avenues
  const poplar = (x, z, h = 7.5) => {
    const g = new THREE.Group(); g.position.set(x, DECK, z); fieldRoad.add(g);
    add(new THREE.CylinderGeometry(0.14, 0.2, 1.6, 6), M.trunk, 0, 0.8, 0, g);
    add(new THREE.ConeGeometry(1.0, h, 8), M.poplar, 0, 1.6 + h / 2, 0, g);
    return g;
  };
  const bush = (x, z, r_ = 1.1) => {
    const b = add(new THREE.SphereGeometry(r_, 10, 8), M.bush, x, DECK + r_ * 0.5, z, fieldRoad);
    b.scale.set(1.25, 0.75, 1.25);
    return b;
  };

  for (let z = -70; z <= 35; z += 7) {
    poplar(-9, z, 8); poplar(9, z, 8);
    bush(-8, z + 2.5, 0.9); bush(8, z + 2.5, 0.9);
  }

  // Rolling background hills
  for (let i = 0; i < 14; i++) {
    const a = i * 0.45, d = 160 + (i % 3) * 45;
    const h = add(new THREE.SphereGeometry(50, 18, 10), i % 2 ? M.hill : M.hillFar, Math.cos(a) * d, -15, Math.sin(a) * d, fieldRoad, { cast: false });
    h.scale.set(1.7, 0.5, 1.3);
  }

  // Tricolor banners
  const banners = [];
  const makeFlag = (x, z) => {
    const g = new THREE.Group(); g.position.set(x, DECK, z); fieldRoad.add(g);
    add(new THREE.CylinderGeometry(0.06, 0.07, 4.8, 6), M.wood, 0, 2.4, 0, g);
    add(new THREE.SphereGeometry(0.12, 8, 6), M.gold, 0, 4.85, 0, g);
    add(box(0.45, 1.0, 0.02), M.navy, -0.45, 4.0, 0, g);
    add(box(0.45, 1.0, 0.02), M.white, 0, 4.0, 0, g);
    add(box(0.45, 1.0, 0.02), M.red, 0.45, 4.0, 0, g);
    banners.push(g);
  };
  makeFlag(-2.8, -1.8);
  makeFlag(2.8, -1.8);
  fieldRoad.userData.banners = banners;

  // ==========================================
  // 2. TENT INTERIOR (Imperial Pavilion)
  // ==========================================
  const tentInterior = new THREE.Group();
  tentInterior.name = 'set_tentInterior';
  tentInterior.position.set(0, DECK, 0);
  scene.add(tentInterior);
  sets.tentInterior = tentInterior;

  // Canvas pavilion walls
  add(tbox(14, 7, 0.2, 2), M.white, 0, 3.5, -4.5, tentInterior);
  add(tbox(0.2, 7, 10, 2), M.white, -6.8, 3.5, 0, tentInterior);
  add(tbox(0.2, 7, 10, 2), M.white, 6.8, 3.5, 0, tentInterior);
  // Navy draped valance & gold trim
  add(box(14, 0.6, 0.4), M.navy, 0, 6.8, -4.4, tentInterior);
  add(box(14, 0.12, 0.45), M.gold, 0, 6.5, -4.38, tentInterior);
  // Red carpeted floor
  const carpet = add(new THREE.PlaneGeometry(13.6, 9.6), M.red, 0, DECK + 0.02, 0, tentInterior, { cast: false });
  carpet.rotation.x = -Math.PI / 2;

  // Wooden campaign table
  const table = new THREE.Group(); table.position.set(0, DECK, -1.2); tentInterior.add(table);
  add(tbox(3.4, 0.12, 1.6, 1), M.wood, 0, 0.9, 0, table);
  for (const [tx, tz] of [[-1.5, -0.65], [1.5, -0.65], [-1.5, 0.65], [1.5, 0.65]]) {
    add(new THREE.CylinderGeometry(0.06, 0.07, 0.9, 8), M.wood, tx, 0.45, tz, table);
  }
  // Documents and parchment on table
  add(box(0.9, 0.02, 0.65), M.white, -0.6, 0.97, 0, table).rotation.y = 0.15;
  add(box(0.7, 0.02, 0.5), M.white, 0.6, 0.97, 0.1, table).rotation.y = -0.2;

  // Candle glow sprites (additive bloom)
  const tentGlowMat = new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  for (const cx of [-1.1, 1.1]) {
    add(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6), M.gold, cx, 1.08, -0.2, table);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), tentGlowMat);
    glow.position.set(cx, 1.35, -0.2); glow.userData.ndSkip = true; table.add(glow);
  }

  // Campaign chests
  add(tbox(1.2, 0.7, 0.7, 1), M.beam, -3.2, 0.35, -3.5, tentInterior);
  add(tbox(0.9, 0.5, 0.5, 1), M.beam, 3.4, 0.25, -3.6, tentInterior);

  // ==========================================
  // 3. CAGE BATTERY (Rabbit Enclosure)
  // ==========================================
  const cageBattery = new THREE.Group();
  cageBattery.name = 'set_cageBattery';
  cageBattery.position.set(0, DECK, 0);
  scene.add(cageBattery);
  sets.cageBattery = cageBattery;

  // Meadow floor for cages
  const cageGround = add(new THREE.PlaneGeometry(60, 60), M.stripedFields, 0, DECK, 0, cageBattery, { cast: false });
  cageGround.rotation.x = -Math.PI / 2; cageGround.receiveShadow = true;

  const cageDoors = [];
  // 2 rows of cages
  for (let row = 0; row < 2; row++) {
    const rz = -row * 1.8;
    for (let col = -3; col <= 3; col++) {
      const cx = col * 1.05;
      const cg = new THREE.Group(); cg.position.set(cx, 0, rz); cageBattery.add(cg);
      add(tbox(0.92, 0.65, 0.75, 0.5), M.beam, 0, 0.325, 0, cg);
      // Front bars
      for (let s = -3; s <= 3; s++) {
        add(box(0.035, 0.55, 0.035), M.plank, s * 0.12, 0.325, 0.38, cg);
      }
      // Top hinged drop door
      const doorPivot = new THREE.Group(); doorPivot.position.set(0, 0.60, 0.39); cg.add(doorPivot);
      add(box(0.84, 0.55, 0.03), M.plank, 0, -0.275, 0, doorPivot);
      cageDoors.push(doorPivot);
    }
  }
  cageBattery.userData.cageDoors = cageDoors;

  // Hay bales and wooden stakes around cages
  for (const bx of [-4.2, 4.2]) {
    add(tbox(1.2, 0.7, 0.8, 1), M.wood, bx, 0.35, -0.8, cageBattery);
    add(tbox(1.1, 0.65, 0.75, 1), M.wood, bx * 0.9, 0.35, -2.4, cageBattery);
  }

  // ==========================================
  // 4. CARRIAGE STATION (Royal Escape)
  // ==========================================
  const carriageStation = new THREE.Group();
  carriageStation.name = 'set_carriageStation';
  carriageStation.position.set(0, DECK, 0);
  scene.add(carriageStation);
  sets.carriageStation = carriageStation;

  const stationGround = add(new THREE.PlaneGeometry(100, 100), M.dirt, 0, DECK, 0, carriageStation, { cast: false });
  stationGround.rotation.x = -Math.PI / 2; stationGround.receiveShadow = true;

  // Imperial Royal Carriage model
  const carriage = new THREE.Group(); carriage.position.set(0, DECK, 0); carriageStation.add(carriage);
  add(box(2.6, 1.8, 0.1), M.navy, 0, 1.5, -0.8, carriage);
  add(box(0.1, 1.8, 1.6), M.navy, -1.25, 1.5, 0, carriage);
  add(box(0.1, 1.8, 1.6), M.navy, 1.25, 1.5, 0, carriage);
  // Front & rear wall with open carriage window cutout
  add(box(2.6, 1.0, 0.1), M.navy, 0, 0.5, 0.8, carriage);
  add(box(2.6, 0.45, 0.1), M.navy, 0, 2.2, 0.8, carriage);
  add(box(0.65, 1.0, 0.1), M.navy, -0.95, 1.5, 0.8, carriage);
  add(box(0.65, 1.0, 0.1), M.navy, 0.95, 1.5, 0.8, carriage);
  // Gold moulding
  add(box(1.4, 0.09, 0.15), M.gold, 0, 1.0, 0.8, carriage);
  add(box(1.4, 0.09, 0.15), M.gold, 0, 2.0, 0.8, carriage);
  // Arched roof
  const roofC = add(new THREE.CylinderGeometry(1.35, 1.35, 2.7, 16, 1, false, 0, Math.PI), M.gold, 0, 2.4, 0, carriage);
  roofC.rotation.z = Math.PI / 2; roofC.rotation.y = Math.PI / 2; roofC.scale.set(0.65, 1, 0.85);
  // Gold spoked wheels
  for (const [wx, wz, wr] of [[-1.3, -0.9, 0.6], [1.3, -0.9, 0.7], [-1.3, 0.9, 0.6], [1.3, 0.9, 0.7]]) {
    add(new THREE.TorusGeometry(wr, 0.08, 8, 24), M.gold, wx, wr, wz, carriage);
    for (let sp = 0; sp < 4; sp++) {
      const spoke = add(new THREE.CylinderGeometry(0.035, 0.035, wr * 2, 6), M.gold, wx, wr, wz, carriage);
      spoke.rotation.x = sp * Math.PI / 4;
    }
  }
  // Carriage lanterns with additive glow
  const carGlowMat = new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const carGlowL = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), carGlowMat);
  carGlowL.position.set(-1.4, 1.8, 0.6); carGlowL.userData.ndSkip = true; carriage.add(carGlowL);
  const carGlowR = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), carGlowMat);
  carGlowR.position.set(1.4, 1.8, 0.6); carGlowR.userData.ndSkip = true; carriage.add(carGlowR);
  carriageStation.userData.carriage = carriage;

  // ==========================================
  // 5. RUSTIC BARN (Farmer's Yard)
  // ==========================================
  const rusticBarn = new THREE.Group();
  rusticBarn.name = 'set_rusticBarn';
  rusticBarn.position.set(0, DECK, 0);
  scene.add(rusticBarn);
  sets.rusticBarn = rusticBarn;

  const barnGround = add(new THREE.PlaneGeometry(50, 50), M.dirt, 0, DECK, 0, rusticBarn, { cast: false });
  barnGround.rotation.x = -Math.PI / 2; barnGround.receiveShadow = true;

  // Wooden barn walls with timber trim
  add(tbox(12, 6.5, 0.25, 2), M.plank, 0, 3.25, -4.0, rusticBarn);
  add(tbox(0.25, 6.5, 8.0, 2), M.plank, -6.0, 3.25, 0, rusticBarn);
  add(tbox(0.25, 6.5, 8.0, 2), M.plank, 6.0, 3.25, 0, rusticBarn);
  // Barn roof
  const barnRoof = add(new THREE.ConeGeometry(8.5, 3.5, 4), M.trunk, 0, 7.8, 0, rusticBarn);
  barnRoof.rotation.y = Math.PI / 4;

  // Stacks of carrot crates
  for (let cy = 0; cy < 2; cy++) {
    for (let cx = -1.8; cx <= 1.8; cx += 1.2) {
      const cr = add(tbox(1.0, 0.55, 0.7, 0.5), M.beam, cx, cy * 0.6 + 0.3, -2.6, rusticBarn);
      // Carrots peeking out (orange cones)
      for (let k = -2; k <= 2; k++) {
        const carrot = add(new THREE.ConeGeometry(0.08, 0.35, 6), M.gold, cx + k * 0.16, cy * 0.6 + 0.65, -2.6, rusticBarn);
        carrot.rotation.x = Math.PI;
      }
    }
  }

  // ==========================================
  // 6. CASTLE GATE (Grand Fortress)
  // ==========================================
  const castleGate = new THREE.Group();
  castleGate.name = 'set_castleGate';
  castleGate.position.set(0, DECK, -20);
  scene.add(castleGate);
  sets.castleGate = castleGate;

  add(tbox(36, 16, 4, 3), M.stone, 0, 8, 0, castleGate);
  // Arched portal cutout
  add(box(8, 10, 4.2), M.iron, 0, 5, 0, castleGate);
  // Flanking stone turrets with slate cone roofs
  for (const tx of [-14, 14]) {
    add(new THREE.CylinderGeometry(4.5, 5, 22, 16), M.stone, tx, 11, 0, castleGate);
    add(new THREE.ConeGeometry(6, 9, 16), M.navy, tx, 26, 0, castleGate);
  }

  // ==========================================
  // 7. ARMIES HORIZON (Grand Panoramic Knoll)
  // ==========================================
  const armiesHorizon = new THREE.Group();
  armiesHorizon.name = 'set_armiesHorizon';
  armiesHorizon.position.set(0, DECK, 0);
  scene.add(armiesHorizon);
  sets.armiesHorizon = armiesHorizon;

  const armyGround = add(new THREE.PlaneGeometry(800, 800), M.stripedFields, 0, DECK, 0, armiesHorizon, { cast: false });
  armyGround.rotation.x = -Math.PI / 2; armyGround.receiveShadow = true;

  // Field cannons on caissons
  for (let k = -3; k <= 3; k += 2) {
    const gun = new THREE.Group(); gun.position.set(k * 4.5, DECK, -18); armiesHorizon.add(gun);
    add(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 8), M.iron, 0, 0.7, 0, gun).rotation.x = Math.PI / 2.3;
    for (const wx of [-0.65, 0.65]) {
      add(new THREE.TorusGeometry(0.55, 0.06, 6, 16), M.wood, wx, 0.55, 0, gun);
    }
  }

  // Initially hide all modular sets
  Object.values(sets).forEach(s => { s.visible = false; });
  return sets;
}
