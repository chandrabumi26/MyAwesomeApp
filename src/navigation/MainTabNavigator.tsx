import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardCheck, Code2, User as UserIcon } from 'lucide-react-native';
import AttendanceScreen from '../screens/AttendanceScreen';
import PlaygroundScreen from '../screens/PlaygroundScreen';
import { MainTabParamList } from './types';
import UserPopup from '../components/UserPopup';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator({ route }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const user = route.params?.user;

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 80,
            paddingBottom: 25,
            paddingTop: 10,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: 'white',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="Attendance"
          component={AttendanceScreen}
          initialParams={{ user }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <ClipboardCheck size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Playground"
          component={PlaygroundScreen}
          initialParams={{ user }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Code2 size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="User"
          component={View} // Dummy component
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <UserIcon size={size || 24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      <UserPopup
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userData={user?.user_metadata || {}}
      />
    </>
  );
}
