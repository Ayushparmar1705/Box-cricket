import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const token =
          (await AsyncStorage.getItem('token')) ||
          (await AsyncStorage.getItem('authToken'));

        if (isMounted) {
          setIsAuthenticated(Boolean(token));
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show a theme-consistent loading screen while checking storage
  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // If token is found, open Home page; otherwise open Login page
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0F0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
