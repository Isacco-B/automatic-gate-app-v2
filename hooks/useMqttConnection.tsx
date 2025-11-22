import { MqttClient } from 'mqtt';
import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import { createMqttClient } from '../services/mqttService';

export type MqttStatus = 'Connected' | 'Disconnected' | 'Offline' | 'Reconnecting' | 'Error';
export type MqttError = { type: string; msg: string } | null;
export type MqttData = { message: any; topic: string } | null;

function useMqttConnection(doMqttConnection: boolean) {
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>('Disconnected');
  const [mqttError, setMqttError] = useState<MqttError>(null);
  const [mqttData, setMqttData] = useState<MqttData>(null);
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    if (!doMqttConnection) return;

    const client = createMqttClient({
      setMqttStatus,
      setMqttError,
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
  }, [doMqttConnection]);

  return {
    mqttClient,
    mqttData,
    mqttStatus,
    mqttError,
    setMqttStatus,
    setMqttError,
  };
}

export default useMqttConnection;
