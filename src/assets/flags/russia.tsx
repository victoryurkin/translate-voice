import { FC } from 'react';

interface Props {
  className?: string;
}

export const FlagRussia: FC<Props> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.02 22.68" className={className}>
    <g>
      <path
        d="M0 0h34.02v7.65H0z"
        style={{
          fill: '#fff',
        }}
      />
      <path
        d="M0 15.02h34.02v7.65H0z"
        style={{
          fill: '#d93729',
        }}
      />
      <path
        d="M0 7.65h34.02v7.37H0z"
        style={{
          fill: '#2e4b9f',
        }}
      />
    </g>
  </svg>
);
