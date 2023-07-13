import { HTMLProps, forwardRef } from 'react';
import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { browserName } from 'react-device-detect';

interface Props extends HTMLProps<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const baseClass = cx({
    'typo-default block w-full rounded-3xl border-0 py-3 px-6 text-gray-900': true,
    'ring-1 ring-inset ring-gray-300': true,
    'placeholder:text-gray-400 sm:text-sm sm:leading-6': true,
    'focus:ring-1 focus:ring-inset focus:ring-blue-300 ': true,
    'focus:outline-0': true,
    'shadow-sm transition-all focus:shadow-[0px_0px_10px_2px] focus:shadow-blue-200': true,
    'border-1': browserName === 'Safari',
    'border-2': browserName === 'WebKit' || browserName === 'Mobile Safari',
  });

  const errorClass = cx({
    'shadow-[0px_0px_10px_2px] shadow-red-300 focus:shadow-red-300': !!props.error,
  });

  const finalClasses = twMerge(baseClass, errorClass, props.className);

  return <input {...props} ref={ref} className={finalClasses} />;
});

Input.displayName = 'Input';
