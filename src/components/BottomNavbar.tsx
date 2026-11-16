import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabType = 'home' | 'explore' | 'bookings' | 'profile';

interface BottomNavbarProps {
  activeTab?: TabType;
}

export default function BottomNavbar({ activeTab = 'home' }: BottomNavbarProps) {
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: TabType) => {
    if (tab === activeTab) return;

    switch (tab) {
      case 'home':
        router.push('/home');
        break;
      case 'explore':
        router.push('/home');
        break;
      case 'bookings':
        router.push('/bookings');
        break;
      case 'profile':
        router.push('/profile');
        break;
    }
  };

  const tabs: {
    id: TabType;
    label: string;
    iconActive: keyof typeof Ionicons.glyphMap;
    iconInactive: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      iconActive: 'home',
      iconInactive: 'home-outline',
    },
    {
      id: 'explore',
      label: 'Explore',
      iconActive: 'compass',
      iconInactive: 'compass-outline',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      iconActive: 'calendar',
      iconInactive: 'calendar-outline',
    },
    {
      id: 'profile',
      label: 'Profile',
      iconActive: 'person',
      iconInactive: 'person-outline',
    },
  ];

  return (
    <View style={[styles.navbarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab.id)}
            >
              {/* Active Tab Accent Pill / Icon */}
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.iconInactive}
                  size={22}
                  color={isActive ? '#183D30' : '#8E8E93'}
                />
              </View>

              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>

              {/* Active Bottom Dot */}
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconWrapperActive: {
    backgroundColor: '#E8F5E9',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#183D30',
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#183D30',
    marginTop: 3,
  },
});
