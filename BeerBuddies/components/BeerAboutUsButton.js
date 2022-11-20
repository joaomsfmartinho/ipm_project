import React from "react"
import { View, ImageBackground, StyleSheet, Pressable } from "react-native"

const BeerAboutUsButton = ({ navigation }) => {

    const navigateAboutUs = () => {
        {/** TODO Navigate to about us */ }
        {/** navigation.push('About') ? */ }
    }

    return (
        <View style={styles.mainContainer}>
            <Pressable onPress={() => navigateAboutUs()}>
                <ImageBackground style={styles.image}
                    source={require("../assets/images/beers.png")}>
                </ImageBackground>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    image: {
        width: '62%',
        height: '46%',
        marginLeft: '-3%',
        marginTop: '7%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default BeerAboutUsButton;