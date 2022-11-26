import React, { useEffect } from "react";
import { View, ActivityIndicator, LogBox, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./routes/RootStack";
import UserDrawer from "./routes/UserDrawer";
import { AuthContext } from "./components/AuthorizationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserProfile from "./pages/UserProfile";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import Map from "./pages/Map";
import PostsStack from "./routes/PostsStack";
import MyParcells from "./pages/MyParcells";

import Filter from "./pages/Filter";
import {
  ApplicationProvider,
  Layout,
  styled,
  Text,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { db } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";
import Search from "./pages/Search";

const Tab = createBottomTabNavigator();

export default function App(props) {
  // var intervalId = window.setInterval(function(){
  //   setToken(AsyncStorage.getItem("tokenID"))
  // }, 10000);

  const [numberNotifications, setNumberNotifications] = React.useState(0);

  const updateData = async () => {
    let email = await AsyncStorage.getItem("email");
    getNotificationsNumber(email);
  };

  const getNotificationsNumber = async (email) => {
    if (email) {
      let ref = doc(collection(db, "notifications"), email);
      let res = await getDoc(ref);
      let nots = res.get("notifications");
      if (nots !== undefined) {
        setNumberNotifications(nots.length);
      }
    }
  };

  useEffect(() => {
    setInterval(() => {
      updateData();
    }, 5000);
  }, []);

  initialLoginState = {
    email: null,
    token: null,
  };

  loginReducer = (prevState, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...prevState,
          token: action.token,
          email: action.email,
        };
      case "LOGOUT":
        return {
          ...prevState,
          token: null,
          email: null,
        };
      case "RETRIEVE_DATA":
        return {
          ...prevState,
          token: action.token,
          email: action.email,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (token, email) => {
        try {
          if (email != null) {
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("email", email);
          }
        } catch (e) {
          console.warn(e);
        }
        dispatch({ type: "LOGIN", email: email, token: token });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("email");
        } catch (e) {
          console.warn(e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  const getBarItem = (route, focused, color, size) => {
    size = size * 1.4;
    let iconName;
    if (route.name === "Map") {
      iconName = focused ? "map" : "map-outline";
      return <Ionicons name={iconName} size={size} color={color} />;
    } else if (route.name === "Notifications") {
      iconName = focused ? "notifications-sharp" : "notifications-outline";
      return <Ionicons name={iconName} size={size} color={color} />;
    } else if (route.name === "Profile") {
      iconName = focused ? "account-circle" : "account-circle-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    } else if (route.name == "Search") {
      iconName = "search";
      return <FontAwesome name={iconName} size={size} color={color} />;
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.token != null ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) =>
                  getBarItem(route, focused, color, size),
                tabBarActiveTintColor: "#ffd086",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: styles.mainTab,
              })}
            >
              <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                  tabBarShowLabel: false,
                  tabBarBadge: numberNotifications,
                  tabBarBadgeStyle: styles.badge,
                }}
              />
              <Tab.Screen
                name="Map"
                component={Map}
                options={{ tabBarShowLabel: false }}
              />
              <Tab.Screen
                name="Search"
                component={Search}
                options={{ tabBarShowLabel: false }}
              />
              <Tab.Screen
                name="Profile"
                component={Profile}
                options={{ tabBarShowLabel: false }}
              />
              <Tab.Screen
                name="Filter"
                component={Filter}
                options={{ tabBarShowLabel: false }}
              />
              <Tab.Screen
                name="About"
                component={About}
                options={{ tabBarShowLabel: false }}
              />
            </Tab.Navigator>
          ) : (
            <RootStack />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#ffd086",
    color: "white",
  },
  mainTab: {
    flex: 0.08,
  },
});
