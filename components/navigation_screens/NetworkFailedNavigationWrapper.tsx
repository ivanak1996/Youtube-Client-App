import React, { Component } from "react";
import { View } from "react-native";
import NetworkFailedScreen from "./NetworkFailedScreen";

interface INetworkFailedNavigationWrapperProps {
    navigation: any;
}

export default class NetworkFailedNavigationWrapper extends Component<INetworkFailedNavigationWrapperProps, {}> {

    constructor(props: INetworkFailedNavigationWrapperProps) {
        super(props);
    }

    render() {
        let { navigation } = this.props;
        let { params } = navigation.state;
        return (
            <View style={{ flex: 1 }}>
                <NetworkFailedScreen
                    onRefreshCallback={async () => { }}
                />
            </View>
        );
    }

}