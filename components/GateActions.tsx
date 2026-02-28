import { GateSensor, GateStatistic } from "@/components";
import { GateStatistics, GateStatusData } from "@/types";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Divider,
  Icon,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

interface GateActionsProps {
  timestamp?: number;
  sensors?: GateStatusData;
  statistics?: GateStatistics;
  isLoading: boolean;
}

export function GateActions({
  sensors,
  statistics,
  timestamp,
  isLoading,
}: GateActionsProps) {
  const [sensorsModalVisible, setSensorsModalVisible] =
    useState<boolean>(false);
  const [statisticsModalVisible, setStatisticsModalVisible] =
    useState<boolean>(false);
  const theme = useTheme();

  const lastStatisticsUpdate = statistics?.timestamp
    ? new Date(statistics.timestamp).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "--:--";

  const lastSensorsUpdate = timestamp
    ? new Date(timestamp).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "--:--";

  return (
    <>
      <View style={styles.actionContainer}>
        <Button
          mode="outlined"
          icon="radar"
          onPress={() => setSensorsModalVisible(true)}
          style={styles.actionBtn}
          contentStyle={styles.actionBtnContent}
          labelStyle={styles.actionBtnLabel}
          disabled={isLoading}
        >
          Sensori
        </Button>
        <Button
          mode="outlined"
          icon="chart-bar"
          onPress={() => setStatisticsModalVisible(true)}
          style={styles.actionBtn}
          contentStyle={styles.actionBtnContent}
          labelStyle={styles.actionBtnLabel}
          disabled={isLoading}
        >
          Statistiche
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={sensorsModalVisible}
          onDismiss={() => setSensorsModalVisible(false)}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.updateTime}>
            <Icon
              source="update"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Utlimo aggiornamento alle {lastSensorsUpdate}
            </Text>
          </View>
          <View style={styles.dialogHeader}>
            <View
              style={[
                styles.dialogIconContainer,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Icon
                source="radar"
                size={28}
                color={theme.colors.onSecondaryContainer}
              />
            </View>
            <View style={styles.dialogHeaderText}>
              <Text variant="titleMedium" style={styles.dialogTitle}>
                Sensori
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Stato in tempo reale di tutti i sensori
              </Text>
            </View>
          </View>

          <Divider />

          <Dialog.Content style={styles.dialogContent}>
            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={false}
            >
              <GateSensor sensors={sensors} />
            </ScrollView>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              onPress={() => setSensorsModalVisible(false)}
              style={[styles.dialogButton, { flex: 1 }]}
              contentStyle={styles.dialogButtonContent}
              labelStyle={styles.dialogButtonLabel}
            >
              Chiudi
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={statisticsModalVisible}
          onDismiss={() => setStatisticsModalVisible(false)}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.updateTime}>
            <Icon
              source="update"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Utlimo aggiornamento alle {lastStatisticsUpdate}
            </Text>
          </View>
          <View style={styles.dialogHeader}>
            <View
              style={[
                styles.dialogIconContainer,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Icon
                source="chart-bar"
                size={28}
                color={theme.colors.onSecondaryContainer}
              />
            </View>
            <View style={styles.dialogHeaderText}>
              <Text variant="titleMedium" style={styles.dialogTitle}>
                Statistiche
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Analizza le statistiche del cancello
              </Text>
            </View>
          </View>

          <Divider />

          <Dialog.Content style={styles.dialogContent}>
            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={false}
            >
              <GateStatistic statistics={statistics} />
            </ScrollView>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              onPress={() => setStatisticsModalVisible(false)}
              style={[styles.dialogButton, { flex: 1 }]}
              contentStyle={styles.dialogButtonContent}
              labelStyle={styles.dialogButtonLabel}
            >
              Chiudi
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
  },
  actionBtnContent: {
    height: 44,
  },
  actionBtnLabel: {
    fontWeight: "700",
    fontSize: 13,
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
  dialogContent: {
    paddingTop: 16,
  },
  dialogActions: {
    paddingBottom: 16,
  },
  dialogButton: {
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
  updateTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
