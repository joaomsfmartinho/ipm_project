import React from "react";
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
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase";
import { CheckBox } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

const GoingToBar = ({ route }) => {
  const [time, updateTime] = React.useState("21:00");
  const [checkedM, setCheckedM] = React.useState(false);
  const [checkedF, setCheckedF] = React.useState(false);
  const [minAge, setMinAge] = React.useState("18");
  const [maxAge, setMaxAge] = React.useState("60");

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

      alert("Confirmed!");
    } catch (e) {
      alert(e);
    }
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
      <View
        style={{
          width: "100%",
          height: "10%",
          flexDirection: "row",
          marginTop: "0.5%",
          borderBottomColor: "#666666",
          borderBottomWidth: 2,
        }}
      >
        <View style={{ width: "15%", height: "100%", marginLeft: 5 }}>
          <TouchableOpacity
            onPress={() => navigateAboutUs()}
            activeOpacity={0.5}
          >
            <Image
              style={styles.image_beer}
              source={require("../assets/images/beers.png")}
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
                style={{ borderBottomWidth: 3, borderBottomColor: "#fce571" }}
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
                style={{ borderBottomWidth: 3, borderBottomColor: "#fce571" }}
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
          onPress={() => confirmStuff()}
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
    width: "100%",
    height: "95%",
  },
  bar_title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  text_subtitles: {
    fontWeight: "bold",
  },
});

export default GoingToBar;
