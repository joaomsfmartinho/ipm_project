import React, { useState } from "react";
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
  TouchableHighlight,
} from "react-native";
import { Button } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text as TextKitten, Divider } from "@ui-kitten/components";
import {auth} from "../firebase"
import {createUserWithEmailAndPassword} from "firebase/auth"
import { AuthContext } from '../components/AuthorizationContext';

const SignInScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    date: new Date(1598051730000),
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const { signIn } = React.useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("Male");

  const handleRegistration = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(response => {
            storeData(response.user.stsTokenManager.accessToken, data.email);
            // TODO: Store user info in DB and store Image
            signIn(response.user.stsTokenManager.accessToken, data.email);
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }
            if (error.code === 'auth/wrong-password') {
                console.log('Wrong Password!');
            }
            console.log(error);
        });
  };

  const storeData = async (token, email) => {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('token', token);
}

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
      date: currentDate,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#14555d" barStyle="light-content" />
      <View style={styles.header}>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Nome</Text>
          <View style={styles.action}>
            <FontAwesome name="user" color="#05375a" size={20} />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handleNameChange(val)}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Email
          </Text>
          <View style={styles.action}>
            <FontAwesome name="envelope" color="#05375a" size={20} />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
            />
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Password
          </Text>
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
          <View>
            <TouchableHighlight onPress={setShow}>
              <View>
                <TextKitten style={styles.picker} category="label">
                  {data.date.toLocaleDateString()}
                </TextKitten>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={data.date}
                    mode={"date"}
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </TouchableHighlight>
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Gender
          </Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Photo
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                handleRegistration();
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
                Register
              </Text>
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
    paddingBottom: 50,
    backgroundColor: "#white",
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
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
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ffd086",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
