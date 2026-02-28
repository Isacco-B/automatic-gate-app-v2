import { GateStatistics, StatisticsCounters } from "@/types";
import { StyleSheet, View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";

const COUNTER_ROWS: {
  key: keyof StatisticsCounters;
  label: string;
  icon: string;
}[] = [
  { key: "cancello", label: "Cancello", icon: "gate" },
  { key: "luce_garage", label: "Luce Garage", icon: "lightbulb-outline" },
  { key: "pedonabile", label: "Pedonabile", icon: "walk" },
  { key: "cancellino", label: "Cancellino", icon: "door-open" },
];

interface StatRowProps {
  label: string;
  icon: string;
  today?: number;
  total?: number;
}

function StatRow({ label, icon, today, total }: StatRowProps) {
  const theme = useTheme();

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

      <View style={styles.counters}>
        <View
          style={[
            styles.counterBadge,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: "600",
            }}
          >
            Oggi
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: "800",
            }}
          >
            {today ?? "--"}
          </Text>
        </View>
        <View
          style={[
            styles.counterBadge,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, fontWeight: "600" }}
          >
            Totale
          </Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: "800" }}
          >
            {total ?? "--"}
          </Text>
        </View>
      </View>
    </Surface>
  );
}

interface GateStatisticProps {
  statistics?: GateStatistics;
}

export function GateStatistic({ statistics }: GateStatisticProps) {
  return (
    <View style={styles.rows}>
      {COUNTER_ROWS.map(({ key, label, icon }) => (
        <StatRow
          key={key}
          label={label}
          icon={icon}
          today={statistics?.ultime_24_ore[key]}
          total={statistics?.totale_storico[key]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: {
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
  counters: {
    flexDirection: "row",
    gap: 8,
  },
  counterBadge: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 2,
  },
});
