import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primaryColor, whiteColor } from '../constants/GlobalConstant';
import { Product } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onPress: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.button} onPress={() => onAddToCart(product)}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: whiteColor,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        width: '48%', // Approx half width for grid
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 150,
    },
    details: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    button: {
        backgroundColor: primaryColor,
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: whiteColor,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ProductCard;
