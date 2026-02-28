import { GateStatusData } from "@/types";
import { StyleSheet, View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";

const DETAIL_ROWS: {
  key: keyof GateStatusData;
  label: string;
  icon: string;
}[] = [
  { key: "fcApertura", label: "FC Apertura", icon: "arrow-expand-left" },
  { key: "fcChiusura", label: "FC Chiusura", icon: "arrow-collapse-right" },
  { key: "fotocellule", label: "Fotocellule", icon: "eye-outline" },
  { key: "coste", label: "Coste", icon: "shield-outline" },
  { key: "ricevente", label: "Ricevente", icon: "remote" },
];

interface DetailRowProps {
  label: string;
  icon: string;
  value?: string;
  isActive: boolean;
}

function DetailRow({ label, icon, value, isActive }: DetailRowProps) {
  const theme = useTheme();

  const statusColor = isActive ? theme.colors.primary : theme.colors.error;
  const statusBg = isActive
    ? theme.colors.primaryContainer
    : theme.colors.errorContainer;
  const statusTextColor = isActive
    ? theme.colors.onPrimaryContainer
    : theme.colors.onErrorContainer;

  return (
    <Surface
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      elevation={0}
    >
      <View style={styles.leading}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Icon
            source={icon}
            size={18}
            color={theme.colors.onSecondaryContainer}
          />
        </View>
        <Text
          variant="labelLarge"
          style={{ color: theme.colors.onSurface, fontWeight: "600" }}
        >
          {label}
        </Text>
      </View>

      <View style={[styles.valueBadge, { backgroundColor: statusBg }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text
          variant="labelMedium"
          style={{
            color: statusTextColor,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {value ?? "..."}
        </Text>
      </View>
    </Surface>
  );
}

interface GateDetailsProps {
  sensors?: GateStatusData;
}

export function GateSensor({ sensors }: GateDetailsProps) {
  return (
    <View style={styles.container}>
      {DETAIL_ROWS.map(({ key, label, icon }) => (
        <DetailRow
          key={key}
          label={label}
          icon={icon}
          value={sensors?.[key]}
          isActive={sensors?.[key] === "attivo"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  valueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
});
