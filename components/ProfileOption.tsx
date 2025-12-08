import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { primaryColor } from '../constants/GlobalConstant'

interface ProfileOptionProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    onPress: () => void;
    delay?: number;
}

const ProfileOption = ({ icon, title, onPress, delay = 0 }: ProfileOptionProps) => {
    return (
        <Animated.View entering={FadeInDown.delay(delay).springify().damping(12)}>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={24} color={primaryColor} />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default ProfileOption

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f0f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
})
