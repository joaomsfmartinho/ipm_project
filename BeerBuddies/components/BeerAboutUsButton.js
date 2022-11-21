import React from "react"
import { View, ImageBackground, StyleSheet, Pressable } from "react-native"

const BeerAboutUsButton = ({ navigation }) => {

    const navigateAboutUs = () => {
        {/** TODO Navigate to about us */ }
        {/** navigation.push('About') ? */ }
    }

    return (
        <Pressable onPress={() => navigateAboutUs()}>
            <ImageBackground style={styles.image}
                source={require("../assets/images/beers.png")}>
            </ImageBackground>
        </Pressable>

    );
};

const styles = StyleSheet.create({
    image: {
        width: '60%',
        height: '50%'

    },
});

export default BeerAboutUsButton;