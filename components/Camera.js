import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Animated, Dimensions } from 'react-native';
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import RadioGroup from './RadioGroup';

export default class CameraView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            position: new Animated.Value(Dimensions.get('window').height),
            ratio: "16:9",
            wb: null,
            ps: null,
            fm: null,
            sizes: null
        }
        this.isHidden = true

        this.changeSetting = this.changeSetting.bind(this)
    }

    async componentDidMount() {
        let { status } = await Camera.requestCameraPermissionsAsync()
        this.setState({ hasCameraPermission: status == 'granted' })
    }

    async takePhoto() {
        if (this.camera) {
            let foto = await this.camera.takePictureAsync();
            let asset = await MediaLibrary.createAssetAsync(foto.uri); // saves in DCIM by default
            ToastAndroid.showWithGravity(
                'Photo!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
        }
    }

    showSettings() {
        let toPosition;
        this.isHidden ? toPosition = 0 : toPosition = Dimensions.get('window').height;

        //animacja

        Animated.spring(
            this.state.position,
            {
                toValue: toPosition,
                velocity: 1,
                tension: 0,
                friction: 10,
                useNativeDriver: true
            }
        ).start()

        this.isHidden = !this.isHidden;
    }

    changeSetting(setting, value, option) {
        switch(setting) {
            case "Camera ratio": 
                this.setState({ ratio: option })
                break
            case "White balance": 
                this.setState({ wb: option })
                break
            case "Picture size": 
                this.setState({ ps: option })
                break
            case "Flash mode": 
                this.setState({ fm: option })
                break
            default:
                break
        }
    }

    async getSizes(){
        if (this.camera) {
            const sizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio)
            const bigArray = []
            sizes.forEach(size => {
                bigArray.push([size, size])
            })
            this.setState({ sizes: bigArray })
        }
    };

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission == null) {
            return null
        }
        else if (hasCameraPermission == false) {
            return (<Text>No access to camera</Text>)
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={ref => { this.camera = ref }}
                        style={{ flex: 1 }}
                        type={this.state.type}
                        whiteBalance={this.state.wb}
                        pictureSize={this.state.ps}
                        flashMode={this.state.fm}                        
                        onCameraReady={async () => await this.getSizes()}>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    })
                                }}
                                style={styles.button}>
                                <Text style={styles.text}>↺</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => await this.takePhoto()}
                                style={styles.button}>
                                <Text style={styles.text}>📷</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.showSettings()}
                                style={styles.button}>
                                <Text style={styles.settings}>⚙️</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                    <Animated.View
                        style={[
                            styles.settingsBox,
                            {
                                transform: [
                                    { translateY: this.state.position }
                                ]
                            }]} >
                        <Text style={styles.settingsTitle}>SETTINGS</Text>
                        <RadioGroup
                            change={this.changeSetting}
                            data={[["4:3", "4:3"], ["16:9", "16:9"]]}
                            groupName="Camera ratio" />
                        <RadioGroup
                            change={this.changeSetting}
                            data={Object.entries(Camera.Constants.WhiteBalance)}
                            groupName="White balance" />
                        <RadioGroup
                            change={this.changeSetting}
                            data={this.state.sizes}
                            groupName="Picture size" />
                        <RadioGroup
                            change={this.changeSetting}
                            data={Object.entries(Camera.Constants.FlashMode)}
                            groupName="Flash mode" />
                    </Animated.View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    buttons: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        display: "flex",
        flexDirection: "row"
    },
    button: {
        margin: 20,
        backgroundColor: "transparent",
        borderRadius: 50,
        padding: 10
    },
    text: {
        color: "white",
        fontSize: 80
    },
    settings: {
        color: "white",
        marginTop: 25,
        fontSize: 55,
    },
    settingsBox: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(42, 157, 143, 0.7)",
        height: Dimensions.get('window').height,
        width: 200,
        borderTopRightRadius: 15,
        padding: 10
    },
    settingsTitle: {
        color: "white",
        fontSize: 35
    }
});
