import { useAuth } from "@/context";
import { createMqttClient } from "@/services/mqttService";
import { MqttData, MqttError, MqttStatus } from "@/types";
import { MqttClient } from "mqtt";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";

export function useMqttConnection(doMqttConnection: boolean) {
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>("Disconnected");
  const [mqttError, setMqttError] = useState<MqttError>(null);
  const [mqttData, setMqttData] = useState<MqttData>(null);
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);

  const { userCredentials } = useAuth();

  useEffect(() => {
    if (!doMqttConnection) return;
    if (!userCredentials?.username || !userCredentials.password) return;

    const client = createMqttClient({
      setMqttStatus,
      setMqttError,
      username: userCredentials.username,
      password: userCredentials.password,
      uniqueId: uuid.v4(),
      onMessage: (topic, message) => {
        setMqttData(() => ({
          message,
          topic,
        }));
      },
    });

    setMqttClient(client);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [doMqttConnection, userCredentials]);

  return {
    mqttClient,
    mqttData,
    mqttStatus,
    mqttError,
    setMqttStatus,
    setMqttError,
  };
}
