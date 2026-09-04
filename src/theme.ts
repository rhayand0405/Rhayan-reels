// Single place to change the look of every reel.
export const theme = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif',
  text: '#ffffff',
  accent: '#ffd60a',
  shadow: '0 6px 24px rgba(0,0,0,0.55)',
  captionSize: 72,
  hookSize: 96,
  safeBottom: 320, // keep captions above the IG/TikTok UI
  safeTop: 220,
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
