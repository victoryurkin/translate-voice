import { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from './button/button';
import { flags } from '@translate-voice/assets';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { PulseLoader } from 'react-spinners';
import { supportedLanguages, Language } from '@translate-voice/constants';
import { LanguageSelector } from './language-selector/language-selector';
import { useMicrophoneStream } from './stream/microphone-stream';
import { withAuth, isAuthenticated } from '@translate-voice/context';
import { compose } from '@translate-voice/utils';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { Settings, SettingsKey } from '@translate-voice/features';
import { getDefaultLanguage } from '@translate-voice/i18n';
import { local } from '@translate-voice/clients';
import { defaultSettings } from '@translate-voice/constants';

//#region iOS Capacitor Plugin
export interface PlayerIosPlugin {
  play(options: { file: string }): Promise<{ response: string }>;
}
const PlayerIos = registerPlugin<PlayerIosPlugin>('PlayerIos');

const TranslateComponent: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeBar, setActiveBar] = useState<string>('none');
  const [topLanguage, setTopLanguage] = useState<Language>(
    supportedLanguages[
      (local.get(SettingsKey.DEFAULT_SOURCE_LANGUAGE) as string) ||
        getDefaultLanguage() ||
        defaultSettings.sourceLanguage
    ]
  );
  const [bottomLanguage, setBottomLanguage] = useState<Language>(
    supportedLanguages[
      (local.get(SettingsKey.DEFAULT_TARGET_LANGUAGE) as string) ||
        (defaultSettings.targetLanguage !== topLanguage.code
          ? defaultSettings.targetLanguage
          : defaultSettings.sourceLanguage)
    ]
  );
  // const [preferredVoice] = useState('male');
  const [languageSelector, setLanguageSelector] = useState<'top' | 'bottom'>();
  const [isSettingsOpen, toggleSettings] = useState<boolean>(false);

  const {
    sourceLanguage,
    targetLanguage,
    transcription,
    translation,
    audioOutput,
    isError,
    startRecording,
    stopRecording,
  } = useMicrophoneStream();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    setTimeout(() => {
      setHasAnimated(true);
    }, 600);
  }, []);

  useEffect(() => {
    if (isError) {
      setLoading(false);
      setActiveBar('none');
    }
  }, [isError]);

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

  const onStartTranslation = (direction: string) => {
    startRecording(
      direction === 'top' ? topLanguage.code : bottomLanguage.code,
      direction === 'top' ? bottomLanguage.code : topLanguage.code
    );
    setActiveBar(direction);
  };

  const onStopRecording = () => {
    setLoading(true);
    stopRecording();
  };

  useEffect(() => {
    if (audioOutput !== undefined) {
      setLoading(false);
      setActiveBar('none');
      if (Capacitor.getPlatform() === 'ios') {
        PlayerIos.play({
          file: audioOutput,
        });
      }
    }
  }, [audioOutput]);

  const selectLanguage = (code: string) => {
    languageSelector === 'top'
      ? setTopLanguage(supportedLanguages[code])
      : setBottomLanguage(supportedLanguages[code]);
    setLanguageSelector(undefined);
  };

  return (
    <>
      <div className={containerClasses}>
        <div className={topBarClasses}>
          <div className="text-right">
            <button
              className="p-md mt-sm mr-sm active:bg-primary-500 rounded-full"
              onClick={() => toggleSettings(true)}>
              <Cog8ToothIcon className="w-8 h-8" color="white" />
            </button>
          </div>
          <div
            className="rounded-full overflow-hidden w-16 h-16 -mt-md mx-auto border shadow-lg flex justify-center items-center relative"
            onClick={() => setLanguageSelector('top')}>
            <div className="w-24 h-16 absolute">
              <img src={flags[topLanguage.code]} className="h-16" alt={topLanguage.code} />
            </div>
          </div>
          <p className="text-center text-secondary-400">{topLanguage.name}</p>
        </div>
        <div className={mainContainerClasses}>
          <div className={topContainerClasses}>
            {isLoading && activeBar === 'top' && !transcription && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            {isLoading && activeBar === 'bottom' && transcription && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            <div className="pt-40 px-xl text-secondary-600 text-center h-full pb-40">
              <div className="h-full overflow-y-auto flex items-center justify-center">
                {sourceLanguage === topLanguage.code ? transcription : translation}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="absolute -translate-y-28">
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                onUpStart={() => onStartTranslation('top')}
                onDownStart={() => onStartTranslation('bottom')}
                onEnd={onStopRecording}
              />
            </div>
          </div>
          <div className={bottomContainerClasses}>
            {isLoading && activeBar === 'top' && !translation && transcription && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            {isLoading && activeBar === 'bottom' && !transcription && (
              <div className="h-full flex items-center justify-center">
                <PulseLoader color="#cccccc" />
              </div>
            )}
            <div className="pt-36 px-xl text-secondary-600 text-center h-full pb-40">
              <div className="h-full overflow-y-auto flex items-center justify-center">
                {targetLanguage === bottomLanguage.code ? translation : transcription}
              </div>
            </div>
          </div>
        </div>
        <div className={bottomBarClasses}>
          <p className="text-center text-secondary-400 -mt-12">{bottomLanguage.name}</p>
          <div
            className="rounded-full overflow-hidden w-16 h-16 mx-auto border shadow-lg flex justify-center items-center relative"
            onClick={() => setLanguageSelector('bottom')}>
            <div className="w-24 h-16 absolute">
              <img src={flags[bottomLanguage.code]} className="h-16" alt={bottomLanguage.code} />
            </div>
          </div>
        </div>
      </div>
      <LanguageSelector
        languageSelector={languageSelector}
        selectedLanguage={languageSelector === 'top' ? topLanguage.code : bottomLanguage.code}
        onClose={() => setLanguageSelector(undefined)}
        onSelect={selectLanguage}
      />
      <Settings isOpen={isSettingsOpen} onClose={() => toggleSettings(false)} />
    </>
  );
};

export const Translate = compose(withAuth(isAuthenticated))(TranslateComponent);
