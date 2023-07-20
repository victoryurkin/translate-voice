import { FC } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { KeyIcon } from '@heroicons/react/24/solid';
import { Button } from '@translate-voice/components';

interface Props {
  onSubmit: () => void;
}

export const Otp: FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <KeyIcon className="h-20 fill-primary-600" />
      <div className="flex justify-center pb-3xl px-lg">
        <form className="flex-1 max-w-xs md:max-w-md">
          <div className="mb-4xl">
            <p className="main-header text-center text-3xl mt-3xl text-primary-800">
              {t('auth.reset_success_title')}
            </p>
            <p className="main-header text-center text-md mt-md text-secondary-600">
              {t('auth.reset_success_subtitle')}
            </p>
          </div>
          <div className="text-center mb-lg">
            <Button className="w-full" onClick={onSubmit}>
              {t('auth.signin')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
