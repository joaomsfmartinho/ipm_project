import React from "react"
import { View, Text, ImageBackground, StyleSheet, StatusBar, Input } from "react-native"
import { TextInput } from "react-native-paper";
import BeerAboutUsButton from "../components/BeerAboutUsButton"
import { useState } from "react";

const Filter = ({ navigation }) => {
    const [price, newPrice] = useState('')
    const [rating, newRating] = useState('')
    const [distance, newDistance] = useState('')

    let availableBeers = [{
        value: 'Sagres',
    }, {
        value: 'Super Bock',
    }, {
        value: 'Heineken',
    }, {
        value: 'Cergal',
    }, {
        value: 'Estrela',
    }]

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor='#fce571' barStyle="light-content" />
            <BeerAboutUsButton />
            <View style={styles.filters}></View>
            <TextInput value={price} keyboardType='numeric' onChangeText={newPrice} placeholder="Type beer price..." style={styles.textInput}></TextInput>
            <TextInput value={rating} keyboardType='numeric' onChangeText={newRating} placeholder="Type min rating..." style={styles.textInput}></TextInput>
            <TextInput value={distance} keyboardType='numeric' onChangeText={newDistance} placeholder="Type max distance..." style={styles.textInput}></TextInput>

        </View>
    );
};
// <Dropdown label='Pick a beer brand' data={availableBeers}></Dropdown>
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
        marginTop: 0,
    },
    action: {
        marginHorizontal: 10,
        marginTop: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 3
    },
    filters: {
        to
    }
});

/**
 *             
 */
export default Filter