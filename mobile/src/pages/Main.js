import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Image, View, Text,TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

import api from '../services/api';
import socket, { connect, disconnect, subscribeToNewDevs } from '../services/socket';

import { MaterialIcons } from '@expo/vector-icons';

function Main({ navigation }){
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(()=>{
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync();

            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }
        }

        loadInitialPosition();
    }, [])

    useEffect(() => {
        subscribeToNewDevs( dev => setDevs([...devs, dev]) )
    }, [devs])

    // useEffect(() => {
    //     function keyBoardHandle(){
            
    //     }

    //     keyBoardHandle();
    // }, [])

    function setupWebsocket(){
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs
        );
    }

    async function loadDevs(){
        const { latitude, longitude } = currentRegion;

        const res = await api.get('/search', { params: { latitude, longitude, techs } })

        setDevs(res.data);
        setupWebsocket();
    }

    function handleRegionChanged(region){ setCurrentRegion(region) }

    if(!currentRegion){ return null }

    return(
        <>
            <MapView
                onRegionChangeComplete={handleRegionChanged}
                initialRegion={currentRegion}
                style={styles.map}>

                {devs.map(dev =>(
                    <Marker key={dev._id}
                        coordinate={{
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1]
                        }}>
                        
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        
                        <Callout style={styles.callout} onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username })
                        }}>
                            <View style={styles.calloutView}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>                                
                            </View>
                        </Callout>

                    </Marker>
                ))}
            </MapView>

            <View style={styles.searchForm}>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={setTechs}
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#ffffff" />
                </TouchableOpacity>

            </View>
        </>
    )
}

let styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fa163f'
    },

    callout: {
        width: 260,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },

    devBio: {
        color: '#666666',
        marginTop: 5
    },

    devTechs: {
        marginTop: 2,
        marginBottom: 5
    },

    searchForm: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#ffffff',
        color: '#333333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#212121',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }
})

export default Main;