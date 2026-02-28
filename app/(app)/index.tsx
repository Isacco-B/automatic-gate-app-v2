import {
  CircuitBoardBackground,
  GateActionButton,
  GateActions,
  GateStatusIndicator,
  Header,
  PositionBar,
} from "@/components";
import { useMqtt } from "@/context";
import {
  GateStatistics,
  GateStatus,
  NotificationPayload,
  NotificationTopics,
  PublishTopics,
  SnackbarState,
} from "@/types";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  Icon,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

const UPDATE_INTERVAL = 5000;
const CONNECTION_TIMEOUT = 10000;

export default function HomeScreen() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: "",
    error: false,
  });
  const [gateStatus, setGateStatus] = useState<GateStatus | undefined>(
    undefined,
  );
  const [gateStatistics, setGateStatistics] = useState<
    GateStatistics | undefined
  >(undefined);

  const theme = useTheme();

  const {
    mqttStatus,
    mqttData,
    subscribeToTopic,
    unsubscribeToTopic,
    publishToTopic,
  } = useMqtt();

  const isConnected = mqttStatus === "Connected";
  const isLoading = !isConnected || !gateStatus;

  useEffect(() => {
    let timer: number;
    if (!isConnected) {
      timer = setTimeout(
        () =>
          setSnackbar({
            visible: true,
            message: "Qualcosa è andato storto, riprova più tardi",
            error: true,
          }),
        CONNECTION_TIMEOUT,
      );
    }
    return () => clearTimeout(timer);
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    const topics = Object.values(NotificationTopics);
    subscribeToTopic(topics);
    requestGateStatus();
    requestStatistics();

    const interval = setInterval(() => {
      requestGateStatus();
      requestStatistics();
    }, UPDATE_INTERVAL);

    return () => {
      unsubscribeToTopic(topics);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (!mqttData?.message) return;
    switch (mqttData.topic) {
      case NotificationTopics.NOTIFICATION_GATE_STATUS:
        setGateStatus(mqttData.message as GateStatus);
        break;
      case NotificationTopics.NOTIFICATION_STATISTICS:
        setGateStatistics(mqttData.message as GateStatistics);
        break;
      default:
        if (
          Object.values(NotificationTopics).includes(
            mqttData.topic as NotificationTopics,
          )
        ) {
          const { status, data, timestamp } =
            mqttData.message as NotificationPayload;
          const messageDate = new Date(timestamp);
          const messagePayload = `${messageDate.toLocaleTimeString()} - ${data}`;
          setSnackbar({
            visible: true,
            message: messagePayload,
            error: status === "error",
          });
          break;
        }
    }
  }, [mqttData]);

  const requestGateStatus = useCallback(() => {
    if (isConnected)
      publishToTopic(PublishTopics.PUBLISH_GATE_STATUS, { cmd: "on" });
  }, [isConnected, publishToTopic]);

  const requestStatistics = useCallback(() => {
    if (isConnected)
      publishToTopic(PublishTopics.PUBLISH_GET_STATISTICS, { cmd: "on" });
  }, [isConnected, publishToTopic]);

  return (
    <>
      <CircuitBoardBackground
        color={theme.colors.scrim}
        opacity={0.02}
        backgroundColor={theme.colors.background}
      >
        <Header />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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
              <GateStatusIndicator
                status={gateStatus?.data?.stato}
                isLoading={isLoading}
              />
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <PositionBar
                  value={gateStatus?.data?.posizione}
                  isLoading={isLoading}
                />
                <GateActions
                  sensors={gateStatus?.data}
                  statistics={gateStatistics}
                  timestamp={gateStatus?.timestamp}
                  isLoading={isLoading}
                />
              </View>
            </Surface>

            <GateActionButton
              status={gateStatus?.data?.stato}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </CircuitBoardBackground>

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
  scrollContent: { flexGrow: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  divider: {
    marginHorizontal: 20,
  },
  section: {
    padding: 20,
    gap: 14,
  },
});
