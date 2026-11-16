import BottomNavbar from '@/components/BottomNavbar';
import { clearAuthData } from '@/utils/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem('userData')
      .then((stored) => {
        if (stored && isMounted) {
          setUserData(JSON.parse(stored));
        }
      })
      .catch((e) => console.warn('Failed to load user data', e));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Box Cricket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuthData();
          router.replace('/login');
        },
      },
    ]);
  };

  const userName =
    userData?.user?.name || userData?.name || userData?.username || 'Box Cricket Player';
  const userPhone = userData?.user?.phone || userData?.phone || '+91 98765 43210';
  const userEmail = userData?.user?.email || userData?.email || 'player@boxcricket.com';
  const userRole = userData?.user?.role || userData?.role || 'PLAYER';

  const menuItems = [
    {
      icon: 'calendar-outline' as const,
      title: 'My Bookings',
      subtitle: 'View upcoming & past games',
      onPress: () => router.push('/bookings'),
    },
    {
      icon: 'heart-outline' as const,
      title: 'Saved Turfs',
      subtitle: 'Your favorite venues',
      onPress: () => router.push('/home'),
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Notifications',
      subtitle: 'Match updates & offers',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Help & Support',
      subtitle: 'FAQs, contact turf admin',
      onPress: () => Alert.alert('Support', 'Contact us at support@boxcricket.com'),
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Privacy & Terms',
      subtitle: 'Terms of service & booking rules',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {userName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userPhone}>{userPhone}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{userRole}</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon} size={20} color="#183D30" />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Box Cricket App · v1.0.0</Text>
      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#183D30',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#183D30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#183D30',
  },
  userPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
  },
});
