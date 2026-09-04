import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {Challenge, challengeDurationInFrames} from './compositions/Challenge';
import {Reel, reelDurationInFrames} from './compositions/Reel';
import {ChallengeProps, ReelProps, challengeSchema, reelSchema} from './schema';
import {FPS, HEIGHT, WIDTH} from './theme';
import {exampleReel} from './examples/example-reel';
import {day0} from './examples/day-0';

// Both compositions are as long as their content, so duration follows
// whatever props come from Studio or --props.
const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = ({props}) => ({
  durationInFrames: reelDurationInFrames(props, FPS),
});

const calculateChallengeMetadata: CalculateMetadataFunction<ChallengeProps> = ({
  props,
}) => ({
  durationInFrames: challengeDurationInFrames(props, FPS),
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
      <Composition
        id="Challenge"
        component={Challenge}
        schema={challengeSchema}
        defaultProps={day0}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={challengeDurationInFrames(day0, FPS)}
        calculateMetadata={calculateChallengeMetadata}
      />
    </>
  );
};
