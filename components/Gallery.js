import React, { Component } from 'react';
import { Image, StyleSheet, Text, Button, View, TouchableOpacity, FlatList } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { Dimensions } from "react-native";
import PhotoItem from './PhotoItem';
import { ToastAndroid } from "react-native";
import * as SecureStore from 'expo-secure-store';

export default class Gallery extends Component {
    constructor(props) {
        super(props)
        this.focusFunction = null

        this.state = {
            columns: 4,
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4,
            photos: [],
            selectedPhotos: new Array(),
            loaded: false,
            ip: "192.168.1.11",
            port: "3000"
        }
        this.select = this.select.bind(this)
        this.unselect = this.unselect.bind(this)
        this.deleteSelected = this.deleteSelected.bind(this)
        this.uploadSelected = this.uploadSelected.bind(this)
    }

    async componentDidMount() {
        let { status } = await MediaLibrary.requestPermissionsAsync()
        if (status !== 'granted') {
            alert('No permission to read images from the gallery!')
            this.props.navigation.navigate("Main")
        }
        else {
            this.focusFunction = this.props.navigation.addListener('focus', async () => {
                await this.getPhotos()
            });
            await this.getPhotos()
        }

        let ip = await SecureStore.getItemAsync("ip")
        ip != null && this.setState({ ip: ip })
        let port = await SecureStore.getItemAsync("port")
        port != null && this.setState({ port: port })
    }

    componentWillUnmount() {
        if (this.focusFunction != null) {
            this.focusFunction()
        }
    }

    async getPhotos() {
        const album = await MediaLibrary.getAlbumAsync("DCIM")

        const media = await MediaLibrary.getAssetsAsync({
            //album: album,
            first: 100,
            sortBy: [["default", false]],
            mediaType: 'photo'
        })

        //alert(JSON.stringify(media.assets, null, 4))
        this.setState({
            photos: media.assets,
            loaded: true
        })
    }

    changeLayout(columns) {
        if (this.state.columns == 1) {
            this.setState({ columns: columns, width: Dimensions.get("window").width / columns, height: Dimensions.get("window").width / columns })
        }
        else {
            this.setState({ columns: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").width / 1.5 })
        }
    }

    select(asset) {
        const selected = this.state.selectedPhotos
        selected.push(asset)
        this.setState({
            selectedPhotos: selected
        })
    }

    unselect(asset) {
        const index = this.state.selectedPhotos.indexOf(asset)
        if (index > -1) {
            const newArray = this.state.selectedPhotos
            newArray.splice(index, 1)
            this.setState({
                selectedPhotos: newArray
            })
        }
    }

    async deleteSelected() {
        if (this.state.selectedPhotos.length == 0) {
            ToastAndroid.showWithGravity(
                'Select some photos first',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return
        }
        const ids = []
        this.state.selectedPhotos.map(photo => ids.push(photo.id))
        this.setState({
            selectedPhotos: []
        })
        await MediaLibrary.deleteAssetsAsync(ids)
        await this.getPhotos()
        ToastAndroid.showWithGravity(
            'Deleted selected photos!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        )
    }

    async uploadSelected() {
        if (this.state.selectedPhotos.length == 0) {
            ToastAndroid.showWithGravity(
                "Select some photos first" ,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
            return
        }
        const data = new FormData()
        this.state.selectedPhotos.map(photo => {
            data.append('photo', {
                uri: photo.uri,
                //type: photo.mediaType,
                type: "image/jpg",
                name: photo.filename
            })
        })
        const answer = await fetch(`http://${this.state.ip}:${this.state.port}/uploadImage`, { method: 'POST', body: data })
        answer.json().then(d => {
            if (d.uploaded) {
                ToastAndroid.showWithGravity(
                    "Photos uploaded!" ,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                return
            }
            else {
                ToastAndroid.showWithGravity(
                    "Error! IP " + this.state.ip + " PORT " + this.state.port ,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                return
            }
        })
    }

    render() {
        if (!this.state.loaded) {
            return null
        }
        return (
            <View style={styles.box}>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={() => this.changeLayout(4)}
                        style={styles.button}>
                        <Text style={styles.text}>GRID | LIST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("Camera")}
                        style={styles.button}>
                        <Text style={styles.text}>CAMERA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => await this.deleteSelected()}
                        style={styles.button}>
                        <Text style={styles.text}>DELETE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => await this.uploadSelected()}
                        style={styles.button}>
                        <Text style={styles.text}>UPLOAD</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.photos}
                    numColumns={this.state.columns}
                    key={this.state.columns}
                    renderItem={({ item }) => <PhotoItem port={this.state.port} ip={this.state.ip} select={this.select} unselect={this.unselect} navigation={this.props.navigation} width={this.state.width} height={this.state.height} asset={item} />}
                />
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
        margin: 8,
        marginTop: 10,
        backgroundColor: "#f4a261",
        borderRadius: 5,
        padding: 8
    },
    text: {
        color: "white",
        fontSize: 16
    }
});