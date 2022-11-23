import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { Divider } from "@ui-kitten/components";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore/lite";

export default function Notifications() {
  const { colors } = useTheme();
  const [notifications, setNotifications] = React.useState([]);

  const updateData = async () => {
    let email = await AsyncStorage.getItem("email");
    getNotifications(email);
  };

  const getNotifications = async (email) => {
    if (email) {
      let ref = doc(collection(db, "notifications"), email);
      let res = await getDoc(ref);
      setNotifications(res.get("notifications"));
    }
  };

  useEffect(() => {
    setInterval(() => {
      updateData();
    }, 5000);
  }, []);

  const openPlacePage = () => {
    // TODO: Redirect to bar page
  };

  const removeNotification = async (index) => {
    let updated_notifications = notifications;
    updated_notifications.splice(index, 1);
    setNotifications(updated_notifications);
    let email = await AsyncStorage.getItem("email");
    let ref = doc(collection(db, "notifications"), email);
    setDoc(ref, { notifications: updated_notifications });
  };

  const data = [
    {
      email: "ahsahs",
      name: "Bingus",
      image: require("../assets/images/bingus.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 20,
      gender: "Male",
    },
    {
      email: "ahsahs",
      name: "Walter",
      image: require("../assets/images/walter.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 30,
      gender: "Male",
    },
    {
      email: "ahsahs",
      name: "Bruno Silva",
      image: require("../assets/images/BS.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 30,
      gender: "Male",
    },
    {
      email: "ahsahs",
      name: "Nig***",
      image: require("../assets/images/nig.png"),
      time: "19:30",
      place: "Buddies Bar",
      age: "??",
      gender: "???",
    },
    {
      email: "ahsahs",
      name: "Sus",
      image: require("../assets/images/rock.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: "??",
      gender: "???",
    },
  ];

  return (
    <View>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <FlatList
        data={notifications}
        ItemSeparatorComponent={NotificationDivider}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.container}>
              <View style={styles.headerLefTimageView}>
                <Image
                  style={styles.headerLeftImage}
                  source={{ uri: item.image }}
                />
                <View style={{ marginLeft: 10, alignSelf: "center" }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {item.name}
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {item.age} years
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 15,
                        fontWeight: "600",
                        marginTop: 5,
                      }}
                    >
                      {item.gender}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginLeft: 50, alignSelf: "flex-start" }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                    fontWeight: "800",
                    alignSelf: "center",
                  }}
                >
                  Wants to meet
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "800",
                    alignSelf: "center",
                  }}
                >
                  {item.time}
                </Text>
                <Pressable
                  onPress={() => {
                    openPlacePage;
                  }}
                >
                  <Text
                    style={{
                      color: "blue",
                      fontSize: 15,
                      fontWeight: "800",
                      alignSelf: "center",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {item.place}
                  </Text>
                </Pressable>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => {
                      removeNotification(index);
                    }}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: "#fff",
                        },
                      ]}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => {
                      removeNotification(index);
                    }}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: "#fff",
                        },
                      ]}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const NotificationDivider = () => {
  return (
    <Divider
      style={{
        alignSelf: "center",
        width: "100%",
        height: "0.2%",
        backgroundColor: "#ffd086",
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffd086",
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#f7b02d",
    borderWidth: 1,
    marginBottom: 1.5,
  },
  headerLeftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  headerLefTimageView: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginLeft: 15,
    flexDirection: "row",
  },
  acceptButton: {
    width: "38%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "green",
    marginLeft: 2,
  },
  declineButton: {
    width: "38%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "red",
  },
});
