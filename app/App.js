import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigation/stack';

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
