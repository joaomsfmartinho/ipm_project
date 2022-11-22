import React from "react"
import { View, Text, ImageBackground, StyleSheet, StatusBar, Input, Pressable } from "react-native"
import { Button, TextInput } from "react-native-paper";
import BeerAboutUsButton from "../components/BeerAboutUsButton"
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";


const Filter = ({ navigation }) => {
    const [price, setPrice] = useState('')
    const [rating, setRating] = useState('')
    const [distance, setDistance] = useState('')
    const [beer, setBeer] = useState('')

    const navigateAboutUs = () => {
        {/** TODO Navigate to about us */ }
        {/** navigation.push('About') ? */ }
    }

    const navigateBackwards = () => {
        {/** TODO Navigate backwords page */ }
    }

    const startSearching = () => {
        {/** TODO Search for bars... */ }
    }

    return (
        <View style={styles.mainContainer}>

            {/** Header */}
            <StatusBar backgroundColor='#fce571' barStyle="light-content" />
            <View style={{ width: '100%', height: '9.9%', flexDirection: 'row', marginTop: '0.5%' }}>
                <View style={{ width: '50%', height: '100%' }}>
                    <Pressable onPress={() => navigateAboutUs()}>
                        <ImageBackground style={styles.image_beer}
                            source={require("../assets/images/beers.png")}>
                        </ImageBackground>
                    </Pressable>
                </View>
                <View style={{ width: '50%', height: '100%' }}>
                    <Pressable onPress={() => navigateBackwards()}>
                        <ImageBackground style={styles.image_arrow}
                            source={require("../assets/images/arrow.png")}>
                        </ImageBackground>
                    </Pressable>
                </View>
            </View>

            {/** Middle Stuff */}
            <View style={{ position: 'absolute', width: '100%', height: '100%', top: '15%' }}>
                {/** Maximum Beer Price */}
                <Text style={styles.text}> Beer Price (€)</Text>
                <TextInput value={price} keyboardType='numeric' onChangeText={setPrice} placeholder="Type beer price..." style={styles.textInput}></TextInput>

                {/** Minimum Rating */}
                <Text style={styles.text}> Minimum Rating (1-5) </Text>
                <View style={styles.picker_rating}>
                    <Picker onValueChange={setRating} selectedValue={rating}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="Any" value="Any" />
                    </Picker>
                </View>

                {/** Maximum Distance */}
                <Text style={styles.text}> Maximum Distance (km) </Text>
                <TextInput value={distance} keyboardType='numeric' onChangeText={setDistance} placeholder="Type max distance..." style={styles.textInput}></TextInput>

                {/** Beer Brand */}
                <Text style={styles.text}> Pick a beer brand of your choice </Text>
                <View style={styles.picker_beers}>
                    <Picker onValueChange={setBeer} selectedValue={beer}>
                        <Picker.Item label="Sagres" value="Sagres" />
                        <Picker.Item label="Super Bock" value="Super Bock" />
                        <Picker.Item label="Heineken" value="Heineken" />
                        <Picker.Item label="Cergal" value="Cergal" />
                        <Picker.Item label="Estrela" value="Estrela" />
                        <Picker.Item label="Corona" value="Corona" />
                        <Picker.Item label="Guinness" value="Guinness" />
                        <Picker.Item label="Any" value="Any" />
                    </Picker>
                </View>

                <Pressable onPress={() => { }}>
                    <View style={styles.button}>
                        <Text style={{ alignContent: 'center', textAlign: 'center', marginTop: '2.5%', fontSize: 25, fontWeight: 'bold', color: 'white' }} onPress={startSearching}>
                            Search
                        </Text>
                    </View>
                </Pressable>
            </View >
        </View >
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    text: {
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '10%',
        marginTop: 20,
        fontSize: 15
    },
    textInput: {
        backgroundColor: 'white',
        marginHorizontal: '10%',
    },
    picker_beers: {
        width: '40%',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d1',
        marginHorizontal: '10%',
    },
    picker_rating: {
        width: '25%',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d1',
        marginHorizontal: '10%',
    },
    image_beer: {
        width: '70%',
        height: '100%'
    },
    image_arrow: {
        width: '55%',
        height: '90%',
        marginLeft: '60%',
        marginTop: 5
    },
    button: {
        height: '25%',
        backgroundColor: 'black',
        marginHorizontal: '10%',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 10,
        marginTop: 50
    }
});


export default Filter