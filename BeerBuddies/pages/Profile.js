import React, { useEffect } from "react";
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
  Pressable,
  TouchableHighlight,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text as TextKitten } from "@ui-kitten/components";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { Avatar, Title, Drawer } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalPoup from "../components/ModalPopup";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

const maxBirthdate = new Date(
  new Date().setFullYear(new Date().getFullYear() - 18)
);

const Profile = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [birthdate, setBirthdate] = React.useState(maxBirthdate);
  const [gender, setGender] = React.useState("Male");
  // TODO
  const [age, setAge] = React.useState(0);

  const [show, setShow] = React.useState(false);

  const choosePhoto = () => {
    // pick new photo
    alert("aaa");
  };

  const getData = async () => {
    setEmail(await AsyncStorage.getItem("email"));
    let ref = doc(collection(db, "users"), email);
    let res = await getDoc(ref);
    setImage(res.get("image"));
    setName(res.get("name"));
    setBirthdate(res.get("birthdate"));
    setGender(res.get("gender"));
    setAge(res.get("age"));
  };

  const updateData = async () => {
    let ref = doc(collection(db, "users"), email);
    await updateDoc(ref, {
      name: name,
      birthdate: birthdate,
      age: calculateAge(birthdate),
      image: image,
      gender: gender,
      age: age,
    });
  };

  const calculateAge = (birthday) => {
    try {
      var ageDifMs = Date.now() - birthday.getTime();
      var ageDate = new Date(ageDifMs); // milliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (e) {
      alert(e);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setBirthdate(currentDate);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View style={styles.footer}>
        <ScrollView>
          <TouchableOpacity styles={styles.image} onPress={() => choosePhoto()}>
            <Image
              style={styles.image}
              source={{ uri: image }}
              defaultSource={require("../assets/images/NoImage.png")}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 0,
              },
            ]}
          >
            Name
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user" color="#05375a" size={20} />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={name}
              onChangeText={(val) => setName(val)}
            />
          </View>
          <Text style={[styles.text_footer, {}]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome
              name="envelope"
              color="#05375a"
              size={20}
              defaultValue={email}
            />
            <Text style={styles.textInput}>{email}</Text>
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Birth Date
          </Text>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 0,
              },
            ]}
          >
            Gender
          </Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={gender}
              defaultValue={gender}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
        </ScrollView>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              updateData();
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
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/*
<View>
  <TouchableHighlight onPress={setShow}>
    <View>
      <TextKitten style={styles.picker} category="label">
        {birthdate.toLocaleDateString()}
      </TextKitten>
      {show && (
        <DateTimePicker
          maximumDate={maxBirthdate}
          testID="dateTimePicker"
          value={birthdate}
          mode={"date"}
          onChange={handleDateChange}
        />
      )}
    </View>
  </TouchableHighlight>
</View>
*/

export default Profile;
const imageSize = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  image: {
    width: imageSize,
    height: imageSize,
    alignSelf: "flex-end",
    borderColor: "#ffd086",
    borderWidth: 1,
    borderRadius: imageSize / 2,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  header: {
    flex: 0,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#ffd086",
  },
  text_header: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 25,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  footer: {
    flex: Platform.OS === "android" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#000",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
