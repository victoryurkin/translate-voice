/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';
import { DefaultProps } from '../common/types';
import './modal.css';

export interface VerticalModalProps extends DefaultProps {
  /**
   * (Required) Is modal open.
   */
  isOpen: boolean;
  /**
   * (Optional) Is full screen mode. Default is false.
   */
  isFullScreen?: boolean;
  /**
   * (Optional) On close handler
   */
  onClose?: () => void;
}

/**
 * Modal window. Has two modes: default and full screen.
 */
export const VerticalModal: FC<VerticalModalProps> = ({
  isOpen,
  isFullScreen = false,
  children,
  onClose,
  testId,
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    // const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe && onClose) {
      onClose();
    }
  };

  const modalClasses = cx(
    `
      h-full w-10/12 
      bg-white rounded-l-3xl
      overflow-hidden overflow-y-scroll
      absolute right-0
    `
  );

  const durationClasses = cx('duration-200 sm:duration-300');

  return (
    <Transition show={isOpen} appear data-testid={testId}>
      {!isFullScreen && (
        <Transition.Child
          data-testid="transition-child-1"
          className="fixed top-0 left-0 w-screen h-screen bg-black z-50"
          enter={`transition ${durationClasses}`}
          enterFrom="opacity-0"
          enterTo="opacity-25"
          entered="opacity-25"
          leave={`transition ${durationClasses}`}
          leaveFrom="opacity-25"
          leaveTo="opacity-0"
        />
      )}
      <Transition.Child
        data-testid="transition-child-2"
        className="fixed top-0 left-0 w-full h-full z-50 flex flex-col-reverse"
        enter={`transform transition ease-out ${durationClasses}`}
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave={`transform transition ease-out ${durationClasses}`}
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        onClick={onClose}>
        <div
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-container"
          id="modal-body"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}>
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};
export default VerticalModal;
