import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

// The opening claim. Big, centred, gone before it overstays — used once, on
// the first shot, so it reads as the thesis of the video rather than a caption.
export const Headline: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16}, durationInFrames: 16});
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 90,
        opacity: exit,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontSize: 88,
          fontWeight: 900,
          color: theme.text,
          textAlign: 'center',
          lineHeight: 1.05,
          textShadow: theme.shadow,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          opacity: enter,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
