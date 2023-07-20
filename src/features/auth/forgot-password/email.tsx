/* eslint-disable indent */
import { FC, useState } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { KeyIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';
import { useForm, Controller } from '@translate-voice/hooks';
import { useAuth, AuthError, AuthErrorCodes } from '@translate-voice/context';

interface FormData {
  email: string;
}

interface Props {
  onSubmit: () => void;
}

export const Email: FC<Props> = ({ onSubmit: onSuccess }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { t } = useTranslation();
  const { resetPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data: unknown) => {
    try {
      const formData = data as FormData;
      setLoading(true);
      await resetPassword(formData.email);
      onSuccess();
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case AuthErrorCodes.USER_NOT_FOUND:
          setError(t('auth.errors.email_not_found'));
          break;
        default:
          setError(t('generic_error'));
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <KeyIcon className="h-20 fill-primary-600" />
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

          {error && <p className="mb-md text-red-500 text-sm text-center">{error}</p>}

          <div className="text-center mb-xl">
            <Button className="w-full" htmlType="submit" disabled={isLoading} isLoading={isLoading}>
              {t('auth.reset')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
