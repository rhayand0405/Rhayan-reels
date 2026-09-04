# Rhayan-reels

Vertical videos (1080x1920, 30fps) rendered from code with [Remotion](https://remotion.dev).

## Setup

```bash
npm install
npm run studio
```

Studio opens a live preview of the `Reel` composition with an editable props panel.

## Rendering

```bash
npx remotion render Reel out/mi-reel.mp4 --props=props/mi-reel.json
```

## How a reel is defined

One composition, `Reel`, fully driven by props (`src/schema.ts`):

- `hook` — the opening line, the thing that decides retention
- `segments[]` — each with a duration, an optional caption, and optional video/image media
- `music` / `voiceover` — audio from `public/`
- `showProgressBar` — thin top bar showing how far along the video is

Total duration is computed from the segments automatically.

Drop footage, images and music into `public/` and reference them by relative path
(`clips/gym.mp4`), or use a full `https://` URL.

## Skills

- `.claude/skills/reels` — how to build and render reels in this repo (Remotion).
- `.agents/skills/*` — HyperFrames skills (HTML → MP4), for motion-graphics-style videos.

See `CLAUDE.md` for when to use which.
