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
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { Avatar, Title, Drawer } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalPoup from "../components/ModalPopup";
import bars from "../assets/data/bars.json";
import { ImageBackground } from "react-native-web";

const BarView = ({ bar }) => {
  bar = bars[0];

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View style={styles.textContainer}>
        <Text style={styles.varTitle}>Bar name</Text>
        <Text style={styles.varValue}>{bar.name}</Text>
        <Text style={[styles.varTitle, { marginTop: 35 }]}>
          Beer price (20cl)
        </Text>
        <Text style={styles.varValue}>{bar.price}€</Text>
        <Text style={[styles.varTitle, { marginTop: 35 }]}>Rating</Text>
        <Text style={styles.varValue}>{bar.rating}</Text>

        <Text style={[styles.varTitle, { marginTop: 35 }]}>Address</Text>
        <Text style={styles.varValue}>{bar.street}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/images/NoImage.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "row",
  },
  textContainer: {
    flexDirection: "column",
    flex: 0.6,
    height: "50%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 30,
    backgroundColor: "blue",
  },
  addressTextContainer: {
    flex: 0.6,
    height: "50%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 30,
    backgroundColor: "blue",
  },
  imageContainer: {
    paddingRight: 50,
    flex: 0.5,
    backgroundColor: "red",
    marginTop: 30,
    height: "40%",
  },
  image: {
    aspectRatio: 10 / 10,
  },
  varTitle: {
    color: "#05375a",
    fontSize: 18,
    fontWeight: "700",
  },
  varValue: {},
});

export default BarView;
