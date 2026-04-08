import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabaes';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      // 2. Ambil idToken
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('ID Token tidak ditemukan!');
      }

      // 3. TUKARKAN TOKEN DENGAN SESSION SUPABASE
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      console.log('User berhasil login ke Supabase:', data.user);
      // Di sini nanti kamu panggil supabase.auth.signInWithIdToken(...)
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User membatalkan login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Proses login sedang berjalan');
      } else {
        console.log('Error lainnya:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-grow px-6 justify-center pt-10 pb-6">
          <View className="mb-10 w-full items-center">
            <View className="w-20 h-20 bg-indigo-100 rounded-full mb-5 items-center justify-center">
              <Text className="text-4xl text-indigo-600">🔒</Text>
            </View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</Text>
            <Text className="text-slate-500 text-base">Sign in to continue</Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-sm mb-8">
            <View className="mb-5">
              <Text className="text-slate-700 font-medium mb-2 pl-1">Email Address</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-base focus:border-blue-500 focus:bg-white"
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mb-2">
              <Text className="text-slate-700 font-medium mb-2 pl-1">Password</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-base focus:border-blue-500 focus:bg-white"
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="self-end mb-6 py-2 px-1">
              <Text className="text-blue-600 font-medium tracking-wide">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-blue-600 rounded-2xl py-4 mb-5 shadow-md flex-row justify-center items-center active:bg-blue-700"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold text-center">Sign In</Text>
            </TouchableOpacity>

            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-slate-300" />
              <Text className="mx-4 text-slate-500">or</Text>
              <View className="flex-1 h-px bg-slate-300" />
            </View>

            <GoogleSigninButton
              style={{ width: '100%', height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
            />

          </View>

          <View className="flex-row justify-center mt-auto">
            <Text className="text-slate-500 font-medium">Don't have an account? </Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="text-blue-600 font-bold" onPress={(() => navigation.navigate('SignUp'))}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
