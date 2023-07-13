import { Auth } from 'aws-amplify';

export const signUp = (email: string, password: string) => Auth.signUp(email, password);
