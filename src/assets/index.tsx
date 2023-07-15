import deDe from './flags/de-DE.png';
import enUS from './flags/en-US.png';
import esUS from './flags/es-US.png';
import frFR from './flags/fr-FR.png';
import hiIN from './flags/hi-IN.png';
import itIT from './flags/it-IT.png';
import jaJP from './flags/ja-JP.png';
import koKR from './flags/ko-KR.png';
import ptBR from './flags/pt-BR.png';
import ruRU from './flags/ru-RU.png';
import zhCN from './flags/zh-CN.png';

interface Flag {
  [key: string]: string;
}

export const flags: Flag = {
  'de-DE': deDe,
  'en-US': enUS,
  'es-US': esUS,
  'fr-FR': frFR,
  'hi-IN': hiIN,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'pt-BR': ptBR,
  'ru-RU': ruRU,
  'zh-CN': zhCN,
};
