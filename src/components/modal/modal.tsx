import { FC } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';
import { DefaultProps } from '../common/types';
import './modal.css';

export interface ModalProps extends DefaultProps {
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
export const Modal: FC<ModalProps> = ({
  isOpen,
  isFullScreen = false,
  children,
  onClose,
  testId,
}) => {
  const modalClasses = cx({
    [`
      max-w-md min-h-3/10 max-h-4/5
      bg-white rounded-t-4xl
      overflow-hidden overflow-y-scroll
      relative left-1/2 transform -translate-x-1/2
    `]: !isFullScreen,
    [`
      w-full h-full
      overflow-hidden overflow-y-scroll
      bg-white
    `]: isFullScreen,
  });

  const durationClasses = cx({
    'duration-150 sm:duration-200': !isFullScreen,
    'duration-200 sm:duration-300': isFullScreen,
    // 'duration-1000 sm:duration-1000': !isFullScreen,
    // 'duration-900 sm:duration-1000': isFullScreen,
  });

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
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave={`transform transition ease-out ${durationClasses}`}
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
        onClick={onClose}>
        <div
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-container"
          id="modal-body">
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};
export default Modal;
