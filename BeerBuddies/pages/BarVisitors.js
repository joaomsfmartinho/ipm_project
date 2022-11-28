import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import { Divider } from "@ui-kitten/components";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore/lite";
import ModalPopup from "../components/ModalPopup";

const BarVisitors = ({ route }) => {
  const { colors } = useTheme();
  const [visitors, setVisitors] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [selectedPerson, selectPerson] = React.useState("");
  const [selectedTime, selectTime] = React.useState("19:30");
  const [selectedIndex, selectIndex] = React.useState(0);

  const getVisitors = async () => {
    let mail = await AsyncStorage.getItem("email");
    let bar = route.params.name;
    setEmail(mail);
    let userRef = doc(collection(db, "users"), mail);
    let userDoc = await getDoc(userRef);
    let userAge = userDoc.get("age");
    let userName = userDoc.get("name");
    let userGender = userDoc.get("gender");
    let ref = doc(collection(db, "visitors"), bar);
    let res = await getDoc(ref);
    let vis = res.get("visitors");
    if (vis !== undefined) {
      let filteredV = [];
      for (let i = 0; i < vis.length; i++) {
        let v = vis[i];
        if (
          userAge <= v.maxAge &&
          userAge >= v.minAge &&
          v.prefGenders.includes(userGender) &&
          v.name != userName
        ) {
          filteredV.push(v);
        }
      }
      setVisitors(filteredV);
    }
  };

  const requestMeeting = () => {
    let updated_visitors = [];
    for (let i = 0; i < visitors.length; i++) {
      let v = visitors[i];
      if (i == selectedIndex) {
        updateNotifications(v.email, v.time);
        v.requested.push(email);
      }
      updated_visitors.push(v);
    }
    setVisitors(updated_visitors);
    updateVisitorsInDB(updated_visitors);
    setVisible(false);
  };

  const updateVisitorsInDB = async (updated_visitors) => {
    let email = await AsyncStorage.getItem("email");
    let ref = doc(collection(db, "visitors"), email);
    setDoc(ref, { visitors: updated_visitors });
  };

  const updateNotifications = async (visitor, time) => {
    let email = await AsyncStorage.getItem("email");
    let userRef = doc(collection(db, "users"), email);
    let user = await getDoc(userRef);
    let ref = doc(collection(db, "notifications"), visitor);
    let res = await getDoc(ref);
    let nots = res.get("notifications");
    let updatedNotifications = nots;
    updatedNotifications.push({
      age: user.get("age"),
      email: email,
      gender: user.get("gender"),
      image: user.get("image"),
      name: user.get("name"),
      place: route.params.name,
      time: time,
    });
    setDoc(ref, { notifications: updatedNotifications });
  };

  useEffect(() => {
    getVisitors();
  }, []);

  const data = [
    {
      email: "ahsahs",
      name: "Bingus",
      image: require("../assets/images/bingus.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 20,
      maxAge: 80,
      minAge: 20,
      gender: "Male",
      requested: ["a@a.com"],
    },
    {
      email: "ahsahs",
      name: "Walter",
      image: require("../assets/images/walter.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 30,
      maxAge: 80,
      minAge: 60,
      gender: "Male",
      requested: [],
    },
    {
      email: "ahsahs",
      name: "Bruno Silva",
      image: require("../assets/images/BS.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: 30,
      maxAge: 80,
      minAge: 30,
      gender: "Male",
      requested: [],
    },
    {
      email: "ahsahs",
      name: "Nig***",
      image: require("../assets/images/nig.png"),
      time: "19:30",
      place: "Buddies Bar",
      age: "??",
      maxAge: 80,
      minAge: 60,
      gender: "???",
      requested: [],
    },
    {
      email: "ahsahs",
      name: "Sus",
      image: require("../assets/images/rock.jpg"),
      time: "19:30",
      place: "Buddies Bar",
      age: "??",
      maxAge: 80,
      minAge: 60,
      gender: "???",
      requested: [],
    },
  ];

  return (
    <View>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />

      <ModalPopup visible={visible} style={styles.popup}>
        <View>
          <Text
            style={{
              alignSelf: "center",
              padding: 10,
              fontSize: 25,
              fontWeight: "700",
            }}
          >
            Request meeting with {selectedPerson} at {selectedTime}?
          </Text>
          <View
            style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}
          >
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => {
                setVisible(false);
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
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                requestMeeting(selectedPerson);
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
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalPopup>
      <FlatList
        data={visitors}
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
                      fontWeight: "600",
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
                        marginTop: 10,
                      }}
                    >
                      {item.gender}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginLeft: 80, alignSelf: "flex-start" }}>
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
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  {!item.requested.includes(email) && (
                    <TouchableOpacity
                      style={styles.requestButton}
                      onPress={() => {
                        selectIndex(index);
                        selectPerson(item.name);
                        selectTime(item.time);
                        setVisible(true);
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
                        Request Meeting
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.requested.includes(email) && (
                    <TouchableOpacity
                      style={styles.requestedButton}
                      onPress={() => {}}
                    >
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: "#fff",
                          },
                        ]}
                      >
                        Requested
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

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
  requestButton: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#faae3c",
    marginLeft: 2,
  },
  requestedButton: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#6b4900",
    marginLeft: 2,
  },
  acceptButton: {
    width: "40%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "green",
    marginLeft: 20,
  },
  declineButton: {
    width: "40%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "red",
    marginRight: 20,
  },
});

export default BarVisitors;
