import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ROUTES } from '@/routes';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="items-center gap-6">
          <View className="items-center gap-2">
            <Text className="text-7xl font-bold text-foreground/20">404</Text>
            <Text className="text-2xl font-semibold text-foreground">Pagina non trovata</Text>
            <Text className="text-center text-base text-muted-foreground">
              La pagina che stai cercando non esiste o è stata rimossa.
            </Text>
          </View>

          <Link href={ROUTES.HOME} asChild>
            <Button className="mt-4 w-full max-w-xs">
              <Text>Torna alla home</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}
