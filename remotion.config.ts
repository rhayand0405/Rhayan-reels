import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// H.264 + CRF 18 looks clean on Instagram/TikTok without huge files.
Config.setCodec('h264');
Config.setCrf(18);
