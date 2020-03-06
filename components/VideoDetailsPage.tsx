import React, { Component } from "react";
import { View, Text, StatusBar, Dimensions, StyleSheet, Button, ActivityIndicator, Platform } from "react-native";
import YoutubePlayer from 'react-native-youtube-iframe';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import { YOUTUBE_SERVER_URI } from '../constants';
import { ScrollView } from "react-native-gesture-handler";

const WIDTH = Dimensions.get('window').width;

interface IVideoDetailsPageProps {
    id: string;
    title: string;
    description: string;
}

interface IVideoDetailsPageState {
    hasError: boolean;
    isDownloading: boolean;
}

export default class VideoDetailsPage extends Component<IVideoDetailsPageProps, IVideoDetailsPageState> {

    constructor(props: IVideoDetailsPageProps) {
        super(props);
        this.state = { hasError: false, isDownloading: false }
        this.downloadFile = this.downloadFile.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.shareFile = this.shareFile.bind(this);
    }

    componentDidUpdate(prevProps: IVideoDetailsPageProps) {
        if (this.props.id != prevProps.id) {
            this.setState({ hasError: false });
        }
    }

    DownloadAndShareSection = () => {
        if (Platform.OS === 'android') {
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                        <Button
                            title="Download"
                            onPress={() => this.downloadFile(true)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Share"
                            onPress={() => this.downloadFile(false)}
                        />
                    </View>
                </View>);
        } else if (Platform.OS === 'ios') {
            return (
                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <Button
                        title="Share"
                        onPress={() => this.downloadFile(false)}
                    />
                </View>);
        }
    }

    render() {

        return (
            <View style={{ flex: 1, overflow: "hidden", paddingTop: StatusBar.currentHeight, backgroundColor: "#737373" }}>
                {!this.state.hasError &&
                    <YoutubePlayer
                        height={WIDTH * 0.5625}
                        width={WIDTH}
                        videoId={`${this.props.id}`}
                        volume={50}
                        playbackRate={1}
                        onError={(err) => {
                            console.log(err);
                            this.setState({ hasError: true });
                        }}
                        playerParams={{
                            preventFullScreen: true,
                            cc_lang_pref: "us",
                            showClosedCaptions: true
                        }}
                    />}
                {this.state.hasError &&
                    <Text>Error</Text>
                }
                <View style={{ backgroundColor: "#595959", flex: 1, marginTop: 12 }}>
                    <View style={styles.container_text}>
                        <View style={{ flex: 3 }}>
                            <Text style={styles.title}>{this.props.title}</Text>
                            <ScrollView style={{ marginBottom: 20, marginTop: 20 }}>
                                <Text style={styles.description}>{this.props.description}</Text>
                            </ScrollView>
                        </View>
                        <this.DownloadAndShareSection />
                        {/* <View style={{ flex: 1 }}>
                            <Button
                                title="Download"
                                onPress={this.downloadFile}
                            />
                        </View> */}
                        {this.state.isDownloading && <ActivityIndicator size="small" color="#00ff00" />}
                    </View>
                </View>
            </View>
        );
    }

    downloadFile(shouldDownload: boolean) {
        this.setState({ isDownloading: true });
        const uri = `${YOUTUBE_SERVER_URI}/api/Youtube/DownloadFile/${this.props.id}`;
        let str = this.props.title;
        str = str.replace(/\s+/g, '_');
        let fileUri = FileSystem.documentDirectory + `${str}.mp3`
        console.log(fileUri);
        FileSystem.downloadAsync(uri, fileUri)
            .then(({ uri }) => {
                if (shouldDownload)
                    this.saveFile(uri);
                else
                    this.shareFile(uri);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                this.setState({ isDownloading: false });
            })
    }

    saveFile = async (fileUri: string) => {
        if (Platform.OS === 'android') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                await MediaLibrary.createAlbumAsync("Download", asset);
            }
        } else if (Platform.OS === 'ios') {
            Sharing.shareAsync(fileUri, { UTI: 'public.audio' })
        }
    }

    shareFile = async (fileUri: string) => {
        console.log('share file');
        if (Platform.OS === 'ios') {
            Sharing.shareAsync(fileUri, { UTI: 'public.audio' });
        } else if (Platform.OS === 'android') {
            Sharing.shareAsync(fileUri, { mimeType: 'audio/mpeg' });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 1,
    },
    title: {
        fontSize: 20,
        color: '#d9d9d9',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        margin: 12,
    },
    container_expanded: {
        flex: 1,
        flexDirection: 'column'
    },
    container_icons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center"
    },
    description: {
        fontSize: 16,
        color: '#bfbfbf',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
    },
    photo: {
        height: 90,
        width: 90,
    },
});
