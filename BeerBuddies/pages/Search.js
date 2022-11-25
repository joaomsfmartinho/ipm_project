import React from "react"
import { View, Text, ImageBackground, StyleSheet, StatusBar, Input, Pressable } from "react-native"
import { Button, TextInput } from "react-native-paper";
import BeerAboutUsButton from "../components/BeerAboutUsButton"
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";


const Search = ({ params }) => {

    return (
        <View style={styles.mainContainer}>
            <Text> At search </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
});

export default Search;