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
import {Media} from '../components/Media';
import {StatRow} from '../components/StatRow';
import {theme} from '../theme';
import type {ChallengeProps} from '../schema';

const resolve = (src: string) =>
  src.startsWith('http') ? src : staticFile(src);

// Where the badge sits while it owns the frame, and where it parks once the
// footage takes over. Laid out from the hero box's top-left corner.
const HERO_LEFT = (1080 - BADGE_BOX) / 2;
const HERO_TOP = 500;
const PARKED_LEFT = 56;
const PARKED_TOP = 120;
const PARKED_SCALE = 0.3;
const PARK_FRAMES = 16;

// Badge hero -> corner badge. One continuous move: the number never cuts,
// it shrinks out of the way and keeps counting for the rest of the video.
const TravellingBadge: React.FC<{
  day: number;
  totalDays: number;
  dayLabel: string;
  parkStart: number;
}> = ({day, totalDays, dayLabel, parkStart}) => {
  const frame = useCurrentFrame();

  const park = interpolate(frame, [parkStart, parkStart + PARK_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.2, 1),
  });

  const x = interpolate(park, [0, 1], [0, PARKED_LEFT - HERO_LEFT]);
  const y = interpolate(park, [0, 1], [0, PARKED_TOP - HERO_TOP]);
  const scale = interpolate(park, [0, 1], [1, PARKED_SCALE]);

  return (
    <AbsoluteFill>
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

// Title, subtitle and stats. They belong to the intro only and clear out as
// the badge parks.
const IntroText: React.FC<{
  title: string;
  subtitle?: string;
  stats: ChallengeProps['stats'];
  parkStart: number;
}> = ({title, subtitle, stats, parkStart}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 22,
    fps,
    config: {damping: 200},
    durationInFrames: 16,
  });
  const leave = interpolate(frame, [parkStart - 4, parkStart + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: theme.safeBottom,
        opacity: enter * leave,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontFamily,
          color: theme.text,
          fontSize: 78,
          fontWeight: 900,
          textAlign: 'center',
          lineHeight: 1.05,
          textShadow: theme.shadow,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
          padding: '0 70px',
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            fontFamily: theme.fontFamily,
            color: theme.text,
            fontSize: 36,
            fontWeight: 600,
            opacity: 0.7,
            marginTop: 18,
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {subtitle}
        </div>
      ) : null}

      {stats.length > 0 ? (
        <div style={{marginTop: 56}}>
          <StatRow stats={stats} delay={34} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Challenge: React.FC<ChallengeProps> = ({
  day,
  totalDays,
  dayLabel,
  title,
  subtitle,
  stats,
  introDurationInSeconds,
  introMedia,
  segments,
  music,
  voiceover,
}) => {
  const {fps} = useVideoConfig();
  const introFrames = Math.round(introDurationInSeconds * fps);
  const parkStart = introFrames - PARK_FRAMES;

  // Segments run back to back after the intro card.
  let cursor = introFrames;
  const placed = segments.map((segment) => {
    const from = cursor;
    const durationInFrames = Math.round(segment.durationInSeconds * fps);
    cursor += durationInFrames;
    return {segment, from, durationInFrames};
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#08090b'}}>
      <Sequence durationInFrames={introFrames} name="Intro">
        {introMedia ? (
          <>
            <Media media={introMedia} />
            {/* Dim the footage so the ring and the number stay readable. */}
            <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.55)'}} />
          </>
        ) : null}
        <IntroText
          title={title}
          subtitle={subtitle}
          stats={stats}
          parkStart={parkStart}
        />
      </Sequence>

      {placed.map(({segment, from, durationInFrames}, i) => (
        <Sequence key={i} from={from} durationInFrames={durationInFrames} name={`Scene ${i + 1}`}>
          {segment.media ? <Media media={segment.media} /> : null}
          {segment.caption ? <Caption text={segment.caption} /> : null}
        </Sequence>
      ))}

      <TravellingBadge
        day={day}
        totalDays={totalDays}
        dayLabel={dayLabel}
        parkStart={parkStart}
      />

      {music ? <Audio src={resolve(music.src)} volume={music.volume} loop /> : null}
      {voiceover ? <Audio src={resolve(voiceover.src)} /> : null}
    </AbsoluteFill>
  );
};

// Intro card plus every scene.
export const challengeDurationInFrames = (props: ChallengeProps, fps: number) =>
  Math.max(
    1,
    Math.round(
      (props.introDurationInSeconds +
        props.segments.reduce((total, s) => total + s.durationInSeconds, 0)) *
        fps,
    ),
  );
