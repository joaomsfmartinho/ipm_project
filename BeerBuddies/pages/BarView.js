import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";

const BarView = ({ route }) => {
  const navigate = useNavigation();
  const [availableBeers, setAvailableBeers] = React.useState("");

  useEffect(() => {
    setAvailableBeers(getAvailableBeers());
  }, [route]);

  const getAvailableBeers = () => {
    let availableBeers = "";
    let beers = route.params.beers;
    for (let i = 0; i < beers.length; i++) {
      if (i != beers.length - 1) {
        availableBeers += beers[i] + ", ";
      } else {
        availableBeers += beers[i];
      }
    }
    return availableBeers;
  }

  const navigateGoingToBar = () => {
    navigate.push("GoingToBar", route.params);
  };
  const navigateBarVisitors = () => {
    navigate.push("Bar Visitors", route.params);
  };

  const navigateAboutUs = () => {
    navigate.navigate("About");
  };

  const navigateBackwards = () => {
    navigate.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
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
      <View style={styles.topContainer}>
        <View style={styles.leftTextContainer}>
          <Text style={styles.varTitle}>Bar name</Text>
          <Text style={styles.varValue}>{route.params.name}</Text>
          <Text style={[styles.varTitle, { marginTop: 20 }]}>
            Beer price (20cl)
          </Text>
          <Text style={styles.varValue}>{route.params.price}€</Text>
          <Text style={[styles.varTitle, { marginTop: 20 }]}>Rating</Text>
          <View style={{ flexDirection: "row", height: "20%" }}>
            <Text style={styles.varValue}>{route.params.rating}</Text>
            <Image
              style={{ width: "14%", height: "35%", marginLeft: 6 }}
              source={require("../assets/images/rating_star.png")}
            />
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: route.params.img }} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.varTitle}>Address</Text>
        <Text style={styles.varValue}>{route.params.street}</Text>
        <Text style={[styles.varTitle, { marginTop: 20 }]}>Available beers</Text>
        <Text style={styles.varValue}>{availableBeers}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigateBarVisitors()}
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
            Who is visiting?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigateGoingToBar()}
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
    marginTop: -20,
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
  button: {
    height: "17%",
    backgroundColor: "black",
    marginHorizontal: "10%",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 10,
    marginTop: 50,
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
});

export default BarView;
