import React from "react"
import { View, Text, ImageBackground, StyleSheet, StatusBar, Input, Pressable } from "react-native"
import { Button, TextInput } from "react-native-paper";
import BeerAboutUsButton from "../components/BeerAboutUsButton"
import { useState } from "react";

import { Picker } from "@react-native-picker/picker";


const Filter = ({ navigation }) => {
    const [price, newPrice] = useState('')
    const [rating, newRating] = useState('')
    const [distance, newDistance] = useState('')
    const [beer, newBeer] = useState('')


    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor='#fce571' barStyle="light-content" />
            <Pressable onPress={() => navigateAboutUs()}>
                <ImageBackground style={styles.image}
                    source={require("../assets/images/beers.png")}>
                </ImageBackground>
            </Pressable>
            <Text style={styles.text}> Beer Price </Text>
            <TextInput value={price} keyboardType='numeric' onChangeText={newPrice} placeholder="Type beer price..." style={styles.textInput}></TextInput>
            <Text style={styles.text}> Minimum Rating </Text>
            <TextInput value={rating} keyboardType='numeric' onChangeText={newRating} placeholder="Type min rating..." style={styles.textInput}></TextInput>
            <Text style={styles.text}> Maximum Distance </Text>
            <TextInput value={distance} keyboardType='numeric' onChangeText={newDistance} placeholder="Type max distance..." style={styles.textInput}></TextInput>
            <Picker style={styles.picker} onValueChange={newBeer} selectedValue={beer}>
                <Picker.Item label="Sagres" value="Sagres" />
                <Picker.Item label="Super Bock" value="Super Bock" />
                <Picker.Item label="Heineken" value="Heineken" />
                <Picker.Item label="Cergal" value="Cergal" />
                <Picker.Item label="Estrela" value="Estrela" />
                <Picker.Item label="Corona" value="Corona" />
                <Picker.Item label="Guinness" value="Guinness" />
            </Picker>
        </View>
    );
};
// 
const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    text: {
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 10,
    },
    action: {
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 0
    },
    picker: {
        marginHorizontal: 10
    },
    image: {
        width: '50%',
        height: '50%'

    },
});

/**
 *             
 */
export default Filter