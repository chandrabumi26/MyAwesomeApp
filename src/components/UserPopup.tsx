import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import { LogOut, X, User } from 'lucide-react-native';
import { supabase } from '../lib/supabaes';

interface UserPopupProps {
  visible: boolean;
  onClose: () => void;
  userData: any;
}

const { height } = Dimensions.get('window');

export default function UserPopup({ visible, onClose, userData }: UserPopupProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl">
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-slate-200 rounded-full mb-8" />
                
                <View className="bg-slate-100 p-4 rounded-full mb-4">
                  <User size={48} color="#64748b" />
                </View>

                <Text className="text-2xl font-bold text-slate-800">
                  {userData?.full_name || 'User Profile'}
                </Text>
                <Text className="text-slate-500 mb-8">{userData?.email || ''}</Text>
              </View>

              <View className="space-y-4">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="bg-red-50 py-5 rounded-3xl flex-row justify-center items-center active:bg-red-100 border border-red-100"
                >
                  <LogOut size={24} color="#ef4444" className="mr-3" />
                  <Text className="text-red-500 font-bold text-lg">Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  className="mt-4 bg-slate-50 py-5 rounded-3xl flex-row justify-center items-center active:bg-slate-100"
                >
                  <Text className="text-slate-500 font-bold text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
