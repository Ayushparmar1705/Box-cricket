import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchVenues, Venue } from '../services/venueService';

const DEFAULT_VENUE_IMAGE =
  'https://res.cloudinary.com/dblawr8bm/image/upload/v1792169801/box-cricket/venues/memugxm4lgwr5j7bm8ax.png';

export default function HomeScreen() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVenues = async (search: string = '') => {
    setLoading(true);
    try {
      const data = await fetchVenues(search);
      setVenues(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Notice', 'Unable to fetch venues.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchVenues('')
      .then((data) => {
        if (isMounted) {
          setVenues(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    Keyboard.dismiss();
    loadVenues(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    loadVenues('');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadVenues(searchQuery);
  }, [searchQuery]);

  const handleBookVenue = (venue: Venue) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch { }

    const title = venue.name || venue.venue_name || 'Venue';
    Alert.alert(
      'Book Slot',
      `Book slot at ${title}?\nTiming: ${venue.opening_time || '06:00:00'} - ${venue.closing_time || '23:00:00'}\nContact: ${venue.contact_number || venue.phone_number || 'N/A'}`
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('authToken');
          router.replace('/login');
        },
      },
    ]);
  };

  const renderVenueCard = ({ item }: { item: Venue }) => {
    const venueName = item.name || item.venue_name || 'Box Cricket Turf';
    const amenities = item.venue_amenities || item.amenities || [];
    const imageUri = item.imageUrl || DEFAULT_VENUE_IMAGE;

    return (
      <View style={styles.cardContainer}>
        {/* Venue Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.venueImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(10, 15, 13, 0.85)']}
            style={styles.imageGradientOverlay}
          />

          {/* Badges */}
          <View style={styles.imageTopBadgesRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {item.rating ? item.rating.toFixed(1) : '4.8'}
              </Text>
            </View>

            {item.is_active && (
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>Open Now</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.venueTitle} numberOfLines={1}>
            {venueName}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#10B981" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.address || 'Ahmedabad, Gujarat'}
            </Text>
          </View>

          {/* Amenities Chips */}
          {amenities.length > 0 && (
            <View style={styles.amenitiesRow}>
              {amenities.slice(0, 3).map((amenity, idx) => (
                <View key={idx} style={styles.amenityChip}>
                  <Text style={styles.amenityChipText}>{String(amenity).trim()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Row */}
          <View style={styles.cardActionRow}>
            <View style={styles.timingInfo}>
              <Ionicons name="time-outline" size={13} color="#94A3B8" />
              <Text style={styles.timingText}>
                {item.opening_time || '06:00:00'} - {item.closing_time || '23:00:00'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              activeOpacity={0.85}
              onPress={() => handleBookVenue(item)}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookButtonGradient}
              >
                <Text style={styles.bookButtonText}>Book Slot</Text>
                <Ionicons name="arrow-forward" size={14} color="#0A0F0D" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Ahmedabad 📍</Text>
            <Text style={styles.headerMainTitle}>Box Cricket Turfs</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Search Bar with Dedicated Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search (e.g. demo)..."
              placeholderTextColor="#475569"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearIconWrapper}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.85}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchButtonGradient}
            >
              <Ionicons name="search" size={15} color="#0A0F0D" />
              <Text style={styles.searchButtonText}>Search</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Venues List or Loading */}
        {loading ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Fetching venues...</Text>
          </View>
        ) : (
          <FlatList
            data={venues}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderVenueCard}
            contentContainerStyle={styles.venueList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#10B981"
                colors={['#10B981']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#475569" />
                <Text style={styles.emptyTitle}>No Venues Found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? `No venues match "${searchQuery}".`
                    : 'No active venues available at this time.'}
                </Text>
                {searchQuery.length > 0 && (
                  <TouchableOpacity style={styles.clearSearchBtn} onPress={handleClear}>
                    <Text style={styles.clearSearchBtnText}>Show All Venues</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F0D',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerSubtitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerMainTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121A15',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    height: '100%',
  },
  clearIconWrapper: {
    padding: 4,
  },
  searchButton: {
    borderRadius: 14,
    overflow: 'hidden',
    height: 48,
  },
  searchButtonGradient: {
    height: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  searchButtonText: {
    color: '#0A0F0D',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Venue List */
  venueList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  /* Venue Card */
  cardContainer: {
    backgroundColor: '#121A15',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFill,
  },
  imageTopBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(10, 15, 13, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratingText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  availableText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Card Content */
  cardContent: {
    padding: 16,
  },
  venueTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  locationText: {
    color: '#94A3B8',
    fontSize: 13,
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 12,
  },
  amenityChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  amenityChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  timingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timingText: {
    color: '#64748B',
    fontSize: 12,
  },
  bookButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  bookButtonText: {
    color: '#0A0F0D',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  clearSearchBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  clearSearchBtnText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
});
