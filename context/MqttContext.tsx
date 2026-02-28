import { useAppStateBackground, useMqttConnection } from "@/hooks";
import { emitStateError } from "@/services/errorHandler";
import {
  MqttData,
  MqttError,
  MqttStatus,
  PublishTopicPayloadMap,
  PublishTopics,
  PublishToTopic,
  SubscribeToTopic,
} from "@/types";
import { MqttClient } from "mqtt";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

const MqttContext = createContext<{
  mqttClient: MqttClient | null;
  mqttData: MqttData;
  mqttStatus: MqttStatus;
  mqttError: MqttError;
  subscribeToTopic: SubscribeToTopic;
  unsubscribeToTopic: SubscribeToTopic;
  publishToTopic: PublishToTopic;
  setDoMqttConnection: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [doMqttConnection, setDoMqttConnection] = useState<boolean>(true);

  const {
    mqttClient,
    mqttData,
    mqttStatus,
    mqttError,
    setMqttError,
    setMqttStatus,
  } = useMqttConnection(doMqttConnection);

  useAppStateBackground(mqttClient);

  const subscribeToTopic: SubscribeToTopic = (topics, { qos = 1 } = {}) => {
    if (!mqttClient) {
      console.warn("MQTT client is not connected");
      return;
    }

    topics.forEach((topic) => {
      mqttClient.subscribe(topic, { qos }, (error) => {
        if (error) {
          setMqttStatus("Error");
          emitStateError(setMqttError, "MqttTopic", error);
        }
      });
    });
  };

  const unsubscribeToTopic: SubscribeToTopic = (topics) => {
    if (!mqttClient) {
      console.warn("MQTT client is not connected");
      return;
    }

    topics.forEach((topic) => {
      mqttClient.unsubscribe(topic, (error) => {
        if (error) {
          setMqttStatus("Error");
          emitStateError(setMqttError, "MqttTopic", error);
        }
      });
    });
  };

  const publishToTopic: PublishToTopic = <T extends PublishTopics>(
    topic: T,
    message: PublishTopicPayloadMap[T],
  ) => {
    if (!mqttClient) {
      console.warn("MQTT client is not connected");
      return;
    }

    const payload =
      message === undefined || message === null ? "" : JSON.stringify(message);

    mqttClient.publish(topic, payload);
  };

  return (
    <MqttContext.Provider
      value={{
        mqttClient,
        mqttData,
        mqttStatus,
        mqttError,
        subscribeToTopic,
        unsubscribeToTopic,
        publishToTopic,
        setDoMqttConnection,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error("useMqtt must be used within an MqttProvider");
  }
  return context;
};
