import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Text,
} from '@/components/ui';
import { useAlertDialog, useAuth, useNotification } from '@/context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { AlertTriangle, Camera, Check, Loader2, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function UserProfileScreen() {
  const { userProfile, updateProfile } = useAuth();
  const { showAlertDialog } = useAlertDialog();
  const { notify } = useNotification();
  const { colorScheme } = useColorScheme();

  const [displayName, setDisplayName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [displayNameError, setDisplayNameError] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setProfileImage(userProfile.profileImage);
    }
  }, [userProfile]);

  useEffect(() => {
    const nameChanged = displayName !== (userProfile?.displayName || '');
    const imageChanged = profileImage !== userProfile?.profileImage;
    setHasChanges(nameChanged || imageChanged);
  }, [displayName, profileImage, userProfile]);

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        notify(
          'Permessi mancanti',
          "È necessario concedere l'accesso alla galleria per selezionare un'immagine.",
          AlertTriangle,
          {
            variant: 'destructive',
          }
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Am error occurred while selecting an image:', error);
      notify(
        'Qualcosa è andato storto!',
        "Si è verificato un errore durante la selezione dell'immagine",
        AlertTriangle,
        {
          variant: 'destructive',
        }
      );
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        notify(
          'Permessi mancanti',
          "È necessario concedere l'accesso alla fotocamera per scattare una foto.",
          AlertTriangle,
          {
            variant: 'destructive',
          }
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('An error occurred while taking a photo:', error);
      notify(
        'Qualcosa è andato storto!',
        'Si è verificato un errore durante lo scatto della foto',
        AlertTriangle,
        {
          variant: 'destructive',
        }
      );
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setDisplayNameError(true);
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({
        displayName: displayName.trim(),
        profileImage: profileImage,
      });

      notify('Operazione riuscita', 'Profilo aggiornato correttamente.', Check);
    } catch (error) {
      console.error('An error occurred while updating the profile:', error);
      notify(
        'Qualcosa è andato storto!',
        "Si è verificato un errore durante l'aggiornamento del profilo. Riprova.",
        AlertTriangle,
        {
          variant: 'destructive',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      showAlertDialog(
        'Sei sicuro di voler annullare?',
        'Tutte le modifiche non salvate andranno perse.',
        () => {
          router.back();
        },
        'Conferma',
        'Annulla'
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView behavior={'height'} className="flex-1" keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4 py-6">
            <Card className="border-border/0 shadow-none">
              <CardHeader>
                <CardTitle className="text-center text-xl">Profilo Utente</CardTitle>
                <CardDescription className="text-center">
                  Aggiorna le informazioni del tuo profilo
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-6">
                <View className="items-center">
                  <View className="relative mb-4">
                    <TouchableOpacity
                      onPress={selectImage}
                      activeOpacity={0.8}
                      className="size-32 items-center justify-center rounded-full border-4 border-white bg-muted shadow-lg">
                      {profileImage ? (
                        <Avatar alt="Immagine profilo" className="size-28">
                          <AvatarImage
                            source={{ uri: profileImage }}
                            className="size-28 rounded-full"
                          />
                          <AvatarFallback>
                            <Text className="text-2xl font-semibold">
                              {displayName.charAt(0).toUpperCase() || 'U'}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <User size={64} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                      )}
                    </TouchableOpacity>

                    <View className="absolute bottom-0 right-0">
                      <TouchableOpacity
                        onPress={takePhoto}
                        activeOpacity={0.8}
                        className="rounded-full bg-primary p-3">
                        <Camera size={20} color={colorScheme === 'dark' ? '#000' : '#fff'} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text className="text-center text-sm text-muted-foreground">
                    Tocca l'immagine per modificarla
                  </Text>
                </View>

                <View className="gap-6">
                  <View className="gap-2">
                    <Label htmlFor="displayName" nativeID="displayName">
                      Nome visualizzato
                    </Label>
                    <Input
                      id="displayName"
                      placeholder="Inserisci il tuo nome"
                      value={displayName}
                      onChangeText={(text) => {
                        setDisplayName(text);

                        if (displayNameError && text.trim()) {
                          setDisplayNameError(false);
                        }
                      }}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSaveProfile}
                      editable={!isLoading}
                      maxLength={50}
                      variant={displayNameError ? 'destructive' : 'default'}
                    />
                    {displayNameError && (
                      <Text className="text-xs text-destructive">
                        Il nome non può essere vuoto.
                      </Text>
                    )}
                    <Text className="text-xs text-muted-foreground">
                      {displayName.length}/50 caratteri
                    </Text>
                  </View>

                  <View className="gap-3">
                    <Button
                      className="w-full"
                      onPress={handleSaveProfile}
                      disabled={!hasChanges || isLoading}>
                      {isLoading ? (
                        <View className="flex-row items-center gap-2">
                          <Loader2 size={18} color="white" className="animate-spin" />
                          <Text>Salvataggio...</Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center gap-2">
                          <Check size={18} color="white" />
                          <Text>Salva modifiche</Text>
                        </View>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onPress={handleCancel}
                      disabled={isLoading}>
                      <Text>Annulla</Text>
                    </Button>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
