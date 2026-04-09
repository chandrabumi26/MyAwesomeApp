import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { Code2, RefreshCcw } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Playground'>

export default function PlaygroundScreen({ route }: Props) {
  const user = route.params?.user;
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId: user?.id,
      });
      console.log("response : ", response);
    } catch (err) {
      setError('Failed to post data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
      <View className="p-6 mt-10">
        <View className="flex-row items-center mb-6">
          <Code2 size={32} color="#6366f1" />
          <Text className="text-3xl font-bold ml-3 text-slate-800">API Playground</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <Text className="text-slate-500 mb-4 font-medium uppercase tracking-wider text-xs">API Endpoint</Text>
          <View className="bg-slate-100 p-3 rounded-xl mb-6">
            <Text className="text-slate-600 font-mono text-xs">GET https://jsonplaceholder.typicode.com/posts/1</Text>
          </View>

          {loading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className="mt-4 text-slate-400">Fetching data...</Text>
            </View>
          ) : error ? (
            <View className="py-10 items-center">
              <Text className="text-red-500 font-bold">{error}</Text>
              <TouchableOpacity
                onPress={fetchData}
                className="mt-4 bg-slate-200 px-6 py-2 rounded-full"
              >
                <Text className="text-slate-700">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text className="text-slate-500 mb-2 font-medium uppercase tracking-wider text-xs">Response Body</Text>
              <View className="bg-slate-900 p-4 rounded-2xl">
                <Text className="text-green-400 font-mono text-sm leading-5">
                  {JSON.stringify(data, null, 2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={fetchData}
                className="mt-8 bg-indigo-500 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:bg-indigo-600"
              >
                <RefreshCcw size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg">Refresh Data</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <Text className="text-indigo-800 font-bold mb-2">What's happening?</Text>
          <Text className="text-indigo-600 leading-5">
            This screen demonstrates a simple HTTP GET request using Axios. The response from the external API is displayed in real-time.
          </Text>
        </View>

        <View className="p-6 mt-8 bg-white border-1 border-black shadow-2xl rounded-3xl">
          <Text className="text-indigo-800 font-bold mb-2">Lets try post request</Text>
          <View className="mb-5">
            <Text className="text-slate-700 font-medium mb-2 pl-1">Title</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Enter title"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-5">
            <Text className="text-slate-700 font-medium mb-2 pl-1">Body</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Enter body"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={body}
              onChangeText={setBody}
            />
          </View>

          <TouchableOpacity
            onPress={handlePostData}
            className="mt-8 bg-indigo-500 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:bg-indigo-600"
          >
            <RefreshCcw size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg">Post Data</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
