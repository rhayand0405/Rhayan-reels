import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import type {Stat} from '../schema';

// The starting numbers. They arrive one after another so the eye reads them
// in order instead of taking the block in as one lump.
export const StatRow: React.FC<{stats: Stat[]; delay: number}> = ({
  stats,
  delay,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{display: 'flex', gap: 72, justifyContent: 'center'}}>
      {stats.map((stat, i) => {
        const enter = spring({
          frame: frame - delay - i * 5,
          fps,
          config: {damping: 200},
          durationInFrames: 14,
        });

        return (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              fontFamily: theme.fontFamily,
              color: theme.text,
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
            }}
          >
            <div style={{fontSize: 66, fontWeight: 900, textShadow: theme.shadow}}>
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 4,
                opacity: 0.6,
                marginTop: 6,
              }}
            >
              {stat.label.toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
};
