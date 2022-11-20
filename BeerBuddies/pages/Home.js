import * as React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableHighlight,
} from "react-native";
import StyledButton from "../components/StyledButton";
import { stopLocationUpdatesAsync } from "expo-location";
import { Button } from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Text as TextKitten, Divider } from "@ui-kitten/components";

export default function Home({ navigation }) {
  return (
    <View>
      <View style={styles.mainContainer}>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/beers.png")}
        ></ImageBackground>
        <View style={styles.titles}>
          <TextKitten style={styles.title} category="h5">
            Beer Buddies
          </TextKitten>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableHighlight
            onPress={() => {
              navigation.push("Login");
            }}
            underlayColor="#eca921"
            style={{
              marginLeft: "3%",
              marginTop: "5%",
              width: "95%",
              height: "8.5%",
              borderRadius: 1,
              borderColor: "black",
              borderWidth: 0.8,
              justifyContent: "center",
              backgroundColor: "#ffd086",
            }}
          >
            <View style={styles.button}>
              <TextKitten style={styles.textButton} category="label">
                LOG IN
              </TextKitten>
            </View>
          </TouchableHighlight>
          <Divider
            style={{
              alignSelf: "center",
              width: "100%",
              marginTop: "5%",
              height: "0.2%",
              backgroundColor: "#BEBEBE",
            }}
          />
          <TouchableHighlight
            underlayColor="#eca921"
            style={{
              marginLeft: "3%",
              marginTop: "4.5%",
              marginBottom: "0.5%",
              width: "95%",
              height: "8.5%",
              borderColor: "black",
              borderWidth: 0.8,
              borderRadius: 1,
              justifyContent: "center",
              backgroundColor: "#ffd086",
            }}
            onPress={() => {
              navigation.push("Register");
            }}
          >
            <View style={styles.button}>
              <TextKitten style={styles.textButton} category="label">
                REGISTER
              </TextKitten>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  titles: {
    marginTop: "68%",
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    color: "#eca921",
    textShadowColor: "#000",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 2,
  },

  textButton: {
    fontSize: 15,
    color: "#000",
    width: "100%",
    textAlign: "center",
  },

  image: {
    width: "72%",
    height: "50%",
    marginLeft: "25%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  button: {
    alignItems: "center",
    padding: 10,
  },

  buttonsContainer: {
    position: "absolute",
    marginTop: "96%",
    width: "100%",
    height: "100%",
  },
});
