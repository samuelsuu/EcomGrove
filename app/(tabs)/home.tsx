import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInRight,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryPill from '../../components/CategoryPill'
import ProductCard from '../../components/ProductCard'
import { backgroundColor, primaryColor, whiteColor } from '../../constants/GlobalConstant'
import { Product, useCart } from '../../context/CartContext'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH * 0.85;
const SPACER_WIDTH = (SCREEN_WIDTH - BANNER_WIDTH) / 2;

// Mock Data
const PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', description: 'High quality wireless headphones.' },
  { id: '2', name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', description: 'Advanced smart watch.' },
  { id: '3', name: 'Running Shoes', price: 79.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', description: 'Comfortable running shoes.' },
  { id: '4', name: 'Leather Bag', price: 129.50, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1000&auto=format&fit=crop', description: 'Genuine leather bag.' },
  { id: '5', name: 'Digital Camera', price: 599.00, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop', description: 'Professional digital camera.' },
  { id: '6', name: 'Sunglasses', price: 45.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop', description: 'Stylish sunglasses.' },
]

const BANNERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop',
    title: 'Summer Collection',
    subtitle: 'Up to 50% Off',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    title: 'New Arrivals',
    subtitle: 'Shop the Latest Trends',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?q=80&w=1000&auto=format&fit=crop',
    title: 'Special Deals',
    subtitle: 'Limited Time Only',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Sports', 'Home', 'Beauty'];

const Home = () => {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollX = useSharedValue(0);
  const bannerRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        currentIndexRef.current = (currentIndexRef.current + 1) % BANNERS.length;
        bannerRef.current.scrollToIndex({
          index: currentIndexRef.current,
          animated: true,
        });
      }
    }, 3000); // Change banner every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProductPress = (product: Product) => {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const BannerItem = ({ item, index }: { item: any, index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * BANNER_WIDTH,
        index * BANNER_WIDTH,
        (index + 1) * BANNER_WIDTH,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP
      );

      const rotateY = interpolate(
        scrollX.value,
        inputRange,
        [10, 0, -10],  // Rotate slightly for 3D effect
        Extrapolation.CLAMP
      );

      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [20, 0, -20],
        Extrapolation.CLAMP
      );

      return {
        transform: [
          { perspective: 1000 },
          { scale },
          { rotateY: `${rotateY}deg` },
          { translateX }
        ],
        opacity,
        zIndex: index === 1 ? 10 : 1, // Simple zIndex logic for demo
      };
    });

    return (
      <Animated.View style={[styles.bannerWrapper, animatedStyle]}>
        <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.bannerOverlay}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={whiteColor} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Header with Greeting */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.subtitle}>Find your favorite products</Text>
        </View>
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push('/checkout')}>
          <View style={styles.cartIcon}>
            <MaterialCommunityIcons name="cart-outline" size={26} color={primaryColor} />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="tune-variant" size={22} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* 3D Banner Section */}
      <View style={styles.bannerContainer}>
        <Animated.FlatList
          ref={bannerRef}
          data={BANNERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={BANNER_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SPACER_WIDTH }}
          renderItem={({ item, index }) => <BannerItem item={item} index={index} />}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {CATEGORIES.map((cat, index) => (
          <Animated.View key={cat} entering={FadeInRight.delay(index * 100 + 400).springify()}>
            <CategoryPill
              category={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={PRODUCTS}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 150 + 600).springify().damping(12)}
            style={{ flex: 1 }}
          >
            <ProductCard
              product={item}
              onAddToCart={addToCart}
              onPress={handleProductPress}
            />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  cartIconContainer: {
    marginLeft: 12,
  },
  cartIcon: {
    backgroundColor: whiteColor,
    padding: 12,
    borderRadius: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: backgroundColor,
  },
  badgeText: {
    color: whiteColor,
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterButton: {
    padding: 4,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  bannerContainer: {
    marginBottom: 24,
    height: 220,
    marginHorizontal: -16,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
    height: 190,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginTop: 10,
    marginRight: 0, // Removed margin as we handle spacing explicitly
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 24,
  },
  bannerContent: {
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: whiteColor,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: whiteColor,
    marginBottom: 16,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  bannerButtonText: {
    color: whiteColor,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: '600',
  },
})
