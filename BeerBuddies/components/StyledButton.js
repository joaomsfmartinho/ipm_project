import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const StyledButton = ( props ) => {

  const { type, onPress} = props;

  const backgroundColor= '#14555d';
  const textColor = '#FFFFFFA6';
  const content = type === 'register' ? 'Criar conta' : 'Entrar';

  return (

    <View style={styles.container}>
      <Pressable
        style={[styles.button, { backgroundColor: backgroundColor }]}
        onPress={() => onPress()}
      >
        <Text style={[styles.text, { color: textColor }]}>{content}</Text>
      </Pressable>
    </View>

  );
};

const styles = StyleSheet.create({

  container: {
      width: '100%',
      padding: 10,
  },

  button: {
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#14555d'
  },

  text: {
      fontSize: 12,
      fontWeight: '500',
      textTransform: 'uppercase',
  },

  

});

export default StyledButton;