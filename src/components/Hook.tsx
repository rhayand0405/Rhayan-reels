import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

// The opening line. Big, centered, and gone before it overstays.
export const Hook: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 14}, durationInFrames: 14});
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
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
          fontSize: theme.hookSize,
          fontWeight: 900,
          color: theme.text,
          textAlign: 'center',
          lineHeight: 1.05,
          textShadow: theme.shadow,
          transform: `scale(${enter})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
