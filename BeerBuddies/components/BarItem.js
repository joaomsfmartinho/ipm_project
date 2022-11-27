import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BarItem = (props) => {
  const navigate = useNavigation();

  const navigateToBarView = () => {
    navigate.push("BarView", props.bar);
  };

  return (
    <TouchableOpacity
      style={styles.barContainer}
      onPress={() => navigateToBarView()}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.bar_text}>{props.bar.name} </Text>
        <Text style={styles.text}>{props.bar.rating}</Text>
        <Image
          style={styles.star}
          source={require("../assets/images/rating_star.png")}
        ></Image>
      </View>
      <Text style={styles.text}> {props.bar.street}</Text>
      {/**<Text style={styles.text}> Price: {props.bar.price}</Text>
            <Text style={styles.text}> Distance: {distance / 1000} k.m.</Text>*/}
    </TouchableOpacity>
  );
};

export default BarItem;

const styles = StyleSheet.create({
  barContainer: {
    width: "100%",
    marginVertical: 10,
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 2,
    paddingBottom: 20,
    marginHorizontal: 5,
  },
  bar_text: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  text: {
    fontSize: 16,
    padding: 5,
  },
  star: {
    width: "4%",
    height: "40%",
  },
});
