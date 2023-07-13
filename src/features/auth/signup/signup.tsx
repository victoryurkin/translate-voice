import { FC } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';

interface Props {
  onSignup: () => void;
}

export const SignupForm: FC<Props> = ({ onSignup }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <UserIcon className="h-20 fill-primary-600" />
      <div className="flex justify-center py-3xl px-lg">
        <form className="flex-1 max-w-xs md:max-w-md">
          <div className="mb-lg">
            <Input label={t('auth.email')} type="email" id="email" placeholder={t('auth.email')} />
          </div>
          <div className="mb-lg">
            <Input
              label={t('auth.password')}
              type="password"
              id="password"
              placeholder={t('auth.password')}
            />
          </div>
          <div className="mb-4xl">
            <Input
              label={t('auth.confirm_password')}
              type="confirm_password"
              id="confirm_password"
              placeholder={t('auth.confirm_password')}
            />
          </div>
          <div className="text-center mb-lg">
            <Button className="w-full" onClick={onSignup}>
              {t('auth.signup')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
