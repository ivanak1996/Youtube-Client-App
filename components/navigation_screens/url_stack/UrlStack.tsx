import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../../MenuButton";
import { createAppContainer, NavigationActions, StackActions } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import VideoDetailsPageWrapper from "../VideoDetailsPageWrapper";
import VideoFromUrlGetter from "./VideoFromUrlGetter";
import NetworkFailedNavigationWrapper from "../NetworkFailedNavigationWrapper";

interface IUrlStackProps {
    navigation: any;
}

export default class UrlStack extends Component<IUrlStackProps, {}>{

    constructor(props: IUrlStackProps) {
        super(props);

        // const didFocusSubscription = this.props.navigation.addListener(
        //     'didFocus',
        //     payload => {
        //         console.debug('didFocus', payload);

        //         const resetStackAction = StackActions.reset({
        //             index: 0,
        //             actions: [NavigationActions.navigate({ routeName: 'Discover' })],
        //         });
        //     this.props.navigation.dispatch(resetStackAction);
        //     }
        // );
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
                    <StackWrapper  />
                </View>
            </View>
        );
    }
}

const UrlStackNav = createStackNavigator({
    MainPage: {
        screen: VideoFromUrlGetter
    },
    VideoDetails: {
        screen: VideoDetailsPageWrapper
    },
    ErrorPage: {
        screen: NetworkFailedNavigationWrapper
    }
},
    {
        headerMode: 'none'
    }
);

const StackWrapper = createAppContainer(UrlStackNav);
