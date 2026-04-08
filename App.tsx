import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, MainStackParamList } from './src/navigation/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from './src/lib/supabaes';
import { Session } from '@supabase/supabase-js';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUp from './src/screens/SignUp';
import HomeScreen from './src/screens/HomeScreen';

GoogleSignin.configure({
  // WAJIB menggunakan Web Client ID meskipun aplikasinya Android
  webClientId: '44255507281-250e5tu8j0de4m0cme1rrt6utouife41.apps.googleusercontent.com',
  offlineAccess: true,
});

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {session && session.user ? (
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen
              name="Home"
              component={HomeScreen}
              initialParams={{ user: session.user }}
            />
          </MainStack.Navigator>
        ) : (
          <AuthStack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
            }}
          >
            <AuthStack.Screen name="Landing" component={LandingScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
