/* eslint-disable indent */
import { createContext, FC, useReducer, useContext, ReactNode, useMemo } from 'react';
import { Auth, onAuthStateChanged, User, signInWithEmailAndPassword } from 'firebase/auth';

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
  authUser?: User;
  accessToken?: string;
  signIn: (username: string, password: string) => Promise<void>;
}

const initialState: AuthState = {
  isLoading: false,
  signIn: async () => {
    console.log('AuthProvider was not set up');
  },
};

const AuthContext = createContext(initialState);

enum DispatchTypes {
  SET_ERROR,
  SET_LOADING,
  SET_AUTH_USER,
  SET_ACCESS_TOKEN,
}

interface DispatchProps {
  type: DispatchTypes;
  payload: unknown;
}

const reducer = (state: AuthState, { type, payload }: DispatchProps) => {
  switch (type) {
    case DispatchTypes.SET_LOADING:
      return {
        ...state,
        isLoading: payload as boolean,
      };
    case DispatchTypes.SET_ERROR:
      return {
        ...state,
        error: payload as Error,
      };
    case DispatchTypes.SET_AUTH_USER:
      return {
        ...state,
        authUser: payload as User,
      };
    case DispatchTypes.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload as string,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  auth: Auth;
  children: ReactNode;
}

/**
 * Auth Context Provider
 * @returns JSX.Element
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children, auth }) => {
  const [authState, dispatch] = useReducer(reducer, initialState);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch({
        type: DispatchTypes.SET_AUTH_USER,
        payload: user,
      });
      const accessToken = await user.getIdToken();
      dispatch({
        type: DispatchTypes.SET_ACCESS_TOKEN,
        payload: accessToken,
      });
    }
  });

  const signIn = async (username: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    console.log('!!!', userCredential);
    if (userCredential?.user) {
      dispatch({
        type: DispatchTypes.SET_AUTH_USER,
        payload: userCredential.user,
      });
      const accessToken = await userCredential.user.getIdToken();
      if (accessToken) {
        dispatch({
          type: DispatchTypes.SET_ACCESS_TOKEN,
          payload: accessToken,
        });
      }
    }
  };

  const providerValue = useMemo(
    () => ({
      ...authState,
      signIn,
    }),
    [authState]
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
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
