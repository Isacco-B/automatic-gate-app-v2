import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function parsePosition(position?: string): number {
  if (!position) return 0;
  const pos = parseFloat(position);
  return isNaN(pos) ? 0 : Math.min(Math.max(pos, 0), 100);
}

interface PositionBarProps {
  value?: string;
  isLoading?: boolean;
}

export function PositionBar({ value, isLoading }: PositionBarProps) {
  const theme = useTheme();
  const percent = parsePosition(value);

  return (
    <>
      <View style={styles.positionContainer}>
        <View style={styles.stateIconContainer}>
          <Text
            variant="labelMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Posizione:
          </Text>
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.onSurface, fontWeight: "700" }}
          >
            {isLoading ? "—" : (percent ?? "—")}%
          </Text>
        </View>
      </View>
      <View style={styles.positionWrapper}>
        <View style={styles.positionLabelRow}>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            0%
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            100%
          </Text>
        </View>
        <View
          style={[
            styles.trackContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <View
            style={[
              styles.trackFill,
              {
                width: `${percent}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
          <View
            style={[
              styles.trackThumb,
              {
                left: `${percent}%`,
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.surface,
              },
            ]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  positionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stateIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  positionWrapper: {
    gap: 8,
  },
  positionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackContainer: {
    height: 8,
    borderRadius: 999,
    overflow: "visible",
    position: "relative",
    justifyContent: "center",
  },
  trackFill: {
    height: "100%",
    borderRadius: 999,
  },
  trackThumb: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 3,
    marginLeft: -9,
    top: -5,
  },
});
