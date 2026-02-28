import { emitStateError } from "@/services/errorHandler";
import { MqttError, MqttStatus } from "@/types";
import mqtt from "mqtt";
import { Dispatch, SetStateAction } from "react";

type CreateMqttClient = {
  setMqttStatus: Dispatch<SetStateAction<MqttStatus>>;
  setMqttError: Dispatch<SetStateAction<MqttError>>;
  username: string;
  password: string;
  uniqueId: string;
  onMessage: (topic: string, message: any) => void;
};

function createMqttClient({
  setMqttStatus,
  setMqttError,
  username,
  password,
  uniqueId,
  onMessage,
}: CreateMqttClient) {
  const HOST = process.env.EXPO_PUBLIC_MQTT_HOST;
  const PATH = "/ws";
  const PORT = 9001;
  const PROTOCOL = "wss";

  const client = mqtt
    .connect(`${PROTOCOL}://${HOST}:${PORT}${PATH}`, {
      forceNativeWebSocket: true,
      clientId: uniqueId,
      username,
      password,
      reconnectPeriod: 5000,
      queueQoSZero: true,
      resubscribe: true,
      clean: true,
      keepalive: 30,
    })
    .on("connect", () => {
      setMqttStatus("Connected");
      console.log("MQTT connected");
    })
    .on("error", (error) => {
      setMqttStatus("Error");
      emitStateError(setMqttError, "MqttGeneral", error);
    })
    .on("disconnect", (_packet) => {
      setMqttStatus("Disconnected");
    })
    .on("offline", () => {
      setMqttStatus("Offline");
    })
    .on("reconnect", () => {
      setMqttStatus("Reconnecting");
    })
    .on("close", () => {
      setMqttStatus("Disconnected");
    })
    .on("message", (topic, message, _packet) => {
      onMessage(topic, JSON.parse(message.toString()));
    });

  return client;
}

export { createMqttClient };
