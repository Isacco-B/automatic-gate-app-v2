import { UserMenu } from "@/components/UserMenu";
import { STATUS_CONFIG } from "@/constants";
import { useMqtt } from "@/context";
import { MqttStatus } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

function ConnectionBadge({ status }: { status: MqttStatus }) {
  const [opacity, setOpacity] = useState(1);
  const config = STATUS_CONFIG[status];

  useEffect(() => {
    let increasing = false;
    const interval = setInterval(() => {
      setOpacity((prev) => {
        if (prev <= 0.3) increasing = true;
        if (prev >= 1) increasing = false;
        return increasing ? prev + 0.05 : prev - 0.05;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.badgeWrapper}>
      <View
        style={[styles.badgeGlow, { backgroundColor: config.color + "30" }]}
      />
      <View
        style={[styles.badgeDot, { backgroundColor: config.color, opacity }]}
      />
      <Text style={[styles.badgeLabel, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

export function Header() {
  const { mqttStatus } = useMqtt();

  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.headerContainer}>
        <ConnectionBadge status={mqttStatus} />
        <UserMenu />
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  badgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  badgeGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: 999,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
