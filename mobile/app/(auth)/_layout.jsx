import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
  const { user } = useAuth();

  // ⛔ Jangan pakai <Redirect /> di dalam `if` tanpa return langsung
  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
