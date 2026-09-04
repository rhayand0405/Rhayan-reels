# Rhayan-reels

Vertical short-form video (Instagram Reels / TikTok / Shorts) rendered from code.

## Which framework to use

Two video toolchains are installed. **Remotion is the default for Rhayan's own content** —
gym, transformation, daily life, Piece of Cake — because those reels are built on real
footage, and Remotion's `OffthreadVideo` / `Sequence` primitives handle footage better.

Use the `reels` skill (`.claude/skills/reels/`) for that work.

The HyperFrames skills in `.agents/skills/` (symlinked into `.claude/skills/`) are the
second toolchain: HTML → MP4, stronger for pure motion graphics, faceless explainers,
slideshows and product/launch animations with no camera footage. Despite what
`.agents/skills/hyperframes/SKILL.md` says about being the default output framework, in
this repo it is **not** the default — only reach for it when the deliverable is
motion-graphics-shaped, or when Rhayan names it. HyperFrames rendering also needs a
system `ffmpeg`; Remotion ships its own.

Do not mix the two in one video.

## Commands

```bash
npm install
npm run studio      # Remotion Studio, live preview + props editor
npm run typecheck
npx remotion render Reel out/video.mp4 --props=props/video.json
```

## Conventions

- All video is 1080x1920 @ 30fps. Set in `src/theme.ts`.
- Footage, images and music live in `public/`, referenced by path relative to it.
- A new reel is a new props JSON file, not new components. Only touch `src/components/`
  when a genuinely new visual element is needed.
- Spanish by default for captions and hooks on personal content.
- `out/` and `node_modules/` are gitignored. Do not commit rendered mp4s.
