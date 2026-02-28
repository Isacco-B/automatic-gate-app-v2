import { CircuitBoardBackground } from "@/components";
import { LoginType, useAuth } from "@/context";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Divider,
  Icon,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<LoginType>({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  function handleChange(field: keyof LoginType) {
    return (text: string) => {
      setFormData((prev) => ({ ...prev, [field]: text }));
    };
  }

  function onSubmit() {
    if (!isValid) return;
    Keyboard.dismiss();
    login(formData);
    setFormData({ username: "", password: "" });
  }

  const isValid = [formData.username.trim(), formData.password.trim()].every(
    Boolean,
  );

  return (
    <CircuitBoardBackground
      color={theme.colors.scrim}
      opacity={0.02}
      backgroundColor={theme.colors.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top },
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Surface
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
                elevation={0}
              >
                <View style={styles.header}>
                  <View
                    style={[
                      styles.headerIconContainer,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    <Icon
                      source="gate"
                      size={32}
                      color={theme.colors.onSecondaryContainer}
                    />
                  </View>
                  <View style={styles.headerText}>
                    <Text
                      variant="titleMedium"
                      style={[styles.title, { color: theme.colors.onSurface }]}
                    >
                      Accedi al tuo account
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Inserisci le tue credenziali per continuare
                    </Text>
                  </View>
                </View>

                <Divider />

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Icon
                      source="lock-outline"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text
                      variant="labelMedium"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Credenziali
                    </Text>
                  </View>

                  <TextInput
                    label="Username"
                    placeholder="Inserisci il tuo username"
                    value={formData.username}
                    onChangeText={handleChange("username")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    mode="outlined"
                    left={<TextInput.Icon icon="account-outline" />}
                  />

                  <TextInput
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChangeText={handleChange("password")}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={onSubmit}
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={passwordVisible ? "eye-off" : "eye"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                  />

                  <Button
                    mode="contained"
                    onPress={onSubmit}
                    disabled={!isValid}
                    icon="login"
                    contentStyle={{ flexDirection: "row-reverse", height: 48 }}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Accedi
                  </Button>
                </View>
              </Surface>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </CircuitBoardBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: "700",
  },
  section: {
    padding: 20,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  button: {
    borderRadius: 12,
    marginTop: 4,
  },
  buttonLabel: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
