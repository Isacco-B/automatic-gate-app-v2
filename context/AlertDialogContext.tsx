import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui';
import { Text } from '@/components/ui/text';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View } from 'react-native';

type AlertDialogContextType = {
  showAlertDialog: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string,
    customContent?: ReactNode
  ) => void;
  hideAlertDialog: () => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | null>(null);

export const AlertDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: () => {},
    customContent: null as ReactNode | null,
  });

  const hideAlertDialog = () => setOpen(false);

  const showAlertDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = '',
    cancelText = '',
    customContent: ReactNode = null
  ) => {
    setDialogConfig({ title, message, onConfirm, confirmText, cancelText, customContent });
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    dialogConfig.onConfirm();
  };

  return (
    <AlertDialogContext.Provider value={{ showAlertDialog, hideAlertDialog }}>
      {children}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent style={{ minWidth: '100%' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogConfig.message}</AlertDialogDescription>
            {dialogConfig.customContent && <View>{dialogConfig.customContent}</View>}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              {dialogConfig.cancelText && (
                <AlertDialogCancel>
                  <Text>{dialogConfig.cancelText}</Text>
                </AlertDialogCancel>
              )}

              {dialogConfig.confirmText && (
                <AlertDialogAction onPress={handleConfirm}>
                  <Text>{dialogConfig.confirmText}</Text>
                </AlertDialogAction>
              )}
            </View>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error('useAlertDialog must be used inside AlertDialogProvider');
  return ctx;
};
