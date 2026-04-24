# Safran × AIonOS Vision Agents Demo

A static HTML demo that plays the supplied Safran production-floor AI-agent video inline, loops it, and plays a pre-generated narration MP3 from the repository.

## Files

- `index.html` — main demo page
- `styles.css` — visual styling
- `script.js` — inline playback logic, narration cues, MP3 sync, loop behaviour
- `assets/safran-vision-agent-demo.webm` — demo video
- `assets/narration.txt` — single source narration script
- `assets/demo-narration.mp3` — generated narration audio used in the demo
- `assets/safran-vision-agent-demo-narrated.mp4` — rendered video + narration output
- `scripts/generate_narration.py` — narration generator script (prefers Edge TTS voice, falls back to local eSpeak)
- `.github/workflows/generate-narration.yml` — workflow that regenerates and commits the narration MP3
- `.github/workflows/render-narrated-mp4.yml` — workflow that muxes the WebM demo video and MP3 narration into `assets/safran-vision-agent-demo-narrated.mp4`

## Demo storyline

The narration is written for Safran Vision Agents creating an operational cockpit from CCTV and production-floor camera feeds. It focuses on:

- operations control from live visual coverage
- productivity visibility across stations, queues, and dwell time
- safety and compliance monitoring on the shop floor
- AI-assisted escalation, root-cause prompts, and action orchestration

## How to use

1. Upload the full folder to any static host.
2. Open `index.html` through the hosted URL.
3. Click **Play demo with narration** once.
4. The video and MP3 narration will play inline and loop together.

## Regenerate narration MP3

Update `assets/narration.txt`, then either:

```bash
pip install edge-tts
python scripts/generate_narration.py
```

If `edge-tts` is unavailable locally, the script will fall back to `espeak` + `ffmpeg` when those tools are installed.

Or trigger the GitHub Actions workflow **Generate narration audio**, which regenerates `assets/demo-narration.mp3` and commits it automatically.

## Render an MP4 with synced narration

Trigger the GitHub Actions workflow **Render narrated MP4**. It will:

1. Read `assets/safran-vision-agent-demo.webm` and `assets/demo-narration.mp3`.
2. Loop the video input as needed to match narration timing.
3. Export `assets/safran-vision-agent-demo-narrated.mp4` using H.264 video + AAC audio.
4. Commit the MP4 back to the repository when it changes.

## Hosting options

- GitHub Pages
- Netlify
- Vercel
- Any Apache/Nginx/static file server
