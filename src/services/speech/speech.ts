import { Predictions } from '@aws-amplify/predictions';
import { Buffer } from 'buffer';

export const speech = async (text: string, voice: string) => {
  const response = await Predictions.convert({
    textToSpeech: {
      source: {
        text: text,
      },
      voiceId: voice, // default configured on aws-exports.js
      // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
    },
  });
  const buffer = Buffer.from(response.audioStream);
  const base64 = buffer.toString('base64');
  return base64;
};
