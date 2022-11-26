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

const BarView = ({ route }) => {

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View style={styles.topContainer}>
        <View style={styles.leftTextContainer}>
          <Text style={styles.varTitle}>Bar name</Text>
          <Text style={styles.varValue}>{route.params.name}</Text>
          <Text style={[styles.varTitle, { marginTop: 35 }]}>
            Beer price (20cl)
          </Text>
          <Text style={styles.varValue}>{route.params.price}€</Text>
          <Text style={[styles.varTitle, { marginTop: 35 }]}>Rating</Text>
          <View style={{ flexDirection: 'row', height: '20%' }}>
            <Text style={styles.varValue}>{route.params.rating}</Text>
            <Image
              style={{ width: '14%', height: '35%', marginLeft: 6 }}
              source={require("../assets/images/rating_star.png")}
            />
          </View>
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
        <Text style={styles.varValue}>{route.params.street}</Text>
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
