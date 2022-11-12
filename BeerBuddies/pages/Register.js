import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, ScrollView, StatusBar, Alert, Image } from 'react-native';
import { Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import ModalPopup from '../components/modalPopUp';

const SignInScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        NIF: '',
        address: '',
        accountType: '',
        check_textInputChange: false,
        secureTextEntry: true,
        secureTextEntry2: true,
        confirm_secureTextEntry: true,
    });

    const [tutorialVisible, setTutorialVisible] = React.useState(false);

    const [selectedValue, setSelectedValue] = React.useState("Gestor de Parcelas");

    const handleRegistration = () => {
        axios
            .post('https:/saving-fields.appspot.com/rest/register/user',
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    confirmation_pwd: data.confirm_password,
                    phone: data.phone,
                    NIF: data.NIF,
                    address: data.address,
                    accountType: selectedValue
                })
            .then(response => {
                if (response.status == 200) {
                    navigation.goBack();
                }
            })
            .catch(error => {
                if (error.response.data != "") {
                    Alert.alert('Erro!', error.response.data, [
                        { text: 'Okay' }
                    ]);
                }
            });
    }

    const textInputChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const handleNameChange = (val) => {
        setData({
            ...data,
            name: val
        });
    }

    const handlePhoneChange = (val) => {
        setData({
            ...data,
            phone: val
        });
    };

    const handleNIFChange = (val) => {
        setData({
            ...data,
            NIF: val
        });
    };

    const handleAddressChange = (val) => {
        setData({
            ...data,
            address: val
        });
    };

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#14555d' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Registar!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>Nome</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleNameChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                    style={{ marginRight: 15 }}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                    style={{ marginRight: 15 }}

                                />
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Confirmação da Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {data.confirm_secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                    style={{ marginRight: 15 }}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                    style={{ marginRight: 15 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Telemóvel</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="phone"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            onChangeText={(val) => handlePhoneChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>NIF</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="id-card"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            onChangeText={(val) => handleNIFChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Morada</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="home"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleAddressChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Tipo de conta</Text>
                    <ModalPopup visible={tutorialVisible}>
                        <View style={{ alignItems: 'center', flexDirection: "row" }}>
                            <View >
                                <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                    Os Tipos de Conta
                                </Text>
                            </View>
                            <View style={{ width: "100%", right: 0, bottom: "14%" }}>
                                <TouchableOpacity onPress={() => setTutorialVisible(false)}>
                                    <Image
                                        source={require('../assets/images/x.png')}
                                        style={{ height: 30, width: 30, position: 'absolute', right: "55%" }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.button}>
                            <Text style={[styles.tutorial, {
                                marginTop: 25
                            }]}>
                                Um Proprietário é um utlizador que tem capacidade de registrar o seu terreno em seu nome ( e mais utilizadores se o quiser) e ter completo acesso à sua parcela e às suas funcionalidades.
                                Um Gestor de Parcelas é um utilizador que tem capacidade de registrar um terreno em nome de outros proprietários sem ter completo acesso à parcela registada e às suas funcionalidades.
                            </Text>
                        </View>
                    </ModalPopup>
                    <View style={styles.dropdown}>
                        <Picker
                            selectedValue={selectedValue}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="Gestor de Parcelas" value="Gestor de Parcelas" style={{ textAlign: 'center' }} />
                            <Picker.Item label="Proprietário" value="PROPRIETÁRIO" />
                        </Picker>
                        <Button
                            color="blue"
                            style={{ bottom: "10%", left: "180%", position: 'absolute' }}
                            icon="help-circle"
                            onPress={() => { setTutorialVisible(true) }}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { handleRegistration() }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Criar Conta</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    tutorial: {
        fontSize: 18,
        width: "100%",
        alignItems: 'center'
    },
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1.2,
        borderColor: '#14555d',
        marginTop: 5,
        width: '50%',
    },
    picker: {
        flex: 1,
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
        fontSize: 30
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