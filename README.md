# Cartoon Audio Short (AI Agent Skill & 3D Animation Kit)

An autonomous AI agent skill and procedural 3D WebGL animation engine for generating vertical animated shorts (9:16) from voiceover audio.

Designed for the **Google Antigravity** agentic ecosystem, compatible with Claude Code, Cursor, and custom LLM workflows.

---

## 🎨 Visual Aesthetic & Style

Matches the production standard of viral narrative animation shorts (*The Spear and the Shield*, *The Soldier Who Never Left*):

- **Characters ("Stickman Bean Heads / Toon Cards")**:
  - Smooth pure-white (`#ffffff`) egg/bean capsule heads with bold ink borders (`#1a1622`).
  - Highly expressive minimalist ink eyes, slanted eyebrows, and talking mouths.
  - Distinct silhouettes, costume colors, and iconic accessories per character.
  - Thin stick limbs with rounded joints and pure-white mitten hands.
- **Cinematography & Composition**:
  - Dominant 1-point central vanishing perspective staging.
  - Top-down bird's-eye crowd shots and low-angle ground close-ups.
  - Continuous camera motion (push-in, tracking pan, parallax).
- **Shading & Post-Processing**:
  - Soft 4-band stepped cel-shading toon ramp.
  - Elevated hemisphere fill light and softened shadow radius.
  - Radial bloom sprites for torches, candles, lanterns, and sunbeams.
  - Soft frame vignette and per-preset color grading.
- **Narrative Comedic Props**:
  - Animated rolling flip counters (`0000 -> 1807`), Prussian blue blueprint flowcharts, hanging wooden price tags, and giant rubber stamps.
- **Kinetic Lower-Third Captions**:
  - Word-synced subtitles displaying 1–2 words at a time.
  - Bold rounded sans-serif (88px), white fill, 11px dark outline, soft drop shadow.
  - Positioned at 68–72% of frame height (within 62–78% to avoid covering faces or props).
- **Audio Ducking**:
  - Music bed strictly at 50% of voiceover level (−6 dB RMS).
  - Sound effects (SFX) at 50% or less with peak limiting.
  - Master audio normalized to −14 LUFS / −1.5 dBFS true peak.

---

## 📁 Repository Structure

```text
cartoon-audio-short/
├── SKILL.md                 # Agent instructions & prompt specification
└── kit/
    ├── README.md            # Kit documentation & workflow guide
    ├── engine/              # Procedural Three.js 3D WebGL animation engine:
    │   ├── main.js          # Rendering pipeline, camera staging, and HUD subtitle pass
    │   ├── sets.js          # Modular 3D set library (fieldRoad, castleGate, tentInterior, etc.)
    │   ├── roman.js         # Character card & prop painter (heads, expressions, props, swarms)
    │   ├── paint.js         # Procedural canvas textures (clouds, planks, stone, fields, bloom)
    │   ├── motion.js        # Smooth procedural spring animations & easing curves
    │   └── index.html       # WebGL canvas host
    ├── tools/               # Automation & rendering utilities:
    │   ├── timing.py        # Voice-to-word timestamp alignment (Whisper / silence-align)
    │   ├── render_parallel.py # Multi-process Playwright Chromium frame renderer
    │   ├── finish.py / .sh  # Audio normalization (-14 LUFS), H.264 encoder, & QA sheet tiler
    │   ├── sheet.py         # Full-video 1-fps QA contact sheet generator
    │   └── setup.sh         # Project environment initializer
    ├── example/             # Reference project:
    │   └── soldier/         # Example story script, audio generator, and contact sheet
    └── vendor/
        └── toon.ts          # Cel-shading shader definitions & material helpers
```

---

## 🚀 Requirements

- **Node.js**: v20+ with Playwright (`npx playwright install chromium`)
- **Python**: 3.10+ with `numpy` and `Pillow`
- **FFmpeg**: Accessible via system `PATH` (for audio alignment, normalization, and video encoding)

---

## 📄 License

MIT License. Free to use and customize for AI-assisted animation and content creation.
