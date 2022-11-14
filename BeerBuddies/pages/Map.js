import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, Alert, ScrollView, Dimensions, LogBox, Image } from 'react-native';
import axios from 'axios';
import {
    Avatar,
    withTheme,
    Card,
    useTheme,
    Title,
    Paragraph,
    List,
    Searchbar,
    FAB,
    Portal,
    Provider,
    Modal, Button,
    IconButton
} from 'react-native-paper';
import MapView, { Polygon, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config/index.json';
import MapViewDirections from 'react-native-maps-directions';
import ModalPopup from '../components/ModalPopup';
import * as turf from '@turf/turf';
import booleanIntersects from '@turf/boolean-intersects';
import ScrollableModalPopup from '../components/ScrollableModalPopup';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from "buffer";
import { lineString } from '@turf/turf';
import { feature } from '@turf/helpers';
import { area } from '@turf/area';

let markersArray = [];
let firstIteration = true;

const FILE_TYPE = "application/pdf";
const IMAGE_NAME = "ImagemParcela";

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

const Map = ({ navigation }) => {
    const [parcells, setParcells] = React.useState([]);
    const [markers, setMarkers] = React.useState([]);
    const [markersLatLng, setMarkersLatLng] = React.useState([]);
    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [userLocation, setUserLocation] = React.useState(null);
    const [destin, setDestin] = React.useState(null);
    const [state, setState] = React.useState({ open: false });
    const [visible, setVisible] = React.useState(false);
    const [isRouteEnabled, setIsRouteEnabled] = React.useState(false);
    const [confirmedDraw, setConfirmedDraw] = React.useState(false);
    const [continueRegistration, setContinueRegistration] = React.useState(false);
    const [tutorialVisible, setTutorialVisible] = React.useState(false);
    const [hasPermission, setPermission] = React.useState('');
    const [parcellArea, setArea] = React.useState(0);
    const [owner, setOwner] = React.useState({
        fullName: '',
        email: '',
        citizenCard: '',
        citizenCardValidity: '10-07-2022'
    });

    const [giveAccess, setGiveAccess] = React.useState({
        parish: '',
        section: '',
        article: '',
        email: ''
    });

    const [addOwner, setAddOwner] = React.useState({
        parish: '',
        section: '',
        article: '',
        fullName: '',
        email: '',
        citizenCard: '',
        citizenCardValidity: '10-07-2022'
    });

    const [searchParcell, setSearchParcell] = React.useState({
        parish: '',
        section: '',
        article: ''
    });

    const [parcellInfo, setParcellInfo] = React.useState({
        userThatRegistered: '',
        tokenID: '',
        district: '',
        county: '',
        parish: '',
        section: '',
        article: '',
        name: '',
        description: '',
        soil: '',
        atualUse: 'Nenhum',
        anteriorUse: '',
        area: '',
        owner: null,
        access: null,
        rental: [],
        coordinates: null
    })

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
        LogBox.ignoreLogs(["Failed prop type: The prop 'region.latitudeDelta' is marked as required in 'MapView', but its value is 'undefined'."]);
        LogBox.ignoreLogs(['If you are using React Native v0.60.0+ you must follow these instructions to enable currentLocation: https://git.io/Jf4AR']);
        if (parcells.length == 0) {
            axios
                .get('https:/saving-fields.appspot.com/rest/parcell/drawParcells')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        let coordsToParse = JSON.parse(response.data[i].stringCoordinates);
                        let parcellCoords = [];
                        for (let j = 0; j < coordsToParse.length; j++) {
                            parcellCoords.push({
                                latitude: coordsToParse[j].lat,
                                longitude: coordsToParse[j].lng
                            });
                        }
                        setParcells((current) => [
                            ...current, {
                                PARCELL: response.data[i].PARCELL,
                                accountType: response.data[i].accountType,
                                area: response.data[i].area,
                                stringCoordinates: parcellCoords,
                                userThatRegistered: response.data[i].userThatRegistered
                            }
                        ]);
                    }
                })
                .catch(error => {
                    console.warn(error);
                });
        }
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setPermission(status);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            setLocation(location);
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.00421
            })
        })();
    }, []);

    const clearState = () => {
        setMarkers([]);
        markersArray = [];
        setMarkersLatLng([]);
        firstIteration = true;
    }

    const handleParishChange = (val) => {
        setSearchParcell({
            ...searchParcell,
            parish: val
        });
    };

    const handleArticleChange = (val) => {
        setSearchParcell({
            ...searchParcell,
            article: val
        });
    };

    const handleSectionChange = (val) => {
        setSearchParcell({
            ...searchParcell,
            section: val
        });
    };

    const displayParcells = () => {
        return parcells.map((parcell) => {
            return (
                <Polygon
                    keyExtractor={(item, index) => index.toString()}
                    coordinates={parcell.stringCoordinates}
                    fillColor="rgba(0, 200, 0, 0.5)"
                    strokeColor="rgba(0,0,0,0.5)"
                    strokeWidth={2}
                >
                </Polygon>
            );
        });
    }

    const handleParcellInfoDistrict = (val) => {
        setParcellInfo({
            ...parcellInfo,
            district: val
        });
    }

    const handleParcellInfoCounty = (val) => {
        setParcellInfo({
            ...parcellInfo,
            county: val
        });
    }

    const handleParcellInfoParish = (val) => {
        setParcellInfo({
            ...parcellInfo,
            parish: val
        });
    }

    const handleParcellInfoSection = (val) => {
        setParcellInfo({
            ...parcellInfo,
            section: val
        });
    }

    const handleParcellInfoArticle = (val) => {
        setParcellInfo({
            ...parcellInfo,
            article: val
        });
    }

    const handleParcellInfoName = (val) => {
        setParcellInfo({
            ...parcellInfo,
            name: val
        });
    }

    const handleParcellInfoDescription = (val) => {
        setParcellInfo({
            ...parcellInfo,
            description: val
        });
    }

    const handleParcellInfoSoil = (val) => {
        setParcellInfo({
            ...parcellInfo,
            soil: val
        });
    }

    const handleParcellInfoAnteriorUse = (val) => {
        setParcellInfo({
            ...parcellInfo,
            anteriorUse: val
        });
    }

    const handleParcellInfoAtualUse = (val) => {
        setParcellInfo({
            ...parcellInfo,
            atualUse: val
        });
    }

    const handleOwnerInfoName = val => {
        setOwner({
            ...owner,
            fullName: val
        });
    }

    const handleOwnerInfoEmail = val => {
        setOwner({
            ...owner,
            email: val
        });
    }

    const handleOwnerInfoCC = val => {
        setOwner({
            ...owner,
            citizenCard: val,
        });
    }

    const handleOwnerInfoCardValidity = (val) => {
        setOwner({
            ...owner,
            citizenCardValidity: val
        })
    }

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

    const uploadImage = (imageToUpload, type) => {
        if (parcellInfo.parish == '' || parcellInfo.section == '' || parcellInfo.article == '') {
            Alert.alert('Erro!', "Por favor, preencha os restantes dados antes de dar upload dos documentos.", [
                { text: 'Okay' }
            ]);
        }
        else if (type != "png" && type != "jpg" && type != "jpeg") {
            Alert.alert('Erro!', "A imagem tem de ser do tipo PNG, JPG ou JPEG.", [
                { text: 'Okay' }
            ]);
        } else {
            let parcellID = parcellInfo.parish + "-" + parcellInfo.section + "-" + parcellInfo.article;
            axios.post('https:/saving-fields.appspot.com/rest/user/uploadImage/' + parcellID + "/" + type,
                imageToUpload, {
                headers: {
                    'content-type': 'application/octet-stream'
                }
            })
                .then(response => {
                    Alert.alert('Sucesso!', "Imagem atualizada com sucesso.", [
                        { text: 'Okay' }
                    ]);
                })
                .catch(err => {
                    Alert.alert('Erro!', err.response.data, [
                        { text: 'Okay' }
                    ]);
                })
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

    const uploadFile = (filename, fileToUpload) => {
        if (parcellInfo.parish == '' || parcellInfo.section == '' || parcellInfo.article == '') {
            Alert.alert('Erro!', "Por favor, preencha os restantes dados antes de dar upload dos documentos.", [
                { text: 'Okay' }
            ]);
        } else {
            let parcellID = parcellInfo.parish + "-" + parcellInfo.section + "-" + parcellInfo.article;
            axios.post('https:/saving-fields.appspot.com/rest/user/uploadFile/' + parcellID + "/" + filename + "",
                fileToUpload, {
                headers: {
                    'content-type': "application/octet-stream"
                }
            })
                .then(response => {
                    Alert.alert('Sucesso!', "Ficheiro adicionado com sucesso.", [
                        { text: 'Okay' }
                    ]);
                })
                .catch(err => {
                    Alert.alert('Erro!', err.response.data, [
                        { text: 'Okay' }
                    ]);
                });
        }
    }

    const handleRegisterParcell = async () => {
        let email = await AsyncStorage.getItem("email");
        let token = await AsyncStorage.getItem("token");
        let ownerArr = [];
        ownerArr.push(owner);
        let accessArr = [];
        accessArr.push(email);
        accessArr.push(owner.email);
        setParcellInfo({
            ...parcellInfo,
            userThatRegistered: email,
            tokenID: token,
            owner: ownerArr,
            access: accessArr,
            coordinates: markersLatLng
        });
        axios.get('https:/saving-fields.appspot.com/rest/user/getType/?email=' + email)
            .then(response => {
                if (response.data == "Gestor de Parcelas") {
                    Alert.alert('Erro!', "Como o seu tipo de conta é Gestor de Parcelas, não pode registar uma parcela.", [
                        { text: 'Okay' }
                    ]);
                }
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            })
        registerParcell(email, token, ownerArr, accessArr);
    }

    const registerParcell = (email, token, ownerArr, accessArr) => {
        let regInfo = {
            userThatRegistered: email,
            tokenID: token,
            district: parcellInfo.district,
            county: parcellInfo.county,
            parish: parcellInfo.parish,
            section: parcellInfo.section,
            article: parcellInfo.article,
            name: parcellInfo.name,
            description: parcellInfo.description,
            soil: parcellInfo.soil,
            atualUse: parcellInfo.atualUse,
            anteriorUse: parcellInfo.anteriorUse,
            area: parseFloat(parcellArea),
            owner: ownerArr,
            access: accessArr,
            rental: parcellInfo.rental,
            coordinates: markersLatLng
        }
        console.warn(regInfo);
        if (parcellInfo.district == "" || parcellInfo.county == "" || parcellInfo.parish == "" || parcellInfo.article == "") {
            Alert.alert('Erro!', "Por favor, preencha os dados da sua parcela antes de registar.", [
                { text: 'Okay' }
            ]);
        } else {
            axios
                .post('https:/saving-fields.appspot.com/rest/parcell/registerParcell', regInfo)
                .then(response => {
                    setVisible(false);
                    setMarkers([]);
                    setMarkersLatLng([]);
                    markersArray = [];
                    firstIteration = true;
                    Alert.alert('Sucesso!', "A sua parcela foi registada. Por favor, aguarde a verificação da mesma por parte dos técnicos.", [
                        { text: 'Okay' }
                    ]);
                })
                .catch(err => {
                    Alert.alert('Erro!', err.response.data, [
                        { text: 'Okay' }
                    ]);
                    firstIteration = true;
                });
        }
    }

    const createRouteToParcell = () => {
        setIsRouteEnabled(true);
        axios
            .post('https:/saving-fields.appspot.com/rest/parcell/getParcellForRoute', searchParcell)
            .then(response => {
                let coordsToParse = JSON.parse(response.data.coordinates);
                setDestin({
                    latitude: coordsToParse[0].lat,
                    longitude: coordsToParse[0].lng,
                    latitudeDelta: 0.000922,
                    longitudeDelta: 0.000421
                });

            })
            .catch(error => {
                if (error.response.data != "") {
                    Alert.alert('Erro!', error.response.data, [
                        { text: 'Okay' }
                    ]);
                }
            });
        setVisible(false)
    };

    const confirmParcellDraw = (e) => {
        setConfirmedDraw(true);
        let arr = [];
        if (markersArray.length > 0) {
            for (let i = 0; i < markersArray.length; i++) {
                arr.push([markersArray[i].lat, markersArray[i].lng]);
            }
            arr.push([markersArray[0].lat, markersArray[0].lng]);
            var parcell = {
                type: "Polygon",
                coordinates: [arr]
            };
            var parcellFeature = feature(parcell);
            setArea(turf.area(parcellFeature));
        } else {
            setConfirmedDraw(false);
            Alert.alert('Erro!', "Ainda não registou a sua parcela. Comece o processo ao clicar em 'Desenhar parcela'.", [
                { text: 'Okay' }
            ]);
        }
    }

    const handleContinueRegistration = () => {
        setContinueRegistration(true);
    }

    const addMarker = () => {
        if (markers.length > 50) {
            Alert.alert('Erro!', "Ultrapassou o limite de marcadores. Por favor, recomece o processo de desenho.", [
                { text: 'Okay' }
            ]);
            setMarkers([]);
            setMarkersLatLng([]);
            markersArray = [];
            firstIteration = true;
        } else {
            let latLng = { lat: userLocation.latitude, lng: userLocation.longitude };
            if (firstIteration) {
                markersArray.push(latLng);
                firstIteration = false;
                setMarkers((current) => [
                    ...current,
                    {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                    },
                ]);
                setMarkersLatLng((current) => [
                    ...current,
                    {
                        lat: userLocation.latitude,
                        lng: userLocation.longitude,
                    },
                ]);
            } else {
                let lat = markersArray[markersArray.length - 1].lat;
                let lng = markersArray[markersArray.length - 1].lng;
                if (lat != latLng.lat && lng != latLng.lng) {
                    markersArray.push(latLng);
                    setMarkers((current) => [
                        ...current,
                        {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        },
                    ]);
                    setMarkersLatLng((current) => [
                        ...current,
                        {
                            lat: userLocation.latitude,
                            lng: userLocation.longitude,
                        },
                    ]);
                    lat = markersArray[markersArray.length - 1].lat;
                    lng = markersArray[markersArray.length - 1].lng;
                    let overlap = false;
                    let markersCoords = [];
                    markersCoords.push([
                        markersArray[markersArray.length - 1].lat,
                        markersArray[markersArray.length - 1].lng
                    ]
                    );
                    markersCoords.push([
                        markersArray[markersArray.length - 2].lat,
                        markersArray[markersArray.length - 2].lng
                    ]
                    );
                    for (let i = 0; i < parcells.length && !overlap; i++) {
                        let parcellCoords = [];
                        for (let j = 0; j < parcells[i].stringCoordinates.length; j++) {
                            parcellCoords.push([parcells[i].stringCoordinates[j].latitude, parcells[i].stringCoordinates[j].longitude]);
                        }
                        let polygon = [parcellCoords];
                        let line = [markersCoords[markersCoords.length - 1], markersCoords[markersCoords.length - 2]];
                        overlap = turf.booleanIntersects({
                            type: "LineString",
                            coordinates: line
                        }, {
                            type: "Polygon",
                            coordinates: polygon
                        });
                        if (overlap) {
                            setMarkers([]);
                            setMarkersLatLng([]);
                            markersArray = [];
                            firstIteration = true;
                            Alert.alert("Erro!", "A sua parcela não está a cumprir com os limites devidos. Por favor, recomece o processo de desenho.", [
                                { text: 'Okay' }
                            ]);
                            break;
                        }
                    }
                }
            }
        }
    }

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder='Pesquisa'
                GooglePlacesSearchQuery={{
                    rankby: "distance"
                }}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    setDestin({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        latitudeDelta: 0.000922,
                        longitudeDelta: 0.000421
                    });
                }}
                query={{
                    key: config.directionsApiKey,
                    language: '	pt-pt',
                    components: 'country:pt',
                }}
                enablePoweredByContainer={false}
                fetchDetails={true}
                styles={{
                    container: { flex: 0, position: "absolute", width: "100%", zIndex: 1, top: "-0.5%" },
                    listView: { height: 100 }
                }}
            />
            <MapView
                initialRegion={userLocation}
                region={userLocation}
                style={styles.map}
                showsUserLocation={true}
                loadingEnabled={true}
                showsTraffic={isRouteEnabled}
                followsUserLocation={true}
                mapType="terrain"
                onUserLocationChange={(e) => {
                    setUserLocation({
                        latitude: e.nativeEvent.coordinate.latitude,
                        longitude: e.nativeEvent.coordinate.longitude
                    });
                }}
            >
                {markers.length != 0 ?
                    <Polygon
                        coordinates={markers}
                        fillColor="rgba(0, 200, 0, 0.5)"
                        strokeColor="rgba(0,0,0,0.5)"
                        strokeWidth={2}
                    >
                    </Polygon> : null}
                {displayParcells()}
                {destin &&
                    <MapViewDirections
                        origin={userLocation}
                        destination={destin}
                        apikey={config.directionsApiKey}
                        strokeWidth={3}
                        onReady={result => {

                        }}
                    />
                }
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
                <ScrollableModalPopup visible={confirmedDraw} style={{ height: "90%" }} >
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Dados da parcela
                            </Text>
                        </View>
                        <View style={{ width: "100%", right: 0, bottom: "13%" }}>
                            <TouchableOpacity onPress={() => setConfirmedDraw(false)}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, right: 0, height: 30, width: 30, position: 'absolute', right: "50%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Distrito</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleParcellInfoDistrict(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Concelho</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleParcellInfoCounty(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Freguesia</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleParcellInfoParish(val)}
                            require
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
                            onChangeText={(val) => handleParcellInfoSection(val)}
                            require
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
                            onChangeText={(val) => handleParcellInfoArticle(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Nome da Parcela</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleParcellInfoName(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Descrição</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleParcellInfoDescription(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Tipo de solo</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleParcellInfoSoil(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Uso atual</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcellInfo.atualUse}
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleParcellInfoAtualUse(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Uso anterior</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleParcellInfoAnteriorUse(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Área</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            value={parcellArea.toString()}
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Nome completo do dono</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleOwnerInfoName(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Email do dono</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleOwnerInfoEmail(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Numero do cartão de cidadão do dono</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            onChangeText={(val) => handleOwnerInfoCC(val)}
                            require
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Validade do Cartão de Cidadão</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="DD-MM-YYYY"
                            multiline={true}
                            keyboardType='number-pad'
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleOwnerInfoCardValidity(val)}
                            require
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { handleContinueRegistration() }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollableModalPopup>
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
            <View>
                <IconButton
                    color="red"
                    style={{ bottom: 0, left: "-1%", position: 'absolute' }}
                    icon="map-marker-plus"
                    onPress={(e) => { addMarker(e) }}
                />
            </View>
            <Provider>
                <Portal>
                    <FAB.Group
                        open={open}
                        icon={open ? 'close' : 'plus'}
                        style={{ bottom: 0, right: 0, top: "0%" }}
                        actions={[
                            {
                                icon: 'map-search',
                                label: "Pesquisar rota",
                                onPress: (e) => {
                                    setVisible(true);
                                }
                            },
                            {
                                icon: 'help',
                                label: 'Precisa de ajuda?',
                                onPress: (e) => {
                                    setTutorialVisible(true);
                                }
                            },
                            {
                                icon: 'car-off',
                                label: "Cancelar rota",
                                onPress: (e) => {
                                    setDestin(null);
                                    setIsRouteEnabled(false);
                                }
                            },
                            {
                                icon: 'delete',
                                label: 'Limpar desenho',
                                onPress: () => clearState(),
                            },
                            {
                                icon: 'calendar-check',
                                label: 'Confirmar',
                                onPress: (e) => confirmParcellDraw(e),
                            },
                        ]}
                        onStateChange={onStateChange}
                        fabStyle={{ backgroundColor: "#14555d" }}
                        onPress={() => {
                            if (!open) {
                                // do something if the speed dial is open
                            }
                        }}
                    />
                </Portal>
            </Provider>
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
        top: "5%",
    },
    button: {
        alignItems: 'center',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
});