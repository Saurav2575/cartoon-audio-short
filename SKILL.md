---
name: cartoon-audio-short
description: Make a vertical animated cartoon short. Offers 10 ideas, writes the script, then turns the user's voiceover into a finished MP4 with music and SFX at half the voice level. Use for any cartoon short or animated story video request.
---

# Cartoon short: idea → script → voiceover → finished MP4

## The Visual Aesthetic & Technical Standard
The visual style is defined by high-production shorts like "The Spear and the Shield" and "The Soldier Who Never Left":
- **Characters ("Stickman Bean Heads / Toon Cards")**:
  - **Heads**: Smooth, pure-white (`#ffffff`) egg/bean capsule heads with crisp, bold dark-ink borders (`#1a1622`, stroke width ~5-6px on 1000px canvas).
  - **Silhouettes & Costumes**: Every named character needs a distinct silhouette, costume colour, and signature accessory (e.g., Napoleon's cockade bicorne, Berthier's spectacles and red plume, Grenadiers' tall bearskins, Farmer's red beret).
  - **Dynamic Facial Expressions & Poses**: Every named character must have at least 2–3 distinct expressions across the short (e.g. smug, scared, sweating, shocked, pouting, laughing) and varied poses (profile, 3/4 angle, rear, running). **Do not use the same front-facing pose in consecutive shots.** Include reaction close-ups for key comedic beats.
  - **Limbs**: Ultra-thin expressive stick arms and legs with rounded joints, pure-white mitten hands, and clean round shoes or boots.
- **Lighting & Post-Processing (The Look)**:
  - **4-Band Toon Ramp**: Materials use a stepped 4-band gradient map (deep shadow, soft shadow, mid-light, highlight) instead of a 2-tone gradient for softer, richer cel-shading.
  - **Soft Lighting & Fill**: Lower direct sun intensity (~1.0–1.25), raised hemisphere ambient fill (~1.4–1.6), and softened shadows (larger `shadow.radius` ~5–6, lighter shadow tint).
  - **Ambient Occlusion & Contact Shadows**: Soft oval contact shadow disks under all actors, props, and vehicles.
  - **Bloom & Vignette**: Luminous additive bloom sprites around candles, lanterns, torches, forge embers, and sunbeams; soft frame vignette (`rgba(12,10,18,0.24)`); and a dedicated color grade tint per lighting preset.
- **Modular Sets (`engine/sets.js`)**:
  - Sets are decoupled into a modular library (`fieldRoad`, `bridgeRiver`, `castleGate`, `tentInterior`, `cageBattery`, `carriageStation`, `rusticBarn`, `nightCamp`, `armiesHorizon`).
  - Sets feature rich, layered details: layered foreground/midground/background, textured ground (dirt ruts, cobblestone, agricultural stripes), framed windows, banners, trees, and props with trim. No bare flat-colour boxes.
  - The story file picks sets per shot, mounting and animating them dynamically.
- **Lighting Presets**:
  - Six standardized presets: `day`, `dusk`, `night` (stars + moon), `interior-warm` (candles/lanterns), `forge` (orange glow), and `overcast`.
  - Palette evolves with the story arc: bright daylight for setup, dusk/night for tension/chase, warm candle glow for planning/revelation.
- **Cinematic Transitions**:
  - 6–10 frame crossfade/dissolve between shots, whip-pans, and shape/direction match-cuts. Hard cuts are allowed only 2–3 times per video for maximum comedic impact. White flashes are reserved strictly for time jumps.
- **Props as Jokes**:
  - Mechanical flip counters, signs, blueprints, and price tags are large, animated (counter rolls, paper tears, bouncing stamps) and instantly readable on a phone screen. All prop text stays strictly within an **8% safe margin** on every side.
- **Ending Callback**:
  - Always end with a visual callback to the opening image or prop plus a final payoff gag.
- **Mandatory Kinetic Captions**:
  - **Per-Word Timings (`words.json`)**: Show 1–2 words at a time, switching word-synced.
  - **Typography**: Bold rounded sans-serif (`Arial Rounded MT Bold`, `system-ui`), about 84–96px at 1080 wide, pure white fill (`#ffffff`), thick dark stroke (10–12px, `#141218`), and soft drop shadow.
  - **Position**: Centered horizontally, vertical position about **68–72% of frame height** (default 70%, never 82–86%).
  - **Obstruction Prevention**: Never cover faces or key props. Shift caption up or down within **62–78%** if needed.
- **Audio Standards**:
  - Output is 1080x1920 (9:16 vertical), 30 fps, exactly matching voiceover duration.
  - Voiceover narration is untouched.
  - Music bed sits strictly at **50% of voice level** (−6 dB, gated RMS).
  - Sound effects (SFX) sit at **50% or slightly less**, with peaks capped. Always mix with `audio.py` and `finish.py`, never by hand.

