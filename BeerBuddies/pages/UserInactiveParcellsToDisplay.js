import React from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import ScrollableModalPopup from '../components/ScrollableModalPopup';
import ModalPoup from '../components/ModalPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from "buffer";

const FILE_TYPE = "application/pdf";
const IMAGE_NAME = "ImagemParcela";

class UserInactiveParcellsToDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parcellVisible: false,
            parcells: [],
            email: '',
            token: '',
            continueChange: false,
            parcellID: '',
            atualUse: props.parcell.atualUse,
            anteriorUse: props.parcell.anteriorUse,
            soil: props.parcell.soil,
            giveAccessActive: false,
            giveAccessEmail: "",
            removeAccessEmail: "",
            removeAccessActive: false,
            addOwnerActive: false, 
            addOwnerfullName: "",
            addOwnerEmail: "",
            addOwnerCC: "",
            addOwnerCCValidity:""
        }
        this.token = "";
        this.imageToUpload;
        this.fileToUpload;
        this.atualUseDisplay = props.parcell.atualUse;
        this.anteriorUseDisplay = props.parcell.anteriorUse;
        this.soilDisplay = props.parcell.soilDisplay;
    }

    componentDidMount() {
        const getToken = async () => {
            let token = await AsyncStorage.getItem("token");
            this.token = token;
        }
        getToken();
    }


    showParcellInfo(parcell) {
        this.setState({
            parcellVisible: true
        });
        let id = parcell.parish + "-" + parcell.section + "-" + parcell.article;
        this.setState({ parcellID: id });
    }

    handleCloseParcellInfo() {
        this.setState({ parcellVisible: false });
    }

    handleChangeSoil(val) {
        this.setState({ soil: val });
    }

    handleChangeAnteriorUse(val) {
        this.setState({ anteriorUse: val });
    }

    handleChangeAtualUse(val) {
        this.setState({ atualUse: val });
    }

    handleContinueChangeParcellData(email) {
        this.setState({ continueChange: true });
    }

    handleGiveAccessEmail(email) {
        this.setState({giveAccessEmail: email});
    }

    handleGiveAccess(parcell, email) {
        let giveAccessInfo = {
            email: email,
            tokenID: this.token,
            giveAccessEmail: this.state.giveAccessEmail,
            parcellID: parcell.parish + "-"+parcell.section+"-"+parcell.article
        };
        axios.post('https:/saving-fields.appspot.com/rest/parcell/giveAccess', giveAccessInfo)
        .then(response => {
            this.setState({giveAccessActive: false});
            Alert.alert('Sucesso!', "Utilizador adicionado à lista de acesso à parcela.", [
                { text: 'Okay' }
            ]);
        })
        .catch(err => {
            Alert.alert('Erro!', err.response.data, [
                { text: 'Okay' }
            ]);
        })
    }

    handleRemoveAccessEmail(email) {
        this.setState({removeAccessEmail: email});
    }

    handleRemoveAccess(parcell, email) {
        let removeAccessInfo = {
            email: email,
            tokenID: this.token,
            giveAccessEmail: this.state.removeAccessEmail,
            parcellID: parcell.parish + "-"+parcell.section+"-"+parcell.article
        };
        axios.post('https:/saving-fields.appspot.com/rest/parcell/removeAccess', removeAccessInfo)
        .then(response => {
            this.setState({removeAccessActive: false});
            Alert.alert('Sucesso!', "Utilizador removido da lista de acesso à parcela.", [
                { text: 'Okay' }
            ]);
        })
        .catch(err => {
            Alert.alert('Erro!', err.response.data, [
                { text: 'Okay' }
            ]);
        })
    }

    handleUpdateParcell(email) {
        axios.post('https:/saving-fields.appspot.com/rest/parcell/updateAccessParcell', {
            email: email,
            tokenID: this.token,
            parcellID: this.state.parcellID,
            atualUse: this.state.atualUse,
            soil: this.state.soil,
            anteriorUse: this.state.anteriorUse
        })
            .then(response => {
                this.setState({ parcellVisible: false });
                this.setState({ continueChange: false });
                Alert.alert('Sucesso!', "A parcela foi atualizada.", [
                    { text: 'Okay' }
                ]);
                this.anteriorUseDisplay = this.state.anteriorUse;
                this.atualUseDisplay = this.state.atualUse;
                this.soilDisplay = this.state.soil;
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
                this.setState({ anteriorUse: this.anteriorUseDisplay });
                this.setState({ atualUse: this.atualUseDisplay });
                this.setState({ soil: this.soilDisplay });
            })
    }

    handleAddOwnerFullName(val)  {
        this.setState({addOwnerfullName: val});
    }

    handleAddOwnerEmail(val)  {
        this.setState({addOwnerEmail: val});
    }

    handleAddOwnerCC(val)  {
        this.setState({addOwnerCC: val});
    }

    handleAddOwnerCCValidity(val)  {
        this.setState({addOwnerCC: val});
    }

    handleAddOwner(parcell, email) {
        let addInfo = {
            myEmail: email,
            tokenID: this.token,
            parcellID: parcell.parish+"-"+parcell.section+"-"+parcell.article,
            fullName: this.state.addOwnerfullName,
            email: this.state.addOwnerEmail,
            citizenCardValidity: this.state.addOwnerCCValidity,
            citizenCard: this.state.addOwnerCC
        };
        axios.post('https:/saving-fields.appspot.com/rest/parcell/addOwner', addInfo)
            .then(response => {
                this.setState({addOwnerActive: false});
                Alert.alert('Sucesso!', "O proprietário foi adicionado à parcela. Por favor, aguarde que seja verificado pelos técnicos.", [
                    { text: 'Okay' }
                ]);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            })
    }

    async takePicture() {
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
            if (!result.cancelled) {
                this.readImage(result.uri);
            }
        } catch (err) {
            throw err;
        }
    }

    async pickImage() {
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
                this.readImage(result.uri);
            }
        } catch (err) {
            throw err;
        }
    }

    async readImage(uri) {
        try {
            const imageInfo = await FileSystem.getInfoAsync(uri);
            if (imageInfo.exists) {
                let splitted = uri.split(".");
                let imageType = splitted[splitted.length - 1];
                let imageString = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                let imageBuff = Buffer.from(imageString, 'base64').toJSON();
                this.imageToUpload = imageBuff.data;
                this.uploadImage(this.imageToUpload, "image/" + imageType);
            }
        } catch (err) {
            console.warn(err);
        }
    }

    uploadImage(imageToUpload, type) {
        axios.post('https:/saving-fields.appspot.com/rest/user/uploadImage', {
            parcellID: this.state.parcellID,
            data: imageToUpload,
            type: type,
            filename: IMAGE_NAME
        })
            .then(response => {
                Alert.alert('Sucesso!', "A imagem foi atualizada.", [
                    { text: 'Okay' }
                ]);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            })
    }

    async pickDocument() {
        // Pick a single file
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: FILE_TYPE,
            });
            this.readFile(res.uri, res.name);
            if (res.type == "cancel") {
            } else {

            }
        } catch (err) {
            throw err;
        }
    }


    async readFile(uri, filename) {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists) {
                let fileString = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
                let fileBuff = Buffer.from(fileString, 'utf8').toJSON();
                fileToUpload = JSON.parse("[" + fileBuff.data + "]");
                filenameToUpload = filename;
                this.uploadFile(filename, fileToUpload);
            }
        } catch (err) {
            console.warn(err);
        }
    }

    uploadFile(filename, fileToUpload) {
        axios.post('https:/saving-fields.appspot.com/rest/user/uploadFile', {
            parcellID: this.state.parcellID,
            data: fileToUpload,
            filename: filename,
            type: FILE_TYPE
        })
            .then(response => {
                Alert.alert('Sucesso!', "O ficheiro foi adicionado à lista de ficheiros da sua parcela.", [
                    { text: 'Okay' }
                ]);
            })
            .catch(err => {
                Alert.alert('Erro!', err.response.data, [
                    { text: 'Okay' }
                ]);
            });
    }

    render() {
        const { parcell } = this.props;
        const { email } = this.props;
        let owner = JSON.parse(parcell.owner);
        let owners = "";
        let rentalArr = parcell.rental;
        owner.map((own, i) => {
            if (i + 1 == owner.length) {
                owners += own.email;
            } else {
                owners += own.email + ", ";
            }
        });

        return (
            <View>
                <TouchableOpacity
                    style={{ width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: "10%" }}
                    onPress={(e) => this.showParcellInfo(parcell)}>
                    {parcell.image != undefined ? (<Image style={{ width: 150, height: 150 }}
                        source={{ uri: parcell.image }} />) :
                        <Image style={{ width: 150, height: 150 }}
                            source={require('../assets/images/NoImage.png')} />}
                    <Text>Nome: {parcell.name}</Text>
                    <Text>Área: {parcell.area.toFixed(0)} m²</Text>
                    <Text>Distrito: {parcell.district}</Text>
                    <Text>Freguesia: {parcell.parish}</Text>
                </TouchableOpacity>
                <ScrollableModalPopup visible={this.state.parcellVisible}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Informações da parcela
                            </Text>
                        </View>
                        <View style={{ width: "100%", bottom: "12%" }}>
                            <TouchableOpacity onPress={() => this.handleCloseParcellInfo()}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, right: 0, height: 30, width: 30, position: 'absolute', right: "72%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Distrito</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.district}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Concelho</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.county}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Freguesia</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.parish}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Secção</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.section}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Artigo</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.article}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Uso atual</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={this.state.atualUse}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => { this.handleChangeAtualUse(val) }}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Uso anterior</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={this.state.anteriorUse}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => { this.handleChangeAnteriorUse(val) }}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Tipo de solo</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={this.state.soil}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => { this.handleChangeSoil(val) }}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Disponível para arrendar?</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={rentalArr == "[]" && parcell.atualUse.toLowerCase() == "nenhum" ? "Sim" : "Não"}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Email dos proprietários</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            value={owners}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.handleContinueChangeParcellData(email) }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.setState({giveAccessActive: true}) }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Ceder Acesso</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.setState({removeAccessActive: true})}}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Remover Acesso</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.setState({addOwnerActive: true})}}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Adicionar Proprietário</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollableModalPopup visible={this.state.addOwnerActive}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold", marginTop: "5%" }}>
                                Adicionar proprietário a parcela
                            </Text>
                        </View>
                        <View style={{ width: "100%", right: 0, bottom: "15%" }}>
                            <TouchableOpacity onPress={() => this.setState({addOwnerActive: (false)})}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, right: 0, height: 30, width: 30, position: 'absolute', right: "100%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Nome Completo</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => this.handleAddOwnerFullName(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Email</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => this.handleAddOwnerEmail(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Número de Cartão de Cidadão</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            onChangeText={(val) => this.handleAddOwnerCC(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Validade do Cartão de Cidadão</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="DD-MM-YYYY"
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                            onChangeText={(val) => this.handleAddOwnerCCdValidity(val)}
                            require
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.handleAddOwner(parcell, email) }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Adicionar proprietário</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollableModalPopup>
                    <ScrollableModalPopup visible={this.state.removeAccessActive}>
                        <View style={{ alignItems: 'center', flexDirection: "row" }}>
                            <View >
                                <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                    Remover acesso
                                </Text>
                            </View>
                            <View style={{ width: "100%", right: 0, bottom: "14%" }}>
                                <TouchableOpacity onPress={() => this.setState({removeAccessActive: false})}>
                                    <Image
                                        source={require('../assets/images/x.png')}
                                        style={{ top: 0, right: 0, height: 30, width: 30, position: "absolute", right: "47%" }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <TextInput
                                style={[styles.textInput, { marginTop: 5 }]}
                                autoCapitalize="words"
                                onChangeText={(val) => this.handleRemoveAccessEmail(val)}
                            />
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.createTopicButton}
                                onPress={() => { this.handleRemoveAccess(parcell, email) }}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Remover acesso</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollableModalPopup>
                    <ScrollableModalPopup visible={this.state.giveAccessActive}>
                        <View style={{ alignItems: 'center', flexDirection: "row" }}>
                            <View >
                                <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                    Ceder acesso
                                </Text>
                            </View>
                            <View style={{ width: "100%", right: 0, bottom: "14%" }}>
                                <TouchableOpacity onPress={() => this.setState({giveAccessActive: false})}>
                                    <Image
                                        source={require('../assets/images/x.png')}
                                        style={{ top: 0, right: 0, height: 30, width: 30, position: "absolute", right: "40%" }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <TextInput
                                style={[styles.textInput, { marginTop: 5 }]}
                                autoCapitalize="words"
                                onChangeText={(val) => this.handleGiveAccessEmail(val)}
                            />
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.createTopicButton}
                                onPress={() => { this.handleGiveAccess(parcell, email) }}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Ceder acesso</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollableModalPopup>
                </ScrollableModalPopup>
                <ModalPoup visible={this.state.continueChange}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ width: "100%", fontSize: 20, alignItems: "center", fontWeight: "bold" }}>
                                Dados da parcela
                            </Text>
                        </View>
                        <View style={{ width: "100%", bottom: "12%", right: 0 }}>
                            <TouchableOpacity onPress={() => this.setState({ continueChange: false })}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ top: 0, height: 30, width: 30, position: 'absolute', right: "50%" }}
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
                                onPress={() => { this.pickDocument() }}
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
                                onPress={() => { this.pickImage() }}
                            />
                            <Button
                                style={styles.buttonUpload}
                                icon="camera-plus"
                                mode="contained"
                                onPress={() => { this.takePicture() }}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { this.handleUpdateParcell(email) }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Atualizar parcela</Text>
                        </TouchableOpacity>
                    </View>
                </ModalPoup>
            </View>

        )
    }
}
export default UserInactiveParcellsToDisplay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14555d'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonUpload: {
        marginTop: "2%",
        width: "4%",
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#14555d',

    },
    createTopicButton: {
        width: '70%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#14555d',
        marginTop: '10%'
    },
    deleteButton: {
        width: '70%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#B60000',
        marginTop: '10%'
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
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