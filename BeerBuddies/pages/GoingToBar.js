import React from "react"
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
    Image,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { CheckBox } from "@ui-kitten/components";

const GoingToBar = ({ route }) => {

    const [time, updateTime] = React.useState('')
    const [checkedM, setCheckedM] = React.useState(false)
    const [checkedF, setCheckedF] = React.useState(false)

    function confirmStuff() { }

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor="#ffd086" barStyle="light-content" />
            <View style={{ width: '100%', height: '10%', flexDirection: 'row', marginTop: '0.5%', borderBottomColor: "#666666", borderBottomWidth: 2 }}>
                <View style={{ width: '15%', height: '100%', marginLeft: 5 }}>
                    <TouchableOpacity onPress={() => navigateAboutUs()} activeOpacity={0.5}>
                        <Image style={styles.image_beer}
                            source={require("../assets/images/beers.png")}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: '100%', height: '40%', alignItems: 'center', paddingTop: 10 }}>
                <Text style={styles.bar_title}>{route.params.name}</Text>
                <Image
                    style={{ width: '80%', height: '80%', margin: 10 }}
                    source={{ uri: route.params.img }}
                />
            </View>
            <View style={{ marginHorizontal: '10%', height: '27%', width: '80%' }}>
                <Text style={styles.text_subtitles}>Time:</Text>
                <View>
                    <Picker onValueChange={updateTime} selectedValue={time} style={{ width: '50%' }}>
                        <Picker.Item label="21:00" value="21:00" />
                        <Picker.Item label="21:30" value="21:30" />
                        <Picker.Item label="22:00" value="22:00" />
                        <Picker.Item label="22:30" value="22:30" />
                        <Picker.Item label="23:00" value="23:00" />
                        <Picker.Item label="23:30" value="23:30" />
                        <Picker.Item label="00:00" value="00:00" />
                    </Picker>
                </View>
                <Text style={styles.text_subtitles}>Preferred genders:</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <CheckBox
                        checked={checkedM}
                        onChange={nextChecked => setCheckedM(nextChecked)}>
                        <Text>Male</Text>
                    </CheckBox>
                    <CheckBox
                        checked={checkedF}
                        onChange={nextChecked => setCheckedF(nextChecked)}>
                        <Text>Female</Text>
                    </CheckBox>
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row', height: '30%' }} >
                    <View style={{ width: '30%', height: '100%' }}>
                        <Text style={styles.text_subtitles}>Min. Age:</Text>
                        <View style={{ width: '70%', height: '100%' }}>
                            <TextInput style={{ borderBottomWidth: 3, borderBottomColor: '#fce571' }}>  </TextInput>
                        </View>

                    </View>
                    <View style={{ width: '30%', height: '100%' }}>
                        <Text style={styles.text_subtitles}>Max. Age:</Text>
                        <View style={{ width: '70%', height: '100%' }}>
                            <TextInput style={{ borderBottomWidth: 3, borderBottomColor: '#fce571', }}>  </TextInput>
                        </View>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => confirmStuff()} style={styles.button}>
                    <Text style={{ alignContent: 'center', textAlign: 'center', marginTop: '2.5%', fontSize: 23, fontWeight: 'bold', color: 'white' }}>
                        I'm going to this bar.
                    </Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        flexDirection: "column",
    },
    button: {
        marginTop: 20,
        height: '25%',
        backgroundColor: 'black',
        marginHorizontal: '10%',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 10
    },
    image_beer: {
        width: '100%',
        height: '95%'
    },
    bar_title: {
        fontWeight: 'bold',
        fontSize: 24
    },
    text_subtitles: {
        fontWeight: 'bold'
    }
});

export default GoingToBar;