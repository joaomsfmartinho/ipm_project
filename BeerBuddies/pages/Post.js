import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, ScrollView, FlatList, Share, Image, Alert, Dimensions, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import ModalPoup from '../components/modalPopUp';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Post({ navigation }) {

  const route = useRoute();
  const { title, content, commentsList } = route.params;
  const [newComment, setNewComment] = React.useState("");
  const [visible2, setVisible2] = React.useState(false);
  const [list, setList] = React.useState(commentsList);
  const [update, setUpdate] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [comment, setComment] = React.useState({
    email: null,
    tokenID: null,
    topicTitle: "",
    content: ""
  }
  );

  const onRefresh = () => {
    setRefreshing(true);
    const string = 'https:/saving-fields.appspot.com/rest/user/getMessage/?title='
    const endpoint = string + title
    axios.get(endpoint)
      .then(response => {
        setList(response.data.comments)
      })
      .catch(error => {
      })
    wait(2000).then(() => setRefreshing(false));
  };


  const getComments = () => {
    if (list.length == 0) {
      return (
        <View>
          <Text style={styles.userText}>Sem comentários, seja o primeiro a comentar!</Text>
        </View>
      );
    } else {
      return (
        <View>
          <FlatList
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                {item.userName == "Utilizador Eliminado" ?
                  <View style={{ marginTop: "4%" }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.userEliminatedText}>{item.userName} </Text>
                      <Text style={{
                        color: '#B60000',
                        fontSize: 16,
                        position: 'absolute',
                        right: 0
                      }}>{item.content}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.date}</Text>
                  </View> :
                  <View style={{
                    marginTop: "5%"
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.userText}>{item.userName}</Text>
                      <Text style={{
                        color: '#05375a',
                        fontSize: 16,
                        position: 'absolute',
                        right: 0
                      }}>{item.content}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.date}</Text>
                  </View>
                }
              </View>
            )
            }
            extraData={list}
          />
        </View >
      );

    }
  }

  const success = () => {
    const string = 'https:/saving-fields.appspot.com/rest/user/getMessage/?title='
    const endpoint = string + title
    axios.get(endpoint)
      .then(response => {
        setList(response.data.comments)
        setVisible2(true)
      })
      .catch(error => {
      })
  };

  const addComment = (email, tokenID, topicTitle, content) => {
    if (content == "" || content == null || content == " ") {
      Alert.alert('Erro!', "O comentário não pode estar vazio.", [
        { text: 'Okay' }
      ]);
    } else {
      let cm = {
        email: email,
        tokenID: tokenID,
        topicTitle: topicTitle,
        content: content
      }
      axios
        .post('https:/saving-fields.appspot.com/rest/user/postMessage', cm)
        .then(response => {
          success()
        })
        .catch(error => {
          if (error.response.data != "") {
            Alert.alert('Erro!', error.response.data, [
              { text: 'Okay' }
            ]);
          }
        })
    }
  };

  const handleAddComment = async (commentContent) => {
    let email = await AsyncStorage.getItem("email");
    let tokenID = await AsyncStorage.getItem("token");
    let topicTitle = title;
    let content = commentContent;
    addComment(email, tokenID, topicTitle, content);
  }

  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <StatusBar backgroundColor='#14555d' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>{title}</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[styles.footer, {
          backgroundColor: colors.background
        }]}
      >
        <View>
          <ScrollView>
            <Text style={[styles.userText, {
              color: colors.text,
              marginTop: "1%",
              fontSize: 22,
              marginBottom: "5%"
            }]}>{content}</Text>
          </ScrollView>
        </View>


        <View>
          {(getComments())}
        </View>

        <View>

          <Text style={[styles.text_footer, {
            color: colors.text,
            marginTop: "10%",
            fontWeight: "bold"
          }]}>Comentário</Text>
          <View style={styles.action}>
            <Feather
              name="edit-3"
              color={colors.text}
              size={20}
            />
            <TextInput
              multiline={true}
              style={[styles.textInput, {
                color: colors.text
              }]}
              autoCapitalize="none"
              onChangeText={(val) => setNewComment(val)}
            />
          </View>
        </View>
        <View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.createComment}
              onPress={() => { handleAddComment(newComment) }}
            >
              <Text style={[styles.textSign, {
                color: '#fff'
              }]}>Adicionar Comentário</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.goBack}
              onPress={() => { navigation.goBack() }}
            >
              <Text style={[styles.textSign, {
                color: '#fff'
              }]}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      <ModalPoup visible={visible2}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.headerX}>
            <TouchableOpacity onPress={() => setVisible2(false)}>
              <Image
                source={require('../assets/images/x.png')}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/images/success.png')}
            style={{ height: 150, width: 150, marginVertical: 10 }}
          />
        </View>

        <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', fontWeight: "bold" }}>
          Comentado com sucesso!
        </Text>
      </ModalPoup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14555d'
  },
  header: {
    flex: 1,
    marginTop: "8%",
    marginBottom: "4%",
    paddingHorizontal: 20,
    backgroundColor: '#14555d'
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  commentText: {
    color: "black",
    fontSize: 18,
    paddingHorizontal: "3%",
    marginTop: "2%"
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  userEliminatedText: {
    color: '#B60000',
    fontSize: 19
  },
  userEliminatedTextDate: {
    color: '#B60000',
    fontSize: 16,
  },
  userText: {
    color: '#05375a',
    fontSize: 19,

  },
  userTextDate: {
    color: '#05375a',
    fontSize: 16,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 20
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
  },
  createComment: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#14555d',
    marginTop: '20%'
  },
  goBack: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#14555d',
    marginTop: '5%'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerX: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },

});