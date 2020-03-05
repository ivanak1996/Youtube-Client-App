import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../MenuButton";
import MainPage from "../MainPage"

interface IHomeScreenProps {
    navigation: any;
}

export default class HomeScreen extends Component<IHomeScreenProps, {}>{

    constructor(props: IHomeScreenProps) {
        super(props);
    }

    render() {
        var {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
                    <MenuButton navigation={navigation} />
                </View>
                <View style={{ flex: 9 }}>
                    <MainPage navigation={navigation} />
                </View>
            </View>
        );
    }
}
