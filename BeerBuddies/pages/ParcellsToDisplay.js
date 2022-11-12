import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput } from 'react-native';
import ScrollableModalPopup from '../components/scrollableModalPopup';


class ParcellsToDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parcellVisible: false,
        }
    }
    
    showParcellInfo(parcell) {
        this.setState({
            parcellVisible: true
        });
    }


    render() {
        const { parcell } = this.props;
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
                        <View style={{ width: "100%", bottom: "12%"}}>
                            <TouchableOpacity onPress={() => this.setState({ parcellVisible: false })}>
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
                    }]}>Tipo de solo</Text>
                    <View style={styles.action}>
                        <TextInput
                            value={parcell.soil}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            editable={false}
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
                </ScrollableModalPopup>
            </View>

        )
    }
}
export default ParcellsToDisplay;

const styles = StyleSheet.create({
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