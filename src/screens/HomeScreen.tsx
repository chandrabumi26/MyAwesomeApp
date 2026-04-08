import { ScrollView, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import DigitalClock from "./components/DigitalClock";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import axios from "axios";

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
  const user = route.params?.user;
  console.log("user : ", user);

  const takePhotoAndUpload = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.7,
    };

    launchCamera(options, async(response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        
        const photo = response.assets[0];
        const currentTime = new Date().toISOString();

        const formData = new FormData();
        formData.append('photo', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName || 'photo.jpg',
        } as any);
        formData.append('timestamp', currentTime);

        try {
          console.log('Uploading to API...');
          const res = await axios.post('https://api-kamu.com/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          Alert.alert('Sukses', 'Foto dan waktu berhasil dikirim!');
          console.log('Response:', res.data);
        } catch (error) {
          console.error('Upload Error:', error);
          Alert.alert('Gagal', 'Terjadi kesalahan saat upload ke server.');
        }
      }
    })
  }

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
          <DigitalClock />
          <TouchableOpacity onPress={takePhotoAndUpload} className="w-full bg-green-500 rounded-2xl py-4 mb-5 shadow-md flex-row justify-center items-center active:bg-green-600 mt-5">
            <Text className="text-white text-lg font-bold text-center">Get Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}