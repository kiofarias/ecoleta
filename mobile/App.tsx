import React from 'react';
import {AppLoading} from 'expo';
import { Text , StatusBar } from 'react-native';
import { Ubuntu_400Regular, Ubuntu_500Medium } from '@expo-google-fonts/ubuntu'
import { Roboto_700Bold , useFonts } from '@expo-google-fonts/roboto'
import Routes from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading/>
  }
  
  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent/>
      <Routes/>
    </>
  );
}

