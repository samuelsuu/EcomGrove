import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { backgroundColor, primaryColor, whiteColor } from '../../constants/GlobalConstant';
import { Product, useCart } from '../../context/CartContext';

// Mock product data (in production, fetch from API)
const ALL_PRODUCTS: Product[] = [
    { id: '1', name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and supreme comfort for all-day wear.' },
    { id: '2', name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', description: 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications. Water-resistant up to 50 meters.' },
    { id: '3', name: 'Running Shoes', price: 79.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for daily training and races.' },
    { id: '4', name: 'Leather Bag', price: 129.50, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1000&auto=format&fit=crop', description: 'Genuine leather messenger bag with multiple compartments. Ideal for work or travel with padded laptop sleeve.' },
    { id: '5', name: 'Digital Camera', price: 599.00, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop', description: '24MP mirrorless camera with 4K video, fast autofocus, and interchangeable lens system for professional photography.' },
    { id: '6', name: 'Sunglasses', price: 45.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop', description: 'Polarized UV protection sunglasses with lightweight frame. Classic aviator style suitable for any occasion.' },
];

const ProductDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    // Find current product
    const product = ALL_PRODUCTS.find(p => p.id === id);

    // Get suggested products (exclude current product)
    const suggestedProducts = ALL_PRODUCTS.filter(p => p.id !== id).slice(0, 4);

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Product not found</Text>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        router.back();
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        router.push('/checkout');
    };

    const handleProductPress = (selectedProduct: Product) => {
        router.push({ pathname: '/product/[id]', params: { id: selectedProduct.id } });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <MaterialCommunityIcons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF3B30" : "#333"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Product Image */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
                    </View>
                </Animated.View>

                {/* Product Info */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

                    {/* Rating (Static for now) */}
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <MaterialCommunityIcons
                                key={star}
                                name="star"
                                size={20}
                                color="#FFD700"
                            />
                        ))}
                        <Text style={styles.ratingText}>5.0 (128 reviews)</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Quantity Selector */}
                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <MaterialCommunityIcons name="minus" size={20} color={primaryColor} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <MaterialCommunityIcons name="plus" size={20} color={primaryColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Suggested Products */}
                    <Text style={styles.sectionTitle}>You May Also Like</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestedProducts}
                    >
                        {suggestedProducts.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInRight.delay(index * 100 + 300).springify()}
                                style={styles.suggestedProductCard}
                            >
                                <ProductCard
                                    product={item}
                                    onAddToCart={addToCart}
                                    onPress={handleProductPress}
                                />
                            </Animated.View>
                        ))}
                    </ScrollView>
                </Animated.View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <MaterialCommunityIcons name="cart-outline" size={20} color={whiteColor} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        backgroundColor: whiteColor,
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        aspectRatio: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: 12,
        padding: 8,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
        minWidth: 30,
        textAlign: 'center',
    },
    suggestedProducts: {
        paddingRight: 20,
    },
    suggestedProductCard: {
        width: 180,
        marginRight: 12,
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: whiteColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        gap: 12,
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: whiteColor,
        borderWidth: 2,
        borderColor: primaryColor,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyNowText: {
        color: primaryColor,
        fontSize: 16,
        fontWeight: '700',
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    addToCartText: {
        color: whiteColor,
        fontSize: 16,
        fontWeight: '700',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default ProductDetail;
