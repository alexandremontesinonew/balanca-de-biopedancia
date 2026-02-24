import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/theme';

function HomeIcon({ color }: { color: string }) {
  return (
    <MaterialCommunityIcons
      name="home"
      size={26}
      color={color}
    />
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <MaterialCommunityIcons
      name="cog-outline"
      size={26}
      color={color}
    />
  );
}

function PlusTabButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.fabWrapper}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => <PlusTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
  },
  fabWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.fab,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
