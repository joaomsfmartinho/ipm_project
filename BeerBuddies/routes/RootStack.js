import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login'
import Register from '../pages/Register';
import Home from '../pages/Home';
import MyDrawer from '../routes/HomeDrawer';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (

    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="Home"
        component={Home}
      />

      <Stack.Screen
        name="Login"
        component={Login}
      />

      <Stack.Screen
        name="Register"
        component={Register}
      />

    </Stack.Navigator>


  );
}

export default RootStack;