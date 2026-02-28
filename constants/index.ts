import { ActionKey, PublishTopics } from "@/types";

export const STATUS_CONFIG = {
  Connected: { label: "Connesso", color: "#33691e" },
  Reconnecting: { label: "Riconnessione", color: "#f59e0b" },
  Error: { label: "Errore Connessione", color: "#ba1a1a" },
  Offline: { label: "Errore Connessione", color: "#ba1a1a" },
  Disconnected: { label: "Errore Connessione", color: "#ba1a1a" },
};

export const ACTION_BUTTONS: {
  key: ActionKey;
  label: string;
  icon: string;
  topic: PublishTopics;
}[] = [
  {
    key: "garage",
    label: "Garage",
    icon: "lightbulb-outline",
    topic: PublishTopics.PUBLISH_LIGHT,
  },
  {
    key: "cancellino",
    label: "Cancellino",
    icon: "door-open",
    topic: PublishTopics.PUBLISH_SMALLGATE,
  },
  {
    key: "pedonabile",
    label: "Pedonabile",
    icon: "walk",
    topic: PublishTopics.PUBLISH_PARTIAL,
  },
];
