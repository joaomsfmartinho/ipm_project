import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login'
import Register from '../pages/Register';
import Home from '../pages/Home';
import Filter from '../pages/Filter';

import About from '../pages/About';
import MyDrawer from '../routes/HomeDrawer';
import { HeaderBackButton } from 'react-navigation-stack';
import { ImageBackground } from 'react-native';
import Search from '../pages/Search';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (

    <Stack.Navigator
      initialRouteName="Search"
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

      <Stack.Screen
        name="Filter"
        component={Filter}
      />

      <Stack.Screen
        name="About"
        component={About}
      />

      <Stack.Screen
        name="Search"
        component={Search}
      />
    </Stack.Navigator>


  );
}

export default RootStack;