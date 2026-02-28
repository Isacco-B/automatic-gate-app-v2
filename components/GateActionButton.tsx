import { ACTION_BUTTONS } from "@/constants";
import { useAuth, useMqtt } from "@/context";
import { GateState, PublishTopics } from "@/types";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

function getGateConfig(stato: GateState): { label: string; icon: string } {
  if (stato === "in apertura")
    return { label: "Stop", icon: "stop-circle-outline" };
  if (stato === "stop" || stato === "aperto")
    return { label: "Chiudi", icon: "gate-arrow-right" };
  if (stato === "in chiusura" || stato === "chiuso")
    return { label: "Apri", icon: "gate-arrow-left" };
  return { label: "...", icon: "timer-sand" };
}

interface ActionButtonProps {
  status?: GateState;
  isLoading: boolean;
}

interface ActionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function SecondaryCard({
  icon,
  label,
  onPress,
  disabled = false,
}: ActionCardProps) {
  const theme = useTheme();

  return (
    <Surface
      style={[
        styles.card,
        styles.cardSmall,
        {
          backgroundColor: disabled
            ? "rgb(225, 225, 219)"
            : theme.colors.surface,
          borderColor: disabled
            ? theme.colors.outlineVariant
            : theme.colors.onSurface,
        },
      ]}
      elevation={0}
    >
      <TouchableRipple
        onPress={onPress}
        disabled={disabled}
        borderless={true}
        rippleColor="rgba(51, 105, 30, 0.15)"
        style={styles.ripple}
      >
        <View style={styles.cardInnerSm}>
          <View
            style={[
              styles.iconContainerSm,
              {
                backgroundColor: disabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.secondaryContainer,
              },
            ]}
          >
            <Icon
              source={icon}
              size={24}
              color={
                disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary
              }
            />
          </View>
          <Text
            variant="labelMedium"
            style={{
              color: disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.onSurface,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableRipple>
    </Surface>
  );
}

function PrimaryCard({
  icon,
  label,
  onPress,
  disabled = false,
}: ActionCardProps) {
  const theme = useTheme();

  return (
    <Surface
      style={[
        styles.card,
        styles.cardLarge,
        {
          backgroundColor: disabled
            ? "rgb(225, 225, 219)"
            : theme.colors.primary,
          borderColor: disabled
            ? theme.colors.outlineVariant
            : theme.colors.primary,
        },
      ]}
      elevation={0}
    >
      <TouchableRipple
        onPress={onPress}
        disabled={disabled}
        borderless={true}
        rippleColor="rgba(255, 255, 255, 0.15)"
        style={styles.ripple}
      >
        <View style={styles.cardInnerLg}>
          <View
            style={[
              styles.iconContainerLg,
              {
                backgroundColor: disabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.onPrimary,
              },
            ]}
          >
            <Icon
              source={icon}
              size={34}
              color={
                disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary
              }
            />
          </View>

          <View style={styles.primaryText}>
            <Text
              variant="headlineSmall"
              style={{
                color: disabled
                  ? theme.colors.onSurfaceDisabled
                  : theme.colors.onPrimary,
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {label}
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: disabled
                  ? theme.colors.onSurfaceDisabled
                  : theme.colors.onPrimary,
                opacity: 0.8,
              }}
            >
              {disabled ? "Non disponibile" : "Tocca per azionare"}
            </Text>
          </View>

          <View
            style={[
              styles.chevron,
              {
                backgroundColor: disabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.onPrimary,
              },
            ]}
          >
            <Icon
              source="chevron-right"
              size={20}
              color={
                disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary
              }
            />
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
}

export function GateActionButton({ status, isLoading }: ActionButtonProps) {
  const { publishToTopic } = useMqtt();
  const { userProfile } = useAuth();

  const { label: gateLabel, icon: gateIcon } = getGateConfig(
    status || "sconosciuto",
  );

  const handleAction = (topic: PublishTopics) => {
    publishToTopic(topic, { cmd: "on", user: userProfile?.displayName });
  };

  return (
    <View style={styles.container}>
      <PrimaryCard
        icon={gateIcon}
        label={gateLabel}
        onPress={() => handleAction(PublishTopics.PUBLISH_GATE)}
        disabled={isLoading}
      />
      <View style={styles.secondaryRow}>
        {ACTION_BUTTONS.map(({ key, label, icon, topic }) => (
          <SecondaryCard
            key={key}
            icon={icon}
            label={label}
            onPress={() => handleAction(topic)}
            disabled={
              isLoading || (key === "pedonabile" && status !== "chiuso")
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardSmall: {
    flex: 1,
  },
  cardLarge: {
    width: "100%",
  },
  ripple: {
    borderRadius: 20,
  },
  cardInnerSm: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 10,
  },
  iconContainerSm: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInnerLg: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 16,
  },
  iconContainerLg: {
    width: 68,
    height: 68,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    flex: 1,
    gap: 2,
  },
  chevron: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
