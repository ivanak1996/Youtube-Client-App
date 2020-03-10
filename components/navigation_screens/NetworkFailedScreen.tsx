import React, { Component } from "react";
import { View, StyleSheet, Text, Image, SafeAreaView, ScrollView, RefreshControl } from "react-native";

interface INetworkFailedScreenProps {
    onRefreshCallback(): Promise<void>;
}

interface INetworkFailedScreenState {
    refreshing: boolean;
}

export default class NetworkFailedScreen extends Component<INetworkFailedScreenProps, INetworkFailedScreenState> {

    constructor(props) {
        super(props);
        this.state = { refreshing: false };

        this.setRefreshing = this.setRefreshing.bind(this);
    }

    setRefreshing(val: boolean) {
        this.setState({ refreshing: val });
    }

    onRefresh = async () => {
        this.setRefreshing(true);
        await this.props.onRefreshCallback();
        this.setRefreshing(false);
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                    <Image source={require('../assets/yterror.png')} resizeMode={'center'} />
                    <Text style={{ fontSize: 20, color: "#d396d5", margin: 15 }}>
                        Network error
                    </Text>
                    <Text style={{ fontSize: 18, color: "#d396d5", margin: 15, textAlign: 'center' }}>
                        Failed to load request.{"\n"}Sorry about that.
                </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    render1() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/yterror.png')} resizeMode={'center'} />
                <Text style={{ fontSize: 20, color: "#d396d5", margin: 15 }}>
                    Network error
                </Text>
                <Text style={{ fontSize: 18, color: "#d396d5", margin: 15, textAlign: 'center' }}>
                    Failed to load request.{"\n"}Sorry about that.
                </Text>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        elevation: 1,
        alignItems: 'center',
        backgroundColor: '#737373'
    }
});
