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
  Image,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text as TextKitten } from "@ui-kitten/components";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../components/AuthorizationContext";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const maxBirthdate = new Date(
  new Date().setFullYear(new Date().getFullYear() - 18)
);

const SignInScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    birthdate: maxBirthdate,
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const { signIn } = React.useContext(AuthContext);
  const [show, setShow] = React.useState(false);
  const [gender, setGender] = React.useState("Male");
  const [image, setImage] = React.useState(null);

  const handleRegistration = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        storeData(data);
        signIn(data.email);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("That email address is already in use!");
        }
        if (error.code === "auth/invalid-email") {
          alert("Invalid email!");
        }
        if (error.code === "auth/weak-password") {
          alert("Password needs at least 6 characters!");
        }
        //console.error(error);
      });
  };

  const storeData = async (data) => {
    AsyncStorage.setItem("email", data.email);
    AsyncStorage.setItem("nNotifications", "0");
    let ref = doc(collection(db, "users"), data.email);

    setDoc(ref, {
      name: data.name,
      birthdate: data.birthdate.toDateString(),
      age: calculateAge(data.birthdate),
      image: image,
      gender: gender,
    });
    ref = doc(collection(db, "notifications"), data.email);
    setDoc(ref, { notifications: [] });
  };

  const calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const handleNameChange = (val) => {
    setData({
      ...data,
      name: val,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setData({
      ...data,
      birthdate: currentDate,
    });
  };

  const handleChooseImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let splitted = result.uri.split(".");
      let imageType = splitted[splitted.length - 1];
      let imageString = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage(`data:image/${imageType};base64,${imageString}`);
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View style={styles.header}>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/beers.png")}
        ></ImageBackground>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <TextKitten style={styles.text_footer}>Name</TextKitten>
          <View style={styles.action}>
            <FontAwesome name="user" color="#05375a" size={20} />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handleNameChange(val)}
            />
          </View>
          <TextKitten
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Email
          </TextKitten>
          <View style={styles.action}>
            <FontAwesome name="envelope" color="#05375a" size={20} />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
            />
          </View>

          <TextKitten
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Password
          </TextKitten>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather
                  name="eye-off"
                  color="grey"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              ) : (
                <Feather
                  name="eye"
                  color="grey"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <TextKitten
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Birth Date
          </TextKitten>
          <View>
            <TouchableHighlight onPress={setShow}>
              <View>
                <TextKitten style={styles.picker} category="label">
                  {data.birthdate.toLocaleDateString()}
                </TextKitten>
                {show && (
                  <DateTimePicker
                    maximumDate={maxBirthdate}
                    testID="dateTimePicker"
                    value={data.birthdate}
                    mode={"date"}
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </TouchableHighlight>
          </View>
          <TextKitten
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Gender
          </TextKitten>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <TextKitten
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Photo
          </TextKitten>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <TouchableOpacity
            style={styles.choosePhoto}
            onPress={() => {
              handleChooseImage();
            }}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#05375a",
                },
              ]}
            >
              Choose Photo
            </Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                handleRegistration();
              }}
            >
              <TextKitten style={styles.textSign} category="label">
                Register
              </TextKitten>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#14555d",
    marginTop: 5,
    width: "50%",
  },
  picker: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#white",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 0,
    backgroundColor: "#white",
  },
  image: {
    width: "50%",
    height: "60%",
    marginLeft: "40%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    fontWeight: "700",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  choosePhoto: {
    borderRadius: 10,
    backgroundColor: "#ffd086",
    marginRight: 230,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ffd086",
  },
  textSign: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
