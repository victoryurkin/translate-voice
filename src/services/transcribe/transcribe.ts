import { Predictions } from '@aws-amplify/predictions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transcribe = async (bytes: any, language: string) => {
  const response = await Predictions.convert({
    transcription: {
      source: {
        bytes,
      },
      language: language,
    },
  });
  return response.transcription.fullText;
};
