import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../../MenuButton";
import Playlists from "./Playlists";

interface IPlaylistWrapperProps {
    navigation: any;
}

export default class PlaylistWrapper extends Component<IPlaylistWrapperProps, {}> {

    constructor(props: IPlaylistWrapperProps) {
        super(props);
    }

    render() {
        let { navigation } = this.props;
        let { params } = navigation.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
                    <MenuButton navigation={navigation} />
                </View>
                <View style={{ flex: 9 }}>
                    <Playlists
                        navigation={this.props.navigation}
                        getMyPlaylists={params.getMyPlaylists}
                        retrieveFreshToken={params.retrieveFreshToken}
                    />
                </View>
            </View>
        );

    }

}
