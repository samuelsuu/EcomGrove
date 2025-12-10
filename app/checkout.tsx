import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentSuccess from '../components/PaymentSuccess';
import { backgroundColor, primaryColor, whiteColor } from '../constants/GlobalConstant';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, removeFromCart, cartTotal, clearCart, incrementQuantity, decrementQuantity } = useCart();
    const router = useRouter();

    // Payment form state
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    // Validation errors
    const [errors, setErrors] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });

    // Success modal
    const [showSuccess, setShowSuccess] = useState(false);

    // Format card number (add spaces every 4 digits)
    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    };

    // Format expiry date (MM/YY)
    const formatExpiryDate = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const handleCardNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 16) {
            setCardNumber(formatCardNumber(cleaned));
            if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
        }
    };

    const handleExpiryChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 4) {
            setExpiryDate(formatExpiryDate(cleaned));
            if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
        }
    };

    const handleCvvChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 4) {
            setCvv(cleaned);
            if (errors.cvv) setErrors({ ...errors, cvv: '' });
        }
    };

    const validateForm = () => {
        const newErrors = { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' };
        let isValid = true;

        // Card number validation
        const cleanedCard = cardNumber.replace(/\s/g, '');
        if (!cleanedCard || cleanedCard.length < 13) {
            newErrors.cardNumber = 'Please enter a valid card number';
            isValid = false;
        }

        // Expiry validation
        if (!expiryDate || expiryDate.length < 5) {
            newErrors.expiryDate = 'Please enter a valid expiry date';
            isValid = false;
        }

        // CVV validation
        if (!cvv || cvv.length < 3) {
            newErrors.cvv = 'Please enter a valid CVV';
            isValid = false;
        }

        // Cardholder name validation
        if (!cardholderName.trim()) {
            newErrors.cardholderName = 'Please enter cardholder name';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCheckout = () => {
        if (validateForm()) {
            // Show success modal
            setShowSuccess(true);
        }
    };

    const handleSuccessContinue = () => {
        setShowSuccess(false);
        clearCart();
        // Reset form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardholderName('');
        router.replace('/(tabs)/home');
    };

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <MaterialCommunityIcons name="cart-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.headerTitle}>Checkout</Text>

                    {/* Cart Items */}
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {cart.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                                {/* Quantity Controls */}
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => decrementQuantity(item.id)}
                                    >
                                        <MaterialCommunityIcons name="minus" size={18} color={primaryColor} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => incrementQuantity(item.id)}
                                    >
                                        <MaterialCommunityIcons name="plus" size={18} color={primaryColor} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Payment Form */}
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.paymentForm}>
                        {/* Cardholder Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Cardholder Name</Text>
                            <TextInput
                                style={[styles.input, errors.cardholderName && styles.inputError]}
                                placeholder="John Doe"
                                value={cardholderName}
                                onChangeText={(text) => {
                                    setCardholderName(text);
                                    if (errors.cardholderName) setErrors({ ...errors, cardholderName: '' });
                                }}
                            />
                            {errors.cardholderName ? <Text style={styles.errorText}>{errors.cardholderName}</Text> : null}
                        </View>

                        {/* Card Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Card Number</Text>
                            <View style={styles.cardInputContainer}>
                                <TextInput
                                    style={[styles.input, errors.cardNumber && styles.inputError]}
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChangeText={handleCardNumberChange}
                                    keyboardType="numeric"
                                    maxLength={19}
                                />
                                <MaterialCommunityIcons
                                    name="credit-card-outline"
                                    size={24}
                                    color="#999"
                                    style={styles.cardIcon}
                                />
                            </View>
                            {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}
                        </View>

                        {/* Expiry and CVV */}
                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>Expiry Date</Text>
                                <TextInput
                                    style={[styles.input, errors.expiryDate && styles.inputError]}
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChangeText={handleExpiryChange}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                                {errors.expiryDate ? <Text style={styles.errorText}>{errors.expiryDate}</Text> : null}
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>CVV</Text>
                                <TextInput
                                    style={[styles.input, errors.cvv && styles.inputError]}
                                    placeholder="123"
                                    value={cvv}
                                    onChangeText={handleCvvChange}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                />
                                {errors.cvv ? <Text style={styles.errorText}>{errors.cvv}</Text> : null}
                            </View>
                        </View>
                    </View>

                    {/* Total */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
                    </View>

                    {/* Pay Button */}
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color={whiteColor} />
                        <Text style={styles.checkoutButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <PaymentSuccess
                visible={showSuccess}
                total={cartTotal}
                onContinueShopping={handleSuccessContinue}
            />
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
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    continueButton: {
        backgroundColor: primaryColor,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    continueButtonText: {
        color: whiteColor,
        fontWeight: '600',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1a1a1a',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 12,
        marginTop: 8,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        color: primaryColor,
        fontWeight: '700',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 4,
        alignSelf: 'flex-start',
    },
    quantityButton: {
        padding: 6,
        backgroundColor: whiteColor,
        borderRadius: 6,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 16,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    paymentForm: {
        backgroundColor: whiteColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    cardInputContainer: {
        position: 'relative',
    },
    cardIcon: {
        position: 'absolute',
        right: 16,
        top: 12,
    },
    inputRow: {
        flexDirection: 'row',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    totalContainer: {
        backgroundColor: whiteColor,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: primaryColor,
    },
    checkoutButton: {
        backgroundColor: primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    checkoutButtonText: {
        color: whiteColor,
        fontSize: 18,
        fontWeight: '700',
    },
});

export default Checkout;
