/* eslint-disable indent */
import { FC, useState } from 'react';
import { useTranslation } from '@translate-voice/i18n';
// import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';
import { useForm, Controller } from '@translate-voice/hooks';
import { useAuth, AuthError, AuthErrorCodes } from '@translate-voice/context';

interface FormData {
  email: string;
  password: string;
}

interface Props {
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export const Signin: FC<Props> = ({ onForgotPassword, onSuccess }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { t } = useTranslation();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data: unknown) => {
    try {
      const formData = data as FormData;
      setLoading(true);
      await signIn(formData.email, formData.password);
      onSuccess();
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case AuthErrorCodes.USER_NOT_FOUND:
        case AuthErrorCodes.WRONG_PASSWORD:
          setError(t('auth.errors.email_password_not_found'));
          break;
        default:
          setError(t('generic_error'));
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-col justify-center pt-xl">
      <div>
        <p className="main-header text-center text-4xl mt-3xl text-primary-800">
          {t('main.title')}
        </p>
        <p className="main-header text-center text-md mt-md text-secondary-600">
          {t('main.subtitle')}
        </p>
      </div>
      {/* <UserIcon className="h-20 fill-primary-600" /> */}
      <div className="flex justify-center py-3xl px-lg">
        <form className="flex-1 max-w-xs md:max-w-md" onSubmit={onSubmit}>
          <div className="mb-lg">
            <label htmlFor="email" className="hidden">
              {t('auth.email')}
            </label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  label={t('auth.email')}
                  type="email"
                  id="email"
                  placeholder={t('auth.email')}
                  disabled={isLoading}
                  required
                  error={errors.email && (errors.email.message as string)}
                />
              )}
            />
          </div>

          <div className="mb-lg">
            <label htmlFor="password" className="hidden">
              {t('auth.password')}
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  label={t('auth.password')}
                  type="password"
                  id="password"
                  placeholder={t('auth.password')}
                  disabled={isLoading}
                  required
                  error={errors.password && (errors.password.message as string)}
                />
              )}
            />
          </div>

          {error && <p className="mb-md text-red-500 text-sm text-center">{error}</p>}

          <div className="text-center mb-xl">
            <Button className="w-full" htmlType="submit" disabled={isLoading} isLoading={isLoading}>
              {t('auth.signin')}
            </Button>
          </div>
          <div className="text-center">
            <Button className="w-full" type="link" onClick={onForgotPassword} disabled={isLoading}>
              {t('auth.forgot_password')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
