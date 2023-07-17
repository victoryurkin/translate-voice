import { FC, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Modal } from '@translate-voice/components';
import { supportedLanguages, Language } from '@translate-voice/constants';
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
  const supportedLanguagesMap = useMemo(
    () => Object.keys(supportedLanguages).map((key) => supportedLanguages[key]),
    []
  );
  const [search, setSearch] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>(supportedLanguagesMap);

  useEffect(() => {
    if (search !== '') {
      setFilteredLanguages(supportedLanguagesMap.filter((lang) => lang.name.includes(search)));
    } else {
      setFilteredLanguages(supportedLanguagesMap);
    }
  }, [search]);

  useEffect(() => {
    setTimeout(() => {
      if (languageSelector) {
        const container = document.getElementById('modal-body');
        if (container) {
          const containerHeight = container.clientHeight;
          container.style.height = `${containerHeight}px`;
        }
      } else {
        setSearch('');
      }
    }, 500);
  }, [languageSelector]);

  const inputClasses = cx('border-b w-full text-sm px-xl py-md', 'ring-0 outline-0');
  return (
    <Modal isOpen={!!languageSelector} onClose={onClose}>
      <div className="mx-xl mt-2xl mb-sm">
        <input
          className={inputClasses}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value.trim())}
        />
      </div>
      {filteredLanguages.map((language, index) => {
        const classes = cx(
          'flex items-center py-md px-xl transition-colors hover:bg-secondary-100 active:bg-secondary-200 cursor-pointer',
          {
            'bg-secondary-100': language.code === selectedLanguage,
          }
        );
        return (
          <div key={index} className={classes} onClick={() => onSelect(language.code)}>
            <div className="h-8 w-11 overflow-hidden border mr-lg">
              <img src={flags[language.code]} className="h-8" alt={language.code} />
            </div>
            <p className="typo-sm text-secondary-500">{language.name}</p>
          </div>
        );
      })}
    </Modal>
  );
};
