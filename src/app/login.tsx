import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { login } from '../services/authService';

const { width } = Dimensions.get('window');

interface FormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // Graceful fallback
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSignIn = async () => {

    setErrorMessage(null);

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setErrorMessage('Please enter your email address');
      emailInputRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setErrorMessage('Please enter a valid email address');
      emailInputRef.current?.focus();
      return;
    }

    if (!formData.password) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setErrorMessage('Please enter your password');
      passwordInputRef.current?.focus();
      return;
    }

    if (formData.password.length < 6) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setErrorMessage('Password must be at least 6 characters');
      passwordInputRef.current?.focus();
      return;
    }

    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const result = await login(formData);
      setIsLoading(false);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      if (result) {
        router.replace('/home');
      }
    } catch (err: any) {
      setIsLoading(false);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Reset Password',
      'A password reset link will be sent to your registered email address.'
    );
  };

  const handleSignUpNavigation = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Create Account', 'Sign up screen will open here.');
  };

  const handleGuestExplore = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    router.push('/home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Ambient lighting backdrop with zIndex -1 so it never intercepts touches */}
        <View style={styles.ambientTopGlow} pointerEvents="none" />
        <View style={styles.ambientBottomGlow} pointerEvents="none" />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardContainer}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {/* Top Bar with Guest Access */}
              <View style={styles.topBar}>
                <View style={styles.venueBadge}>
                  <View style={styles.venueIndicatorDot} />
                  <Text style={styles.venueBadgeText}>TURF BOOKING SYSTEM</Text>
                </View>

                <TouchableOpacity
                  style={styles.guestLink}
                  onPress={handleGuestExplore}
                  activeOpacity={0.7}
                >
                  <Text style={styles.guestLinkText}>Browse Turfs</Text>
                  <Ionicons name="arrow-forward" size={13} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Header / Brand Identity */}
              <View style={styles.headerSection}>
                <View style={styles.brandIconWrapper}>
                  <LinearGradient
                    colors={['#10B981', '#065F46']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.brandIconGradient}
                  >
                    <MaterialCommunityIcons name="cricket" size={28} color="#FFFFFF" />
                  </LinearGradient>
                </View>

                <Text style={styles.mainTitle}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in to manage your box cricket reservations, match fixtures & team slots.
                </Text>
              </View>

              {/* Main Login Card */}
              <View style={styles.loginCard}>
                {/* Error Banner */}
                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color="#EF4444" />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                  <Pressable
                    style={[
                      styles.inputFieldContainer,
                      focusedField === 'email' && styles.inputFieldFocused,
                    ]}
                    onPress={() => emailInputRef.current?.focus()}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={19}
                      color={focusedField === 'email' ? '#10B981' : '#64748B'}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      ref={emailInputRef}
                      style={styles.inputControl}
                      placeholder="player@boxcricket.com"
                      placeholderTextColor="#475569"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      selectionColor="#10B981"
                      cursorColor="#10B981"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => passwordInputRef.current?.focus()}
                      value={formData.email}
                      onChangeText={(val) => handleChange('email', val)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {formData.email.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          handleChange('email', '');
                          emailInputRef.current?.focus();
                        }}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Ionicons name="close-circle" size={18} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </Pressable>
                </View>

                {/* Password Input */}
                <View style={[styles.inputGroup, { marginTop: 18 }]}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>PASSWORD</Text>
                    <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>

                  <Pressable
                    style={[
                      styles.inputFieldContainer,
                      focusedField === 'password' && styles.inputFieldFocused,
                    ]}
                    onPress={() => passwordInputRef.current?.focus()}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={19}
                      color={focusedField === 'password' ? '#10B981' : '#64748B'}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.inputControl}
                      placeholder="Enter your password"
                      placeholderTextColor="#475569"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
                      selectionColor="#10B981"
                      cursorColor="#10B981"
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                      value={formData.password}
                      onChangeText={(val) => handleChange('password', val)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={19}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </Pressable>
                </View>

                {/* Remember Me Checkbox */}
                <TouchableOpacity
                  style={styles.rememberRow}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setRememberMe(!rememberMe);
                  }}
                >
                  <View style={[styles.customCheckbox, rememberMe && styles.customCheckboxActive]}>
                    {rememberMe && <Ionicons name="checkmark-sharp" size={12} color="#0A0F0D" />}
                  </View>
                  <Text style={styles.rememberText}>Keep me signed in on this device</Text>
                </TouchableOpacity>

                {/* Primary Sign In Button */}
                <TouchableOpacity
                  style={styles.signInButtonContainer}
                  activeOpacity={0.88}
                  onPress={handleSignIn}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.signInButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#0A0F0D" size="small" />
                    ) : (
                      <>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={17} color="#0A0F0D" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Registration Footer */}
              <View style={styles.footerSection}>
                <Text style={styles.footerPrompt}>
                  Don’t have an account?{' '}
                  <Text style={styles.signUpLink} onPress={handleSignUpNavigation}>
                    Create an account
                  </Text>
                </Text>

                {/* Security & Support Note */}
                <View style={styles.securityIndicator}>
                  <Ionicons name="shield-checkmark-outline" size={14} color="#64748B" />
                  <Text style={styles.securityText}>
                    Secure 256-bit encrypted authentication
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Ambient light gradients */
  ambientTopGlow: {
    position: 'absolute',
    top: -80,
    left: width * 0.1,
    width: width * 0.8,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#10B981',
    opacity: 0.12,
    transform: [{ scaleX: 1.4 }],
    zIndex: -1,
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#047857',
    opacity: 0.08,
    zIndex: -1,
  },

  /* Top Navigation Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  venueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  venueIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  venueBadgeText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  guestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  guestLinkText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },

  /* Brand / Header */
  headerSection: {
    marginBottom: 24,
  },
  brandIconWrapper: {
    marginBottom: 16,
  },
  brandIconGradient: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  /* Login Card */
  loginCard: {
    backgroundColor: '#121A15',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },

  /* Error Banner */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  /* Form Inputs */
  inputGroup: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0F0D',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFieldFocused: {
    borderColor: '#10B981',
    backgroundColor: '#0D1511',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fieldIcon: {
    marginRight: 10,
  },
  inputControl: {
    flex: 1,
    height: '100%',
    color: '#F8FAFC',
    fontSize: 15,
    paddingVertical: 0,
  },

  /* Remember Me */
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCheckboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  rememberText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
  },

  /* Primary Button */
  signInButtonContainer: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  signInButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInButtonText: {
    color: '#0A0F0D',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* Footer */
  footerSection: {
    marginTop: 28,
    alignItems: 'center',
    gap: 14,
  },
  footerPrompt: {
    color: '#94A3B8',
    fontSize: 14,
  },
  signUpLink: {
    color: '#10B981',
    fontWeight: '700',
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
});
