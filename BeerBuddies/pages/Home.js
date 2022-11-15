import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import StyledButton from '../components/StyledButton';
import { stopLocationUpdatesAsync } from 'expo-location';
import {
  useFonts,
  BalsamiqSans_400Regular,
  BalsamiqSans_400Regular_Italic,
  BalsamiqSans_700Bold,
  BalsamiqSans_700Bold_Italic,
} from '@expo-google-fonts/balsamiq-sans'
import { Button } from 'react-native-paper';


export default function Home( { navigation } ) {

  useFonts({
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
  });

  return (
    <View>
      <View style={styles.mainContainer}>

      <ImageBackground style={styles.image}
      source={require("../assets/images/beers.png")}>

      </ImageBackground>
        <View style={styles.titles}>
          <Text style={styles.title}>Beer Buddies</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            style={{
              marginLeft: '3%',
              marginTop: '5%',
              width: '95%',
              height: '8.5%',
              borderRadius: 1,
              borderColor: 'black',
              borderWidth: 0.8,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffd086'

            }}
            type="register"
            onPress={() => { navigation.push('Register') }}>
            <Text style={styles.textButton}>LOG IN</Text>
          </Button>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, height: 1, backgroundColor: 'gray', marginTop:'6%'}} />
              <View>
                  <Text style={{width: 50, textAlign: 'center', color: 'gray', marginTop:'22%'}}> OR </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: 'gray', marginTop:'6%'}} />
          </View>
          <Button
            style={{
              marginLeft: '3%',
              marginTop: '4.5%',
              marginBottom: '1%',
              width: '95%',
              height: '8.5%',
              borderColor: 'black',
              borderWidth: 0.8,
              borderRadius: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffd086'
            }}
          
            onPress={() => { navigation.push('Login') }}
          >
             <Text style={styles.textButton}>REGISTER</Text>
          </Button>
        </View>

      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },

  titles: {
    marginTop: '65%',
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 35,
    color: '#eca921',
    fontWeight: 'normal',
    textShadowColor: '#000', 
    textShadowOffset: {
      width: 2,
      height: 2
    },
    textShadowRadius: 2,
    textDecorationStyle: 'solid',
    fontFamily: 'BalsamiqSans_700Bold',
  },

  textButton: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    alignContent: 'center',
    justifyContent: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#5c5e62',
  },

  image: {
    width: '72%',
    height: '50%',
    marginLeft: '25%',
    marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  buttonsContainer: {
    position: 'absolute',
    marginTop: '90%',
    width: '100%',
    height: '100%',
  },
});


