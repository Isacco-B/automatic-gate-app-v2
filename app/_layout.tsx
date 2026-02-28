import { AuthProvider, MqttProvider, useAuth } from "@/context";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const { theme } = useMaterial3Theme({
    sourceColor: "#33691e",
    fallbackSourceColor: "#33691e",
  });
  return (
    <PaperProvider theme={{ ...MD3LightTheme, colors: theme.light }}>
      <StatusBar style="dark" animated />
      <AuthProvider>
        <MqttProvider>
          <RootNavigator />
        </MqttProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
