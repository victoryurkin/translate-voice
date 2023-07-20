import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from '@translate-voice/i18n';
import { routes } from '@translate-voice/constants';
import { withAuth, isNotAuthenticated } from '@translate-voice/context';
import { compose } from '@translate-voice/utils';
import { Signin } from './signin/signin';
import { Signup } from './signup/signup';
import { ForgotPassword } from './forgot-password';
import mainBanner from '@translate-voice/assets/images/main.png';

enum VirtualRoutes {
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
}

const AuthComponent: FC = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [navigation, toggleNavigation] = useState(false);
  const [virtualRoute, setVirtualRoute] = useState<VirtualRoutes>(VirtualRoutes.SIGN_IN);

  const { t } = useTranslation();
  const navigateToRoute = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
      toggleNavigation(true);
    }, 100);
    setTimeout(() => {
      setHasAnimated(true);
    }, 600);
  }, []);

  const containerClasses = cx({
    'h-full flex flex-col': true,
    'overflow-hidden': !hasAnimated,
  });

  const topBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'bg-gradient-to-t from-primary-600 to-primary-500 h-64 rounded-b-4xl': true,
    '-translate-y-64': !isLoaded,
    '-translate-y-0': isLoaded,
  });
  const bottomBarClasses = cx({
    'transition-transform duration-500 ease-out': true,
    'transition-all w-full px-xl bg-gradient-to-b from-primary-600 to-primary-500 rounded-t-4xl text-white underline active:from-primary-700 active:to-primary-500 focus-visible:outline-0 focus-visible:shadow-[0px_0px_0px_4px] focus-visible:shadow-primary-300':
      true,
    'translate-y-24': !isLoaded,
    'translate-y-0': isLoaded,
  });

  const navigate = (route: VirtualRoutes) => {
    toggleNavigation(false);
    setTimeout(() => {
      setVirtualRoute(route);
      toggleNavigation(true);
    }, 250);
  };

  const routerClasses = cx({
    'transition-all duration-250 ease-out': true,
    'opacity-0 translate-y-12': !navigation,
    'opacity-1 translate-y-0': navigation,
  });

  return (
    <div className={containerClasses}>
      <div className="flex-1">
        <div className={topBarClasses}>
          <div className="h-full flex items-center justify-center px-4xl sm:px-mega overflow-hidden">
            <img src={mainBanner} className="" alt="" />
          </div>
        </div>
        <div className={routerClasses}>
          {virtualRoute === VirtualRoutes.SIGN_IN && (
            <Signin
              onForgotPassword={() => navigate(VirtualRoutes.FORGOT_PASSWORD)}
              onSuccess={() => navigateToRoute(routes.TRANSLATE.path)}
            />
          )}
          {virtualRoute === VirtualRoutes.SIGN_UP && (
            <Signup onSuccess={() => navigateToRoute(routes.TRANSLATE.path)} />
          )}
          {virtualRoute === VirtualRoutes.FORGOT_PASSWORD && <ForgotPassword />}
        </div>
      </div>
      <button
        className={bottomBarClasses}
        onClick={() =>
          navigate(
            virtualRoute === VirtualRoutes.SIGN_IN ? VirtualRoutes.SIGN_UP : VirtualRoutes.SIGN_IN
          )
        }>
        <div className="h-20 p-xl">
          {virtualRoute === VirtualRoutes.SIGN_IN && t('auth.create_account')}
          {(virtualRoute === VirtualRoutes.SIGN_UP ||
            virtualRoute === VirtualRoutes.FORGOT_PASSWORD) &&
            t('auth.signin_account')}
        </div>
      </button>
    </div>
  );
};

export const Auth = compose(withAuth(isNotAuthenticated))(AuthComponent);
