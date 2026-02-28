import { GateState, GateStatus } from "@/types";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

function getStateConfig(stato: GateState): { icon: string } {
  switch (stato) {
    case "aperto":
      return { icon: "gate-open" };
    case "chiuso":
      return { icon: "gate" };
    case "in apertura":
      return { icon: "gate-arrow-left" };
    case "in chiusura":
      return { icon: "gate-arrow-right" };
    case "stop":
      return { icon: "stop-circle-outline" };
    default:
      return { icon: "timer-sand" };
  }
}

interface GateStatusIndicatorProps {
  data?: GateStatus;
  status?: GateState;
  isLoading?: boolean;
}

export function GateStatusIndicator({
  status,
  isLoading = false,
}: GateStatusIndicatorProps) {
  const theme = useTheme();
  const { icon } = getStateConfig(status || "sconosciuto");

  return (
    <>
      <View style={styles.stateRow}>
        <View
          style={[
            styles.stateIconContainer,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Icon source={icon} size={32} color={theme.colors.primary} />
        </View>
        <View style={styles.stateText}>
          <Text
            variant="labelMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Stato cancello
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              color: theme.colors.onSurface,
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {isLoading || !status ? "Caricamento..." : status}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  stateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
  stateIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    flex: 1,
    gap: 2,
  },
});
