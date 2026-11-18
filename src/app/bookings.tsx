import BottomNavbar from '@/components/BottomNavbar';
import { getUserBookings } from '@/services/bookingService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING'>('ALL');

  // Load bookings from Backend API (with local fallback)
  const fetchMyBookings = async () => {
    try {
      // 1. Get logged-in user id
      let currentUserId = 1;
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        currentUserId = parsed?.user?.id || parsed?.id || 1;
      }

      // 2. Fetch directly from database backend API
      const remoteBookings = await getUserBookings(currentUserId);
      setBookings(Array.isArray(remoteBookings) ? remoteBookings : []);
    } catch (err) {
      console.warn('Error loading bookings from database:', err);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Clear old offline mock cache so only real database bookings appear
    AsyncStorage.removeItem('user_bookings').catch(() => {});
    fetchMyBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return (b.bookingStatus || b.booking_status || 'PENDING').toUpperCase() === activeFilter;
  });

  const renderBookingItem = ({ item }: { item: any }) => {
    const status = (item.bookingStatus || item.booking_status || 'PENDING').toUpperCase();
    const isConfirmed = status === 'CONFIRMED';
    const bookingId = item.id || item.bookingid || item.bookingId || 'N/A';
    const venueName = item.venueName || item.venue_name || (item.venueId ? `Venue #${item.venueId}` : 'Box Cricket Turf');
    const courtName = item.courtName || item.court_name || (item.courtId ? `Court #${item.courtId}` : 'Pitch 1');
    const date = item.bookingDate || item.booking_date || item.date || 'N/A';
    const time =
      item.timeSlot ||
      (item.startTime && item.endTime
        ? `${item.startTime} - ${item.endTime}`
        : item.startTime
        ? `${item.startTime} (${item.duration || 1} hr)`
        : 'Time N/A');
    const price = item.total || item.totalPrice || item.total_price || item.totalAmount || item.price || 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.idBox}>
            <Text style={styles.idText}>#BC-{bookingId}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isConfirmed ? '#ECFDF5' : '#FFFBEB' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConfirmed ? '#10B981' : '#F59E0B' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isConfirmed ? '#065F46' : '#B45309' },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        <Text style={styles.venueTitle}>{venueName}</Text>
        <Text style={styles.courtSub}>{courtName}</Text>

        {/* Venue ID & Court ID Badges */}
        <View style={styles.idChipRow}>
          <View style={styles.idChip}>
            <Ionicons name="business-outline" size={12} color="#183D30" />
            <Text style={styles.idChipText}>Venue ID: {item.venueId || item.venue_id || 'N/A'}</Text>
          </View>
          <View style={styles.idChip}>
            <Ionicons name="tennisball-outline" size={12} color="#183D30" />
            <Text style={styles.idChipText}>Court ID: {item.courtId || item.court_id || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>{time}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{price}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="reload" size={18} color="#183D30" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'CONFIRMED', 'PENDING'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.filterTabTextActive,
              ]}
            >
              {filter === 'ALL' ? 'All' : filter === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#183D30" />
          <Text style={styles.loadingText}>Loading your bookings...</Text>
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="calendar-outline" size={54} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Bookings Found</Text>
          <Text style={styles.emptySub}>
            {"You haven't made any bookings yet. Book a court to get started!"}
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.exploreBtnText}>Explore Turfs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item, index) => String(item.bookingid || item.id || index)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#183D30']}
            />
          }
        />
      )}

      {/* Bottom Navbar */}
      <BottomNavbar activeTab="bookings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#183D30',
  },
  refreshBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#183D30',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  venueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183D30',
  },
  courtSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  idChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  idChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#183D30',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 18,
    backgroundColor: '#183D30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
