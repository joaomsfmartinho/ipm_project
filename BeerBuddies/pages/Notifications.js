import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";

const THUMB_SIZE = 80;

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Notifications() {
  const { colors } = useTheme();
  const [notifications, setNotifications] = React.useState([]);

  const updateData = async () => {
    let email = await AsyncStorage.getItem("email");
    getNotifications(email);
  };

  const getNotifications = async (email) => {
    if (email) {
      let ref = doc(collection(db, "users"), email);
      let res = await getDoc(ref);
      setNotifications(res.get("notifications"));
    }
  };

  useEffect(() => {
    setInterval(() => {
      updateData();
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <Text>{notifications}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: "2%",
  },
  list: {
    flex: 1,
  },
  card: {
    width: "96%",
    marginBottom: "5%",
    marginLeft: "2%",
  },
  listImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: "#14555d",
  },
  footer: {
    flex: 7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "black",
    alignItems: "center",
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#14555d",
    fontSize: 22,
  },
});
