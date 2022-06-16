import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";
import * as SecureStore from 'expo-secure-store';

export default function Settings(){
    const [visible, setVisible] = useState(false)
    const [ip, onChangeIP] = React.useState("192.168.1.11")
    const [port, onChangePort] = React.useState("3000")

    useEffect(async () => {
        let lastIP = await SecureStore.getItemAsync("ip")
        lastIP == null ? onChangeIP("192.168.1.11") : onChangeIP(lastIP)
        let lastPort = await SecureStore.getItemAsync("port")
        lastPort == null ? onChangePort("3000") : onChangePort(lastPort)
    }, [])

    const showDialog = () => {
        setVisible(true)
    }
  
    const handleCancel = () => {
        setVisible(false)
    }
  
    const handleSave = async () => {
        await SecureStore.setItemAsync("ip", ip)
        await SecureStore.setItemAsync("port", port)
        setVisible(false)
    }

    return (
        <View style={styles.box}>
            <Text style={styles.info}>Current IP</Text>
            <Text style={styles.info}>{ip}</Text>

            <Text style={styles.info}>Current PORT</Text>
            <Text style={styles.info}>{port}</Text>

            <TouchableOpacity
                onPress={showDialog}
                style={styles.button}>
                <Text style={styles.text}>Change settings</Text>
            </TouchableOpacity>

            <Dialog.Container visible={visible}>
                <Dialog.Title>Update settings</Dialog.Title>
                <Dialog.Input value={ip} style={styles.input} onChangeText={onChangeIP}/>
                <Dialog.Input value={port} style={styles.input} onChangeText={onChangePort}/>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Save" onPress={handleSave} />
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#222222",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        marginTop: 20,
        backgroundColor: "#f4a261",
        borderRadius: 5,
        padding: 10
    },
    info: {
        color: "white",
        fontSize: 25,
        margin: 10
    },
    text: {
        color: "white",
        fontSize: 20
    },
    input: {
        fontSize: 18,
        margin: 0
    }
})
