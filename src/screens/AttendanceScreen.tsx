import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from "react-native";
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import DigitalClock from "./components/DigitalClock";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import { supabase } from '../lib/supabaes';
import {
  Clock,
  Calendar,
  Camera,
  CheckCircle2,
  History,
  ChevronRight,
  User as UserIcon
} from 'lucide-react-native';

type Props = BottomTabScreenProps<MainTabParamList, 'Attendance'>;

export default function AttendanceScreen({ route }: Props) {
  const user = route.params?.user;
  const [attendance, setAttendance] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAttendance();
    setRefreshing(false);
  }, []);

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
        Alert.alert('Camera Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const photo = response.assets[0];
        const currentTime = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        try {
          if (!photo.uri) throw new Error('Photo URI is missing');
          setLoading(true);

          const { error: dbError } = await supabase
            .from('attendance_logs')
            .insert([
              {
                photo_url: "dummy",
                capture_time: currentTime
              }
            ]);

          if (dbError) throw dbError;

          Alert.alert('Success', 'Attendance saved successfully!');
          await loadAttendance();
        } catch (error: any) {
          console.error('Operation Error:', error.message);
          Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">
              {today}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-slate-800 mr-2">
                Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
              </Text>
              <Text className="text-2xl">👋</Text>
            </View>
          </View>
          {user?.user_metadata?.picture ? (
            <Image
              source={{ uri: user.user_metadata.picture }}
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm"
              resizeMode="cover"
            />
          ) : (
            <View className="w-12 h-12 rounded-2xl bg-indigo-100 items-center justify-center">
              <UserIcon size={24} color="#6366f1" />
            </View>
          )}
        </View>

        {/* Hero Card - Clock & Action */}
        <View className="mx-6 mt-4">
          <View className="bg-slate-900 rounded-[40px] p-8 shadow-2xl border border-slate-800">
            <View className="flex-row items-center justify-center mb-6">
              <Clock size={20} color="#6366f1" className="mr-2" />
              <Text className="text-indigo-400 font-bold uppercase tracking-widest text-xs">
                In-Time Tracking
              </Text>
            </View>

            <DigitalClock />

            <TouchableOpacity
              onPress={takePhotoAndUpload}
              disabled={loading}
              activeOpacity={0.8}
              className={`w-full mt-8 bg-indigo-500 rounded-3xl py-5 flex-row justify-center items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
            >
              <Camera size={24} color="white" className="mr-3" />
              <Text className="text-white text-xl font-bold">
                {loading ? 'Processing...' : 'Check In Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats / Info */}
        <View className="flex-row px-6 mt-8 justify-between">
          <View className="bg-white rounded-3xl p-4 flex-1 mr-2 flex-row items-center shadow-sm border border-slate-100">
            <View className="bg-green-50 p-2 rounded-xl mr-3">
              <Calendar size={20} color="#22c55e" />
            </View>
            <View>
              <Text className="text-slate-400 text-xs font-medium">Status</Text>
              <Text className="text-slate-800 font-bold">On Time</Text>
            </View>
          </View>
          <View className="bg-white rounded-3xl p-4 flex-1 ml-2 flex-row items-center shadow-sm border border-slate-100">
            <View className="bg-blue-50 p-2 rounded-xl mr-3">
              <History size={20} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-slate-400 text-xs font-medium">Logs</Text>
              <Text className="text-slate-800 font-bold">{attendance.length} today</Text>
            </View>
          </View>
        </View>

        {/* History Section */}
        <View className="mt-8 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800">Recent Activity</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-indigo-500 font-bold text-sm">View All</Text>
              <ChevronRight size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>

          {attendance.length === 0 ? (
            <View className="bg-white rounded-3xl p-10 items-center justify-center border border-dashed border-slate-200">
              <View className="bg-slate-50 p-4 rounded-full mb-4">
                <History size={32} color="#cbd5e1" />
              </View>
              <Text className="text-slate-400 font-medium text-center">
                No activity yet today.{"\n"}Ready to start?
              </Text>
            </View>
          ) : (
            attendance.map((item, index) => (
              <View
                key={item.id}
                className={`bg-white rounded-3xl p-5 mb-4 flex-row items-center shadow-sm border border-slate-100 ${index === 0 ? 'border-l-4 border-l-indigo-500' : ''}`}
              >
                <View className={`p-3 rounded-2xl mr-4 ${index === 0 ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                  <CheckCircle2 size={24} color={index === 0 ? '#6366f1' : '#94a3b8'} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-800 font-bold text-lg">{item.capture_time}</Text>
                  <Text className="text-slate-400 text-sm">Attendance Captured</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-[10px] font-bold uppercase">Success</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
