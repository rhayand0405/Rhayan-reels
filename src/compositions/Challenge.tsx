import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BADGE_BOX, DayBadge} from '../components/DayBadge';
import {Caption} from '../components/Caption';
import {Headline} from '../components/Headline';
import {Media} from '../components/Media';
import {StatRow} from '../components/StatRow';
import {theme} from '../theme';
import type {ChallengeProps} from '../schema';

const resolve = (src: string) =>
  src.startsWith('http') ? src : staticFile(src);

// Bright footage — a gym ceiling, daylight, a white wall — washes out white
// text. These gradients sit between the footage and the text so captions and
// the badge stay readable without dimming the whole shot.
const Scrim: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{
        height: 420,
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
      }}
    />
    <AbsoluteFill
      style={{
        top: 'auto',
        bottom: 0,
        height: 680,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
      }}
    />
  </AbsoluteFill>
);

// The badge's two homes: a small mark in the corner while the footage runs,
// and the closing card it grows into.
const HERO_LEFT = (1080 - BADGE_BOX) / 2;
const HERO_TOP = 560;
const PARKED_LEFT = 56;
const PARKED_TOP = 120;
const PARKED_SCALE = 0.3;
const GROW_FRAMES = 20;

// Corner mark for the length of the film, then it grows into the closing card.
// One continuous move — the number never cuts.
const TravellingBadge: React.FC<{
  day: number;
  totalDays: number;
  dayLabel: string;
  appearAt: number;
  growStart: number;
}> = ({day, totalDays, dayLabel, appearAt, growStart}) => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const grow = interpolate(frame, [growStart, growStart + GROW_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.6, 0, 0.2, 1),
  });

  const x = interpolate(grow, [0, 1], [PARKED_LEFT - HERO_LEFT, 0]);
  const y = interpolate(grow, [0, 1], [PARKED_TOP - HERO_TOP, 0]);
  const scale = interpolate(grow, [0, 1], [PARKED_SCALE, 1]);

  return (
    <AbsoluteFill style={{opacity: appear}}>
      <div
        style={{
          position: 'absolute',
          left: HERO_LEFT,
          top: HERO_TOP,
          transformOrigin: '0 0',
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
        }}
      >
        <DayBadge day={day} totalDays={totalDays} label={dayLabel} />
      </div>
    </AbsoluteFill>
  );
};

// The closing card behind the grown badge. Nothing here competes with the
// number — the line and the commitments land under it.
const OutroCard: React.FC<{
  title: string;
  subtitle?: string;
  stats: ChallengeProps['outro']['stats'];
}> = ({title, subtitle, stats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wash = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enter = spring({
    frame: frame - 16,
    fps,
    config: {damping: 200},
    durationInFrames: 16,
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: `rgba(8,9,11,${wash})`}} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: theme.safeBottom,
          opacity: enter,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            color: theme.text,
            fontSize: 72,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.05,
            padding: '0 70px',
            textShadow: theme.shadow,
            transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              fontFamily: theme.fontFamily,
              color: theme.text,
              fontSize: 34,
              fontWeight: 600,
              opacity: 0.68,
              marginTop: 16,
              textAlign: 'center',
              padding: '0 80px',
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div style={{marginTop: 52}}>
            <StatRow stats={stats} delay={26} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Challenge: React.FC<ChallengeProps> = ({
  day,
  totalDays,
  dayLabel,
  segments,
  badgeFromSeconds,
  outro,
  music,
  voiceover,
}) => {
  const {fps} = useVideoConfig();

  // Footage runs from frame 0 — the opening shot is the hook, not a title card.
  let cursor = 0;
  const placed = segments.map((segment) => {
    const from = cursor;
    const durationInFrames = Math.round(segment.durationInSeconds * fps);
    cursor += durationInFrames;
    return {segment, from, durationInFrames};
  });

  const bodyFrames = cursor;
  const outroFrames = Math.round(outro.durationInSeconds * fps);

  return (
    <AbsoluteFill style={{backgroundColor: '#08090b'}}>
      {placed.map(({segment, from, durationInFrames}, i) => (
        <Sequence
          key={i}
          from={from}
          durationInFrames={durationInFrames}
          name={`Scene ${i + 1}`}
        >
          {segment.media ? <Media media={segment.media} /> : null}
          {segment.media ? <Scrim /> : null}
          {segment.headline ? <Headline text={segment.headline} /> : null}
          {segment.caption ? <Caption text={segment.caption} /> : null}
        </Sequence>
      ))}

      {/* The last shot holds under the closing card instead of cutting to black. */}
      <Sequence from={bodyFrames} durationInFrames={outroFrames} name="Outro">
        <OutroCard
          title={outro.title}
          subtitle={outro.subtitle}
          stats={outro.stats}
        />
      </Sequence>

      <TravellingBadge
        day={day}
        totalDays={totalDays}
        dayLabel={dayLabel}
        appearAt={Math.round(badgeFromSeconds * fps)}
        growStart={bodyFrames}
      />

      {music ? <Audio src={resolve(music.src)} volume={music.volume} loop /> : null}
      {voiceover ? (
        <Audio src={resolve(voiceover.src)} volume={voiceover.volume} />
      ) : null}
    </AbsoluteFill>
  );
};

// Every scene, plus the closing card.
export const challengeDurationInFrames = (props: ChallengeProps, fps: number) =>
  Math.max(
    1,
    Math.round(
      (props.segments.reduce((total, s) => total + s.durationInSeconds, 0) +
        props.outro.durationInSeconds) *
        fps,
    ),
  );
