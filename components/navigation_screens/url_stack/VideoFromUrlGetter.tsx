import React, { Component } from "react";
import { View, StatusBar, StyleSheet, Keyboard } from "react-native";
import MenuButton from "../../MenuButton";
import { Input, Button } from "react-native-elements";
import IVideoListItem from "../../../models/IVideoListItem";
import { YOUTUBE_SERVER_URI } from "../../../constants";
import { TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";

interface IVideoFromUrlGetterProps {
    navigation: any;
}

interface IVideoFromUrlGetterState {
    input: string;
    editable: boolean;
}

function extractIdFromUrl(ytUrl: string) {
    var url = ytUrl;
    var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    return (videoid != null) ? videoid[1] : null;
}

async function getVideoDetails(videoId: string) {
    let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/GetYoutubeVideo?id=${videoId}`;
    try {
        let response = await fetch(uri).then((response) => response.json());
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default class VideoFromUrlGetter extends Component<IVideoFromUrlGetterProps, IVideoFromUrlGetterState> {

    constructor(props: IVideoFromUrlGetterProps) {
        super(props);
        this.state = { input: "", editable: false };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ editable: true });
        }, 100);
    }

    render() {
        var { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.videoByUrlContainer}>
                    <TextInput
                        style={{marginBottom: 20, height: 40, borderColor: 'gray', borderWidth: 1, fontSize: 20, color: "#ffccff"}}
                        placeholder="paste video URL here"
                        onChangeText={(text) => { this.setState({ input: text }) }}
                        value={this.state.input}
                        editable={this.state.editable}
                    />
                    <Button
                        onPress={async () => {
                            let videoId: string = extractIdFromUrl(this.state.input);
                            let res: IVideoListItem = await (getVideoDetails(videoId));
                            if (res !== null) {
                                navigation.navigate(`VideoDetails`, { id: videoId, description: res.description, title: res.title });
                            } else {
                                navigation.navigate(`VideoDetails`, { id: "RG-DK2Th7FY", description: "Juzni vetar", title: "Juzni vetar" });
                            }
                        }}
                        title="   Fetch   " />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    videoByUrlContainer: {
        flex: 9,
        flexDirection: 'column',
        resizeMode: 'cover',
        backgroundColor: '#737373',
        elevation: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    }
});
