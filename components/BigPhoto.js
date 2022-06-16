import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from 'expo-sharing';
import { ToastAndroid } from "react-native";

export default class BigPhoto extends Component {
    async deletePhoto() {
        await MediaLibrary.deleteAssetsAsync([this.props.route.params.asset.id])
        this.props.navigation.goBack()
        ToastAndroid.showWithGravity(
            'Deleted photo!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        )
    }

    async uploadPhoto() {
        const data = new FormData()
        data.append('photo', {
            uri: this.props.route.params.asset.uri,
            type: "image/jpg",
            name: this.props.route.params.asset.filename
        })

        const answer = await fetch(`http://${this.props.route.params.ip}:${this.props.route.params.port}/uploadImage`, { method: 'POST', body: data })
        answer.json().then(d => {
            if (d.uploaded) {
                ToastAndroid.showWithGravity(
                    "Photo uploaded!" ,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                return
            }
            else {
                ToastAndroid.showWithGravity(
                    "Error!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                return
            }
        })
    }

    render() {
        return (
            <View style={styles.box}>
                <Image
                    style={{
                        margin: 20,
                        borderRadius: 5,
                        width: "90%",
                        height: "82%"
                    }}
                    source={{ uri: this.props.route.params.asset.uri }}
                />
                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={async () => {
                            console.log(this.props.route.params.asset.uri)
                            await Sharing.shareAsync(this.props.route.params.asset.uri)
                        }}
                        style={styles.button}>
                        <Text style={styles.text}>SHARE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => await this.deletePhoto()}
                        style={styles.button}>
                        <Text style={styles.text}>DELETE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => await this.uploadPhoto()}
                        style={styles.button}>
                        <Text style={styles.text}>UPLOAD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#222222",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center"
    },
    buttons: {
        display: "flex",
        flexDirection: "row"
    },
    button: {
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "#f4a261",
        borderRadius: 5,
        padding: 10
    },
    text: {
        color: "white",
        fontSize: 20
    }
});
