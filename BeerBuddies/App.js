import React, { useEffect } from 'react';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './routes/RootStack';
import UserDrawer from './routes/UserDrawer';
import { AuthContext } from './components/AuthorizationContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserProfile from './pages/UserProfile'
import UserPage from './pages/UserPage'
import About from './pages/About'
import Map from './pages/Map';
import PostsStack from './routes/PostsStack';
import MyParcells from './pages/MyParcells';


const Drawer = createDrawerNavigator();

export default function App(props) {

  // var intervalId = window.setInterval(function(){
  //   setToken(AsyncStorage.getItem("tokenID"))
  // }, 10000);

  useEffect(() => {
    LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native.']);
  }, []);

  initialLoginState = {
    email: null,
    token: null
  };

  loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...prevState,
          token: action.token,
          email: action.email,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          token: null,
          email: null,
        };
      case 'RETRIEVE_DATA':
        return {
          ...prevState,
          token: action.token,
          email: action.email,
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (token, email) => {
      try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('email', email);
      } catch (e) {
        console.warn(e);
      }
      dispatch({ type: 'LOGIN', email: email, token: token });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
      } catch (e) {
        console.warn(e);
      }
      dispatch({ type: 'LOGOUT' });
    }
  }), []);

  return (
    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        {loginState.token != null ? (
          <Drawer.Navigator screenOptions={({ route }) => ({
            headerShown: route.name === "ForumStack" ? false : true
          })} drawerContent={props => <UserDrawer {...props} />}>
            <Drawer.Screen name="Saving Fields" component={UserPage} />
            <Drawer.Screen name="Perfil" component={UserProfile} />
            <Drawer.Screen name="Forum" component={PostsStack} />
            <Drawer.Screen name="MyParcells" component={MyParcells} options={{title: "As Minhas Parcelas"}} />
            <Drawer.Screen name="Map" component={Map} options={{ title: "Parcelas" }} />
            <Drawer.Screen name="Sobre" component={About}  />
          </Drawer.Navigator>
        )
          :
          <RootStack />

        }

      </NavigationContainer>



    </AuthContext.Provider>

  );
}

