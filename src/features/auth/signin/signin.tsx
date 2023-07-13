import { FC } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';

interface Props {
  onForgotPassword: () => void;
}

export const Signin: FC<Props> = ({ onForgotPassword }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <UserIcon className="h-20 fill-primary-600" />
      <div className="flex justify-center py-3xl px-lg">
        <form className="flex-1 max-w-xs md:max-w-md">
          <div className="mb-lg">
            <Input label={t('auth.email')} type="email" id="email" placeholder={t('auth.email')} />
          </div>
          <div className="mb-4xl">
            <Input
              label={t('auth.password')}
              type="password"
              id="password"
              placeholder={t('auth.password')}
            />
          </div>
          <div className="text-center mb-xl">
            <Button className="w-full">{t('auth.signin')}</Button>
          </div>
          <div className="text-center">
            <Button className="w-full" type="link" onClick={onForgotPassword}>
              {t('auth.forgot_password')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
