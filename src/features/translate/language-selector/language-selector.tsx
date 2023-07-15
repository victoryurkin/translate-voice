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
        const classes = cx(
          'p-md transition-colors hover:bg-secondary-100 active:bg-secondary-200 cursor-pointer',
          {
            'bg-secondary-100': key === selectedLanguage,
          }
        );
        return (
          <div key={index} className={classes} onClick={() => onSelect(key)}>
            <div className="flex justify-center">
              <img src={flags[key]} className="h-14" alt={key} />
            </div>
            <p className="typo-sm text-center text-secondary-500">{key}</p>
          </div>
        );
      })}
    </Modal>
  );
};
