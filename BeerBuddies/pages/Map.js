import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, Alert, Dimensions, LogBox, Image, ImageBackground } from 'react-native';
import {
    FAB,
    Portal,
    Provider,
    Modal,
    Button,
    IconButton
} from 'react-native-paper';
import MapView, { Polygon, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import ModalPopup from '../components/ModalPopup';
import { useNavigation } from "@react-navigation/native";
import ScrollableModalPopup from '../components/ScrollableModalPopup';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from "buffer";

const FILE_TYPE = "application/pdf";


const Map = () => {

    const navigation = useNavigation();
    const barsList = require('../assets/data/bars.json');
    const [markers, setMarkers] = React.useState([]);
    const [markersLatLng, setMarkersLatLng] = React.useState([]);
    const [location, setLocation] = React.useState({
        latitude: 38.662741,
        longitude: -9.205523,
        latitudeDelta: 0.0004,
        longitudeDelta: 0.005
    });
    const [destin, setDestin] = React.useState(null);
    const [state, setState] = React.useState({ open: false });
    const [visible, setVisible] = React.useState(false);
    const [isRouteEnabled, setIsRouteEnabled] = React.useState(false);
    const [continueRegistration, setContinueRegistration] = React.useState(false);
    const [tutorialVisible, setTutorialVisible] = React.useState(false);

    useEffect(() => {
        getLocationAsync();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
        LogBox.ignoreLogs(["Failed prop type: The prop 'region.latitudeDelta' is marked as required in 'MapView', but its value is 'undefined'."]);
        LogBox.ignoreLogs(['If you are using React Native v0.60.0+ you must follow these instructions to enable currentLocation: https://git.io/Jf4AR']);
    }, [location]);

    const clearState = () => {
        setMarkers([]);
        markersArray = [];
        setMarkersLatLng([]);
        firstIteration = true;
    }

    const navigateAboutUs = () => {
        navigation.navigate("About");
    }

    const getLocationAsync = (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Error!", "Location permissions not granted by the user.")
        }
        let locations = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High, distanceInterval: 3,
            timeInterval: 5000
        }, (loc) => {
            if (loc.coords.latitude != location.latitude || loc.coords.longitude != location.longitude) {
                setLocation({
                    ...location,
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                });
            }
        });
    });

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert("You've refused to allow this appp to access your photos!");
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                aspect: [4, 3],
                allowsEditing: true,
                quality: 1,
                includeBase64: true
            });

            if (!result.cancelled) {
                readImage(result.uri);
            }
        } catch (err) {
            throw err;
        }
    }

    const takePicture = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("You've refused to allow this appp to access your photos!");
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                aspect: [4, 3],
                allowsEditing: true,
                quality: 1,
                base64: true
            })
            if (!result.cancelled && result.type == "image") {
                readImage(result.uri);
            } else if (result.type == "video") {
                Alert.alert('Erro!', "Só é permitido dar upload de imagens.", [
                    { text: 'Okay' }
                ]);
            }
        } catch (err) {
            throw err;
        }
    }

    const readImage = async (uri) => {
        try {
            const imageInfo = await FileSystem.getInfoAsync(uri);
            if (imageInfo.exists) {
                if (imageInfo.size > 700000) {
                    Alert.alert('Erro!', "A sua imagem é demasiado grande. Por favor, selecione outra.", [
                        { text: 'Okay' }
                    ]);
                } else {
                    let splitted = uri.split(".");
                    let imageType = splitted[splitted.length - 1];
                    let imageString = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

                    let imageBuff = Buffer.from(imageString, 'base64');
                    uploadImage(imageBuff, imageType);
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const pickDocument = async () => {
        // Pick a single file
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: FILE_TYPE,
            });
            readFile(res.uri, res.name);
            if (res.type == "cancel") {
            } else {

            }
        } catch (err) {
            throw err;
        }
    }


    const readFile = async (uri, filename) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.size > 500000) {
                Alert.alert('Erro!', "O ficheiro é demasiado grande.", [
                    { text: 'Okay' }
                ]);
            } else if (filename.length > 50) {
                Alert.alert('Erro!', "O nome do ficheiro é demasiado grande.", [
                    { text: 'Okay' }
                ]);
            } else if (fileInfo.exists) {
                let fileString = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
                let fileBuff = Buffer.from(fileString, "utf8");
                uploadFile(filename, fileBuff);
            }
        } catch (err) {
            console.warn(err);
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                loadingEnabled={true}
                initialRegion={location}
                region={location}
                showsTraffic={true}
                mapType="terrain"
                showsCompass={false}
            >
                {barsList && barsList.map(bar => (
                    <Marker
                        identifier={bar.name}
                        title={"Beer price: " + bar.price.toString() + "€"}
                        coordinate={{
                            latitude: bar.latitude,
                            longitude: bar.longitude
                        }}
                        image={require('../assets/images/beers_map.png')}
                        description={"Available beers: " + bar.beers + ""}
                    >
                        <Text style={{fontWeight: "bold"}}>{bar.name}</Text>
                    </Marker>
                ))}
            </MapView>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ModalPopup visible={visible}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Pesquisar rota
                            </Text>
                        </View>
                        <View style={{ width: "100%", right: 0, bottom: "12%" }}>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, right: 0, height: 30, width: 30, position: 'absolute', right: "42%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Freguesia</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleParishChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Secção</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleSectionChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Artigo</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleArticleChange(val)}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { createRouteToParcell() }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Pesquisar</Text>
                        </TouchableOpacity>
                    </View>
                </ModalPopup>
                <ModalPopup visible={continueRegistration}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Dados da parcela
                            </Text>
                        </View>
                        <View style={{ width: "100%", right: 0, bottom: "13%" }}>
                            <TouchableOpacity onPress={() => setContinueRegistration(false)}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, right: 0, height: 30, width: 30, position: 'absolute', right: "50%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Upload de documentos</Text>
                        <View>
                            <Button
                                style={styles.buttonUpload}
                                icon="text-box-plus"
                                mode="contained"
                                onPress={() => { pickDocument() }}
                            />
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Upload de imagem da parcela</Text>
                        <View>
                            <Button
                                style={styles.buttonUpload}
                                icon="file-image-plus"
                                mode="contained"
                                onPress={() => { pickImage() }}
                            />
                            <Button
                                style={styles.buttonUpload}
                                icon="camera-plus"
                                mode="contained"
                                onPress={() => { takePicture() }}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { handleRegisterParcell() }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Registar parcela</Text>
                        </TouchableOpacity>
                    </View>
                </ModalPopup>
                <ModalPopup visible={tutorialVisible}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Como Registar Uma Parcela?
                            </Text>
                        </View>
                        <View style={{ width: "100%", right: 0, bottom: "14%" }}>
                            <TouchableOpacity onPress={() => setTutorialVisible(false)}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ height: 30, width: 30, position: 'absolute', right: "90%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Text style={[styles.tutorial, {
                            marginTop: 25
                        }]}>
                            Para começar o processo de registo, toque no botão no canto inferior esquerdo do ecrã , depois, contorne os limites da sua parcela (a pé ou nalgum veículo)
                            e vá adicionando marcadores ao clicar nesse botão. Assim que terminar o desenho, siga para o registo (botão "Confirmar").
                            Caso se engane, toque em "Limpar desenho" e recomece o processo.
                        </Text>
                    </View>
                </ModalPopup>
            </View>
            <View style={styles.beerButton}>
            <TouchableOpacity style={styles.beerButton} onPress={()=>{ navigateAboutUs()}}>
                <ImageBackground style={styles.image_beer} source={require("../assets/images/beers.png")}/>
        </TouchableOpacity>
            </View>
        </View >
    );
};
export default Map;

const styles = StyleSheet.create({
    tutorial: {
        fontSize: 18,
        width: "100%",
        alignItems: 'center'
    },
    image_beer: {
        width: '110%',
        height: '95%'
    },
    container: {
        flex: 1,
        backgroundColor: '#14555d'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    createTopicButton: {
        width: '70%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#14555d',
        marginTop: '20%'
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    buttonUpload: {
        marginTop: "2%",
        width: "4%",
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#14555d',

    },
    background: {
        width: "100%",
        height: "100%",
        backgroundColor: '#fff'
    },
    map: {
        width: Dimensions.get("window").width,
        height: "100%",
    },
    beerButton: {
        marginLeft: "3%",
        width: "30%",
        height: "30%",
        alignSelf: 'flex-start',
        position: "absolute"
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
});