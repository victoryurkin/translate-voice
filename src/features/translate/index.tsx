import { FC, useEffect, useState, useRef, SyntheticEvent } from 'react';
import cx from 'classnames';

export const Translate: FC = () => {
  const [buttonPosition, setButtonPosition] = useState<number>();
  const isMoving = useRef<boolean>();
  const startMove = useRef<(e: MouseEvent) => void>();
  const endMove = useRef<() => void>();
  const initMousePosition = useRef<number>();

  useEffect(() => {
    const updateMousePosition = (e: unknown) => {
      const event = e as MouseEvent;
      if (isMoving.current === true && initMousePosition.current) {
        setButtonPosition(event.pageY - initMousePosition.current > 0 ? 62 : -62);
      }
    };

    startMove.current = (e: unknown) => {
      const event = e as MouseEvent;
      isMoving.current = true;
      if (event.pageY) {
        initMousePosition.current = event.pageY;
      } else {
        const touchEvent = e as SyntheticEvent;
        if (touchEvent.nativeEvent) {
          const nativeEvent = touchEvent.nativeEvent as MouseEvent;
          initMousePosition.current = nativeEvent.pageY;
        }
      }
    };

    endMove.current = () => {
      isMoving.current = false;
      initMousePosition.current = undefined;
      setButtonPosition(0);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('touchmove', updateMousePosition);
    window.addEventListener('mouseup', endMove.current);
    window.addEventListener('touchend', endMove.current);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('touchmove', updateMousePosition);
      if (endMove.current) {
        window.removeEventListener('mouseup', endMove.current);
        window.removeEventListener('touchend', endMove.current);
      }
    };
  }, []);

  const handleStartMove = (e: unknown) => {
    const event = e as MouseEvent;
    if (startMove.current) {
      startMove.current(event);
    }
  };

  const handleEndMove = () => {
    if (endMove.current) {
      endMove.current();
    }
  };

  const buttonClasses = cx(
    'w-40 h-40 rounded-full bg-primary-500',
    'active:bg-primary-700 hover:bg-primary-500 focus:bg-primary-500',
    'transition-transform duration-300 ease-out'
  );

  return (
    <div className="h-full flex items-center justify-center">
      <div className="rounded-full w-40 h-72 bg-secondary-100 flex items-center justify-center">
        <div
          style={{ transform: `translateY(${buttonPosition}px)` }}
          className={buttonClasses}
          onMouseDown={handleStartMove}
          onTouchStart={handleStartMove}
          onMouseUp={handleEndMove}
          onTouchEnd={handleEndMove}
        />
      </div>
    </div>
  );
};
