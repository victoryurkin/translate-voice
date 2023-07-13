/* eslint-disable indent */
import { createContext, FC, useReducer, useContext, ReactNode, useEffect } from 'react';
import { getAuthUser, AuthUser } from '@translate-voice/services';

/**
 * The Auth state property been injected to a component using withAuth HOC.
 * @example
 * interface Props {
 *  authState: AuthState;
 * }
 */
export interface AuthState {
  isLoading: boolean;
  error?: Error;
  authUser?: AuthUser;
}

const initialState: AuthState = {
  isLoading: true,
};

const AuthContext = createContext(initialState);

enum DispatchTypes {
  SET_ERROR,
  SET_AUTH_USER,
}

interface DispatchProps {
  type: DispatchTypes;
  payload: unknown;
}

const reducer = (state: AuthState, { type, payload }: DispatchProps) => {
  switch (type) {
    case DispatchTypes.SET_ERROR:
      return {
        ...state,
        error: payload as Error,
        isLoading: false,
      };
    case DispatchTypes.SET_AUTH_USER:
      return {
        ...state,
        authUser: payload as AuthUser,
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Context Provider
 * @returns JSX.Element
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadAuthUser = async () => {
      try {
        const response = await getAuthUser();
        dispatch({
          type: DispatchTypes.SET_AUTH_USER,
          payload: response,
        });
      } catch (error) {
        dispatch({
          type: DispatchTypes.SET_ERROR,
          payload: error,
        });
      }
    };

    loadAuthUser();
  }, []);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

interface AuthContextProps {
  authState: AuthState;
}

/**
 * HOC to consume a Auth Context. Injects authState property into component's properties.
 * Use it with any component under the component level where withAuthProvider was used.
 * @returns JSX.Element
 * @example export default withAuth(MyComponent);
 */
export const withAuth =
  <P extends AuthContextProps>(condition: (authState: AuthState) => boolean) =>
  (Component: FC<P>) =>
  (props: P) => {
    return (
      <AuthContext.Consumer>
        {(context) => (condition(context) ? <Component {...props} authState={context} /> : null)}
      </AuthContext.Consumer>
    );
  };

/**
 * HOC condition to return nested component when user was loaded
 * @returns JSX.Element
 * @example export default withUser(isLoaded)(MyComponent);
 */
export const isAuthenticated = (authState: AuthState) => !!authState.authUser;

// Custom hook to access the auth
export const useAuth = () => useContext(AuthContext);
