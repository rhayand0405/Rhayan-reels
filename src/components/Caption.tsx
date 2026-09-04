import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

// Bottom caption that pops in. Sits above the platform UI so it never
// gets covered by the username / sound / buttons.
export const Caption: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 10});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: theme.safeBottom,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontSize: theme.captionSize,
          fontWeight: 800,
          color: theme.text,
          textAlign: 'center',
          lineHeight: 1.15,
          textShadow: theme.shadow,
          transform: `scale(${0.9 + enter * 0.1})`,
          opacity: enter,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
