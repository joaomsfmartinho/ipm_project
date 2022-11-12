import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, ScrollView, StatusBar, Alert, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Avatar, Title, Drawer } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPoup from '../components/modalPopUp'

const UserProfile = ({ navigation }) => {


  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [typeAccount, setTypeAccount] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  const [nif, setNif] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [visible2, setVisible2] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("GESTOR");

  useEffect(() => {
    const fu = async () => {
      let email1;
      email1 = await AsyncStorage.getItem('email');
      getUser(email1)
    }
    fu()
  }, []);

  const getUser = (email1) => {
    axios.post('https://saving-fields.appspot.com/rest/user/getUser', { email: email1 })
      .then(response => {
        let accountType = response.data.accountType.toLowerCase();
        setName(response.data.name)
        setPhone(response.data.phone)
        setNif(response.data.NIF)
        setAddress(response.data.address)
        setTypeAccount(accountType)
      })
      .catch(error => {
      })
  }

  const updateUser = async () => {
    let email1 = await AsyncStorage.getItem('email');
    let token = await AsyncStorage.getItem('token');
    axios.put('https://saving-fields.appspot.com/rest/user/updateData', {
      email: email1,
      tokenID: token,
      name: name,
      phone: phone,
      nif: nif,
      address: address,
      type: typeAccount
    })
      .then(response => {
        setVisible2(true)
        getUser(email1)
      })
      .catch(error => {
        Alert.alert('Erro!', error.response.data, [
          { text: 'Okay' }
        ]);
      })

  }


  useEffect(() => {
    async function displayEmail() {
      setEmail(await AsyncStorage.getItem('email'));
    }
    displayEmail();
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#14555d' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>{name}</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={styles.footer}
      >
        
        <ScrollView>
          

          <Text style={[styles.text_footer, {
          }]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome
              name="envelope"
              color="#05375a"
              size={20}
              defaultValue={email}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={email}
              editable={false}
            />
          </View>

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Nome *</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user"
              color="#05375a"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={name}
              onChangeText={(val) => setName(val)}
            />
          </View>

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Tipo de Conta</Text>
          <View style={styles.action}>
            <FontAwesome
              name="users"
              color="#05375a"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={typeAccount}
              editable={false}
            />
          </View>

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Telemóvel *</Text>
          <View style={styles.action}>
            <FontAwesome
              name="phone"
              color="#05375a"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={phone}
              keyboardType='number-pad'
              onChangeText={(val) => setPhone(val)}
            />
          </View>
          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>NIF *</Text>
          <View style={styles.action}>
            <FontAwesome
              name="id-card"
              color="#05375a"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={nif}
              keyboardType='number-pad'
              onChangeText={(val) => setNif(val)}
            />
          </View>
          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Morada *</Text>
          <View style={styles.action}>
            <FontAwesome
              name="home"
              color="#05375a"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              defaultValue={address}
              onChangeText={(val) => setAddress(val)}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => { updateUser() }}
            >
              <Text style={[styles.textSign, {
                color: '#fff'
              }]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ModalPoup visible={visible2}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.headerX}>
              <TouchableOpacity onPress={() => setVisible2(false)}>
                <Image
                  source={require('../assets/images/x.png')}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/images/success.png')}
              style={{ height: 150, width: 150, marginVertical: 10 }}
            />
          </View>

          <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center' }}>
            A sua conta foi atualizada com sucesso!
          </Text>
        </ModalPoup>
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
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: '#14555d'
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
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
    marginTop: Platform.OS === 'ios' ? 0 : -12,
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