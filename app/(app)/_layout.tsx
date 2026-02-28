import { useAuth } from "@/context";
import { Stack } from "expo-router";

export default function AppLayout() {
  const { hasCompletedProfileSetup } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={hasCompletedProfileSetup}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
