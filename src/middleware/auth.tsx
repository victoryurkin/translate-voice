import { useEffect } from 'react';
import { Router } from '../pages/router';
import { useAuth } from '@translate-voice/context';

const Auth = () => {
  const { authUser, accessToken } = useAuth();
  useEffect(() => {
    if (authUser) {
      console.log('!', accessToken);
    }
  }, [accessToken]);
  return (
    <div className="h-full">
      <Router />
    </div>
  );
};

export default Auth;
