import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../components/AuthorizationContext";
import { auth, db } from "../firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Text as TextKitten } from "@ui-kitten/components";
import NetInfo from "@react-native-community/netinfo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const Login = ({ navigation }) => {
  const [token, setToken] = React.useState();
  const { signIn } = React.useContext(AuthContext);

  const [data, setData] = React.useState({
    email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const getNetInfo = async() => {
    let isConnectedToInternet = false;
    await NetInfo.fetch().then((state) => {
      isConnectedToInternet = state.isConnected;
    });
    return isConnectedToInternet;
  };

  const loginUser = async() => {
    let isConnectedToInternet = await getNetInfo();
    if (isConnectedToInternet != true) {
      alert("You must be connected to the internet to log in!");
    } else {
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((response) => {
          storeData(data.email);
          signIn(data.email);
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            alert("That email address is invalid!");
          }
          if (error.code === "auth/wrong-password") {
            alert("Wrong Password!");
          }
          if (error.code === "auth/user-not-found") {
            alert("User not Found!");
          }
          //console.log(error);
        });
    }
  };

  const { colors } = useTheme();

  const storeData = async (email) => {
    await AsyncStorage.setItem("email", email);
    await getNotificationsNumber(email);
  };

  const getNotificationsNumber = async (email) => {
    let ref = doc(collection(db, "notifications"), email);
    let res = await getDoc(ref);
    let nots = res.get("notifications");
    if (nots == undefined) nots = [];
    await AsyncStorage.setItem("nNotifications", nots.length.toString());
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const handleEmailChange = (val) => {
    setData({
      ...data,
      email: val,
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
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View style={styles.header}>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/beers.png")}
        ></ImageBackground>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <TextKitten style={styles.text_footer}>Email</TextKitten>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(email) => handleEmailChange(email)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <TextKitten style={[styles.text_footer, { marginTop: "5%" }]}>
          Password
        </TextKitten>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(password) => handlePasswordChange(password)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              loginUser();
            }}
          >
            <TextKitten style={styles.textSign} category="label">
              LOG IN
            </TextKitten>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
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
    flex: 3,
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
    fontWeight: "700",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
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
    marginTop: "20%",
  },
  textSign: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
