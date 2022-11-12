import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, Alert, ScrollView, Image, ActivityIndicator, LogBox, RefreshControl } from 'react-native';
import axios from 'axios';
import {
    Card,
    useTheme,
    Title,
    Searchbar
} from 'react-native-paper';
import ModalPoup from '../components/modalPopUp';

const Forum = ({ navigation }) => {
    const [posts, setPosts] = React.useState([]);
    const [postsFiltered, setPostsFiltered] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [visible, setVisible] = React.useState(false);
    const [isDone, setIsDone] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const { colors } = useTheme();
    const [createPost, setCreatePost] = React.useState({
        email: null,
        tokenID: null,
        title: '',
        numberOfComments: 0,
        content: ''
    });

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const handleTitleChange = (val) => {
        setCreatePost({
            ...createPost,
            title: val
        });
    };

    const handleContentChange = (val) => {
        setCreatePost({
            ...createPost,
            content: val
        });
    };

    const getTopics = () => {
        axios
            .get('https:/saving-fields.appspot.com/rest/user/getTopic')
            .then(response => {
                setPosts(response.data);
                setPostsFiltered(response.data);
            })
            .catch(error => {
            })
    };

    const onRefresh = () => {
        setRefreshing(true);
        getTopics();
        wait(2000).then(() => setRefreshing(false));
    };


    useEffect(() => {
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
        axios
            .get('https:/saving-fields.appspot.com/rest/user/getTopic')
            .then(response => {
                setPosts(response.data);
                setPostsFiltered(response.data);
                setIsDone(true);
            })
            .catch(error => {
            })
    }, []);

    const handleCreateTopic = async () => {
        let email = await AsyncStorage.getItem("email");
        let token = await AsyncStorage.getItem("token");
        createTopic(email, token);
    }

    const onChangeSearch = (query) => {
        setSearch(query);
        setPostsFiltered(filterData(query))
    };

    const filterData = (query) => {
        if (query == '') {
            return posts;
        } else {
            return posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
        }
    };

    const createTopic = (email, token) => {
        let createTopicInfo = {
            email: email,
            tokenID: token,
            title: createPost.title,
            numberOfComments: createPost.numberOfComments,
            content: createPost.content
        }
        axios
            .post('https:/saving-fields.appspot.com/rest/user/createTopic', createTopicInfo)
            .then(response => {
                getTopics();
                setVisible(false);
            })
            .catch(error => {
                if (error.response.data != "") {
                    Alert.alert('Erro!', error.response.data, [
                        { text: 'Okay' }
                    ]);
                }
            })
    };

    const getTopic = (postTitle) => {
        const string = 'https:/saving-fields.appspot.com/rest/user/getMessage/?title='
        const endpoint = string + postTitle
        axios.get(endpoint)
            .then(response => {
                const res = response.data
                navigation.push('PostStack', {
                    title: res.topicTitle,
                    content: res.topic,
                    commentsList: res.comments
                })
            })
            .catch(error => {
            })
    };

    const topicsList = () => {
        return postsFiltered.map((post) => {
            return (
                <TouchableOpacity
                    onPress={() => { getTopic(post.title) }}
                    keyExtractor={(post, index) => index.toString()}
                >
                    <View key={post.title} style={{ margin: 10 }}>
                        <Title>{post.title}</Title>
                        <Text>{post.date}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
    }

    return (
        <ScrollView 
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
            <Searchbar
                placeholder="Pesquisa"
                onChangeText={onChangeSearch}
                value={search}
            />
            {!isDone ? <ActivityIndicator size="large" color="#00ff00" /> :
                <Card>
                    <Card.Content>
                        <View>{topicsList()}</View>
                    </Card.Content>
                </Card>
            }
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ModalPoup visible={visible}>
                    <View style={{ alignItems: 'center', flexDirection: "row" }}>
                        <View >
                            <Text style={{ fontSize: 20 }}>
                                Nova Publicação
                            </Text>
                        </View>
                        <View style={styles.headerX}>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Image
                                    source={require('../assets/images/x.png')}
                                    style={{ height: 30, width: 30, position: 'absolute', right: "50%" }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Título</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleTitleChange(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Conteúdo</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline={true}
                            style={[styles.textInput, { marginTop: 5 }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handleContentChange(val)}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.createTopicButton}
                            onPress={() => { handleCreateTopic() }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Criar Tópico</Text>
                        </TouchableOpacity>
                    </View>

                </ModalPoup>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.createTopicButton}
                    onPress={() => { setVisible(true) }}
                >
                    <Text style={[styles.textSign, {
                        color: '#fff'
                    }]}>Novo post</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

}
export default Forum;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14555d'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
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
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
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
    createTopicButton: {
        width: '70%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#14555d',
        marginTop: '20%',
        marginBottom: '10%',
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    headerX: {
        width: '100%',
        height: 40,
        bottom: "5%"
    },
});