import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function RootLayout() {
  const { user } = useAuth();

  // Jika belum login, redirect ke halaman register
  if (!user) {
    return <Redirect href="/auth/register" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Tambahkan screen lain setelah login di sini */}
    </Stack>
  );
}
