/* eslint-disable indent */
import { Fragment, FC, useState, useMemo } from 'react';
import cx from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Option {
  key: string;
  value: string;
}

export interface SelectProps {
  label: string;
  options: Option[];
  value?: string;
  placeholder?: string;
  search?: boolean;
  onChange?: (value: string) => void;
}

export const Select: FC<SelectProps> = ({
  label,
  options,
  value,
  placeholder,
  search,
  onChange,
}) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.value.toLowerCase().includes(query.toLowerCase());
        });

  const selectedOption = useMemo(() => options.find((item) => item.key === value), [value]);

  return (
    <Listbox value={selectedOption} onChange={(option) => onChange && onChange(option.key)}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6">
              <span className="block truncate">{selectedOption?.value}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute z-10 mt-1 w-full shadow-lg ring-1 rounded-md overflow-hidden bg-white py-1 ring-black ring-opacity-5 focus:outline-none text-base sm:text-sm">
                {search && (
                  <div className="h-10">
                    <input
                      className="border-0 border-b-2 border-secondary-100 w-full text-secondary-500 focus-visible:ring-0 focus-visible:border-secondary-100"
                      placeholder={placeholder}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                )}
                <div className="max-h-60 overflow-auto">
                  {filteredOptions.map((person) => (
                    <Listbox.Option
                      key={person.key}
                      className={({ active }) =>
                        cx(
                          active ? 'bg-primary-500 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={person}>
                      {({ selected, active }) => (
                        <>
                          <span
                            className={cx(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}>
                            {person.value}
                          </span>

                          {selected ? (
                            <span
                              className={cx(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
