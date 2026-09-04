import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

// A thin bar at the top. Gives the viewer a reason to stay: they can see
// how close the payoff is.
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = Math.min(1, frame / durationInFrames);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-start'}}>
      <div style={{height: 10, width: '100%', backgroundColor: 'rgba(255,255,255,0.2)'}}>
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            backgroundColor: theme.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
