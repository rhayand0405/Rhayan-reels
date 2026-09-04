import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {Reel, reelDurationInFrames} from './compositions/Reel';
import {ReelProps, reelSchema} from './schema';
import {FPS, HEIGHT, WIDTH} from './theme';
import {exampleReel} from './examples/example-reel';

// The reel is exactly as long as its segments, so the duration follows
// whatever props are passed in from Studio or --props.
const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = ({props}) => ({
  durationInFrames: reelDurationInFrames(props, FPS),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={Reel}
        schema={reelSchema}
        defaultProps={exampleReel}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={reelDurationInFrames(exampleReel, FPS)}
        calculateMetadata={calculateReelMetadata}
      />
    </>
  );
};
