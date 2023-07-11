import { FC } from 'react';
import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { DefaultProps } from '../common/types';

interface InputProps extends DefaultProps {
  label?: string;
  type?: string;
  placeholder?: string;
}

export const Input: FC<InputProps> = ({
  className,
  id,
  testId,
  ariaLabel,
  type,
  placeholder,
  label,
}) => {
  const baseClass = cx({
    'typo-default block w-full rounded-3xl border-0 py-3 px-6 text-gray-900': true,
    'ring-1 ring-inset ring-gray-300': true,
    'placeholder:text-gray-400 sm:text-sm sm:leading-6': true,
    'focus:ring-1 focus:ring-inset focus:ring-blue-300 ': true,
    'focus:outline-0': true,
    'shadow-sm transition-all focus:shadow-[0px_0px_10px_2px] focus:shadow-blue-200': true,
  });
  const finalClasses = twMerge(baseClass, className);

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        className={finalClasses}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        data-testid={testId}
        aria-label={ariaLabel}
      />
    </>
  );
};
