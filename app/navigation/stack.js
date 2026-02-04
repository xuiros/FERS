import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import Tabs from './tabs';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FrontID from '../screens/FrontID';
import BackID from '../screens/BackID';
import UserInformation from '../screens/UserInformation';
import ResponderDashboard from '../screens/ResponderDashboard';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="Tabs" component={Tabs} /> 
      <Stack.Screen name="FrontID" component={FrontID} />
      <Stack.Screen name="BackID" component={BackID} />
      <Stack.Screen name="UserInformation" component={UserInformation} />
      
      <Stack.Screen name="ResponderDashboard" component={ResponderDashboard}/>
    </Stack.Navigator>
  );
};

export default MainStack;
