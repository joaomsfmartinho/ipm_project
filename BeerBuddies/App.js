import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./routes/RootStack";
import { AuthContext } from "./components/AuthorizationContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import BarVisitors from "./pages/BarVisitors";
import About from "./pages/About";
import Map from "./pages/Map";
import BarView from "./pages/BarView";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoingToBar from "./pages/GoingToBar";

import Filter from "./pages/Filter";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Search from "./pages/Search";
import Meetings from "./pages/Meetings";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App(props) {
  // var intervalId = window.setInterval(function(){
  //   setToken(AsyncStorage.getItem("tokenID"))
  // }, 10000);

  const [numberNotifications, setNumberNotifications] = React.useState(0);

  const updateData = async () => {
    let nNots = await AsyncStorage.getItem("nNotifications");
    if (nNots != undefined) setNumberNotifications(parseInt(nNots));
  };

  useEffect(() => {
    setInterval(() => {
      updateData();
    }, 1000);
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
    } else if (route.name === "Meetings") {
      iconName = focused ? "people-sharp" : "people-outline";
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

  const Home = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) =>
            getBarItem(route, focused, color, size),
          tabBarActiveTintColor: "#ffd086",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: styles.mainTab,
        })}
        initialRouteName="Map"
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
          name="Meetings"
          component={Meetings}
          options={{
            tabBarShowLabel: false,
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{ tabBarShowLabel: false, headerShown: false }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{ tabBarShowLabel: false, headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarShowLabel: false, headerShown: false }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.token != null ? (
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Filter"
                component={Filter}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="About"
                component={About}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BarView"
                component={BarView}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="GoingToBar"
                component={GoingToBar}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Bar Visitors" component={BarVisitors} />
            </Stack.Navigator>
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
