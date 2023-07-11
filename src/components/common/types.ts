import { ReactNode } from 'react';

export interface DefaultProps {
  /**
   * Additional css classes
   */
  className?: string;
  /**
   * Id attribute
   */
  id?: string;
  /**
   * Testing id attribute
   */
  testId?: string;
  /**
   * Accessibility Label
   */
  ariaLabel?: string;
  /**
   * Children html elements
   */
  children?: ReactNode;
}
