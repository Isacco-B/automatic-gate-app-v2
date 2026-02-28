export type ActionKey = "garage" | "cancellino" | "pedonabile" | "cancello";

export type MqttStatus =
  | "Connected"
  | "Disconnected"
  | "Offline"
  | "Reconnecting"
  | "Error";
export type MqttError = { type: string; msg: string } | null;
export type MqttData = { message: any; topic: string } | null;

export type SnackbarState = {
  visible: boolean;
  message: string;
  error: boolean;
};

export type DeviceStatus = "attivo" | "disattivo" | "sconosciuto";

export type GateState =
  | "chiuso"
  | "aperto"
  | "stop"
  | "in apertura"
  | "in chiusura"
  | "sconosciuto";

export type GateStatusData = {
  stato: GateState;
  fcApertura: DeviceStatus;
  fcChiusura: DeviceStatus;
  fotocellule: DeviceStatus;
  coste: DeviceStatus;
  ricevente: DeviceStatus;
  posizione: string | "sconosciuto";
  consumo: string | "sconosciuto";
};

export type GateStatus = {
  timestamp?: number;
  data?: GateStatusData;
  status?: "success" | "error";
};

export type StatisticsCounters = {
  cancello: number;
  luce_garage: number;
  pedonabile: number;
  cancellino: number;
};

export type GateStatistics = {
  timestamp: number;
  totale_storico: StatisticsCounters;
  ultime_24_ore: StatisticsCounters;
};

export type StatisticsResetType = "24h" | "total" | "all";

export type StatisticsResetResponse = {
  action: "reset_counters";
  type: StatisticsResetType;
  status: "success";
  timestamp: number;
};

export type NotificationPayload<T = string> = {
  data: T;
  status: "success" | "error";
  timestamp: number;
};

export type CommandPayload = {
  cmd: "on";
  user?: string;
};

export type GateNotification = NotificationPayload<string>;
export type GateStatusNotification = NotificationPayload<GateStatusData>;
export type StatisticsNotification = NotificationPayload<GateStatistics>;
export type StatisticsResetNotification =
  NotificationPayload<StatisticsResetResponse>;

export enum NotificationTopics {
  NOTIFICATION_SMALLGATE = "api/notification/small_gate",
  NOTIFICATION_LIGHT = "api/notification/garage/light",
  NOTIFICATION_PARTIAL = "api/notification/gate/partial",
  NOTIFICATION_GATE = "api/notification/gate",
  NOTIFICATION_GATE_STATUS = "api/notification/gate/status",
  NOTIFICATION_STATISTICS = "api/notification/statistics",
  NOTIFICATION_GATE_LEARNING = "api/notification/gate/learning",
  NOTIFICATION_STATISTICS_RESET = "api/notification/statistics/reset",
  NOTIFICATION_GATE_ERROR = "api/notification/gate/error",
  NOTIFICATION_PARTIAL_ERROR = "api/notification/gate/partial/error",
  NOTIFICATION_GATE_LEARNING_ERROR = "api/notification/gate/learning/error",
}

export enum PublishTopics {
  PUBLISH_SMALLGATE = "api/small_gate",
  PUBLISH_LIGHT = "api/garage/light",
  PUBLISH_PARTIAL = "api/gate/partial",
  PUBLISH_GATE = "api/gate",
  PUBLISH_GATE_STATUS = "api/gate/status",
  PUBLISH_GET_STATISTICS = "api/gate/statistics",
  PUBLISH_GATE_LEARNING = "api/gate/learning",
  PUBLISH_RESET_STATISTICS = "api/gate/statistics/reset",
}

export type NotificationTopicPayloadMap = {
  [NotificationTopics.NOTIFICATION_GATE]: GateNotification;
  [NotificationTopics.NOTIFICATION_PARTIAL]: GateNotification;
  [NotificationTopics.NOTIFICATION_GATE_LEARNING]: GateNotification;
  [NotificationTopics.NOTIFICATION_GATE_ERROR]: GateNotification;
  [NotificationTopics.NOTIFICATION_PARTIAL_ERROR]: GateNotification;
  [NotificationTopics.NOTIFICATION_GATE_LEARNING_ERROR]: GateNotification;
  [NotificationTopics.NOTIFICATION_SMALLGATE]: GateNotification;
  [NotificationTopics.NOTIFICATION_LIGHT]: GateNotification;
  [NotificationTopics.NOTIFICATION_GATE_STATUS]: GateStatusNotification;
  [NotificationTopics.NOTIFICATION_STATISTICS]: StatisticsNotification;
  [NotificationTopics.NOTIFICATION_STATISTICS_RESET]: StatisticsResetNotification;
};

export type PublishTopicPayloadMap = {
  [PublishTopics.PUBLISH_GATE]: CommandPayload;
  [PublishTopics.PUBLISH_PARTIAL]: CommandPayload;
  [PublishTopics.PUBLISH_GATE_LEARNING]: CommandPayload;
  [PublishTopics.PUBLISH_SMALLGATE]: CommandPayload;
  [PublishTopics.PUBLISH_LIGHT]: CommandPayload;
  [PublishTopics.PUBLISH_GATE_STATUS]: CommandPayload;
  [PublishTopics.PUBLISH_GET_STATISTICS]: CommandPayload;
  [PublishTopics.PUBLISH_RESET_STATISTICS]: StatisticsResetType;
};

export type PublishToTopic = <T extends PublishTopics>(
  topic: T,
  message: PublishTopicPayloadMap[T],
) => void;

export type SubscribeToTopic = (
  topics: string[],
  options?: { qos?: 0 | 1 | 2 },
) => void;
