import { CircuitBoardBackground } from "@/components";
import { useAuth } from "@/context";
import { SnackbarState } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  Divider,
  HelperText,
  Icon,
  Portal,
  Snackbar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { userProfile, updateProfile, hasCompletedProfileSetup } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [displayNameError, setDisplayNameError] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: "",
    error: false,
  });

  const showSnackbar = (message: string, error = false) => {
    setSnackbar({ visible: true, message, error });
  };

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setProfileImage(userProfile.profileImage);
    }
  }, [userProfile]);

  useEffect(() => {
    const nameChanged = displayName !== (userProfile?.displayName || "");
    const imageChanged = profileImage !== userProfile?.profileImage;
    setHasChanges(nameChanged || imageChanged);
  }, [displayName, profileImage, userProfile]);

  const selectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showSnackbar("È necessario concedere l'accesso alla galleria.", true);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      showSnackbar("Errore durante la selezione dell'immagine.", true);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showSnackbar("È necessario concedere l'accesso alla fotocamera.", true);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      showSnackbar("Errore durante lo scatto della foto.", true);
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setDisplayNameError(true);
      return;
    }
    try {
      setIsLoading(true);
      await updateProfile({ displayName: displayName.trim(), profileImage });
      showSnackbar("Profilo aggiornato correttamente.");
    } catch {
      showSnackbar(
        "Errore durante l'aggiornamento del profilo. Riprova.",
        true,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setDialogVisible(true);
    } else {
      router.back();
    }
  };

  const avatarLabel = displayName.charAt(0).toUpperCase() || "U";

  return (
    <>
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
                        source="account-circle-outline"
                        size={28}
                        color={theme.colors.onSecondaryContainer}
                      />
                    </View>
                    <View style={styles.headerText}>
                      <Text
                        variant="titleMedium"
                        style={[
                          styles.title,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Il tuo profilo
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Aggiorna le informazioni del tuo account
                      </Text>
                    </View>
                  </View>

                  <Divider />

                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Icon
                        source="camera-account"
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
                        Foto profilo
                      </Text>
                    </View>
                    <View style={styles.avatarSection}>
                      <View style={styles.avatarWrapper}>
                        <TouchableOpacity
                          onPress={selectImage}
                          activeOpacity={0.8}
                        >
                          {profileImage ? (
                            <Avatar.Image
                              size={100}
                              source={{ uri: profileImage }}
                            />
                          ) : (
                            <Avatar.Text size={100} label={avatarLabel} />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={takePhoto}
                          activeOpacity={0.8}
                          style={[
                            styles.cameraButton,
                            { backgroundColor: theme.colors.primary },
                          ]}
                        >
                          <Icon
                            source="camera"
                            size={18}
                            color={theme.colors.onPrimary}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onSurfaceVariant,
                          textAlign: "center",
                        }}
                      >
                        Tocca per modificare dalla galleria
                      </Text>
                    </View>
                  </View>

                  <Divider />

                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Icon
                        source="pencil-outline"
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
                        Informazioni
                      </Text>
                    </View>
                    <View>
                      <TextInput
                        label="Nome visualizzato"
                        placeholder="Inserisci il tuo nome"
                        value={displayName}
                        onChangeText={(text) => {
                          setDisplayName(text);
                          if (displayNameError && text.trim())
                            setDisplayNameError(false);
                        }}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleSaveProfile}
                        editable={!isLoading}
                        maxLength={50}
                        mode="outlined"
                        error={displayNameError}
                        left={<TextInput.Icon icon="account-outline" />}
                      />
                      <View style={styles.fieldMeta}>
                        <HelperText type="error" visible={displayNameError}>
                          Il nome non può essere vuoto.
                        </HelperText>
                        <Text
                          variant="bodySmall"
                          style={{
                            color: theme.colors.onSurfaceVariant,
                            marginTop: 4,
                          }}
                        >
                          {displayName.length}/50
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Divider />

                  <View style={[styles.section, { gap: 10 }]}>
                    <Button
                      mode="contained"
                      onPress={handleSaveProfile}
                      disabled={!hasChanges || isLoading}
                      icon={isLoading ? undefined : "check"}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonLabel}
                    >
                      {isLoading ? (
                        <View style={styles.loadingRow}>
                          <ActivityIndicator
                            size={16}
                            color={theme.colors.onPrimary}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={{ color: theme.colors.onPrimary }}>
                            Salvataggio...
                          </Text>
                        </View>
                      ) : (
                        "Salva modifiche"
                      )}
                    </Button>
                    {hasCompletedProfileSetup && (
                      <Button
                        mode="outlined"
                        onPress={handleCancel}
                        disabled={isLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                      >
                        Torna indietro
                      </Button>
                    )}
                  </View>
                </Surface>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </CircuitBoardBackground>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.dialogHeader}>
            <View
              style={[
                styles.dialogIconContainer,
                { backgroundColor: theme.colors.errorContainer },
              ]}
            >
              <Icon
                source="alert-outline"
                size={28}
                color={theme.colors.onErrorContainer}
              />
            </View>
            <View style={styles.dialogHeaderText}>
              <Text variant="titleMedium" style={styles.dialogTitle}>
                Sei sicuro di voler annullare?
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Tutte le modifiche non salvate andranno perse.
              </Text>
            </View>
          </View>

          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="outlined"
              onPress={() => setDialogVisible(false)}
              style={styles.dialogButton}
              contentStyle={styles.dialogButtonContent}
              labelStyle={styles.dialogButtonLabel}
            >
              Annulla
            </Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              onPress={() => {
                setDialogVisible(false);
                router.back();
              }}
              style={styles.dialogButton}
              contentStyle={styles.dialogButtonContent}
              labelStyle={styles.dialogButtonLabel}
            >
              Conferma
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        duration={3000}
        style={{
          backgroundColor: snackbar.error
            ? theme.colors.errorContainer
            : theme.colors.primary,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon
            source={snackbar.error ? "alert-circle" : "check-circle"}
            size={20}
            color={
              snackbar.error
                ? theme.colors.onErrorContainer
                : theme.colors.onPrimary
            }
          />
          <Text
            style={{
              color: snackbar.error
                ? theme.colors.onErrorContainer
                : theme.colors.onPrimary,
              flex: 1,
            }}
          >
            {snackbar.message}
          </Text>
        </View>
      </Snackbar>
    </>
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
  avatarSection: {
    alignItems: "center",
    gap: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dialog: {
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
  },
  dialogIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogHeaderText: {
    flex: 1,
    gap: 2,
  },
  dialogTitle: {
    fontWeight: "700",
  },
  dialogActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    gap: 10,
  },
  dialogButton: {
    flex: 1,
    borderRadius: 12,
  },
  dialogButtonContent: {
    height: 48,
  },
  dialogButtonLabel: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
