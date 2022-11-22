import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, ScrollView, StatusBar, Alert, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { Text as TextKitten} from '@ui-kitten/components';
import { Avatar, Title, Drawer } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPoup from '../components/ModalPopup'

const UserProfile = ({ navigation }) => {


  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [birthdate, setBirthdate] = React.useState(null);
  const [gender, setGender] = React.useState(null);



  useEffect(() => {
    const fu = async () => {
      let email1;
      email1 = await AsyncStorage.getItem('email');
      getUser(email1)
    }
    fu()
  }, []);

  const database = ""

  const getUser = (email1) => {
   
  }

  const updateUser = async () => {
    let email1 = await AsyncStorage.getItem('email');
   

  }


  useEffect(() => {
    async function displayEmail() {
      setEmail(await AsyncStorage.getItem('email'));
    }
    displayEmail();
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ffd086' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>{name}</Text>
      </View>
      <View>
          <Text style={styles.text_footer}>
            Photo
          </Text>
        </View>
      <View style={styles.footer}>
        
        <ScrollView>
          
          <TextKitten style={styles.text_footer}>Email</TextKitten>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={email}
              editable={false}
            />
          </View>

          <TextKitten style={[styles.text_footer, {
            marginTop: 35
          }]}>Name</TextKitten>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={name}
              onChangeText={(val) => setName(val)}
            />
          </View>
          <TextKitten style={[styles.text_footer, {
            marginTop: 35
          }]}>Birth Date</TextKitten>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={birthdate}
            />
          </View>
          <TextKitten style={[styles.text_footer, {
            marginTop: 35
          }]}>Gender</TextKitten>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={gender}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => { updateUser() }}
            >
              <Text style={[styles.textSign, {
                color: '#fff'
              }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: '#14555d',
    marginTop: 5,
    width: '50%',
  },
  headerX: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  picker: {
    height: '5%',
  },
  container: {
    flex: 1,
    backgroundColor: '#14555d'
  },
  header: {
    flex: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 0,
    backgroundColor: '#14555d'
  },
  footer: {
    flex: Platform.OS === 'android' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#14555d'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});