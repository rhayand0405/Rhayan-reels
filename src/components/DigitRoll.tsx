import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const SPINS = 2; // full 0-9 passes before landing on the digit

// One odometer column. Renders 0,1,2…9,0,1…digit stacked vertically and
// slides the strip up so the target digit lands in the window.
const Column: React.FC<{
  digit: number;
  size: number;
  delay: number;
}> = ({digit, size, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cellHeight = size * 1.1;
  const steps = SPINS * 10 + digit;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, mass: 1.1, stiffness: 90},
    durationInFrames: 30,
  });

  return (
    <div style={{height: cellHeight, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${-progress * steps * cellHeight}px)`}}>
        {Array.from({length: steps + 1}, (_, i) => (
          <div
            key={i}
            style={{
              height: cellHeight,
              lineHeight: `${cellHeight}px`,
              fontSize: size,
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {i % 10}
          </div>
        ))}
      </div>
    </div>
  );
};

// A number rendered as spinning odometer columns, padded to `digits` places.
export const DigitRoll: React.FC<{
  value: number;
  digits?: number;
  size: number;
  delay?: number;
}> = ({value, digits = 2, size, delay = 0}) => {
  const padded = String(Math.max(0, Math.round(value))).padStart(digits, '0');

  return (
    <div style={{display: 'flex'}}>
      {padded.split('').map((char, i) => (
        // Right-hand digits settle last, so the number reads as it lands.
        <Column key={i} digit={Number(char)} size={size} delay={delay + i * 4} />
      ))}
    </div>
  );
};
