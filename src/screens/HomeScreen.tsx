import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
  const user = route.params?.user;
  console.log("user : ", user);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="mt-10 mx-4">
        <Text className="text-center text-2xl font-bold">Hi there,</Text>
        {user && (
          <View className="flex-row justify-center items-center mt-2">
            {user.user_metadata?.picture && (
              <Image
                source={{ uri: user.user_metadata.picture }}
                className="w-8 h-8 rounded-full mr-2"
                resizeMode="cover"
              />
            )}
            <Text className="text-slate-500 text-base">
              Welcome, {user.user_metadata.full_name}
            </Text>
          </View>
        )}

        <View className="rounded-3xl bg-white border-1 border-black shadow-2xl w-full mt-10 items-center p-5">
          <TouchableOpacity className="w-full bg-[#f6ecde] rounded-2xl py-4 mb-5 shadow-md flex-row justify-center items-center active:bg-[#ededed]">
            <Text className="text-white text-lg font-bold text-center">Get Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}