import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../../MenuButton";
import Playlists from "./Playlists";
import { createStackNavigator } from 'react-navigation-stack';
import PlaylistVideosList from "./PlaylistVideosList";
import { createAppContainer } from "react-navigation";
import VideoDetailsPageWrapper from "../VideoDetailsPageWrapper";

interface IPlaylistWrapperWithStackProps {
    navigation: any;
}

export default class PlaylistWrapperWithStack extends Component<IPlaylistWrapperWithStackProps, {}> {

    constructor(props: IPlaylistWrapperWithStackProps) {
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
                    <StackWrapper
                        //navigation={this.props.navigation}
                        screenProps={{
                            getMyPlaylists: async () => { return await params.getMyPlaylists() },
                            retrieveFreshToken: async () => { return await params.retrieveFreshToken() }
                        }}
                    />
                </View>
            </View>
        );

    }

}

function PlaylistsWrapper({ navigation, screenProps }) {
    //let { params } = navigation.state;
    return (
        <Playlists
            navigation={navigation}
            getMyPlaylists={screenProps.getMyPlaylists}
            retrieveFreshToken={screenProps.retrieveFreshToken}
        />
    );
}

const PlaylistsStack = createStackNavigator({
    MyPlaylists: {
        screen: PlaylistsWrapper
    },
    MyPlaylistVideoList: {
        screen: PlaylistVideosList
    },
    MyPlaylistVideoDetails: {
        screen: VideoDetailsPageWrapper
    }
},
{
    headerMode: 'none'
}
);

const StackWrapper = createAppContainer(PlaylistsStack);
