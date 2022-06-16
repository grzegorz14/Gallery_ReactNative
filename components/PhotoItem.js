import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity  } from 'react-native';

export default class PhotoItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: false,
            unselect: false
        }
    }

    render() {
        if (this.state.selected) {
            return (
                <TouchableOpacity 
                    style={styles.selected}
                    onPressIn={() => this.setState({ unselect: true })}
                    onPressOut={() => {
                        if (this.state.unselect) {
                            this.setState({ selected: false, unselect: false })
                            this.props.unselect(this.props.asset)
                        }
                    }}>
                    <View
                        style={{
                            margin: this.props.width / 20
                        }}
                        >
                        <Image
                            style={{
                                borderRadius: 5,
                                width: this.props.width - this.props.width / 10,
                                height: this.props.height - this.props.height / 10,
                            }}
                            source={{ uri: this.props.asset.uri }}
                        />
                        <Text style={styles.id}>{this.props.asset.id}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity 
                    onLongPress={() => { 
                        this.setState({ selected: true })
                        this.props.select(this.props.asset)
                    }}
                    onPress={() => {
                        this.props.navigation.navigate("BigPhoto", { asset: this.props.asset, port: this.props.port, ip: this.props.ip })
                    }}>
                    <View
                        style={{ margin: this.props.width / 20 }}
                        >
                        <Image
                            style={{
                                borderRadius: 5,
                                width: this.props.width - this.props.width / 10,
                                height: this.props.height - this.props.height / 10,
                            }}
                            source={{ uri: this.props.asset.uri }}
                        />
                        <Text style={styles.id}>{this.props.asset.id}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    id: {
        color: "white",
        position: "absolute",
        bottom: 2,
        left: 5
    },
    selected: {
        backgroundColor: "#ffffff"
    }
});