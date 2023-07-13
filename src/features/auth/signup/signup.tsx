import { FC, useState } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { signUp } from '@translate-voice/services';
import { Input, Button } from '@translate-voice/components';
import { useForm, Controller } from '@translate-voice/hooks';

interface FormData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignupData {
  email: string;
  password: string;
}

interface Props {
  onSuccess: (data: SignupData) => void;
}

export const SignupForm: FC<Props> = ({ onSuccess }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const validate = (data: FormData): boolean => {
    if (data.password !== data.confirm_password) {
      setError(t('auth.passwords_dont_match'));
      setFormError('password', { type: 'manual', message: t('auth.passwords_dont_match') });
      setFormError('confirm_password', { type: 'manual', message: t('auth.passwords_dont_match') });
      return false;
    }
    setError(undefined);
    return true;
  };

  const onSubmit = handleSubmit(async (data: unknown) => {
    try {
      const formData = data as FormData;
      const isValid = validate(formData);
      if (isValid) {
        setLoading(true);
        await signUp(formData.email, formData.password);
        onSuccess({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      console.error(error);
      setError(t('generic_error'));
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-col justify-center pt-4xl">
      <UserIcon className="h-20 fill-primary-600" />
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
            {errors.email && <p>{t('auth.errors.email')}</p>}
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
                  pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{6,}"
                  title={t('auth.password_error')}
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(t('auth.password_error'))
                  }
                  onChange={(e) => {
                    (e.target as HTMLInputElement).setCustomValidity('');
                    field.onChange(e);
                  }}
                  error={errors.password && (errors.password.message as string)}
                />
              )}
            />
          </div>

          <div className="mb-2xl">
            <label htmlFor="confirm_password" className="hidden">
              {t('auth.confirm_password')}
            </label>
            <Controller
              name="confirm_password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  label={t('auth.confirm_password')}
                  type="password"
                  id="confirm_password"
                  placeholder={t('auth.confirm_password')}
                  disabled={isLoading}
                  required
                  pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{6,}"
                  title={t('auth.password_error')}
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(t('auth.password_error'))
                  }
                  onChange={(e) => {
                    (e.target as HTMLInputElement).setCustomValidity('');
                    field.onChange(e);
                  }}
                  error={errors.confirm_password && (errors.confirm_password.message as string)}
                />
              )}
            />
          </div>

          {error && <p className="mb-md text-red-500 text-sm">{error}</p>}

          <div className="text-center mb-lg">
            <Button className="w-full" htmlType="submit">
              {t('auth.signup')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
