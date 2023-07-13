import { Predictions } from '@aws-amplify/predictions';

export const translate = async (text: string, sourceLanguage: string, targetLanguage: string) => {
  const response = await Predictions.convert({
    translateText: {
      source: {
        text: text,
        language: sourceLanguage.substring(0, 2),
        // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
      },
      targetLanguage: targetLanguage.substring(0, 2),
    },
  });
  return response.text;
};
