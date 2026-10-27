# BALOUL — "Lul" scroll film: production bible

Target: `WEB` (scroll-scrubbed film with finance UI overlays). Mode: DELIVER_FINISHED_ARTIFACT.
Photoreal footage: generative (external, not connected in this session). Everything else: code.

## Overview
- Direction: **Luxury dark**. Adjectives: *noble, steady*.
- The viewer should feel at the end: growth is a disciplined path, and Baloul walks it with you.
- Reference: the Baloul logo. Extracted: near-black navy surface (#050C1A), brushed royal blue, brushed gold, serif authority, slow metallic highlights, an upward arrow over bar chart.
- Realism: photoreal for all live action (a living rooster in royal blue and gold plumage). The UI is real, accurate product UI with internally consistent numbers.

## Colors
| Role | Value | Notes |
| --- | --- | --- |
| surface | `#050C1A` | sampled from the logo background |
| surface-raised | `#0B1630` | panels |
| royal | `#1F3E8C` | brushed blue, secondary surfaces and bars |
| text | `#F4ECDD` | 16.9:1 on surface |
| text-muted | `#A8B3CC` | navy-tinted, 9.0:1 on surface |
| accent (gold) | `#D4AF5A` | the one brand carrier, 9.3:1 on surface |
| accent-contrast | `#050C1A` | text on gold |
| line | `rgba(212,175,90,.22)` | hairlines |
| up / down | `#7FC79A` / `#E08A7A` | chart only |

## Typography
- Display: Frank Ruhl Libre 500/700 (Hebrew serif, OFL). Text: Heebo 400/600 (OFL), tabular numerals for all money.
- Scale 1.333: 0.75 / 1 / 1.333 / 1.777 / 2.369 / 3.157 / 4.209rem; display capped at `clamp(2.4rem, 5.2vw, 4.2rem)`.
- Tracking ≥ -0.02em for Hebrew display, measure ≤ 34ch for subheads, `text-wrap: balance`.

## Layout
- 8px unit. RTL. CSS grid per shot, so copy and UI never overlap. Desktop (≥900): copy column on the right, UI column (340–420px) on the left. Phones (<900): copy on top, open middle row for the footage, UI as a bottom sheet; on short phones (<740px tall) secondary rows hide.
- One pinned stage, 7 shots × 140vh of scroll. Clips are 16:9 with the subject in the centre 40%, so the 9:16 centre crop on phones keeps the subject.

## Elevation & Depth
- Panels: `0 24px 60px -20px rgba(0,0,0,.65)` + 1px gold hairline. Panels sit above a scrim (start-side and bottom gradients) above the footage.

## Shapes
- Radius 4 / 10 / 18. Hairline 1px; chart strokes 2px.

## Components
- Reused: none. Magic UI NumberTicker and Aceternity scroll effects are `motion`-driven and would be a second owner next to GSAP; the finance HUD is bespoke, so it is built with GSAP + SVG.
- Custom: `Story` (stage + master timeline + odometer), `ShotMedia` (clip, still or lit placeholder backdrop), `Huds` (one UI per shot), `coins.ts` (canvas coins as a pure function of timeline time).
- GSAP SplitText (bundled with gsap, free) for the word reveals.
- Installed but unused: three / R3F / drei. Nothing in this film needs real-time 3D; the realism is in the footage.

## Lighting, materials, camera (for the generated clips)
- One key from camera-left in every shot, warm (golden hour / tungsten); cool royal-blue fill only from monitors in shot 05.
- 50mm full-frame look, f/2.8, shallow depth of field, eye-level with the rooster (low camera, ~35cm).
- Moves: slow push-in, one crane-up (03→04), one lateral track (06→07). No spins, no whip pans.

## Motion language
- Slow-cinematic. Scroll is the master clock (`scrub: 0.8`). Ease: `power3.out` for UI entries, `none` for video time and the progress rail.
- Authored moment per shot: 01 logo light-sweep + 3D turn, 02 gold coins burst out (canvas) while deposit notifications drop in, 03 the same coins stream into the savings ring as it closes, 04 coin rain onto a pile + net-worth numerals de-blur, 05 chart line draws with a live tip + allocation donut + instrument tape, 06 family dots pop in and protections check in, 07 coop line art draws itself → mortgage → CTA.
- Shared across shots: word-mask headline reveals, 3D flip-in panels (rotateX + blur + clip), rolling-digit net-worth odometer in the top bar, outgoing shot recedes (scale + dim) under the iris, desktop pointer parallax on the panels.
- Shot bridges: circular iris from the motivated focal point (the coin, the slot, the screen glow, the door).
- Reduced motion: no pin, no scrub; every shot is a stacked static section showing the clip's poster/still and the UI in its final state.

## Do's and Don'ts
- Do keep the rooster's identity locked across all clips (traits below, verbatim in every prompt).
- Do composite all text, numbers and logos in code. Never let the video model render text or currency.
- Don't show real bank logos, real tickers' prices, or anthropomorphic rooster behaviour (no hands, no standing upright, no wearing clothes).

---

## Scene sheet

Master time source: one ScrollTrigger (pinned stage) → one GSAP master timeline. 10 timeline units per shot.
- DOM motion owner: GSAP master timeline.
- Video frame clock owner: GSAP (`proxy.p` → `video.currentTime`); videos never play on their own.
- Media wrapper scale (slow push): GSAP. Layer clip-path (iris): GSAP. Nothing else touches these properties.
- Excluded: Three/R3F (no real-time 3D needed), Lenis (native scroll is fine), Motion (would duplicate GSAP).

Persistent continuity element: the **שווי נקי** (net worth) counter in the top bar. Values are consistent across the story:
0 → 850 → 25,120 → 482,300 → 684,900 (+42.0%) → 684,900 (protected) → 684,900 (= property 2,400,000 − mortgage 1,800,000 + portfolio 84,900).

| ID | Scroll | Objective | Footage (subject, composition) | Camera | Entry → exit | Bridge to next | UI (GSAP) | Method |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 שחר | 0–1/7 | Meet the hero | Rooster on a weathered fence post at dawn, misty farmyard, crows once | slow push-in | wide → rooster looks down at the straw | gaze down → glint in the straw (iris from lower centre) | logo light-sweep, headline | generative |
| 02 פתאום | 1–2/7 | Sudden money | Rooster scratches straw, uncovers gold coins and folded notes, picks one coin in beak | low, static → slight push | coin hidden → coin in beak, frame centre | coin in beak (match cut on coin position) | 3 deposit notifications, ₪0→₪850 | generative |
| 03 הקופה | 2–3/7 | Saving | Rooster drops coins into a royal-blue ceramic money box with a gold slot, barn table, tungsten light | push-in to slot | coin above slot → box full, coins at the rim | crane up as coins overflow → pile (iris from slot) | goal ring 0→100%, 16 monthly bars | generative |
| 04 עושר | 3–4/7 | Wealth | Rooster stands proud on a waist-high pile of gold coins and banknote stacks, rim light, dust motes | crane up, settle | crane from coins → hero pose | coin glint → monitor glow (iris from centre-right) | net worth rolls to ₪482,300 + breakdown | generative |
| 05 שוק ההון | 4–5/7 | Investing | Rooster perched on a dark desk before three monitors with abstract glowing charts (no readable text) | slow arc 15° | screens glow → rooster turns head to camera-left (a hen clucks off-screen) | gaze → hen enters (cause/effect) | line chart draws vs benchmark, donut 60/30/10, +42.0% | generative + code UI |
| 06 משפחה | 5–6/7 | Family | Rooster with a hen and five golden chicks in a sunlit yard, chicks gather under the hen | lateral track right→left | family meets → chicks run toward camera-left | chicks run → coop door (iris from left) | 4 protections check in | generative |
| 07 הלול | 6–7/7 | The home | A premium coop built like a small white-wood house, royal-blue door, brass hardware, sunset; family walks in | slow pull-back | door → whole coop in golden light | end: hold, then the logo | mortgage card, net-worth breakdown, keys, CTA | generative |

Acceptance per clip: rooster identity unchanged; no text or numbers in frame; key light camera-left; first frame matches the previous clip's last frame at the bridge point; 5 s, 16:9, 24 fps.

---

## Generation prompts (copy-ready)

Generate the Stage 1 still first, then animate it with Stage 2 (Kling 2.x, Veo 3, Runway Gen-4 or similar; image-to-video, 5 s, 16:9, 1920×1080, no audio needed).
For the match-cut shots (02→03, 03→04), use the previous clip's last frame as the first frame when the tool supports start-frame / end-frame.

**Rooster identity (paste into every Stage 1 prompt):** an adult rooster with glossy deep royal-blue body plumage with a sapphire iridescent sheen, metallic gold hackle feathers on the neck and saddle, long arched royal-blue tail sickles edged in gold, a bright red single comb and wattles, a yellow beak, yellow legs and amber eyes; natural real bird anatomy and behaviour.

### 01 — שחר → `public/clips/01-dawn.mp4`
Stage 1: Photorealistic wildlife photograph, 16:9. [Rooster identity.] It stands on a weathered wooden fence post in a misty Galilee farmyard at dawn, body in three-quarter profile facing camera-right, head raised. Low camera at the rooster's eye level, 50mm full-frame, f/2.8, shallow depth of field; soft golden-hour key light from camera-left, rim light on the gold hackles, cool blue mist and olive trees softly out of focus behind. The rooster occupies the centre third of the frame with generous dark negative space on both sides. No people, no text, no logos, no extra birds; correct anatomy with two legs and a single comb.
Stage 2: The rooster crows once, neck extending and chest lifting, then settles and lowers its head to look down at the straw below; the camera makes a slow, steady push-in.
Keep the fence, mist, lighting and bird identity perfectly stable; no camera turns, no cuts, no new animals or objects.

### 02 — פתאום → `public/clips/02-find.mp4`
Stage 1: Photorealistic close-up photograph, 16:9. [Rooster identity.] In the same misty dawn farmyard it stands in golden straw, head lowered, scratching with one foot; a few gold-coloured coins and two folded banknotes are half-buried in the straw in front of it. Camera very low at straw level, 50mm, f/2.8, key light from camera-left, warm glints on the coins. Rooster centred; no readable writing on coins or notes, no text, no people.
Stage 2: The rooster scratches twice, revealing more coins, then picks up one coin in its beak and lifts its head so the coin sits at the exact centre of frame; slight slow push-in.
Hold the bird's identity, straw and lighting stable; the coin stays a plain gold disc with no writing; no extra birds, no cuts.

### 03 — הקופה → `public/clips/03-kupa.mp4`
Stage 1: Photorealistic interior photograph, 16:9. [Rooster identity.] It stands on a rustic oak table inside a wooden barn, a gold coin held in its beak directly above the coin slot of a glossy royal-blue glazed ceramic money box with a polished gold rim around the slot; a small heap of gold coins beside the box. Warm tungsten key from camera-left, dust in the light beam, dark barn falloff behind. Coin and slot at frame centre; 50mm, f/2.8; no text, no logos, no people.
Stage 2: The rooster drops the coin into the slot, pecks up the next coins one by one and drops them in, until coins pile up at the rim of the full box; the camera pushes in slowly toward the slot, then begins to rise.
Keep the money box shape, colour and position fixed; the bird stays the same; no hands, no extra objects appearing from nowhere, no cuts.

### 04 — עושר → `public/clips/04-wealth.mp4`
Stage 1: Photorealistic photograph, 16:9. [Rooster identity.] Inside the same barn it stands proudly on top of a waist-high pile of gold coins and neat banknote bundles (no readable print), chest out, tail sickles arched and catching a strong warm rim light from camera-left; floating dust motes, deep shadow behind. Camera slightly below the rooster looking up, 50mm, f/4; subject centred with space above. No text, no people.
Stage 2: The camera cranes up slowly from the coins to the rooster's eye level and settles; the rooster ruffles its feathers once and turns its head proudly toward camera-right as a glint travels across the coins.
Pile, light and identity stay stable; no coins raining from the sky, no spins, no cuts.

### 05 — שוק ההון → `public/clips/05-market.mp4`
Stage 1: Photorealistic photograph, 16:9. [Rooster identity.] It is perched on the edge of a dark walnut desk in a dim modern office at night, in front of three large monitors showing abstract glowing green and blue line and candlestick charts with no readable numbers or letters; the screens cast a cool royal-blue fill on the bird, with a warm practical lamp from camera-left as key. 50mm, f/2.8, screens softly defocused, rooster centred. No people, no text, no logos.
Stage 2: The rooster watches the screens as the chart lines glow and pulse gently, then turns its head toward camera-left as if hearing something; the camera arcs slowly about 15 degrees.
No readable text appears on the screens; the bird does not touch anything; identity and room stay stable; no cuts.

### 06 — משפחה → `public/clips/06-family.mp4`
Stage 1: Photorealistic photograph, 16:9. [Rooster identity.] It stands beside a hen of the same breed with softer royal-blue plumage and gold-laced neck feathers and a small comb; five fluffy golden-yellow chicks gather around them on short green grass in a sunlit yard, late afternoon key light from camera-left, warm bokeh behind. Low camera at bird height, 50mm, f/2.8; the family in the centre third. No people, no text.
Stage 2: The chicks gather under the hen, the rooster stands protectively beside them, then the chicks run toward camera-left; the camera tracks slowly from right to left following them.
Exactly five chicks, one hen, one rooster for the whole shot; identities stable; no new animals, no cuts.

### 07 — הלול → `public/clips/07-coop.mp4`
Stage 1: Photorealistic architectural photograph, 16:9. A beautiful premium chicken coop built like a small house: white painted wood cladding, a pitched dark roof, a royal-blue front door with polished brass hardware, a small ramp and warm light glowing from a window, set in a green garden at sunset with the key light from camera-left. The rooster from the previous shots [rooster identity], the hen and five golden chicks stand at the foot of the ramp. 35mm look, f/4, the coop centred. No text, no signs, no people.
Stage 2: The family walks up the ramp and into the coop one by one, the rooster last, pausing at the door before going in; the camera pulls back slowly to reveal the whole coop glowing in the sunset.
The coop's shape and colours remain fixed; exactly five chicks; no text appears; no cuts.

---

## Dropping clips in
1. Save each clip under `public/clips/` with the file name above. A Stage 1 still alone also works: save it as `.jpg` with the same base name (e.g. `03-kupa.jpg`) and it is shown with a slow push until the clip exists.
2. Re-encode every clip for smooth scroll scrubbing (dense keyframes, no audio):
   ```bash
   ffmpeg -i in.mp4 -vf scale=1600:-2 -c:v libx264 -preset slow -crf 22 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart -an public/clips/03-kupa.mp4
   ```
3. Reload. A shot with a missing clip shows a labelled placeholder slate.
