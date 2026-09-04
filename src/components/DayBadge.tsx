import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DigitRoll} from './DigitRoll';
import {theme} from '../theme';

export const BADGE_BOX = 640; // the badge always lays out in a 640x640 box

const RADIUS = 280;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// "DAY 00 / 90" inside a progress ring. The ring track sweeps in, then the
// filled arc grows to day/total and the digits roll into place.
export const DayBadge: React.FC<{
  day: number;
  totalDays: number;
  label: string;
}> = ({day, totalDays, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // The empty track draws itself in first — on day 0 there is no filled arc
  // yet, so this is what carries the motion.
  const trackSweep = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });

  const fill = spring({
    frame: frame - 16,
    fps,
    config: {damping: 200},
    durationInFrames: 26,
  });
  const fillFraction = (day / totalDays) * fill;

  return (
    <div
      style={{
        width: BADGE_BOX,
        height: BADGE_BOX,
        position: 'relative',
        fontFamily: theme.fontFamily,
        color: theme.text,
      }}
    >
      <svg
        width={BADGE_BOX}
        height={BADGE_BOX}
        style={{position: 'absolute', transform: 'rotate(-90deg)'}}
      >
        <circle
          cx={BADGE_BOX / 2}
          cy={BADGE_BOX / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - trackSweep)}
          strokeLinecap="round"
        />
        <circle
          cx={BADGE_BOX / 2}
          cy={BADGE_BOX / 2}
          r={RADIUS}
          fill="none"
          stroke={theme.accent}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fillFraction)}
          strokeLinecap="round"
        />
      </svg>

      {/* The label is pinned above the ring's centre line so the number itself
          stays optically centred in the circle. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 244,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 14,
          textIndent: 7, // letter-spacing trails the last glyph; nudge back to centre
          opacity: 0.75,
        }}
      >
        {label}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 900,
            textShadow: theme.shadow,
          }}
        >
          <DigitRoll value={day} digits={2} size={176} delay={4} />
          <div style={{fontSize: 82, opacity: 0.45, margin: '0 4px 0 12px'}}>/</div>
          <div style={{fontSize: 82, opacity: 0.45}}>{totalDays}</div>
        </div>
      </div>
    </div>
  );
};
