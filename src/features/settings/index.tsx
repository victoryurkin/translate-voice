import { FC, useMemo, useState, useEffect } from 'react';
import { Button, VerticalModal } from '@translate-voice/components';
import { Select } from '@translate-voice/components';
import { useTranslation, getDefaultLanguage } from '@translate-voice/i18n';
import { supportedLanguages } from '@translate-voice/constants';
import { local } from '@translate-voice/clients';
import { useAuth } from '@translate-voice/context';
import { SettingsIcon } from './icon';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { defaultSettings } from '@translate-voice/constants';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export enum SettingsKey {
  DEFAULT_SOURCE_LANGUAGE = 'translateme.settings.default_source_language',
  DEFAULT_TARGET_LANGUAGE = 'translateme.settings.default_target_language',
  DEFAULT_VOICE = 'translateme.settings.default_voice',
}

export const Settings: FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [sourceLanguage, setSourceLanguage] = useState<string>(
    (local.get(SettingsKey.DEFAULT_SOURCE_LANGUAGE) as string) ||
      getDefaultLanguage() ||
      defaultSettings.sourceLanguage
  );
  const [targetLanguage, setTargetLanguage] = useState<string>(
    (local.get(SettingsKey.DEFAULT_TARGET_LANGUAGE) as string) || defaultSettings.targetLanguage
  );
  const [voice, setVoice] = useState<string>(defaultSettings.voice);

  const { t } = useTranslation();
  const { signOut } = useAuth();

  useEffect(() => {
    local.set(SettingsKey.DEFAULT_SOURCE_LANGUAGE, sourceLanguage);
  }, [sourceLanguage]);

  useEffect(() => {
    local.set(SettingsKey.DEFAULT_TARGET_LANGUAGE, targetLanguage);
  }, [targetLanguage]);

  useEffect(() => {
    local.set(SettingsKey.DEFAULT_VOICE, voice);
  }, [voice]);

  const options = useMemo(() => {
    return Object.keys(supportedLanguages).map((key: string) => {
      const item = supportedLanguages[key];
      return {
        key: item.code,
        value: item.name,
      };
    });
  }, [supportedLanguages]);

  return (
    <VerticalModal isOpen={isOpen} onClose={onClose}>
      <div className="p-md pb-4xl h-full flex flex-col">
        <div className="flex-1">
          <button
            className="p-md active:bg-secondary-200 rounded-full opacity-40"
            onClick={onClose}>
            <XCircleIcon className="w-8 h-8" />
          </button>
          <div className="px-2xl">
            <div className="flex justify-center mb-4xl">
              <SettingsIcon className="fill-primary-600 w-1/2" />
            </div>
            <h2 className="text-primary-600 typo-head-5 mb-2xl font-light">
              {t('settings.default_languages')}
            </h2>
            <div className="mb-4xl">
              <Select
                label={t('settings.default_source')}
                options={options}
                value={sourceLanguage}
                search={true}
                onChange={(value) => setSourceLanguage(value)}
              />
            </div>
            <div className="mb-4xl">
              <Select
                label={t('settings.default_target')}
                options={options}
                value={targetLanguage}
                search={true}
                onChange={(value) => setTargetLanguage(value)}
              />
            </div>

            <h2 className="text-primary-600 typo-head-5 mb-2xl font-light">
              {t('settings.default_voice')}
            </h2>
            <div className="mb-4xl">
              <Select
                label={t('settings.male_female')}
                options={[
                  { key: 'male', value: 'Male' },
                  { key: 'female', value: 'Female' },
                ]}
                value={voice}
                onChange={(value) => setVoice(value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-4xl p-2xl flex justify-end">
          <Button type="default" onClick={signOut}>
            {t('auth.signout')}
          </Button>
        </div>
      </div>
    </VerticalModal>
  );
};
