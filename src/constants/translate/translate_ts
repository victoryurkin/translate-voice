export interface Language {
  code: string;
  name: string;
  streaming: boolean;
  translateCode: string;
  voices: {
    [key: string]: string | undefined;
    code: string;
    male?: string;
    female?: string;
  };
}

interface SupportedLanguages {
  [key: string]: Language;
}

export const supportedLanguages: SupportedLanguages = {
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese',
    streaming: true,
    translateCode: 'zh',
    voices: {
      code: 'cmn-CN',
      female: 'Zhiyu',
    },
  },
  'en-US': {
    code: 'en-US',
    name: 'English',
    streaming: true,
    translateCode: 'en',
    voices: {
      code: 'en-US',
      male: 'Joey',
      female: 'Kendra',
    },
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    streaming: true,
    translateCode: 'fr',
    voices: {
      code: 'fr-FR',
      male: 'Mathieu',
      female: 'Celine',
    },
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German',
    streaming: true,
    translateCode: 'de',
    voices: {
      code: 'de-DE',
      male: 'Hans',
      female: 'Marlene',
    },
  },
  'hi-IN': {
    code: 'Hindi',
    name: 'hi-IN',
    streaming: true,
    translateCode: 'hi',
    voices: {
      code: 'hi-IN',
      female: 'Aditi',
    },
  },
  'it-IT': {
    code: 'it-IT',
    name: 'Italian',
    streaming: true,
    translateCode: 'it',
    voices: {
      code: 'it-IT',
      male: 'Carla',
      female: 'Giorgio',
    },
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    streaming: true,
    translateCode: 'ja',
    voices: {
      code: 'ja-JP',
      male: 'Takumi',
      female: 'Mizuki',
    },
  },
  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    streaming: true,
    translateCode: 'ko',
    voices: {
      code: 'ko-KR',
      female: 'Seoyeon',
    },
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese',
    streaming: true,
    translateCode: 'pt',
    voices: {
      code: 'pt-BR',
      male: 'Ricardo',
      female: 'Camila',
    },
  },
  'ru-RU': {
    code: 'ru-RU',
    name: 'Russian',
    streaming: false,
    translateCode: 'ru',
    voices: {
      code: 'ru-RU',
      male: 'Maxim',
      female: 'Tatyana',
    },
  },
  'es-US': {
    code: 'es-US',
    name: 'Spanish',
    streaming: true,
    translateCode: 'es',
    voices: {
      code: 'es-US',
      female: 'Lupe',
    },
  },
};
