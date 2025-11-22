import { LoginType, useAuth } from '@/context';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Text,
} from './ui';

export default function SignInForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginType>({
    username: '',
    password: '',
  });

  function handleChange(field: keyof LoginType) {
    return (text: string) => {
      setFormData((prevState) => ({
        ...prevState,
        [field]: text,
      }));
    };
  }

  function onSubmit() {
    if (!isValid) return;
    Keyboard.dismiss();
    login(formData);
    setFormData({ username: '', password: '' });
  }

  const isValid = [formData.username.trim(), formData.password.trim()].every(Boolean);

  return (
    <KeyboardAvoidingView behavior={'height'} className="flex-1" keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-4">
            <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
              <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">
                  Accedi al tuo account
                </CardTitle>
                <CardDescription className="text-center sm:text-left">
                  Inserisci le tue credenziali per continuare
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-6">
                <View className="gap-6">
                  <View className="gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Inserisci il tuo username"
                      value={formData.username}
                      onChangeText={handleChange('username')}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  </View>
                  <View className="gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="*********"
                      value={formData.password}
                      onChangeText={handleChange('password')}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={onSubmit}
                    />
                  </View>
                  <Button className="w-full" onPress={onSubmit} disabled={!isValid}>
                    <Text>Continua</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
