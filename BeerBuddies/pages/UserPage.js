import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Text, FlatList, StyleSheet, StatusBar, RefreshControl, LogBox, ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ParcellsToDisplay from './ParcellsToDisplay';

const THUMB_SIZE = 80;

const IMAGES = {
  image1: require('../assets/images/JR.jpg'),
  image2: require('../assets/images/FG.jpg'),
  image3: require('../assets/images/JR.jpg'),
  image4: require('../assets/images/FG.jpg'),
  image5: require('../assets/images/JR.jpg'),
};

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


export default function UserPage() {

  const { colors } = useTheme();
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState(null);
  const [isDone, setIsDone] = React.useState(false);

  const carouselRef = useRef();
  const flatListRef = useRef();
  const [images, setImages] = useState([
    { id: '1', image: IMAGES.image1 },
    { id: '2', image: IMAGES.image2 },
    { id: '3', image: IMAGES.image3 },
    { id: '4', image: IMAGES.image4 },
    { id: '5', image: IMAGES.image5 },
  ]);
  const [parcells, setParcells] = useState([]);

  const [indexSelected, setIndexSelected] = useState(0);

  const [refreshing, setRefreshing] = React.useState(false);

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
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const fu = async () => {
      let email1;
      email1 = await AsyncStorage.getItem('email');
      getName(email1)
    }
    fu();
    axios.get('https:/saving-fields.appspot.com/rest/parcell/getAllActiveParcells')
      .then(response => {
        setParcells((current) =>
          response.data
        );
        setIsDone(true);
      });
  }, []);

  const getName = (email1) => {
    const string = 'https:/saving-fields.appspot.com/rest/user/getUserName/?email='
    const endpoint = string + email1
    axios.get(endpoint)
      .then(response => {
        setName(response.data)
      })
      .catch(error => {
      });
  }

  const onRefresh = () => {
    setRefreshing(true);
    axios.get('https:/saving-fields.appspot.com/rest/parcell/getAllActiveParcells')
      .then(response => {
        setParcells(
          response.data
        );
      })
      .catch(err => {
        console.warn(err)
      });
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      {!isDone ? <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: "50%" }} /> :
        (<View>
          <StatusBar backgroundColor='#14555d' barStyle="light-content" />
          <Text style={[styles.text_footer, {
            color: colors.text,
            marginTop: "1%",
            alignSelf: 'center',
            fontWeight: "bold"
          }]}>Terrenos Registados</Text>
          {parcells.length == 0 ?
            <View>
              <Text style={{
                fontSize: 18,
                color: colors.text,
                marginTop: "1%",
                alignSelf: 'center',
              }}>Ainda não existem terrenos registados. Registe o seu em "Desenhar Parcelas"!</Text>
            </View> :
            <FlatList
              numColumns={2}
              style={styles.list}
              contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop: "5%" }}
              data={parcells}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (<ParcellsToDisplay parcell={item} />)}
            />
          }
        </View>)
      }
    </ScrollView>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: "2%"
  },
  list: {
    flex: 1,
  },
  card: {
    width: "96%",
    marginBottom: "5%",
    marginLeft: "2%"
  },
  listImage: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: '#14555d'
  },
  footer: {
    flex: 7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#14555d',
    fontSize: 22
  },
});



