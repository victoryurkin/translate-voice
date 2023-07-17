import { FC } from 'react';
import cx from 'classnames';
import { Modal } from '@translate-voice/components';
import { supportedLanguages } from '@translate-voice/constants';
import { flags } from '@translate-voice/assets';

interface LanguageSelectorProps {
  languageSelector?: string;
  selectedLanguage: string;
  onClose: () => void;
  onSelect: (code: string) => void;
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({
  languageSelector,
  selectedLanguage,
  onClose,
  onSelect,
}) => {
  return (
    <Modal isOpen={!!languageSelector} onClose={onClose}>
      {Object.keys(supportedLanguages).map((key, index) => {
        const language = supportedLanguages[key];
        const classes = cx(
          'flex items-center py-md px-xl transition-colors hover:bg-secondary-100 active:bg-secondary-200 cursor-pointer',
          {
            'bg-secondary-100': key === selectedLanguage,
          }
        );
        return (
          <div key={index} className={classes} onClick={() => onSelect(key)}>
            <div className="h-8 w-11 overflow-hidden border mr-lg">
              <img src={flags[key]} className="h-8" alt={key} />
            </div>
            <p className="typo-sm text-secondary-500">{language.name}</p>
          </div>
        );
      })}
    </Modal>
  );
};
