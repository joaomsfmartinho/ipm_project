import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const { width } = Dimensions.get('window');
const THUMB_SIZE = 80;

const IMAGES = {
  image1: require('../assets/images/JR.jpg'),
  image2: require('../assets/images/FG.jpg'),
  image3: require('../assets/images/JM.jpg'),
  image4: require('../assets/images/AS.jpg'),
  image5: require('../assets/images/GP.jpg'),
};


export default function UserPage() {

  const [name, setName] = React.useState();
  const carouselRef = useRef();
  const flatListRef = useRef();
  const [images, setImages] = useState([
    { id: '1', image: IMAGES.image1 },
    { id: '2', image: IMAGES.image2 },
    { id: '3', image: IMAGES.image3 },
    { id: '4', image: IMAGES.image4 },
    { id: '5', image: IMAGES.image5 },
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


  useEffect(() => {
    const fu = async () => {
      let email1;
      email1 = await AsyncStorage.getItem('email');
      getName(email1)
    }
    fu()
  }, []);

  const getName = (email1) => {
    const string = 'https://saving-fields.appspot.com/rest/user/getUserName/?email='
    const endpoint = string + email1
    axios.get(endpoint)
      .then(response => {
        setName(response.data)
      })
      .catch(error => {
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#14555d' barStyle="light-content" />

      <View style={styles.text}>
        <Text style={styles.text_header}>Saving Fields é uma plataforma onde pode registar os seus terrenos e interagir com outros proprietários</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.text_header}>Equipa</Text>
      </View>
      <View style={{ flex: 1.5, marginTop: 20 }}>
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
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              source={item.image}
            />
          )}
        />
        <Pagination
          inactiveDotColor="gray"
          dotColor={'white'}
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
          alignSelf: 'flex-end',
        }}
      >
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14555d'
  },
  text: {
    flex: 1.2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    backgroundColor: '#14555d',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#14555d',
    alignItems: 'center'
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  footer: {
    flex: 7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center'
  },
  text_footer: {
    color: '#14555d',
    fontSize: 25,
  },
});