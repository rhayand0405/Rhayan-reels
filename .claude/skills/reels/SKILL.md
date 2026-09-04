---
name: reels
description: >
  Build and render Rhayan's vertical short-form videos (Instagram Reels, TikToks, YouTube Shorts)
  with the Remotion project in this repo. Use for any request to make, edit, script, caption or
  render a reel, a short, a TikTok, a gym/transformation clip, a Piece of Cake promo, or any
  1080x1920 video from footage, images, captions and music. Covers the Reel composition, its props
  schema, adding footage to public/, and the render commands.
---

# Reels (Remotion)

This repo renders 1080x1920 @ 30fps vertical video with Remotion. One composition, `Reel`,
driven entirely by props — so a new reel is usually a new props file, not new components.

## Files

| Path | What it is |
| --- | --- |
| `src/schema.ts` | Zod schema for the reel props. The contract. |
| `src/compositions/Reel.tsx` | Lays segments out back to back, adds hook, music, voiceover. |
| `src/components/` | `Hook`, `Caption`, `Media`, `ProgressBar`. |
| `src/theme.ts` | Fonts, sizes, colors, safe areas, dimensions. Change the look here. |
| `src/examples/example-reel.ts` | The default props. Copy its shape. |
| `public/` | Footage, images, music. Referenced by path relative to `public/`. |

## Making a reel

1. Put footage in `public/` (e.g. `public/clips/gym-2026-09-04.mp4`, `public/music/track.mp3`).
2. Write a props JSON file under `props/` (create the folder if needed):

```json
{
  "hook": "Perdí 8kg sin dejar de comer pan",
  "hookDurationInSeconds": 2,
  "showProgressBar": true,
  "segments": [
    {
      "durationInSeconds": 3,
      "caption": "Día 1: 95kg",
      "media": {"src": "clips/day1.mp4", "type": "video", "startFrom": 2}
    },
    {
      "durationInSeconds": 3,
      "caption": "Todo lo que cambié fue esto",
      "media": {"src": "clips/kitchen.jpg", "type": "image", "zoom": 1.15}
    }
  ],
  "music": {"src": "music/track.mp3", "volume": 0.25}
}
```

3. Preview: `npm run studio` (opens Remotion Studio, edit props live in the right panel).
4. Render: `npx remotion render Reel out/nombre.mp4 --props=props/nombre.json`

The composition length is computed from the segments — never set `durationInFrames` by hand.

## Writing rules (these matter more than the code)

- The `hook` is the whole video. First 1-3 seconds, one specific claim, no intro, no "hey guys".
- Captions: max ~6 words per segment. They are read, not studied.
- No segment longer than ~4 seconds without a visual change — cut, zoom, or new clip.
- Keep captions above `theme.safeBottom` (already handled) so the IG/TikTok UI never covers them.
- Spanish by default for Rhayan's personal content unless he says otherwise. Natural, not textbook.
- Authentic > polished. Real footage beats stock every time.

## Gotchas

- Remotion packages must all be on the exact same version, and `zod` must be the exact version
  Remotion asks for. Fix with `npx remotion add zod` / `npm run upgrade`.
- Use `OffthreadVideo` (not `<video>`) for video — already done in `src/components/Media.tsx`.
- `staticFile()` for anything in `public/`; raw https URLs also work.
- On first render Remotion downloads a headless Chromium. In a sandbox with no egress to
  `remotion.media`, pass `--browser-executable=<path to a local chromium>`.

## Checks before saying it works

```bash
npm run typecheck
npx remotion render Reel out/smoke-test.mp4   # must produce a non-empty mp4
```

## Challenge composition (Day X / 90)

`Challenge` is the second composition — a day counter reel for a multi-day challenge.

```bash
npx remotion render Challenge out/day-07.mp4 --props=props/day-07.json
```

Structure: an intro card where an odometer counter rolls to the day number inside a
progress ring, with the title and the tracked stats under it; then the counter shrinks
into a corner badge in one continuous move and stays there over the footage.

Props (`challengeSchema` in `src/schema.ts`): `day`, `totalDays`, `dayLabel`, `title`,
`subtitle`, `stats[]`, `introDurationInSeconds`, `introMedia`, `segments[]`, `music`.
`src/examples/day-0.ts` is the day 0 version.

A new day is a new props file with a new `day` and new segments — nothing else changes.
The ring fills to `day / totalDays` on its own, so day 0 correctly shows an empty ring.
