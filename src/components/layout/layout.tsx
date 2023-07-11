import { FC, PropsWithChildren } from 'react';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <div className="container mx-auto max-w-2xl overflow-x-hidden h-full">{children}</div>;
};
