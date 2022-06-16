import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import RadioButton from './RadioButton';

class RadioGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: 0
        }
    }

    selected = (index, value, option) => {
        this.setState({ selectedIndex: index })
        this.props.change(this.props.groupName, value, option)
    }

    render() {
        return (
            <View style={styles.groupBox}>
                <Text style={styles.groupName}>{this.props.groupName}</Text>
                <FlatList
                    data={this.props.data}
                    keyExtractor={(data, i) => i.toString()}
                    renderItem={({ item, index }) => <RadioButton value={item[0]} option={item[1]} index={index} selected={this.state.selectedIndex} pressed={this.selected}/>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    groupBox: {
        margin: 5
    },
    groupName: {
        fontSize: 17,
        color: "white"
    }
});

export default RadioGroup;
