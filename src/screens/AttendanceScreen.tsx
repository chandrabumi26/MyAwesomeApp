import { ScrollView, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import DigitalClock from "./components/DigitalClock";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import { supabase } from '../lib/supabaes';
import { useEffect, useState } from "react";

type Props = BottomTabScreenProps<MainTabParamList, 'Attendance'>;

export default function AttendanceScreen({ route }: Props) {
  const user = route.params?.user;

  const [attendance, setAttendance] = useState<any[]>([]);

  const loadAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*');

    if (error) {
      console.error('Error loading attendance:', error);
      return;
    }
    setAttendance(data || []);
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

          console.log('Menyimpan ke Database...');
          const { error: dbError } = await supabase
            .from('attendance_logs')
            .insert([
              {
                photo_url: "dummy",
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
  }, [])

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
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

        <View className="rounded-3xl bg-white border-1 border-black shadow-2xl w-full mt-10 items-center p-5">
          <Text className="text-center text-2xl font-bold mb-2">Attendance Histroy</Text>
          {attendance.length === 0 ? (
            <Text className="text-slate-400">No logs yet.</Text>
          ) : (
            attendance.map((item) => (
              <Text key={item.id} className="text-center text-lg font-bold">{item.capture_time}</Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
