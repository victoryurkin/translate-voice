import { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { UserIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@translate-voice/components';

export const Login: FC = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    setTimeout(() => {
      setHasAnimated(true);
    }, 400);
  }, []);

  const containerClasses = cx({
    'h-full flex flex-col': true,
    'overflow-hidden': !hasAnimated,
  });

  const topBarClasses = cx({
    'bg-gradient-to-t from-primary-600 to-primary-500 h-64 rounded-b-4xl': true,
    'transition-transform duration-300 ease-out': true,
    '-translate-y-64': !isLoaded,
    '-translate-y-0': isLoaded,
  });
  const bottomBarClasses = cx({
    'transition-all w-full px-xl h-24 bg-gradient-to-b from-primary-600 to-primary-500 rounded-t-4xl text-white underline active:from-primary-700 active:to-primary-500 focus-visible:outline-0 focus-visible:shadow-[0px_0px_0px_4px] focus-visible:shadow-primary-300':
      true,
    'transition-transform duration-300 ease-out': true,
    'translate-y-24': !isLoaded,
    'translate-y-0': isLoaded,
  });

  const formClasses = cx({
    'flex flex-col justify-center pt-mega': true,
    'transition-opacity duration-300 ease-out': true,
    'opacity-0': !isLoaded,
    'opacity-1': isLoaded,
  });

  return (
    <div className={containerClasses}>
      <div className="flex-1">
        <div className={topBarClasses} />
        <div className={formClasses}>
          <UserIcon className="h-20 fill-primary-600" />
          <div className="flex justify-center py-3xl px-lg">
            <form className="flex-1 max-w-xs md:max-w-md">
              <div className="mb-lg">
                <Input label="Email" type="email" id="email" placeholder="Email" />
              </div>
              <div className="mb-4xl">
                <Input label="Password" type="password" id="password" placeholder="Password" />
              </div>
              <div className="text-center mb-lg">
                <Button className="w-full">Log In</Button>
              </div>
              <div className="text-center">
                <Button className="w-full" type="link">
                  Forgot password?
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button className={bottomBarClasses}>Create an account</button>
    </div>
  );
};
