import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Caption} from '../components/Caption';
import {Hook} from '../components/Hook';
import {Media} from '../components/Media';
import {ProgressBar} from '../components/ProgressBar';
import type {ReelProps} from '../schema';

const resolve = (src: string) =>
  src.startsWith('http') ? src : staticFile(src);

export const Reel: React.FC<ReelProps> = ({
  hook,
  hookDurationInSeconds,
  segments,
  music,
  voiceover,
  showProgressBar,
}) => {
  const {fps} = useVideoConfig();

  // Lay the segments out back to back on the timeline.
  let cursor = 0;
  const placed = segments.map((segment) => {
    const from = cursor;
    const durationInFrames = Math.round(segment.durationInSeconds * fps);
    cursor += durationInFrames;
    return {segment, from, durationInFrames};
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {placed.map(({segment, from, durationInFrames}, i) => (
        <Sequence key={i} from={from} durationInFrames={durationInFrames}>
          {segment.media ? <Media media={segment.media} /> : null}
          {segment.caption ? <Caption text={segment.caption} /> : null}
        </Sequence>
      ))}

      <Sequence durationInFrames={Math.round(hookDurationInSeconds * fps)}>
        <Hook text={hook} />
      </Sequence>

      {showProgressBar ? <ProgressBar /> : null}

      {music ? (
        <Audio src={resolve(music.src)} volume={music.volume} loop />
      ) : null}
      {voiceover ? <Audio src={resolve(voiceover.src)} /> : null}
    </AbsoluteFill>
  );
};

// The reel is exactly as long as its segments.
export const reelDurationInFrames = (props: ReelProps, fps: number) =>
  Math.max(
    1,
    Math.round(
      props.segments.reduce((total, s) => total + s.durationInSeconds, 0) * fps,
    ),
  );
