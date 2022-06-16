import React, { Component } from 'react';
import { Image, StyleSheet, Text, Button, View, TouchableOpacity } from 'react-native';
import * as Font from "expo-font";

export default class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fontLoaded: false
        }
    }

    componentDidMount = async () => {
        await Font.loadAsync({
            'Cougarette': {
                uri: require('./cougarette.ttf'),
                display: Font.FontDisplay.FALLBACK,
            },
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        if (this.state.fontLoaded) {
            return (
                <View style={styles.box}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Gallery")}>
                        <Text style={styles.header}>Gallery App</Text>
                        <Text style={styles.subtitle}>show gallery pictures</Text>
                        <Text style={styles.subtitle}>delete photo from device</Text>
                        <Text style={styles.subtitle}>share photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => this.props.navigation.navigate("Settings")}>
                        <Text style={styles.settings}>⚙️</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <Text>Loading font...</Text>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#2a9d8f",
        width: "100%",
        height: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center"
    },
    header: {
        fontFamily: 'Cougarette',
        color: "white",
        fontSize: 100,
        margin: 10,
        marginBottom: 30,
        textAlign: "center",
    },
    subtitle: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        margin: 3
    },
    settings: {
        marginTop: 30,
        fontSize: 60,
        textAlign: "center"
    }
});