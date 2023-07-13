import { FC, useState } from 'react';
import cx from 'classnames';
import { SignupForm } from './signup';
import { Otp } from './otp';

enum VirtualRoutes {
  SIGN_UP,
  OTP,
}

enum Navigation {
  FROM_START,
  TO_END,
}

export const Signup: FC = () => {
  const [virtualRoute, setVirtualRoute] = useState<VirtualRoutes>(VirtualRoutes.SIGN_UP);
  const [navigation, toggleNavigation] = useState<Navigation>();

  const navigate = (route: VirtualRoutes) => {
    toggleNavigation(Navigation.FROM_START);
    setTimeout(() => {
      setVirtualRoute(route);
      toggleNavigation(Navigation.TO_END);
      setTimeout(() => {
        toggleNavigation(undefined);
      }, 50);
    }, 125);
  };

  const routerClasses = cx({
    'transition-all duration-250 ease-out': true,
    'opacity-1 translate-x-0': navigation === undefined,
    'opacity-0 -translate-x-40': navigation === Navigation.FROM_START,
    'opacity-0 translate-x-40': navigation === Navigation.TO_END,
  });

  return (
    <div className={routerClasses}>
      {virtualRoute === VirtualRoutes.SIGN_UP && (
        <SignupForm onSignup={() => navigate(VirtualRoutes.OTP)} />
      )}
      {virtualRoute === VirtualRoutes.OTP && <Otp />}
    </div>
  );
};
