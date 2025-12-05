import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
        {/* Splash screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Auth screens */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/onboarding/index" options={{ headerShown: false }} />

        
      </Stack>
  ) ;
}
