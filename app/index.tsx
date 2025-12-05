import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
// Import necessary React hooks and React Native components
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
// For navigation between screens
// For gradient background

// Get device dimensions (can be used for responsive design)
const { width, height } = Dimensions.get("window");

/**
 * SplashScreen Component
 * 
 * This is the initial screen shown when the app launches.
 * It displays the CatholicPay branding with smooth animations,
 * then automatically navigates to the login screen after 2.5 seconds.
 */
export default function SplashScreen() {
  // Initialize router for navigation
  const router = useRouter();
  
  // Create animated values for different animation effects
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity animation (0 to 1)
  const scaleAnim = useRef(new Animated.Value(0.3)).current; // Scale animation (0.3 to 1)
  const logoFadeAnim = useRef(new Animated.Value(0)).current; // Logo-specific fade (0 to 1)

  useEffect(() => {
    // Start animations when component mounts
    // Animated.parallel runs multiple animations simultaneously
    Animated.parallel([
      // Fade in animation - smoothly increases opacity
      Animated.timing(fadeAnim, {
        toValue: 1, // Final opacity value
        duration: 1000, // Animation duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
      // Spring animation - creates a bouncy scale effect
      Animated.spring(scaleAnim, {
        toValue: 1, // Final scale value (normal size)
        tension: 20, // Controls the spring's stiffness
        friction: 7, // Controls the spring's damping
        useNativeDriver: true,
      }),
      // Logo fade in animation - delayed for staggered effect
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300, // Starts 300ms after the other animations
        useNativeDriver: true,
      }),
    ]).start(); // Start all animations

    // Navigate to login screen after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace("/auth/onboarding"); // 'replace' prevents going back to splash screen
    }, 2500);

    // Cleanup function - clears timer if component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array = runs once on mount

  return (
    // Gradient background - transitions from dark blue tones
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]} // Color stops for gradient
      style={styles.container}
    >
      {/* Main content wrapper with fade and scale animations */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim, // Apply fade animation
            transform: [{ scale: scaleAnim }], // Apply scale animation
          },
        ]}
      >
        {/* Logo and branding section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoFadeAnim, // Apply logo-specific fade
            },
          ]}
        >
          {/* Circular container for the cross icon */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>✝</Text>
          </View>
          
          {/* App name */}
          <Text style={styles.appName}>EcomGrove</Text>
          
          {/* Tagline */}
          <Text style={styles.tagline}>Ecommerce Platform</Text>
        </Animated.View>

        {/* Loading indicator with three dots */}
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingDots}>
            {/* Three dots with different opacities for animated effect */}
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

// Stylesheet for the splash screen
const styles = StyleSheet.create({
  // Main container - fills entire screen
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Content wrapper - centers its children
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Container for logo, app name, and tagline
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  // Circular glassmorphic container for the cross icon
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes it circular
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent border
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    // Shadow effects for depth (iOS)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10, // Shadow for Android
  },
  // Styling for the cross icon
  logoIcon: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "bold",
  },
  // App name styling
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 1, // Slight letter spacing for premium feel
  },
  // Tagline styling
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent for hierarchy
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  // Container for the loading dots
  loadingContainer: {
    marginTop: 40,
  },
  // Horizontal layout for the dots
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  // Base style for all dots
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5, // Makes dot circular
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 6,
  },
  // Individual dot opacities for visual interest
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1, // Fully opaque
  },
});
