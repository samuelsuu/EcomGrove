import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { backgroundColor, primaryColor, whiteColor } from '../constants/GlobalConstant';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        Alert.alert("Success", "Order placed successfully!", [
            {
                text: "OK", onPress: () => {
                    clearCart();
                    router.replace('/(tabs)/home');
                }
            }
        ]);
    };

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty.</Text>
                <Link href="/(tabs)/home" asChild>
                    <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </Link>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Checkout</Text>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                style={styles.list}
            />
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    continueButton: {
        backgroundColor: primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8
    },
    continueButtonText: {
        color: whiteColor,
        fontWeight: 'bold'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: primaryColor,
    },
    list: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    itemQuantity: {
        fontSize: 12,
        color: '#888',
        marginTop: 2
    },
    removeButton: {
        padding: 8,
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: primaryColor,
    },
    checkoutButton: {
        backgroundColor: primaryColor,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: whiteColor,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Checkout;
