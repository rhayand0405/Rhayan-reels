import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {Segment} from '../schema';

const resolve = (src: string) =>
  src.startsWith('http') ? src : staticFile(src);

// Renders one segment's background: a video clip or an image, with an
// optional slow push-in so static shots never feel frozen.
export const Media: React.FC<{media: NonNullable<Segment['media']>}> = ({
  media,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const scale = media.zoom
    ? interpolate(frame, [0, durationInFrames], [1, media.zoom])
    : 1;

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${scale})`,
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {media.type === 'video' ? (
        <OffthreadVideo
          src={resolve(media.src)}
          startFrom={
            media.startFrom ? Math.round(media.startFrom * 30) : undefined
          }
          style={style}
        />
      ) : (
        <Img src={resolve(media.src)} style={style} />
      )}
    </AbsoluteFill>
  );
};
