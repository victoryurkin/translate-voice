import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@translate-voice/context';
import { routes } from '@translate-voice/constants';

export const Default = () => {
  const navigate = useNavigate();
  const { isLoading, authUser } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      navigate(authUser ? routes.TRANSLATE.path : routes.AUTH.path);
    }
  }, [isLoading]);

  return null;
};
