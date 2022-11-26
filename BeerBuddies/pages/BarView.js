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
      <View style={styles.topContainer}>
        <View style={styles.leftTextContainer}>
          <Text style={styles.varTitle}>Bar name</Text>
          <Text style={styles.varValue}>{bar.name}</Text>
          <Text style={[styles.varTitle, { marginTop: 35 }]}>
            Beer price (20cl)
          </Text>
          <Text style={styles.varValue}>{bar.price}€</Text>
          <Text style={[styles.varTitle, { marginTop: 35 }]}>Rating</Text>
          <Text style={styles.varValue}>{bar.rating}</Text>
          <Image
            style={styles.starIcon}
            source={require("../assets/images/rating_star.png")}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/images/NoImage.png")}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.varTitle}>Address</Text>
        <Text style={styles.varValue}>{bar.street}</Text>
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
  topContainer: {
    flexDirection: "row",
    flex: 0.4,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
    //backgroundColor: "blue",
  },
  bottomContainer: {
    flexDirection: "column",
    flex: 0.5,
    height: "50%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginBottom: 10,
    //backgroundColor: "green",
  },
  leftTextContainer: {
    flex: 0.5,
    height: "100%",
    backgroundColor: "#fff",
    //backgroundColor: "red",
  },
  imageContainer: {
    flex: 0.6,
    //backgroundColor: "white",
    height: "100%",
  },
  image: {
    aspectRatio: 15 / 21,
    height: "100%",
    width: "auto",
  },
  varTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  varValue: {
    fontSize: 16,
  },
  starIcon: {
    position: "absolute",
    height: "7.5%",
    width: "auto",
    aspectRatio: 1 / 1,
    marginTop: 180,
    marginLeft: 25,
  },
});

export default BarView;
