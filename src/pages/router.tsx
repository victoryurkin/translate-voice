import { FC, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import { routes } from '@translate-voice/constants';
import { Layout } from '@translate-voice/components';
import { Default } from './default';
import { Auth, Translate } from '@translate-voice/features';
import { useAuth } from '@translate-voice/context';
import { notifications, Events } from '@translate-voice/clients';

export const Router: FC = () => {
  const { isLoading, authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      navigate(authUser ? routes.TRANSLATE.path : routes.AUTH.path);
    }
  }, [isLoading]);

  useEffect(() => {
    const onSignOutEvent = () => {
      navigate(routes.AUTH.path);
    };
    notifications.on(Events.AUTH_SIGNOUT, onSignOutEvent);
    return () => {
      notifications.remove(Events.AUTH_SIGNOUT, onSignOutEvent);
    };
  }, []);

  return (
    <Layout>
      {isLoading && (
        <div className="h-full flex justify-center items-center">
          <MoonLoader className="opacity-70" color="blue" />
        </div>
      )}
      {!isLoading && (
        <Routes>
          <Route path={routes.DEFAULT.path} element={<Default />} />
          <Route path={routes.TRANSLATE.path} element={<Translate />} />
          <Route path={routes.AUTH.path} element={<Auth />} />
        </Routes>
      )}
    </Layout>
  );
};
