import { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from './button/button';
import { FlagRussia, FlagUsa } from '@translate-voice/assets';
import { translate, speech } from '@translate-voice/services';
import { registerPlugin } from '@capacitor/core';

//#region iOS Capacitor Plugin
export interface PlayerIosPlugin {
  play(options: { file: string }): Promise<{ response: string }>;
}
const PlayerIos = registerPlugin<PlayerIosPlugin>('PlayerIos');

export const Translate: FC = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeBar, setActiveBar] = useState<string>('none');

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    setTimeout(() => {
      setHasAnimated(true);
    }, 600);
  }, []);

  const containerClasses = cx({
    'h-full flex flex-col': true,
    'overflow-hidden': !hasAnimated,
  });

  const topBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'relative z-10 bg-gradient-to-t from-primary-600 to-primary-500 h-24 rounded-b-4xl': true,
    '-translate-y-24': !isLoaded,
    '-translate-y-0': isLoaded,
    'bg-gradient-to-t from-primary-800 to-primary-500': activeBar === 'top',
  });

  const topContainerClasses = cx('flex-1 -mt-24', {
    'bg-secondary-100': activeBar !== 'top',
    'bg-white': activeBar === 'top',
  });

  const mainContainerClasses = cx('flex-1 flex flex-col transition-all duration-500 ease-out', {
    'opacity-0': !isLoaded,
    'opacity-1': isLoaded,
  });

  const bottomBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'bg-gradient-to-b from-primary-600 to-primary-500 h-24 rounded-t-4xl': true,
    'translate-y-24': !isLoaded,
    'translate-y-0': isLoaded,
    'bg-gradient-to-b from-primary-800 to-primary-500': activeBar === 'bottom',
  });

  const bottomContainerClasses = cx('flex-1 -mb-24', {
    'bg-secondary-100': activeBar !== 'bottom',
    'bg-white': activeBar === 'bottom',
  });

  const onEnd = async () => {
    try {
      const translateResponse = await translate();
      const speechResponse = await speech(translateResponse);
      await PlayerIos.play({
        file: speechResponse,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={containerClasses}>
      <div className={topBarClasses}>
        <div className="rounded-full overflow-hidden w-16 h-16 mx-auto mt-14 border shadow-lg">
          <FlagUsa className="h-16 fill-white" />
        </div>
      </div>
      <div className={mainContainerClasses}>
        <div className={topContainerClasses}></div>
        <div className="flex justify-center h-10 -mt-6 bg-white">
          <div className="absolute -translate-y-32">
            <Button
              onUpStart={() => setActiveBar('top')}
              onDownStart={() => setActiveBar('bottom')}
              onEnd={onEnd}
            />
          </div>
        </div>
        <div className={bottomContainerClasses}></div>
      </div>
      <div className={bottomBarClasses}>
        <div className="rounded-full overflow-hidden w-16 h-16 mx-auto -mt-8 border shadow-lg">
          <FlagRussia className="h-16 fill-white" />
        </div>
      </div>
    </div>
  );
};