---

## Rules
- Stories, characters and shots are always original. Never recreate another creator's video shot for shot.
- No real, named living people as characters, and no brand mascots or logos.
- Lower-third kinetic captions (1–2 words at a time at 68–72% height) are **mandatory** on all shorts.
- Never edit or re-time the voice. The picture is timed to it, and every visual reaction lands 0–3 frames before its word.
- Audio levels: music bed at 50% voice level (−6 dB), SFX at 50% or less with peak limiting.
- Keep the user informed with a task list. Send a full-video 1-fps QA contact sheet before final delivery.

---

## Stage 1: Intake (always first)
If an audio file is already attached, skip to Stage 4. If a script was also given, use it for timing.
Otherwise ask one question: **"Where are you starting from?"**
- **Voiceover ready**: ask them to upload it, plus script text. Go to Stage 4 when received.
- **I have a script, need the voiceover**: tighten script per Stage 3, provide recording tips, then go to Stage 4 upon upload.
- **Need video ideas and a script**: go to Stage 2.
Target length default is 20–30s; 45–60s is allowed.

---

## Stage 2: 10 video ideas
Give exactly 10 numbered ideas: Title (5–8 words), Hook line, The twist, Why it animates well (2–3 visual moments), and True or legend status.

---

## Stage 3: Script (after they pick)
Write narration only (~3.7 words/s: 20s ≈ 75 words, 30s ≈ 110, 45s ≈ 165, 60s ≈ 220 words).
Structure: Hook → Setting → Escalation (with exaggeration joke) → Pivot ("You see,") → Payoff/twist.

---

## Stage 4: Build the video (after voiceover is uploaded)

### 4.0 Setup & Tools
- Copy kit engine (`sets.js`, `main.js`, `roman.js`, `paint.js`, `motion.js`), tools, and vendor files into project.
- Node 22+ with Playwright Chromium, Python 3 with numpy + Pillow, and FFmpeg.

### 4.1 Timing
- Run `python timing.py voice.mp3 script.txt --out work`.
- Generates `work/words.json` and `work/phrases.json`.
- Compile into `words.js` containing 1–2 word chunks for word-synced subtitles.

### 4.2 Shot Plan (`work/PLAN.md` before code)
- Require **18–20 scenes for a 45-second video** (a new shot every 2–3 seconds), scaled by length.
- **No two consecutive shots may share the same set and camera angle.**
- Every shot must have **camera motion** (push-in, pan, top-down sweep, low angle push, parallax slide).
- Include at least **one top-down or high-angle wide shot** with large armies/crowds, and at least **one dramatic low-angle close-up**.
- Always end with a **callback to the opening image or prop** plus a final payoff gag.

### 4.3 World & Modular Sets (`web/sets.js`)
- Assemble sets from modular library: `fieldRoad`, `castleGate`, `tentInterior`, `cageBattery`, `carriageStation`, `rusticBarn`, `nightCamp`, `armiesHorizon`.
- Layered detail: textured ground, windows with frames, banners, trees, trims. No bare flat-colour boxes.
- Add point-light bloom sprites for lanterns, candles, torches, and sunbeams.

### 4.4 Cast & Poses (`web/roman.js`)
- Draw pure-white bean characters with distinct silhouettes, accessories, and costume colours.
- Implement at least 2–3 expressions per character (smug, scared, sweating, shocked...).
- Add reaction close-ups. Never repeat the same front-facing pose in consecutive shots.

### 4.5 Transitions & Post-Processing (`web/main.js`)
- Use 6–10 frame crossfades/dissolves, whip-pans, and match-cuts. Allow hard cuts only 2–3 times per video for impact. White flashes for time jumps only.
- Render 4-band toon ramp shading, soft vignette, and lighting-preset color grading.

### 4.6 QA Contact Sheet (`tools/sheet.py`)
- Before final render, generate a **1-fps contact sheet covering the entire video** (not just stills).
- Rigorously check:
  1. The last 3 seconds for glitches, black frames, or cutoff.
  2. Text clipped at edges (stay within 8% safe margins).
  3. Captions overlapping faces or critical props (adjust captionY between 62–78%).
  4. Static shots (ensure camera moves every single shot).
- Re-render any frames that fail.

### 4.7 Audio Mix (`audio.py` → `mix.wav` → `finish.py`)
- Compose music bed and SFX.
- Enforce strict levels: music at -6 dB RMS (50% voice level) and SFX at 50% or less with peak limiting.
- Normalize mix to -14 LUFS / -1.5 dBFS true peak.

### 4.8 Parallel Render & Finish
- Render frames with `render_parallel.py` (5–8 parallel Chromium workers).
- Run `python finish.py` to produce final 1080x1920 MP4 (H.264 CRF 17, AAC audio), QA contact sheet, and loudness validation.
