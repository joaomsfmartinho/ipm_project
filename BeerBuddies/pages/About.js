import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const THUMB_SIZE = 80;

const IMAGES = {
  image1: require("../assets/images/JM.jpg"),
  image2: require("../assets/images/BS.jpg"),
  image3: require("../assets/images/JF.jpg"),
  image4: require("../assets/images/HP.jpg"),
};

export default function UserPage() {
  const navigation = useNavigation();

  const [name, setName] = React.useState();
  const carouselRef = useRef();
  const flatListRef = useRef();
  const [images, setImages] = useState([
    { id: "1", image: IMAGES.image1 },
    { id: "2", image: IMAGES.image2 },
    { id: "3", image: IMAGES.image3 },
    { id: "4", image: IMAGES.image4 },
  ]);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
    flatListRef?.current?.scrollToOffset({
      offset: indexSelected * THUMB_SIZE,
      animated: true,
    });
  };

  const onTouchThumbnail = (touched) => {
    if (touched === indexSelected) return;

    carouselRef?.current?.snapToItem(touched);
  };

  const navigateBackwards = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fu = async () => {
      let email1;
      email1 = await AsyncStorage.getItem("email");
    };
    fu();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
      <Text style={styles.title_text}>About us?</Text>

      <View
        style={{
          width: "100%",
          height: "9.9%",
          flexDirection: "row",
          marginTop: "0.5%",
        }}
      >
        <View style={{ width: "50%", height: "100%", alignItems: 'center' }}>
          <ImageBackground
            style={styles.image_beer}
            source={require("../assets/images/beers.png")}
          ></ImageBackground>
        </View>
        <View style={{ width: "50%", height: "100%", alignItems: 'center', justifyContent: 'flex-end' }}>
          <Pressable onPress={() => navigateBackwards()}>
            <ImageBackground
              style={styles.image_arrow}
              source={require("../assets/images/back_arrow.png")}
            ></ImageBackground>
          </Pressable>
        </View>
      </View>
      <View style={styles.text}>
        <Text style={styles.text_header}>
          Beer Buddies is a platform which allows you to find your personal best
          beer places alongside new people! This project is being developed as
          an assignment for our IPM course at university FCT-Nova.
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.text_header}>Team</Text>
      </View>
      <View style={{ flex: 2, marginTop: 10 }}>
        <Carousel
          ref={carouselRef}
          layout="default"
          data={images}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) => onSelect(index)}
          renderItem={({ item, index }) => (
            <Image
              key={index}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              source={item.image}
            />
          )}
        />
        <Pagination
          inactiveDotColor="gray"
          dotColor={"white"}
          activeDotIndex={indexSelected}
          dotsLength={images.length}
          animatedDuration={150}
          inactiveDotScale={1}
        />
      </View>
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 32,
          alignSelf: "flex-end",
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffd086",
  },
  text: {
    flex: 1.3,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    backgroundColor: "#ffd086",
    alignItems: "center",
  },
  header: {
    flex: 0.6,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    backgroundColor: "#ffd086",
    alignItems: "center",
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    textShadowRadius: 2,
    textShadowColor: "#4b4b4b",
    textShadowOffset: { width: 2, height: 2 },
    fontSize: 20,
  },
  image_arrow: {
    width: "48%",
    height: "80%",
    opacity: 0.8,
    marginTop: '10%'
  },
  title_text: {
    position: "absolute",
    height: "10%",
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    textShadowRadius: 2,
    textShadowColor: "#4b4b4b",
    textShadowOffset: { width: 2, height: 2 },
  },
  image_beer: {
    width: "70%",
    height: "100%",
  },
});
