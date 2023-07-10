import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from '@translate-voice/constants';
import { Layout } from '@translate-voice/components';
import { Default } from './default';

export const Router: FC = () => {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path={routes.HOME.path} element={<Default />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
};