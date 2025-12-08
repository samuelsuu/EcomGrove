import { Tabs } from 'expo-router';
import React from 'react';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { backgroundColor, primaryColor } from '../../constants/GlobalConstant';


export default function TabLayout() {
 
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
       
        tabBarStyle: { height: 70, backgroundColor: backgroundColor, alignItems: 'center', justifyContent: 'center' },
       
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color="black" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account" color="black" />,
        }}
      />
    </Tabs>
  );
}
