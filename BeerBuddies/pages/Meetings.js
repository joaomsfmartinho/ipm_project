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
import { useNavigation } from "@react-navigation/native";
import bars from "../assets/data/bars.json";
import ModalPopup from "../components/ModalPopup";

export default function Meetings() {
  const { colors } = useTheme();
  const [meetings, setMeetings] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [selectedIndex, selectIndex] = React.useState(0);
  const navigate = useNavigation();

  const navigateToBarView = (bar) => {
    navigate.push("BarView", bar);
  };

  const updateData = async () => {
    let email = await AsyncStorage.getItem("email");
    getMeetings(email);
  };

  const getMeetings = async (email) => {
    if (email) {
      let ref = doc(collection(db, "meetings"), email);
      let res = await getDoc(ref);
      let meet = res.get("meetings");
      if (meet !== undefined) {
        setMeetings(meet);
      }
    }
  };

  useEffect(() => {
    updateData();
  }, []);

  const openPlacePage = (name) => {
    for (let i = 0; i < bars.length; i++) {
      if (bars[i].name == name) {
        navigateToBarView(bars[i]);
        break;
      }
    }
  };

  const removeMeeting = (index) => {
    let updatedMeetings = [];
    for (let i = 0; i < meetings.length; i++) {
      if (i != index) updatedMeetings.push(meetings[i]);
    }
    setMeetings(updatedMeetings);
    updateMeetingInDB(updatedMeetings);
    // Update for other person
    updateMeetingForOtherInDB(
      meetings[i].email,
      meetings[i].time,
      meetings[i].place
    );
    setVisible(false);
  };

  const updateMeetingInDB = async (updatedMeetings) => {
    let email = await AsyncStorage.getItem("email");
    let ref = doc(collection(db, "meetings"), email);
    setDoc(ref, { meetings: updatedMeetings });
  };

  const updateMeetingForOtherInDB = async (otherEmail, time, place) => {
    let email = await AsyncStorage.getItem("email");
    let ref = doc(collection(db, "meetings"), otherEmail);
    let updatedMeetings = res.get("meetings");
    let toRemove;
    for (let i = 0; i < updatedMeetings.length; i++) {
      if (
        updatedMeetings[i].email == email &&
        updatedMeetings[i].time == time &&
        updatedMeetings[i].place == place
      )
        toRemove = i;
    }
    updatedMeetings.splice(toRemove, 1);
    setDoc(ref, { meetings: updatedMeetings });
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
      {meetings.length == 0 && (
        <View>
          <Text
            style={{
              alignSelf: "center",
              marginTop: 50,
              fontSize: 20,
              fontWeight: "500",
              color: "#737373",
            }}
          >
            No meetings, check back later!
          </Text>
        </View>
      )}
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
            Cancel Meeting?
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
                removeMeeting(selectedIndex);
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
        data={meetings}
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
              <View style={{ marginLeft: 80, alignSelf: "flex-start" }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                    fontWeight: "800",
                    alignSelf: "center",
                  }}
                ></Text>
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
                    openPlacePage(item.place);
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
                    style={styles.cancelButton}
                    onPress={() => {
                      selectIndex(index);
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
                      Cancel Meeting
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
    width: "36%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "green",
    marginLeft: 5,
  },
  declineButton: {
    width: "36%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "red",
  },
  cancelButton: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "red",
  },
});
