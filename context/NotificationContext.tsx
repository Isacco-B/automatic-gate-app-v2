import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
import type { LucideIcon } from 'lucide-react-native';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type NotificationContextType = {
  notify: (
    title: string,
    message: string,
    icon: LucideIcon,
    options?: { variant?: 'default' | 'destructive'; duration?: number }
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const notify = useCallback(
    (
      title: string,
      message: string,
      icon: LucideIcon,
      options?: { variant?: 'default' | 'destructive'; duration?: number }
    ) => {
      const id = Date.now().toString();

      const newNotification: NotificationType = {
        id,
        title,
        message,
        icon,
        variant: options?.variant ?? 'default',
        duration: options?.duration ?? 3000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, newNotification.duration);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          gap: 10,
          zIndex: 999,
        }}>
        {notifications.map((n) => (
          <Animated.View key={n.id} entering={FadeIn} exiting={FadeOut} style={{ width: '100%' }}>
            <Alert variant={n.variant} icon={n.icon}>
              <AlertTitle>{n.title}</AlertTitle>
              <AlertDescription>{n.message}</AlertDescription>
            </Alert>
          </Animated.View>
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
