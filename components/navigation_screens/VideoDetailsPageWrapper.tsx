import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import MenuButton from "../MenuButton";
import VideoDetailsPage from "../VideoDetailsPage";
import { StackActions, NavigationActions } from "react-navigation";

interface IVideoDetailsPageWrapperProps {
    navigation: any;
}

export default class VideoDetailsPageWrapper extends Component<IVideoDetailsPageWrapperProps, {}> {

    constructor(props: IVideoDetailsPageWrapperProps) {
        super(props);

        // const didBlurSubscription = this.props.navigation.addListener(
        //     'didBlur',
        //     payload => {
        //         console.debug('didBlur', payload);

        //         // const resetStackAction = StackActions.reset({
        //         //     index: 0,
        //         //     actions: [NavigationActions.navigate({ routeName: 'MainPage' })],
        //         // });
        //         // this.props.navigation.dispatch(resetStackAction);
        //     }
        // );
    }

    render() {
        let { navigation } = this.props;
        let { params } = navigation.state;
        return (
            <View style={{ flex: 1 }}>
                <VideoDetailsPage
                    id={params.id}
                    description={params.description}
                    title={params.title}
                />
            </View>
        );
    }

}