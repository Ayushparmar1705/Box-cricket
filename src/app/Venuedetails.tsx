import { venueDescription } from '@/services/venueService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_CONTAINER_WIDTH = SCREEN_WIDTH - 32;

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dblawr8bm/image/upload/v1792169801/box-cricket/venues/memugxm4lgwr5j7bm8ax.png';

// Format Date as DD-MM-YYYY (e.g. 15-11-2026)
const formatDDMMYYYY = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function Venuedetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selected Court index (0 for Court 1, 1 for Court 2, etc.)
  const [selectedCourtIndex, setSelectedCourtIndex] = useState(0);

  // Slider image state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageSliderRef = useRef<any>(null);

  // Booking Modal & State (Matches Date & Time + Duration format)
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    formatDDMMYYYY(new Date())
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(1);

  // Dropdown/picker visibility
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  // Booking confirmation modal
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    venueDescription(Number(id))
      .then((data) => {
        if (isMounted) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('Error fetching venue details:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fallback courts if venue has no courts in backend
  const courts = useMemo(() => {
    if (result?.courts && result.courts.length > 0) {
      return result.courts;
    }
    return [
      {
        id: 1,
        court_name: 'Court 1 · Premier',
        max_players: 8,
        surface_type: 'TURF',
        min_price: 1200,
      },
      {
        id: 2,
        court_name: 'Court 2 · Classic',
        max_players: 8,
        surface_type: 'TURF',
        min_price: 1000,
      },
    ];
  }, [result]);

  // Selected court object
  const currentCourt = courts[selectedCourtIndex] || courts[0];

  // Images for the image slider (from court images or venue image)
  const displayImages = useMemo(() => {
    const list: string[] = [];

    // Check if current court has images
    if (currentCourt?.image_urls && currentCourt.image_urls.length > 0) {
      list.push(...currentCourt.image_urls);
    } else if (currentCourt?.images && currentCourt.images.length > 0) {
      currentCourt.images.forEach((img: any) => {
        const url = typeof img === 'string' ? img : img?.image_url;
        if (url) list.push(url);
      });
    }

    // Fallback to venue image or default
    if (list.length === 0) {
      list.push(result?.imageUrl || DEFAULT_IMAGE);
    }
    return list;
  }, [currentCourt, result]);

  // Handler when user selects a court
  const handleSelectCourt = (index: number) => {
    setSelectedCourtIndex(index);
    setActiveImageIndex(0);
    imageSliderRef.current?.scrollTo({ x: 0, animated: false });
  };

  // Generate next 14 upcoming dates formatted as DD-MM-YYYY
  const upcomingDates = useMemo(() => {
    const list = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const dateStr = formatDDMMYYYY(d);
      let dayName = daysOfWeek[d.getDay()];
      if (i === 0) dayName = 'Today';
      else if (i === 1) dayName = 'Tomorrow';

      list.push({
        dateStr,
        label: `${dateStr} (${dayName})`,
      });
    }
    return list;
  }, []);

  // Generate hourly start times based on opening and closing hours
  const availableStartTimes = useMemo(() => {
    let startHour = 6; // Default 6:00 AM
    let endHour = 23; // Default 11:00 PM

    if (result?.opening_time) {
      const parsed = parseInt(result.opening_time.split(':')[0], 10);
      if (!isNaN(parsed)) startHour = parsed;
    }
    if (result?.closing_time) {
      const parsed = parseInt(result.closing_time.split(':')[0], 10);
      if (!isNaN(parsed)) endHour = parsed;
    }

    const times: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      const formatTime = (hour: number) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const display = hour % 12 || 12;
        return `${display < 10 ? '0' : ''}${display}:00 ${period}`;
      };
      times.push(formatTime(h));
    }
    return times;
  }, [result]);

  // Calculate End Time given Start Time and Duration (in hours)
  const calculateEndTime = (startTime: string, hours: number) => {
    if (!startTime) return '';
    const [timePart, period] = startTime.split(' ');
    const [hrStr, minStr] = timePart.split(':');
    let h = parseInt(hrStr, 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    const endH = (h + hours) % 24;
    const endPeriod = endH >= 12 ? 'PM' : 'AM';
    const endDisplay = endH % 12 || 12;
    return `${endDisplay < 10 ? '0' : ''}${endDisplay}:${minStr} ${endPeriod}`;
  };

  // Format closing time for display
  const formatedClosingTime = (time: string) => {
    if (!time) return '11:00 PM';
    const [hours, minute] = time.split(':');
    const hour = Number(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formatedHour = hour % 12 || 12;
    return `${formatedHour}:${minute || '00'} ${period}`;
  };

  // Share venue link
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${result?.name || 'this venue'} on Box Cricket App!`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Open Google Maps
  const handleOpenMap = () => {
    if (result?.google_map_link) {
      Linking.openURL(result.google_map_link);
    } else if (result?.address) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.address)}`
      );
    }
  };

  // Open booking modal
  const handleOpenBookingModal = () => {
    setIsBookingModalVisible(true);
  };

  // Court hourly rate & total price
  const courtHourlyRate =
    currentCourt?.min_price || currentCourt?.pricing_rules?.[0]?.price || 1000;
  const totalPrice = courtHourlyRate * durationHours;

  // Confirm booking action (Local booking - no backend dependency)
  const handleConfirmBooking = async () => {
    const timeToUse = selectedStartTime || availableStartTimes[0] || '06:00 PM';
    const endTime = calculateEndTime(timeToUse, durationHours);
    const displayTimeSlot = `${timeToUse} - ${endTime} (${durationHours} ${durationHours === 1 ? 'hour' : 'hours'})`;

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const bookingDetails = {
      bookingId: `BC-${randomId}`,
      venueName: result?.name || 'Box Cricket Venue',
      courtName: currentCourt?.court_name || `Court ${selectedCourtIndex + 1}`,
      date: selectedDateStr,
      timeSlot: displayTimeSlot,
      duration: `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`,
      price: totalPrice,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // Save locally in AsyncStorage so it appears in My Bookings
    try {
      const stored = await AsyncStorage.getItem('user_bookings');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(bookingDetails);
      await AsyncStorage.setItem('user_bookings', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save booking locally', e);
    }

    setIsBookingModalVisible(false);
    setBookingSuccessData(bookingDetails);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#183D30" />
        <Text style={styles.loadingText}>Loading venue details...</Text>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.loadingText}>Venue not found</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Default amenities if none in backend
  const amenities =
    result.venue_amenities && result.venue_amenities.length > 0
      ? result.venue_amenities
      : ['Free parking', 'Floodlights', 'Equipment', 'Drinking water'];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#183D30" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue details</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color="#183D30" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 2. Court Images Slider */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={imageSliderRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / IMAGE_CONTAINER_WIDTH);
              setActiveImageIndex(index);
            }}
          >
            {displayImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Rating Pill (Bottom Left) */}
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={13} color="#183D30" />
            <Text style={styles.ratingPillText}>4.8 (124 reviews)</Text>
          </View>

          {/* Image Counter (Bottom Right) */}
          <View style={styles.counterPill}>
            <Text style={styles.counterPillText}>
              {activeImageIndex + 1} / {displayImages.length}
            </Text>
          </View>
        </View>

        {/* Operating Hours */}
        <Text style={styles.closingTimeText}>
          Open until {formatedClosingTime(result.closing_time)}
        </Text>

        {/* 3. Venue Title & Info */}
        <View style={styles.venueInfoSection}>
          <Text style={styles.venueName}>{result.name || 'The Pavilion Arena'}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={15} color="#888888" />
            <Text style={styles.locationText} numberOfLines={1}>
              {result.address || 'Indiranagar, Bengaluru · 2.4 km'}
            </Text>
          </View>

          <Text style={styles.descriptionText}>
            {result.description ||
              'A great pitch. A better evening. Play under the lights on our premium, fully netted turf.'}
          </Text>
        </View>

        {/* 4. Pick Your Pitch (Courts) Section */}
        <View style={styles.pitchSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pick your pitch</Text>
            <Text style={styles.courtCountText}>{courts.length} courts</Text>
          </View>

          {/* Court Cards */}
          {courts.map((court: any, index: number) => {
            const isSelected = selectedCourtIndex === index;
            const courtPrice = court.min_price || court.pricing_rules?.[0]?.price || 1000;
            const courtNumber = index < 9 ? `0${index + 1}` : `${index + 1}`;

            return (
              <TouchableOpacity
                key={court.id || index}
                style={[styles.courtCard, isSelected && styles.courtCardSelected]}
                activeOpacity={0.85}
                onPress={() => handleSelectCourt(index)}
              >
                {/* Left Number Box */}
                <View style={[styles.numberBox, isSelected && styles.numberBoxActive]}>
                  <Text style={[styles.numberText, isSelected && styles.numberTextActive]}>
                    {courtNumber}
                  </Text>
                </View>

                {/* Center Court Details */}
                <View style={styles.courtDetails}>
                  <Text style={styles.courtNameText}>
                    {court.court_name || `Court ${index + 1} · Premier`}
                  </Text>
                  <Text style={styles.courtSubText}>
                    {court.max_players ? `${court.max_players} players` : '6–8 players'} ·{' '}
                    {court.surface_type || 'TURF'}
                  </Text>
                </View>

                {/* Right Price */}
                <View style={styles.courtPriceBox}>
                  <Text style={styles.courtPriceText}>₹{courtPrice}</Text>
                  <Text style={styles.courtHourText}>/ hour</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. Good To Know (Amenities & Location) Section */}
        <View style={styles.goodToKnowSection}>
          <Text style={styles.sectionTitle}>Good to know</Text>

          {/* 2-Column Amenities Grid */}
          <View style={styles.amenitiesGrid}>
            {amenities.map((amenity: string, idx: number) => {
              let iconName: any = 'checkmark';
              const lower = String(amenity).toLowerCase();
              if (lower.includes('park')) iconName = 'car-outline';
              else if (lower.includes('light')) iconName = 'flash-outline';
              else if (lower.includes('water')) iconName = 'water-outline';

              return (
                <View key={idx} style={styles.amenityItem}>
                  <Ionicons name={iconName} size={18} color="#183D30" style={styles.amenityIcon} />
                  <Text style={styles.amenityName}>{amenity}</Text>
                </View>
              );
            })}
          </View>

          {/* Address Card */}
          <TouchableOpacity style={styles.addressCard} activeOpacity={0.8} onPress={handleOpenMap}>
            <View style={styles.addressIconCircle}>
              <Ionicons name="location-sharp" size={18} color="#183D30" />
            </View>
            <View style={styles.addressTextBox}>
              <Text style={styles.addressTitle} numberOfLines={1}>
                {result.address ? result.address.split(',')[0] : '12th Main Road, Indiranagar'}
              </Text>
              <Text style={styles.addressSub} numberOfLines={1}>
                {result.address || 'Bengaluru, Karnataka 560038'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#888888" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 6. Bottom Sticky Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>From ₹{courtHourlyRate}</Text>
          <Text style={styles.bottomSub}>per hour</Text>
        </View>

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={handleOpenBookingModal}>
          <Text style={styles.bookBtnText}>Book a court</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* ======================================================== */}
      {/* 7. BOOK SLOT MODAL (Matches user's exact format)          */}
      {/* ======================================================== */}
      <Modal
        visible={isBookingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Book Your Slot</Text>
                <Text style={styles.modalSubtitle}>{result.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsBookingModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#183D30" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {/* Pitch Selection Tabs */}
              <Text style={styles.modalSectionLabel}>Select Pitch</Text>
              <View style={styles.courtTabsRow}>
                {courts.map((court: any, idx: number) => {
                  const isCourtSelected = selectedCourtIndex === idx;
                  const price = court.min_price || court.pricing_rules?.[0]?.price || 1000;
                  return (
                    <TouchableOpacity
                      key={court.id || idx}
                      style={[styles.courtTab, isCourtSelected && styles.courtTabSelected]}
                      onPress={() => handleSelectCourt(idx)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.courtTabText,
                          isCourtSelected && styles.courtTabTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {court.court_name || `Court ${idx + 1}`}
                      </Text>
                      <Text
                        style={[
                          styles.courtTabPrice,
                          isCourtSelected && styles.courtTabPriceSelected,
                        ]}
                      >
                        ₹{price}/hr
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Exact format: Date & Time Section */}
              <Text style={styles.dateTimeSectionTitle}>Date & Time</Text>
              <View style={styles.dateTimeRow}>
                {/* Date Input Box */}
                <TouchableOpacity
                  style={styles.datePickerInput}
                  activeOpacity={0.8}
                  onPress={() => setIsDatePickerVisible(true)}
                >
                  <Text style={styles.dateInputText}>{selectedDateStr}</Text>
                  <Ionicons name="calendar-outline" size={18} color="#111827" />
                </TouchableOpacity>

                {/* Time Input Box */}
                <TouchableOpacity
                  style={styles.timePickerInput}
                  activeOpacity={0.8}
                  onPress={() => setIsTimePickerVisible(true)}
                >
                  <Text style={styles.timeInputText}>
                    {selectedStartTime || '-- : --'}
                  </Text>
                  <View style={styles.timeIconWrapper}>
                    <Ionicons name="time" size={18} color="#000000" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Exact format: Duration Row */}
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Duration</Text>

                <View style={styles.durationControls}>
                  <TouchableOpacity
                    style={[
                      styles.durationCircleBtn,
                      durationHours <= 1 && styles.durationBtnDisabled,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  <Text style={styles.durationValueText}>
                    {durationHours} {durationHours === 1 ? 'hour' : 'hours'}
                  </Text>

                  <TouchableOpacity
                    style={styles.durationCircleBtn}
                    activeOpacity={0.7}
                    onPress={() => setDurationHours((prev) => prev + 1)}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Exact format: Minimum booking subtext */}
              <Text style={styles.minimumBookingText}>
                Minimum Booking of 1 hour is required
              </Text>

              {/* Divider */}
              <View style={styles.formDivider} />

              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Pitch</Text>
                  <Text style={styles.summaryValue}>
                    {currentCourt?.court_name || `Court ${selectedCourtIndex + 1}`}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>{selectedDateStr}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedStartTime
                      ? `${selectedStartTime} - ${calculateEndTime(selectedStartTime, durationHours)}`
                      : 'Please select time'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration</Text>
                  <Text style={styles.summaryValue}>
                    {durationHours} {durationHours === 1 ? 'hour' : 'hours'}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>₹{totalPrice}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Bottom CTA */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.confirmBtn}
                activeOpacity={0.85}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmBtnText}>Confirm Booking · ₹{totalPrice}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 8. DATE PICKER SELECTOR MODAL                            */}
      {/* ======================================================== */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setIsDatePickerVisible(false)}>
                <Ionicons name="close" size={20} color="#183D30" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {upcomingDates.map((item, idx) => {
                const isSelected = selectedDateStr === item.dateStr;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                    onPress={() => {
                      setSelectedDateStr(item.dateStr);
                      setIsDatePickerVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        isSelected && styles.pickerItemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color="#183D30" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 9. TIME PICKER SELECTOR MODAL                            */}
      {/* ======================================================== */}
      <Modal
        visible={isTimePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTimePickerVisible(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Start Time</Text>
              <TouchableOpacity onPress={() => setIsTimePickerVisible(false)}>
                <Ionicons name="close" size={20} color="#183D30" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              <View style={styles.timeGrid}>
                {availableStartTimes.map((time, idx) => {
                  const isSelected = selectedStartTime === time;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                      onPress={() => {
                        setSelectedStartTime(time);
                        setIsTimePickerVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          isSelected && styles.timeChipTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 10. BOOKING SUCCESS CONFIRMATION MODAL                   */}
      {/* ======================================================== */}
      <Modal
        visible={!!bookingSuccessData}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBookingSuccessData(null)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            {/* Big Success Icon */}
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            </View>

            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSubtitle}>
              Your slot has been reserved successfully.
            </Text>

            {/* Ticket Details */}
            <View style={styles.ticketBox}>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Booking ID</Text>
                <Text style={styles.ticketBadge}>{bookingSuccessData?.bookingId}</Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Venue</Text>
                <Text style={styles.ticketValue} numberOfLines={1}>
                  {bookingSuccessData?.venueName}
                </Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Court</Text>
                <Text style={styles.ticketValue}>{bookingSuccessData?.courtName}</Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Date</Text>
                <Text style={styles.ticketValue}>{bookingSuccessData?.date}</Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Slot</Text>
                <Text style={styles.ticketValue}>{bookingSuccessData?.timeSlot}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Total Amount</Text>
                <Text style={styles.ticketTotal}>₹{bookingSuccessData?.price}</Text>
              </View>
            </View>

            {/* Done CTA */}
            <TouchableOpacity
              style={styles.successDoneBtn}
              activeOpacity={0.85}
              onPress={() => setBookingSuccessData(null)}
            >
              <Text style={styles.successDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  goBackBtn: {
    marginTop: 16,
    backgroundColor: '#183D30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  goBackBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#183D30',
  },

  /* Scroll Content */
  scrollContent: {
    paddingBottom: 20,
  },

  /* Court Images Slider */
  imageContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#E5E7EB',
  },
  heroImage: {
    width: IMAGE_CONTAINER_WIDTH,
    height: 220,
  },
  ratingPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#183D30',
  },
  counterPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  counterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#183D30',
  },
  closingTimeText: {
    marginLeft: 16,
    fontSize: 13,
    color: '#183D30',
    fontWeight: '600',
    marginTop: 10,
  },

  /* Venue Info */
  venueInfoSection: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#183D30',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
    marginTop: 8,
  },

  /* Pick Your Pitch */
  pitchSection: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D30',
  },
  courtCountText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  courtCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  courtCardSelected: {
    borderColor: '#183D30',
    backgroundColor: '#FAFAF9',
  },
  numberBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberBoxActive: {
    backgroundColor: '#D9F99D',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  numberTextActive: {
    color: '#183D30',
  },
  courtDetails: {
    flex: 1,
  },
  courtNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183D30',
  },
  courtSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  courtPriceBox: {
    alignItems: 'flex-end',
  },
  courtPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D30',
  },
  courtHourText: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  /* Good To Know */
  goodToKnowSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  amenityItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  amenityIcon: {
    marginRight: 8,
  },
  amenityName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F7',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTextBox: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183D30',
  },
  addressSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  /* Bottom Bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: '#183D30',
  },
  bottomSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#183D30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D30',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183D30',
    marginBottom: 10,
  },

  /* Court Tabs */
  courtTabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  courtTab: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  courtTabSelected: {
    borderColor: '#183D30',
    backgroundColor: '#F0FDF4',
  },
  courtTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  courtTabTextSelected: {
    color: '#183D30',
  },
  courtTabPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  courtTabPriceSelected: {
    color: '#10B981',
    fontWeight: '700',
  },

  /* Date & Time exact format matching uploaded image */
  dateTimeSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 18,
    marginBottom: 10,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  datePickerInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  dateInputText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  timePickerInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingLeft: 12,
    paddingRight: 6,
  },
  timeInputText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  timeIconWrapper: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Duration section matching uploaded image */
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  durationCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3D2D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBtnDisabled: {
    opacity: 0.5,
  },
  durationValueText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    minWidth: 55,
    textAlign: 'center',
  },
  minimumBookingText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  formDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    marginBottom: 10,
  },

  /* Summary Card */
  summaryCard: {
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D30',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#183D30',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },

  /* Modal Footer */
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  confirmBtn: {
    backgroundColor: '#183D30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Pickers (Date / Time Selector Modal) */
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    maxHeight: 400,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183D30',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#374151',
  },
  pickerItemTextSelected: {
    color: '#183D30',
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeChipSelected: {
    backgroundColor: '#183D30',
    borderColor: '#183D30',
  },
  timeChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  timeChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Success Confirmation Modal */
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#183D30',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },
  ticketBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  ticketValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D30',
    maxWidth: '65%',
  },
  ticketBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ticketTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  successDoneBtn: {
    width: '100%',
    backgroundColor: '#183D30',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  successDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
