import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <View className="items-center mb-10 w-full">
        <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">🚀</Text>
        </View>
        <Text className="text-3xl font-bold text-slate-800 text-center mb-3">
          Welcome to AwesomeApp
        </Text>
        <Text className="text-base text-slate-500 text-center px-4 leading-relaxed">
          The best place to discover amazing features and connect with awesome people.
        </Text>
      </View>

      <View className="w-full">
        <TouchableOpacity 
          className="w-full py-4 rounded-2xl bg-blue-600 shadow-md flex-row justify-center items-center active:bg-blue-700"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-white text-lg font-semibold text-center">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
