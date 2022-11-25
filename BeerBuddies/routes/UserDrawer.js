import React, { useEffect } from 'react';
import { View, StyleSheet, Button, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Title, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../components/AuthorizationContext';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPoup from '../components/ModalPopup'


function UserDrawer(props) {

    const { signOut } = React.useContext(AuthContext)
    const [visible, setVisible] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState(null);
    const [userName, setUserName] = React.useState(null);
    const [visible2, setVisible2] = React.useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = React.useState(false);
    const [name, setName] = React.useState();

    useEffect(() => {
        const fu = async () => {
            let email1;
            email1 = await AsyncStorage.getItem('email');
            getName(email1);
        }
        fu()
    }, []);

    const getName = (email1) => {
        const string = 'https://saving-fields.appspot.com/rest/user/getUserName/?email=';
        const endpoint = string + email1;
    }

    useEffect(() => {
        async function displayEmail() {
            setUserEmail(await AsyncStorage.getItem('email'));
        }
        displayEmail();
    }, []);

    const handleLogout = async () => {
        let email;
        let token;
        email = await AsyncStorage.getItem('email');
        token = await AsyncStorage.getItem('token');
        logout(email, token);
    }

    const handleDeleteAccount = async () => {
        let email;
        let token;
        email = await AsyncStorage.getItem('email');
        token = await AsyncStorage.getItem('token');
        deleteAccount(email, token);
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Avatar.Image
                            source={require('../assets/images/logo.png')}
                            size={50}
                        />
                        <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                            <Title style={styles.title}>{name}</Title>
                        </View>
                    </View>
                </View>

                <Drawer.Section style={styles.drawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="home"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Home"
                        onPress={() => { props.navigation.navigate('Saving Fields') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="account"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Perfil"
                        onPress={() => { props.navigation.navigate('Perfil') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="forum"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Forum"
                        onPress={() => { props.navigation.navigate('Forum') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="earth"
                                color={color}
                                size={size}
                            />
                        )}
                        label="As Minhas Parcelas"
                        onPress={() => { props.navigation.navigate('MyParcells') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="earth-plus"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Registar Parcelas"
                        onPress={() => { props.navigation.navigate('Map') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="book"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Sobre"
                        onPress={() => { props.navigation.navigate('Sobre') }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="account-remove"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Eliminar Conta"
                        onPress={() => { setVisible(true) }}
                    />
                </Drawer.Section>
            </View>
            {!visible2 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ModalPoup visible={visible}>
                        <View style={{ height: '40%' }}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={styles.header}>
                                    <TouchableOpacity onPress={() => setVisible(false)}>
                                        <Image
                                            source={require('../assets/images/x.png')}
                                            style={{ height: 30, width: 30 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center' }}>
                                Tem a certeza que quer eliminar a sua conta?
                            </Text>
                            <View style={styles.buttonView}>
                                <View style={styles.button}>
                                    <TouchableOpacity
                                        style={styles.signIn}
                                        onPress={() => { handleDeleteAccount() }}
                                    >
                                        <Text style={[styles.textSign, {
                                            color: '#fff'
                                        }]}>Sim</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.button, {marginLeft: '5%'}]}>
                                    <TouchableOpacity
                                        style={styles.signIn}
                                        onPress={() => { setVisible(false) }}
                                    >
                                        <Text style={[styles.textSign, {
                                            color: '#fff'                                          
                                        }]}>Não</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ModalPoup>
                </View>
            ) :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ModalPoup visible={visible2}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.header}>
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
                            A sua conta foi eliminada com sucesso!
                        </Text>
                    </ModalPoup>
                </View>
            }
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Terminar Sessão"
                    onPress={() => { handleLogout() }}
                />
            </Drawer.Section>
        </View>
    );
}

export default UserDrawer;

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    }, header: {
        width: '100%',
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#14555d',
        marginTop: '20%'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 50,

    }
});