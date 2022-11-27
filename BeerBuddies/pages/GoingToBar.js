import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase";
import { CheckBox } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalPopup from "../components/ModalPopup";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { useNavigation } from "@react-navigation/native";

const GoingToBar = ({ route }) => {
  const navigate = useNavigation();

  const [time, updateTime] = React.useState("21:00");
  const [checkedM, setCheckedM] = React.useState(false);
  const [checkedF, setCheckedF] = React.useState(false);
  const [minAge, setMinAge] = React.useState("18");
  const [maxAge, setMaxAge] = React.useState("60");
  const [visible, setVisible] = React.useState(false);

  const navigateBackwards = () => {
    navigate.goBack();
  };

  const confirmStuff = async () => {
    if (isNaN(minAge)) {
      alert("Min age must be a number");
      return;
    }
    if (isNaN(maxAge)) {
      alert("Max age must be a number");
      return;
    }

    let minAgeVal = parseInt(minAge);
    let maxAgeVal = parseInt(maxAge);
    if (maxAgeVal < minAgeVal) {
      alert("Max age must be higher than the min age");
      return;
    }
    await storeData();
  };

  async function storeData() {
    try {
      let mail = await AsyncStorage.getItem("email");

      let userRef = doc(collection(db, "users"), mail);
      let userDoc = await getDoc(userRef);
      let visitorsRef = doc(collection(db, "visitors"), route.params.name);

      let visitorsDoc = await getDoc(visitorsRef);

      let visitor = {
        email: mail,
        name: userDoc.get("name"),
        image: userDoc.get("image"),
        age: userDoc.get("age"),
        gender: userDoc.get("gender"),
        place: route.params.name,
        time: time,
        minAge: minAge,
        maxAge: maxAge,
        prefGenders: getPreferredGenders(),
        requested: [],
      };

      if (typeof visitorsDoc.get("visitors") !== "undefined") {
        // update list
        let visitorsList = visitorsDoc.get("visitors");
        visitorsList.push(visitor);
        updateDoc(visitorsRef, { visitors: visitorsList });
      } else {
        // new list
        setDoc(visitorsRef, { visitors: [visitor] });
      }
      navigateBackwards();
    } catch (e) { }
  }

  function getPreferredGenders() {
    let genders = [];

    if (checkedM) genders.push("Male");
    if (checkedF) genders.push("Female");

    if (genders.length == 0) return ["Male", "Female"];

    return genders;
  }

  return (
    <View style={styles.mainContainer}>
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
            Confirm visit to {route.params.name} at {time}?
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
                confirmStuff();
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
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalPopup>
      <View
        style={{
          width: "100%",
          height: "11%",
          flexDirection: "row",
          marginTop: "0.5%",
          borderBottomColor: "#666666",
          borderBottomWidth: 2,
          paddingBottom: 10,
        }}
      >
        <View style={{ width: "50%", height: "100%" }}>
          <TouchableOpacity onPress={() => navigateAboutUs()}>
            <Image
              style={styles.image_beer}
              source={require("../assets/images/beers.png")}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={{ width: "50%", height: "100%" }}>
          <TouchableOpacity onPress={() => navigateBackwards()}>
            <Image
              style={styles.image_arrow}
              source={require("../assets/images/back_arrow.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "40%",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text style={styles.bar_title}>{route.params.name}</Text>
        <Image
          style={{ width: "80%", height: "80%", margin: 10 }}
          source={{ uri: route.params.img }}
        />
      </View>
      <View style={{ marginHorizontal: "10%", height: "27%", width: "80%" }}>
        <Text style={styles.text_subtitles}>Time:</Text>
        <View>
          <Picker
            onValueChange={(itemValue, itemIndex) => updateTime(itemValue)}
            selectedValue={time}
            style={{ width: "50%" }}
          >
            <Picker.Item label="21:00" value="21:00" />
            <Picker.Item label="21:30" value="21:30" />
            <Picker.Item label="22:00" value="22:00" />
            <Picker.Item label="22:30" value="22:30" />
            <Picker.Item label="23:00" value="23:00" />
            <Picker.Item label="23:30" value="23:30" />
            <Picker.Item label="00:00" value="00:00" />
          </Picker>
        </View>
        <Text style={styles.text_subtitles}>Preferred genders:</Text>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <CheckBox
            checked={checkedM}
            onChange={(nextChecked) => setCheckedM(nextChecked)}
          >
            <Text>Male</Text>
          </CheckBox>
          <CheckBox
            checked={checkedF}
            onChange={(nextChecked) => setCheckedF(nextChecked)}
          >
            <Text>Female</Text>
          </CheckBox>
        </View>
        <View style={{ marginTop: 20, flexDirection: "row", height: "30%" }}>
          <View style={{ width: "30%", height: "100%" }}>
            <Text style={styles.text_subtitles}>Min. Age:</Text>
            <View style={{ width: "70%", height: "100%" }}>
              <TextInput
                style={{ borderBottomWidth: 3, borderBottomColor: "#ffd086" }}
                onChangeText={(val) => setMinAge(val)}
                defaultValue="18"
                keyboardType="phone-pad"
              >
                {" "}
              </TextInput>
            </View>
          </View>
          <View style={{ width: "30%", height: "100%" }}>
            <Text style={styles.text_subtitles}>Max. Age:</Text>
            <View style={{ width: "70%", height: "100%" }}>
              <TextInput
                style={{ borderBottomWidth: 3, borderBottomColor: "#ffd086" }}
                onChangeText={(val) => setMaxAge(val)}
                defaultValue="60"
                keyboardType="phone-pad"
              >
                {" "}
              </TextInput>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setVisible(true)}
          style={styles.button}
        >
          <Text
            style={{
              alignContent: "center",
              textAlign: "center",
              marginTop: "2.5%",
              fontSize: 23,
              fontWeight: "bold",
              color: "white",
            }}
          >
            I'm going to this bar.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "column",
  },
  button: {
    marginTop: 20,
    height: "25%",
    backgroundColor: "black",
    marginHorizontal: "10%",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 10,
  },
  image_beer: {
    width: "50%",
    height: "100%",
  },
  image_arrow: {
    width: "21%",
    height: "65%",
    marginLeft: "60%",
    marginTop: 17,
    opacity: 0.8,
  },
  bar_title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  text_subtitles: {
    fontWeight: "bold",
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

export default GoingToBar;
