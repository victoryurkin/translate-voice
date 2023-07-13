import { Predictions } from '@aws-amplify/predictions';

export const translate = async () => {
  const response = await Predictions.convert({
    translateText: {
      source: {
        text: 'Hellow world!',
        // language : "es" // defaults configured on aws-exports.js
        // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
      },
      // targetLanguage: "en"
    },
  });
  return response.text;
};
