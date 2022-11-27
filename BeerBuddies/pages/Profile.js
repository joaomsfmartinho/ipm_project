import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, ScrollView, StatusBar, Alert, Image, ImageBackground, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Avatar, Title, Drawer } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPoup from '../components/ModalPopup'
import { db } from "../firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";
import { Text as TextKitten } from '@ui-kitten/components';

const maxBirthdate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
);

const Profile = ({ navigation }) => {

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [image, setImage] = React.useState(null);
    const [birthdate, setBirthdate] = React.useState(maxBirthdate);
    const [gender, setGender] = React.useState("");


    const choosePhoto = () => {
        // pick new photo
        alert("aaa")
    }

    const getData = async () => {
        setEmail(await AsyncStorage.getItem("email"));
        let ref = doc(collection(db, "users"), email);
        let res = await getDoc(ref);
        setImage(res.get("image"));
        setName(res.get("name"));
        setBirthdate(res.get("birthdate"));
        setGender(res.get("gender"));
    }

    async function setData() {
        // update user data
        let ref = doc(collection(db, "users"), email);
        let res = await getDoc(ref);
        alert(name)
    }

    useEffect(() => {
        getData();
    }, []);

    return (

        <View style={styles.container}>
            <StatusBar backgroundColor='#ffd086' barStyle="light-content" />
            <View style={styles.footer}>
                <ScrollView>
                    <TouchableOpacity onPress={() => choosePhoto()}>
                        <Image style={styles.image} source={require("../assets/images/NoImage.png")} />
                    </TouchableOpacity>
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
                        marginTop: 20
                    }]}>Email</TextKitten>
                    <View style={styles.action}>
                        <Text style={styles.textInput}>{email}</Text>
                    </View>
                    <TextKitten style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Birth Date</TextKitten>
                    <View style={styles.action}>
                        <TextInput
                            // change from text input to choose date
                            style={styles.textInput}
                            autoCapitalize="none"
                            defaultValue={birthdate.toString()}
                        />
                    </View>
                    <TextKitten style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Gender</TextKitten>
                    <View style={styles.action}>
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            defaultValue={gender}
                        />
                    </View>
                </ScrollView>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { setData() }}
                    >
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>


    );


};

export default Profile;
const imageSize = 150;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    image: {
        width: imageSize,
        height: imageSize,
        alignSelf: 'flex-end',
        borderColor: '#ffd086',
        borderWidth: 1,
        borderRadius: imageSize / 2,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    header: {
        flex: 0,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#ffd086'
    },
    text_header: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 25,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        fontWeight: "700"
    },
    footer: {
        flex: Platform.OS === 'android' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
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
        backgroundColor: '#000'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})