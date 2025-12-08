import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        {/* Splash screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Auth screens */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/onboarding/index" options={{ headerShown: false }} />

        {/* Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Checkout */}
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />

        {/* Product Details */}
        <Stack.Screen name="product/[id]" options={{ title: 'Details' }} />
      </Stack>
    </CartProvider>
  );
}
