import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { primaryColor, whiteColor } from '../constants/GlobalConstant';

interface PaymentSuccessProps {
    visible: boolean;
    total: number;
    onContinueShopping: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ visible, total, onContinueShopping }) => {
    const scale = useSharedValue(0);
    const checkScale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            // Modal entrance
            opacity.value = withTiming(1, { duration: 200 });
            scale.value = withSpring(1, { damping: 15, stiffness: 150 });

            // Checkmark animation with bounce
            checkScale.value = withDelay(
                300,
                withSequence(
                    withSpring(1.2, { damping: 10, stiffness: 200 }),
                    withSpring(1, { damping: 15, stiffness: 150 })
                )
            );
        } else {
            scale.value = 0;
            checkScale.value = 0;
            opacity.value = 0;
        }
    }, [visible]);

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onContinueShopping}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, modalStyle]}>
                    {/* Success Icon */}
                    <Animated.View style={[styles.iconContainer, checkStyle]}>
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={80}
                            color="#4CAF50"
                        />
                    </Animated.View>

                    {/* Success Message */}
                    <Text style={styles.title}>Payment Successful!</Text>
                    <Text style={styles.message}>
                        Your order has been confirmed
                    </Text>

                    {/* Amount Paid */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount Paid</Text>
                        <Text style={styles.amount}>${total.toFixed(2)}</Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onContinueShopping}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Continue Shopping</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color={whiteColor} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: whiteColor,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    amountContainer: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: primaryColor,
    },
    button: {
        backgroundColor: primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        gap: 8,
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: whiteColor,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PaymentSuccess;
