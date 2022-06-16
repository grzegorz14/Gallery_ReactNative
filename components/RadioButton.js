import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class RadioButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            radioBox: {
                display: "flex",
                flexDirection: "row",
                margin: 6
            },
            circle: {
                width: 23,
                height: 23,
                borderRadius: 50,
                borderColor: "#c6c6c6",
                backgroundColor: this.props.selected == this.props.index ? "#c6c6c6" : "transparent",
                borderWidth: 2,
                marginRight: 10,
                marginLeft: 10
            },
            value: {
                color: "#c6c6c6",
                fontSize: 15
            }
        });
        return (
            <View style={styles.radioBox}>
                <TouchableOpacity style={styles.circle} onPress={() => this.props.pressed(this.props.index, this.props.value, this.props.option)} />
                <Text style={styles.value}>{this.props.value}</Text>
            </View>
        );
    }
}

export default RadioButton;
