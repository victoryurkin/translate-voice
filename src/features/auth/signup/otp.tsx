import { FC } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';

export const Otp: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <UserIcon className="h-20 fill-primary-600" />
      <div className="flex justify-center py-3xl px-lg">
        <form className="flex-1 max-w-xs md:max-w-md">
          <div className="mb-lg">
            <Input label={t('auth.otp')} type="text" id="otp" placeholder={t('auth.otp')} />
          </div>
          <div className="text-center mb-lg">
            <Button className="w-full">{t('auth.confirm_code')}</Button>
          </div>
          <div className="text-center">
            <Button className="w-full" type="link">
              {t('auth.resend_otp')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
