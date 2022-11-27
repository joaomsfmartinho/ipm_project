import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Post from '../pages/Post'
import Forum from '../pages/Forum'

const Stack = createNativeStackNavigator();

function PostsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name="ForumStack"
        component={Forum}
      />

      <Stack.Screen
        name="PostStack"
        component={Post}
      />

    </Stack.Navigator>
  );
}

export default PostsStack;