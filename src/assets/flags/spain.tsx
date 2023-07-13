import { FC } from 'react';

interface Props {
  className?: string;
}

export const FlagSpain: FC<Props> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.02 22.68" className={className}>
    <g>
      <path
        d="M0 5.95h34.02v10.77H0z"
        style={{
          fill: '#fdc028',
        }}
      />
      <path d="M0 0h34.02v5.95H0zM0 16.72h34.02v5.95H0z" className="cls-2" />
    </g>
  </svg>
);
