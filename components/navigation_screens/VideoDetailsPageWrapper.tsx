import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../MenuButton";
import VideoDetailsPage from "../VideoDetailsPage";

interface IVideoDetailsPageWrapperProps {
    navigation: any;
}

export default class VideoDetailsPageWrapper extends Component<IVideoDetailsPageWrapperProps, {}> {

    constructor(props: IVideoDetailsPageWrapperProps) {
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
                    <VideoDetailsPage
                        id={params.id}
                        description={params.description}
                        title={params.title}
                    />
                </View>
            </View>
        );
    }

}