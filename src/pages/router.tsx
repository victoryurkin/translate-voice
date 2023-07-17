import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import { routes } from '@translate-voice/constants';
import { Layout } from '@translate-voice/components';
import { Default } from './default';
import { Auth, Translate } from '@translate-voice/features';
import { useAuth } from '@translate-voice/context';

export const Router: FC = () => {
  const { isLoading } = useAuth();
  return (
    <Layout>
      {isLoading && (
        <div className="h-full flex justify-center items-center">
          <MoonLoader className="opacity-70" color="blue" />
        </div>
      )}
      {!isLoading && (
        <BrowserRouter>
          <Routes>
            <Route path={routes.DEFAULT.path} element={<Default />} />
            <Route path={routes.TRANSLATE.path} element={<Translate />} />
            <Route path={routes.AUTH.path} element={<Auth />} />
          </Routes>
        </BrowserRouter>
      )}
    </Layout>
  );
};
