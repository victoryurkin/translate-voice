import { FC } from 'react';
import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { ClipLoader } from 'react-spinners';
import { DefaultProps } from '../common/types';

interface ButtonProps extends DefaultProps {
  type?: 'primary' | 'default' | 'link';
  htmlType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  className,
  id,
  testId,
  ariaLabel,
  type = 'primary',
  htmlType = 'button',
  disabled,
  isLoading,
  children,
  onClick,
}) => {
  const baseClass = cx({
    'flex justify-center items-center rounded-3xl px-8 py-3 typo-default shadow-sm': true,
    'transition-colors': true,
    'focus-visible:outline-0 focus-visible:shadow-[0px_0px_0px_4px] ': true,
    'active:shadow-white': true,
    'text-white bg-primary-600 hover:bg-primary-700 focus-visible:shadow-primary-200 active:bg-primary-900':
      type === 'primary',
    'text-secondary-600 font-bold bg-white ring-2 ring-secondary-400 hover:bg-secondary-100 focus-visible:shadow-secondary-300 active:bg-secondary-200':
      type === 'default',
    'shadow-none focus-visible:shadow-none underline active:bg-secondary-100 focus-visible:bg-secondary-100':
      type === 'link',
    'opacity-70': disabled,
    'focus-visible:bg-primary-600 hover:bg-primary-600 active:bg-primary-600':
      disabled && type === 'primary',
    'focus-visible:bg-white hover:bg-white active:bg-white': disabled && type === 'default',
  });
  const finalClasses = twMerge(baseClass, className);

  return (
    <button
      type={htmlType}
      className={finalClasses}
      id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}>
      {isLoading && (
        <ClipLoader color={type === 'primary' ? 'white' : '#aaaaaa'} className="mr-sm" size={22} />
      )}
      {children}
    </button>
  );
};
