import { FC, useState } from 'react';
import { useTranslation } from '@translate-voice/i18n';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';
import { useForm, Controller } from '@translate-voice/hooks';
import { confirmSignUp } from '@translate-voice/services';

interface FormData {
  otp: string;
}

interface Props {
  email: string;
  onSuccess: () => void;
}

export const Otp: FC<Props> = ({ email, onSuccess }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data: unknown) => {
    try {
      const formData = data as FormData;
      setLoading(true);
      await confirmSignUp(email, formData.otp);
      onSuccess();
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
            <label htmlFor="otp" className="hidden">
              {t('auth.otp')}
            </label>
            <Controller
              name="otp"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  label={t('auth.otp')}
                  type="text"
                  id="otp"
                  placeholder={t('auth.otp')}
                  disabled={isLoading}
                  required
                  pattern="^[0-9]{1,6}$"
                  title={t('auth.otp_error')}
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(t('auth.otp_error'))
                  }
                  onChange={(e) => {
                    (e.target as HTMLInputElement).setCustomValidity('');
                    field.onChange(e);
                  }}
                  error={errors.otp && (errors.otp.message as string)}
                />
              )}
            />
          </div>

          {error && <p className="mb-md text-red-500 text-sm">{error}</p>}

          <div className="text-center mb-lg">
            <Button className="w-full" htmlType="submit">
              {t('auth.confirm_code')}
            </Button>
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
