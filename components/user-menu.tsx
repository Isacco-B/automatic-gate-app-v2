import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { useAlertDialog, useAuth } from '@/context';
import { cn } from '@/lib/utils';
import type { TriggerRef } from '@rn-primitives/popover';
import { router } from 'expo-router';
import { LogOutIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

const USER = {
  fullName: 'Zach Nugent',
  initials: 'ZN',
  imgSrc: { uri: 'https://github.com/mrzachnugent.png' },
  username: 'mrzachnugent',
};

export function UserMenu() {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);
  const { logout } = useAuth();

  const { showAlertDialog } = useAlertDialog();

  const handleDelete = () => {
    showAlertDialog(
      'Sei sicuro di voler uscire?',
      "Una volta disconnesso, dovrai effettuare nuovamente l'accesso per continuare.",
      () => console.log('Account eliminato!'),
      'Conferma',
      'Annulla'
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" side="bottom" className="w-80 p-0">
        <View className="gap-3 border-b border-border p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">{USER.fullName}</Text>
              {USER.fullName?.length ? (
                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                  {USER.username}
                </Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                popoverTriggerRef.current?.close();
                router.push('/profile');
              }}>
              <Icon as={SettingsIcon} className="size-4" />
              <Text>Modifica profilo</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onPress={handleDelete}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Disconettiti</Text>
            </Button>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar({ className, ...props }: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  return (
    <Avatar alt={`${USER.fullName}'s avatar`} className={cn('size-8', className)} {...props}>
      <AvatarImage source={USER.imgSrc} />
      <AvatarFallback>
        <Text>{USER.initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
