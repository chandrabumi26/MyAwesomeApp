import { ScrollView, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import DigitalClock from "./components/DigitalClock";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import { supabase } from '../lib/supabaes';
import { useEffect, useState } from "react";

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
  const user = route.params?.user;

  const [attendance, setAttendance] = useState<any[]>([]);

  const loadAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*');

    if (error) throw error;
    setAttendance(data);
  }

  const takePhotoAndUpload = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const photo = response.assets[0];
        const currentTime = new Date().toLocaleTimeString('id-ID');

        try {
          if (!photo.uri) throw new Error('Photo URI is missing');

          console.log('Mengambil file foto via XHR...');
          const blob: any = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.error('XHR Error:', e);
              reject(new TypeError('Network request failed (Local File)'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', photo.uri!, true);
            xhr.send(null);
          });

          const fileName = `attendance/${Date.now()}.jpg`;
          
          console.log('Mengupload ke Storage...');
          const { error: storageError } = await supabase.storage
            .from('photos')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
            });

          if (storageError) throw storageError;

          console.log('Mendapatkan URL publik...');
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

          console.log('Menyimpan ke Database...');
          const { error: dbError } = await supabase
            .from('attendance_logs')
            .insert([
              { 
                photo_url: publicUrl, 
                capture_time: currentTime 
              }
            ]);

          if (dbError) throw dbError;

          Alert.alert('Sukses', 'Data tersimpan di Database Supabase!');
          await loadAttendance();
          console.log('Berhasil: Data tersimpan.');
        } catch (error: any) {
          console.error('Operation Error:', error.message);
          Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        }
      }
    })
  }

  useEffect(() => {
    loadAttendance();
  },[])

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

        <View className="rounded-3xl bg-white border-1 border-black shadow-2xl w-full mt-10 items-center p-5 gap-5">
          <Text className="text-center text-2xl font-bold mb-2">Attendance</Text>
          {attendance.map((item) => (
            <Text key={item.id} className="text-center text-lg font-bold">{item.capture_time}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}