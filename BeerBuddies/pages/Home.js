import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import StyledButton from '../components/StyledButton';


export default function Home( { navigation } ) {

  return (
    <View>
      <View style={styles.mainContainer}>
        <ImageBackground
          source={require('../assets/images/homepage.png')}
          style={styles.image}
        />


        <View style={styles.titles}>
          <Text style={styles.title}>Saving Fields</Text>
          <Text style={styles.subtitle}>Salve o seu terreno hoje</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <StyledButton
            type="register"
            onPress={() => { navigation.push('Register') }}
          />

          <StyledButton
            type="log_in"
            onPress={() => { navigation.push('Login') }}
          />
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
  },

  titles: {
    marginTop: '40%',
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 35,
    fontWeight: '500',
  },

  subtitle: {
    fontSize: 16,
    color: '#5c5e62',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },

  buttonsContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',

  },
});


