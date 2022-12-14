import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import bars from "../assets/data/bars.json";
import BarItem from "../components/BarItem";
import { getDistance } from "geolib";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Search = ({ route }) => {
  const navigation = useNavigation();
  const [searchedBars, updateBars] = React.useState(bars);

  const navigateAboutUs = () => {
    navigation.navigate("About");
  };

  const navigateFilters = () => {
    navigation.navigate("Filter");
  };

  const [location, setLocation] = React.useState({
    latitude: 38.650255692353376,
    longitude: -9.224426022521829,
  });

  function inDistance(curBar) {
    let distance = getDistance(
      { latitude: curBar.latitude, longitude: curBar.longitude },
      { latitude: location.latitude, longitude: location.longitude }
    );
    return distance / 1000 <= route.params.distance;
  }

  useEffect(() => filterBars(), [route]);

  const filterBars = () => {
    if (typeof route.params !== 'undefined') {
      console.log("Filtering Bars...")
      let counter = 0;
      let shownBars = [];
      for (let i = 0; i < bars.length; i++) {
        let curBar = bars[i]
        let verifications = 0;

        {/** Check Price */ }
        if (route.params.price >= curBar.price || route.params.price == "") {
          console.log("price")
          verifications++;
        }

        {/** Check Beers */ }
        for (let j = 0; j < curBar.beers.length; j++) {
          if (route.params.beer == "") {
            verifications++;
            break;
          }
          if (route.params.beer == curBar.beers[j]) {
            console.log("beer")
            verifications++;
          }
        }

        {/** Check Distance */ }
        if (route.params.distance == "" || inDistance(curBar)) {
          console.log("distance")
          verifications++;
        }

        {/** Check Ratings */ }
        if (route.params.rating == "" || route.params.rating <= curBar.rating) {
          console.log("rating")
          verifications++;
        }

        console.log(verifications)
        {/** If everything is ok, add bar */ }
        if (verifications == 4) {
          shownBars[counter] = bars[i];
          counter++;
        }
      }
      updateBars(shownBars)
    }
  }

  function barSearchUpdates(text) {
    let shownBars = [];
    let counter = 0;
    for (let i = 0; i < bars.length; i++) {
      if (bars[i].name.toLowerCase().includes(text.toLowerCase())) {
        shownBars[counter] = bars[i];
        counter++;
      }
    }
    updateBars(shownBars);
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <View
        style={{
          width: "100%",
          height: "12%",
          flexDirection: "row",
          marginTop: "0.5%",
          borderBottomColor: "#666666",
          borderBottomWidth: 2,
          paddingBottom: 10,
        }}
      >
        <View style={{ width: "15%", height: "100%", marginLeft: 5 }}>
          <TouchableOpacity
            onPress={() => navigateAboutUs()}
            activeOpacity={0.5}
          >
            <ImageBackground
              style={styles.image_beer}
              source={require("../assets/images/beers.png")}
            ></ImageBackground>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: "85%", height: "100%", alignItems: "flex-start" }}
        >
          <View style={styles.search_bar}>
            <TextInput
              style={{ height: "80%", width: "98%" }}
              placeholder={"Search..."}
              onChangeText={(text) => barSearchUpdates(text)}
            />
          </View>
          <TouchableOpacity
            style={styles.filter_button}
            activeOpacity={0.5}
            onPress={() => navigateFilters()}
          >
            <Text>Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={searchedBars}
        renderItem={({ item }) => <BarItem bar={item} distance={location} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
  },
  image_beer: {
    width: "100%",
    height: "95%",
  },
  search_bar: {
    height: "50%",
    width: "90%",
    marginHorizontal: '2.5%',
    marginTop: 6,
    alignItems: "center",
  },
  filter_button: {
    width: "30%",
    height: "35%",
    backgroundColor: "#ffd086",
    marginHorizontal: '3%',
    marginTop: '2%',
    borderWidth: 2,
    borderColor: "#666666",
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Search;
