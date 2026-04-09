import { User } from '@supabase/supabase-js';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Attendance: { user: User };
  Playground: { user: User };
  User: undefined;
};

export type MainStackParamList = {
  Home: { user: User };
  MainTabs: { user: User };
};
