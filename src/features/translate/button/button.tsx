import { FC, useEffect, useState, useRef, SyntheticEvent } from 'react';
import cx from 'classnames';
import { MoonLoader } from 'react-spinners';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

interface ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onUpStart?: () => void;
  onDownStart?: () => void;
  onEnd?: () => void;
}

export const Button: FC<ButtonProps> = ({
  isLoading,
  isDisabled,
  onUpStart,
  onDownStart,
  onEnd,
}) => {
  const [buttonPosition, setButtonPosition] = useState<number>();
  const isMoving = useRef<boolean>();
  const startMove = useRef<(e: unknown) => void>();
  const endMove = useRef<() => void>();
  const updateMousePosition = useRef<(e: unknown) => void>();
  const initMousePosition = useRef<number>();
  const buttonPositionChange = useRef<number>();

  useEffect(() => {
    const getPageYFromEvent = (e: unknown): number | undefined => {
      const event = e as MouseEvent;
      if (event.pageY) {
        return event.pageY;
      } else {
        const syntheticEvent = e as SyntheticEvent;
        if (syntheticEvent.nativeEvent) {
          const touchEvent = syntheticEvent.nativeEvent as TouchEvent;
          if (touchEvent && touchEvent.changedTouches[0] && touchEvent?.changedTouches[0].pageY) {
            return touchEvent?.changedTouches[0].pageY;
          }
        } else {
          const touchEvent = e as TouchEvent;
          if (touchEvent && touchEvent.changedTouches[0] && touchEvent?.changedTouches[0].pageY) {
            return touchEvent?.changedTouches[0].pageY;
          }
        }
      }
    };

    updateMousePosition.current = (e: unknown) => {
      const pageY = getPageYFromEvent(e);
      if (pageY !== undefined) {
        if (isMoving.current === true && initMousePosition.current) {
          if (pageY - initMousePosition.current > 0) {
            buttonPositionChange.current = 1;
          } else if (pageY - initMousePosition.current < 0) {
            buttonPositionChange.current = -1;
          }
          setButtonPosition(pageY - initMousePosition.current > 0 ? 47 : -47);
        }
      }
    };

    startMove.current = (e: unknown) => {
      isMoving.current = true;
      const pageY = getPageYFromEvent(e);
      if (pageY !== undefined) {
        if (pageY) {
          initMousePosition.current = pageY;
        }
      }
    };

    endMove.current = () => {
      if (isMoving.current) {
        buttonPositionChange.current = 0;
      }
      isMoving.current = false;
      initMousePosition.current = undefined;
      setButtonPosition(0);
    };

    window.addEventListener('mousemove', updateMousePosition.current);
    window.addEventListener('touchmove', updateMousePosition.current);
    window.addEventListener('mouseup', endMove.current);
    window.addEventListener('touchend', endMove.current);
    return () => {
      if (updateMousePosition.current) {
        window.removeEventListener('mousemove', updateMousePosition.current);
        window.removeEventListener('touchmove', updateMousePosition.current);
      }
      if (endMove.current) {
        window.removeEventListener('mouseup', endMove.current);
        window.removeEventListener('touchend', endMove.current);
      }
    };
  }, []);

  const handleStartMove = (e: unknown) => {
    if (startMove.current) {
      startMove.current(e);
    }
  };

  const handleEndMove = () => {
    if (endMove.current) {
      endMove.current();
    }
  };

  useEffect(() => {
    if (buttonPositionChange.current === -1) {
      onUpStart && onUpStart();
    }
    if (buttonPositionChange.current === 1) {
      onDownStart && onDownStart();
    }
    if (buttonPositionChange.current === 0) {
      onEnd && onEnd();
    }
  }, [buttonPositionChange.current]);

  const buttonClasses = cx(
    'w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center',
    'transition-transform duration-300 ease-out',
    {
      'bg-primary-700': isMoving.current,
    }
  );

  return (
    <div className="rounded-full w-32 h-56 bg-secondary-300 flex items-center justify-center shadow-inner">
      {!isDisabled && (
        <div
          style={{ transform: `translateY(${buttonPosition}px)` }}
          className={buttonClasses}
          onMouseDown={handleStartMove}
          onTouchStart={handleStartMove}
          onMouseUp={handleEndMove}
          onTouchEnd={handleEndMove}>
          {isLoading && <MoonLoader className="opacity-70" color="white" />}
          {!isLoading && <MicrophoneIcon className="w-20 h-20 fill-primary-100" />}
        </div>
      )}
      {isDisabled && (
        <div
          style={{ transform: `translateY(${buttonPosition}px)`, opacity: '0.7' }}
          className={buttonClasses}>
          {isLoading && <MoonLoader className="opacity-70" color="white" />}
        </div>
      )}
    </div>
  );
};
