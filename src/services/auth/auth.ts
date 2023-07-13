import { Auth } from 'aws-amplify';

export interface AuthUser {
  email: string;
}

export const signUp = (email: string, password: string) => Auth.signUp(email, password);

export const confirmSignUp = (email: string, otp: string) => Auth.confirmSignUp(email, otp);

export const signIn = (email: string, password: string) => Auth.signIn(email, password);

interface AuthUserResponse {
  attributes?: {
    email: string;
  };
}

export const getAuthUser = async () => {
  const response = (await Auth.currentAuthenticatedUser()) as AuthUserResponse;
  if (response?.attributes?.email) {
    const authUser: AuthUser = {
      email: response?.attributes?.email,
    };
    return authUser;
  }
  return undefined;
};

export const getAccessToken = async () => {
  const response = await Auth.currentSession();
  const idToken = response.getIdToken();
  if (idToken) {
    return idToken.getJwtToken();
  }
  return undefined;
};
