import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTheme } from 'react-native-paper';
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import UserParcellsToDisplay from './UserParcellsToDisplay';
import UserInactiveParcellsToDisplay from './UserInactiveParcellsToDisplay';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function MyParcells() {

    const { colors } = useTheme();

    const [email, setEmail] = React.useState('');
    const [myActiveParcells, setMyActiveParcells] = React.useState([]);
    const [myInactiveParcells, setMyInactiveParcells] = React.useState([]);
    const [refreshingMyParcells, setRefreshingMyParcells] = React.useState(false);
    const [isDoneActive, setIsDoneActive] = React.useState(false);
    const [isDoneInactive, setIsDoneInactive] = React.useState(false);

    useEffect(() => {
        const getData = async () => {
            let email = await AsyncStorage.getItem("email");
            let token = await AsyncStorage.getItem("token");
            getUserParcells(email);
            setEmail(email);
        }
        getData();
    }, []);

    const onRefreshMyParcells = () => {
        setRefreshingMyParcells(true);
        axios.post('https:/saving-fields.appspot.com/rest/parcell/getOwnActiveParcells', {
            email: email,
        })
            .then(response => {
                setMyActiveParcells([]);
                setMyActiveParcells(response.data);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            });
        axios.post('https:/saving-fields.appspot.com/rest/parcell/getOwnInactiveParcells', {
            email: email,
        })
            .then(response => {
                setMyInactiveParcells([]);
            
                setMyInactiveParcells(response.data);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            });

        wait(2000).then(() => setRefreshingMyParcells(false));
    };

    const getUserParcells = (email) => {
        axios.post('https:/saving-fields.appspot.com/rest/parcell/getOwnActiveParcells', {
            email: email,
        })
            .then(response => {
                setMyActiveParcells(response.data);
                setIsDoneActive(true);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            });
        axios.post('https:/saving-fields.appspot.com/rest/parcell/getOwnInactiveParcells', {
            email: email,
        })
            .then(response => {
                setMyInactiveParcells(response.data);
                setIsDoneInactive(true);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            });
    }

    return (
        <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshingMyParcells}
                    onRefresh={onRefreshMyParcells}
                />
            }>
            {!isDoneActive ? <ActivityIndicator size="large" color="#00ff00" /> :
                (<View>
                    <StatusBar backgroundColor='#14555d' barStyle="light-content" />
                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: "1%",
                        alignSelf: 'center',
                        fontWeight: "bold"
                    }]}>As Suas Parcelas Ativas</Text>
                    <FlatList
                        numColumns={2}
                        style={styles.list}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop: "5%" }}
                        data={myActiveParcells}
                        renderItem={({ item }) => (<UserParcellsToDisplay parcell={item} email={email} />)}
                    />
                </View>)}
            {!isDoneInactive ? <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: "70%" }} /> :
                
                (<View>
                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: "1%",
                        alignSelf: 'center',
                        fontWeight: "bold"
                    }]}>As Suas Parcelas Inativas</Text>
                    <FlatList
                        numColumns={2}
                        style={styles.list}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop: "5%" }}
                        data={myInactiveParcells}
                        renderItem={({ item }) => (<UserInactiveParcellsToDisplay parcell={item} email={email} />)}
                    />
                    
                </View>)}
        </ScrollView>
    );
}

export default MyParcells;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: "2%"
    },
    list: {

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