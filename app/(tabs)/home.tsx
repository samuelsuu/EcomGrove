import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryPill from '../../components/CategoryPill'
import ProductCard from '../../components/ProductCard'
import { backgroundColor, primaryColor } from '../../constants/GlobalConstant'
import { Product, useCart } from '../../context/CartContext'

// Mock Data
const PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', description: 'High quality wireless headphones.' },
  { id: '2', name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', description: 'Advanced smart watch.' },
  { id: '3', name: 'Running Shoes', price: 79.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', description: 'Comfortable running shoes.' },
  { id: '4', name: 'Leather Bag', price: 129.50, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1000&auto=format&fit=crop', description: 'Genuine leather bag.' },
  { id: '5', name: 'Digital Camera', price: 599.00, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop', description: 'Professional digital camera.' },
  { id: '6', name: 'Sunglasses', price: 45.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop', description: 'Stylish sunglasses.' },
]

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Sports', 'Home', 'Beauty'];

const Home = () => {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleProductPress = (product: Product) => {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Welcome back,</Text>
          <Text style={styles.subtitle}>Find your favorite products</Text>
        </View>
        <TouchableOpacity style={styles.cartIcon} onPress={() => router.push('/checkout')}>
          <MaterialCommunityIcons name="cart-outline" size={28} color="black" />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <FlatList
          data={[
            { id: '1', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop' },
            { id: '2', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop' },
            { id: '3', image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?q=80&w=1000&auto=format&fit=crop' },
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => (
            <View style={styles.bannerWrapper}>
              <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
            </View>
          )}
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
          <Animated.View key={cat} entering={FadeInRight.delay(index * 100).springify()}>
            <CategoryPill
              category={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular Products</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={PRODUCTS}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={{ flex: 1 }}>
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
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColor,
  },
  cartIcon: {
    padding: 5,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  bannerContainer: {
    marginBottom: 24,
    height: 180,
  },
  bannerWrapper: {
    width: 320,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
})

