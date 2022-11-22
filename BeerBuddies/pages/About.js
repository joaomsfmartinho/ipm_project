import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const THUMB_SIZE = 80;

const IMAGES = {
  image1: require('../assets/images/JM.jpg'),
  image2: require('../assets/images/BS.jpg')
};


export default function UserPage() {

  const [name, setName] = React.useState();
  const carouselRef = useRef();
  const flatListRef = useRef();
  const [images, setImages] = useState([
    { id: '1', image: IMAGES.image1 },
    { id: '2', image: IMAGES.image2 },
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#fce571' barStyle="light-content" />

      <View style={styles.text}>
        <Text style={styles.text_header}>Beer Buddies is a platform which allows you to find your personal best beer places alongside new people!</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.text_header}>Team</Text>
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
    backgroundColor: '#fce571'
  },
  text: {
    flex: 1.2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    backgroundColor: '#fce571',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fce571',
    alignItems: 'center'
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowRadius: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 3 },
    fontSize: 28
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
    color: '#fce571',
    fontSize: 25,
  },
});