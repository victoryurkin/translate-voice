/* eslint-disable indent */
import { createContext, FC, useReducer, useContext, ReactNode, useMemo, useEffect } from 'react';
import {
  Auth,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // sendEmailVerification,
} from 'firebase/auth';

export enum AuthErrorCodes {
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  EMAIL_ALREADY_USED = 'auth/email-already-in-use',
}

export interface AuthError {
  code: AuthErrorCodes;
}

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
  signUp: (username: string, password: string) => Promise<void>;
}

const initialState: AuthState = {
  isLoading: true,
  signIn: async () => {
    console.log('AuthProvider was not setup');
  },
  signUp: async () => {
    console.log('AuthProvider was not setup');
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

  const signIn = async (username: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
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

  const signUp = async (username: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password);
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
      // if (auth.currentUser) {
      //   await sendEmailVerification(auth.currentUser);
      // }
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
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
      } catch (error) {
        console.log('Error getting user: ', error);
      } finally {
        dispatch({
          type: DispatchTypes.SET_LOADING,
          payload: false,
        });
      }
    });
  }, []);

  const providerValue = useMemo(
    () => ({
      ...authState,
      signIn,
      signUp,
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
