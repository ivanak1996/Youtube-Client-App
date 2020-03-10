import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../../MenuButton";
import MainPage from "./MainPage"
import { createAppContainer, StackActions, NavigationActions, NavigationContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import VideoDetailsPageWrapper from "../VideoDetailsPageWrapper";
import NetworkFailedScreen from "../NetworkFailedScreen";

interface IHomeScreenProps {
    navigation: any;
}

export default class HomeScreen extends Component<IHomeScreenProps, {}>{

    constructor(props: IHomeScreenProps) {
        super(props);
    }

    render() {
        var { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, backgroundColor: "#4d4d4d" }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <MenuButton navigation={navigation} />
                    </View>
                </View>
                <View style={{ flex: 9 }}>
                    <StackWrapper />
                </View>
            </View>
        );
    }
}

const VideoSearchStack = createStackNavigator({
    MainPage: {
        screen: MainPage
    },
    VideoDetails: {
        screen: VideoDetailsPageWrapper
    },
    ErrorPage: {
        screen: NetworkFailedScreen
    }

},
    {
        headerMode: 'none'
    }
);

const StackWrapper: NavigationContainer = createAppContainer(VideoSearchStack);
