import { User } from '@supabase/supabase-js';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  Home: { user: User };
};
