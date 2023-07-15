/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import cx from 'classnames';
// import { Recorder } from './recorder/recorder';
import { Button } from './button/button';
import { flags } from '@translate-voice/assets';
import { transcribe, translate, speech, transcribeUpload } from '@translate-voice/services';
import { registerPlugin } from '@capacitor/core';
import { useRecorder } from './recorder/recorder';
import { PulseLoader } from 'react-spinners';
import { useTranslation } from '@translate-voice/i18n';
import { supportedLanguages, Language } from '@translate-voice/constants';
import { LanguageSelector } from './language-selector/language-selector';

//#region iOS Capacitor Plugin
export interface PlayerIosPlugin {
  play(options: { file: string }): Promise<{ response: string }>;
}
const PlayerIos = registerPlugin<PlayerIosPlugin>('PlayerIos');

export const Translate: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [topText, setTopText] = useState<string>();
  const [bottomText, setBottomText] = useState<string>();
  const [isLoaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeBar, setActiveBar] = useState<string>('none');
  const [sourceLanguage, setSourceLanguage] = useState<Language>(supportedLanguages['en-US']);
  const [targetLanguage, setTargetLanguage] = useState<Language>(supportedLanguages['ru-RU']);
  const [preferredVoice] = useState('male');
  const [languageSelector, setLanguageSelector] = useState<'top' | 'bottom'>();

  const { startRecording, stopRecording } = useRecorder();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    setTimeout(() => {
      setHasAnimated(true);
    }, 600);
  }, []);

  const containerClasses = cx({
    'h-full flex flex-col': true,
    'overflow-hidden': !hasAnimated,
  });

  const topBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'relative z-10 bg-gradient-to-t from-primary-600 to-primary-500 h-24 rounded-b-4xl': true,
    '-translate-y-24': !isLoaded,
    '-translate-y-0': isLoaded,
    'bg-gradient-to-t from-primary-800 to-primary-500': activeBar === 'top',
  });

  const topContainerClasses = cx('flex-1 -mt-24', {
    'bg-secondary-100': activeBar !== 'top',
    'bg-white': activeBar === 'top',
  });

  const mainContainerClasses = cx('flex-1 flex flex-col transition-all duration-500 ease-out', {
    'opacity-0': !isLoaded,
    'opacity-1': isLoaded,
  });

  const bottomBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'bg-gradient-to-b from-primary-600 to-primary-500 h-24 rounded-t-4xl': true,
    'translate-y-24': !isLoaded,
    'translate-y-0': isLoaded,
    'bg-gradient-to-b from-primary-800 to-primary-500': activeBar === 'bottom',
  });

  const bottomContainerClasses = cx('flex-1 -mb-24', {
    'bg-secondary-100': activeBar !== 'bottom',
    'bg-white': activeBar === 'bottom',
  });

  const onEnd = async () => {
    setLoading(true);
    try {
      const recording = await stopRecording();

      let sourceText = '';
      if (activeBar === 'top') {
        if (sourceLanguage.streaming) {
          sourceText = await transcribe(recording, sourceLanguage.code);
        } else {
          sourceText = await transcribeUpload(recording, sourceLanguage.code);
        }
      } else {
        if (targetLanguage.streaming) {
          sourceText = await transcribe(recording, targetLanguage.code);
        } else {
          sourceText = await transcribeUpload(recording, targetLanguage.code);
        }
      }

      if (activeBar === 'top') {
        setTopText(sourceText);
      } else {
        setBottomText(sourceText);
      }

      let translateResponse = '';
      if (activeBar === 'top') {
        translateResponse = await translate(
          sourceText,
          sourceLanguage.translateCode,
          targetLanguage.translateCode
        );
        setBottomText(translateResponse);
      } else {
        translateResponse = await translate(
          sourceText,
          targetLanguage.translateCode,
          sourceLanguage.translateCode
        );
        setTopText(translateResponse);
      }

      let speechResponse = '';
      let voice: string;
      if (activeBar === 'top') {
        if (targetLanguage.voices[preferredVoice]) {
          voice = targetLanguage.voices[preferredVoice]!;
        } else {
          voice = targetLanguage.voices.male || targetLanguage.voices.female!;
        }
      } else {
        if (sourceLanguage.voices[preferredVoice]) {
          voice = sourceLanguage.voices[preferredVoice]!;
        } else {
          voice = sourceLanguage.voices.male || sourceLanguage.voices.female!;
        }
      }
      speechResponse = await speech(translateResponse, voice);

      await PlayerIos.play({
        file: speechResponse,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setActiveBar('none');
      setLoading(false);
    }
  };

  const selectLanguage = (code: string) => {
    languageSelector === 'top'
      ? setSourceLanguage(supportedLanguages[code])
      : setTargetLanguage(supportedLanguages[code]);
    setLanguageSelector(undefined);
  };

  return (
    <>
      <div className={containerClasses}>
        <div className={topBarClasses}>
          <div
            className="rounded-full overflow-hidden w-16 h-16 mx-auto mt-14 border shadow-lg"
            onClick={() => setLanguageSelector('top')}>
            <img src={flags[sourceLanguage.code]} className="h-16" alt={sourceLanguage.code} />
          </div>
          <p className="text-center text-secondary-400">en-us</p>
        </div>
        <div className={mainContainerClasses}>
          <div className={topContainerClasses}>
            {isLoading && activeBar === 'top' && !topText && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            {isLoading && activeBar === 'bottom' && bottomText && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            <div className="pt-40 px-xl text-secondary-600 text-center h-full pb-40">
              <div className="h-full overflow-y-auto flex items-center justify-center">
                {topText}
              </div>
            </div>
          </div>
          <div className="flex justify-center h-10 -mt-6 bg-white">
            <div className="absolute -translate-y-32">
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                onUpStart={() => {
                  setActiveBar('top');
                  startRecording();
                  setTopText(undefined);
                  setBottomText(undefined);
                }}
                onDownStart={() => {
                  setActiveBar('bottom');
                  startRecording();
                  setTopText(undefined);
                  setBottomText(undefined);
                }}
                onEnd={onEnd}
              />
            </div>
            <div className="text-left flex-1 flex items-center uppercase text-secondary-400">
              <p className="flex-1 text-right pr-lg">
                {t('translate.swipe')} {'>'}
              </p>
              <div className="w-40"></div>
              <p className="flex-1 pl-lg">
                {'<'} {t('translate.hold')}
              </p>
            </div>
          </div>
          <div className={bottomContainerClasses}>
            {isLoading && activeBar === 'top' && !bottomText && topText && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            {isLoading && activeBar === 'bottom' && !bottomText && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            <div className="pt-36 px-xl text-secondary-600 text-center h-full pb-40">
              <div className="h-full overflow-y-auto flex items-center justify-center">
                {bottomText}
              </div>
            </div>
          </div>
        </div>
        <div className={bottomBarClasses}>
          <p className="text-center text-secondary-400 -mt-12">es-us</p>
          <div
            className="rounded-full overflow-hidden w-16 h-16 mx-auto border shadow-lg"
            onClick={() => setLanguageSelector('bottom')}>
            <img src={flags[targetLanguage.code]} className="h-16" alt={targetLanguage.code} />
          </div>
        </div>
      </div>
      <LanguageSelector
        languageSelector={languageSelector}
        selectedLanguage={languageSelector === 'top' ? sourceLanguage.code : targetLanguage.code}
        onClose={() => setLanguageSelector(undefined)}
        onSelect={selectLanguage}
      />
    </>
  );
};
