import BottomNavbar from '@/components/BottomNavbar';
import { fetchCategory, fetchVenue } from '@/services/venueService';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dblawr8bm/image/upload/v1792169801/box-cricket/venues/memugxm4lgwr5j7bm8ax.png';

export default function Home() {
  const [location, setLocation] = useState('Detecting location...');
  const [category, setCategory] = useState<any[]>([]);
  const [venue, setVenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animated loading progress bar
  const [progressAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (loading) {
      animation = Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      progressAnim.setValue(0);
    }

    return () => {
      animation?.stop();
    };
  }, [loading, progressAnim]);

  const progressTranslate = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_WIDTH * 0.5, SCREEN_WIDTH],
      }),
    [progressAnim]
  );

  // 1. Fetch Location
  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setLocation('Location permission denied');
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = position.coords;
        const result = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const addr = result[0];
        const locationName = [addr?.street, addr?.district, addr?.city]
          .filter(Boolean)
          .filter(
            (value, index, array) =>
              array.findIndex(
                (item) => item?.toLowerCase() === value?.toLowerCase()
              ) === index
          )
          .join(', ');

        if (isMounted) {
          setLocation(locationName || 'Location not found');
        }
      } catch (err) {
        console.log('Error fetching location:', err);
        if (isMounted) setLocation('Failed to fetch location');
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch categories and venues
  const loadData = () => {
    return Promise.all([fetchCategory(), fetchVenue()])
      .then(([categoryData, venueData]) => {
        setCategory(categoryData || []);
        setVenue(venueData || []);
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });
  };

  useEffect(() => {
    let isMounted = true;

    loadData().finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    loadData().finally(() => {
      setRefreshing(false);
      setLoading(false);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Location Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.locationBox}>
            <Image
              source={require('../../assets/images/pin.png')}
              style={styles.pinIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
          <Image
            source={require('../../assets/images/Notifications.png')}
            resizeMode="contain"
            style={styles.notificationIcon}
          />
        </View>
      </View>

      {/* Animated Linear Loading Bar */}
      {loading && (
        <View style={styles.loadingBarTrack}>
          <Animated.View
            style={[
              styles.loadingBarIndicator,
              {
                transform: [{ translateX: progressTranslate }],
              },
            ]}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#183D30', '#10B981']}
            tintColor="#183D30"
          />
        }
      >
        {/* Category Horizontal Row */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {category.map((cat: any, index: number) => (
            <View key={cat.id || index} style={styles.categoryContent}>
              <TouchableOpacity>
                <Text style={styles.categoryText}>{cat.category_name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Venues List Container */}
        <View style={styles.venueSection}>
          <Text style={styles.sectionTitle}>Box Cricket & Sports Venues</Text>

          {/* Loading State or Empty State or List */}
          {loading && venue.length === 0 ? (
            <View style={styles.loadingStateContainer}>
              <ActivityIndicator size="large" color="#183D30" />
              <Text style={styles.loadingStateText}>
                Fetching turfs & venues near you...
              </Text>
            </View>
          ) : venue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="football-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Venues Found</Text>
              <Text style={styles.emptySub}>
                Please pull down to refresh or check back later.
              </Text>
            </View>
          ) : (
            venue.map((item: any, index: number) => {
              const venueName =
                item.name || item.venue_name || 'Box Cricket Turf';
              const imageUri = item.imageUrl || DEFAULT_IMAGE;
              const amenities = item.venue_amenities || [];
              const court =
                item.courts && item.courts.length > 0 ? item.courts[0] : null;

              // Calculate starting price from court min_price or pricing rules
              const startingPrice =
                court?.min_price ||
                court?.pricing_rules?.[0]?.price ||
                1000;

              return (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.venueCard}
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push({
                      pathname: '/Venuedetails',
                      params: { id: String(item.id) },
                    })
                  }
                >
                  {/* 1. Hero Image with Badges */}
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.venueImage}
                      resizeMode="cover"
                    />

                    {/* Active / Closed Badge (Top Right) */}
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: item.is_active
                            ? 'rgba(16, 185, 129, 0.9)'
                            : 'rgba(239, 68, 68, 0.9)',
                        },
                      ]}
                    >
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>
                        {item.is_active ? 'Open Now' : 'Closed'}
                      </Text>
                    </View>
                  </View>

                  {/* 2. Card Body Details */}
                  <View style={styles.cardBody}>
                    {/* Venue Name */}
                    <Text style={styles.venueTitle} numberOfLines={1}>
                      {venueName}
                    </Text>

                    {/* Address */}
                    <View style={styles.row}>
                      <Ionicons name="location-sharp" size={15} color="#10B981" />
                      <Text style={styles.addressText} numberOfLines={1}>
                        {item.address || 'Ahmedabad, Gujarat'}
                      </Text>
                    </View>

                    {/* Timing & Court Name */}
                    <View style={styles.rowBetween}>
                      <View style={styles.row}>
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.timingText}>
                          {item.opening_time ? item.opening_time.slice(0, 5) : '06:00'} -{' '}
                          {item.closing_time ? item.closing_time.slice(0, 5) : '23:00'}
                        </Text>
                      </View>

                      {court?.court_name && (
                        <View style={styles.courtBadge}>
                          <Text style={styles.courtBadgeText} numberOfLines={1}>
                            🏟️ {court.court_name}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Amenities Chips */}
                    {amenities.length > 0 && (
                      <View style={styles.amenitiesRow}>
                        {amenities.slice(0, 3).map((amenity: string, idx: number) => (
                          <View key={idx} style={styles.amenityChip}>
                            <Text style={styles.amenityText}>{amenity}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* 3. Card Bottom Row: Price & Book Button */}
                    <View style={styles.cardFooter}>
                      <View>
                        <Text style={styles.priceLabel}>Starts at</Text>
                        <Text style={styles.priceAmount}>
                          ₹{startingPrice}{' '}
                          <Text style={styles.pricePerHour}>/ hour</Text>
                        </Text>
                      </View>

                      <View style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Book Slot</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },

  /* Top Bar */
  topBar: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  pinIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },

  /* Animated Linear Loading Bar */
  loadingBarTrack: {
    height: 3,
    width: '100%',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  loadingBarIndicator: {
    height: '100%',
    width: '45%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },

  /* Categories */
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  categoryContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  /* Venues Section */
  venueSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#183D30',
    marginBottom: 14,
  },

  /* Loading State Container */
  loadingStateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStateText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  /* Empty Container */
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },

  /* Venue Card */
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Card Body */
  cardBody: {
    padding: 14,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D30',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timingText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  courtBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  courtBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  /* Amenities */
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  amenityChip: {
    backgroundColor: '#F7F9F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amenityText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },

  /* Card Footer */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D30',
  },
  pricePerHour: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#183D30',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
