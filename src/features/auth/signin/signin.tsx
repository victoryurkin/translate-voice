import { FC, useState } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';
import { useForm, Controller } from '@translate-voice/hooks';
import { useAuth } from '@translate-voice/context';

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
      console.log('!!!', 'Singing in...');
      const formData = data as FormData;
      console.log('!!!', formData);
      setLoading(true);
      const response = await signIn(formData.email, formData.password);
      console.log('!!!', response);
      onSuccess();
    } catch (error) {
      console.error(error);
      console.log('!!!', error);
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

          {error && <p className="mb-md text-red-500 text-sm">{error}</p>}

          <div className="text-center mb-xl">
            <Button className="w-full" htmlType="submit">
              {t('auth.signin')}
            </Button>
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
