import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Image, StatusBar, SafeAreaView, RefreshControl } from "react-native";
import IVideoListItem from "../../../models/IVideoListItem";
import { YOUTUBE_SERVER_URI } from "../../../constants";
import MenuButton from "../../MenuButton";

interface IPlaylistVideosListProps {
    navigation: any;
}

interface IPlaylistVideosListState {
    videos: IVideoListItem[];
    nextPageToken: string;
    loading: boolean;
    refreshing: boolean;
}

export default class PlaylistVideosList extends Component<IPlaylistVideosListProps, IPlaylistVideosListState> {

    constructor(props: IPlaylistVideosListProps) {
        super(props);
        this.state = ({ videos: [], nextPageToken: "", loading: false, refreshing: false });
        this.getMyPlaylists = this.getMyPlaylists.bind(this);
        this.getPlaylistId = this.getPlaylistId.bind(this);
        this.getPlaylistVideos = this.getPlaylistVideos.bind(this);
        this.getMorePlaylistVideos = this.getMorePlaylistVideos.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        try {
            await this.getPlaylistVideos();
        } catch (err) {
            console.log(err);
        }
    }

    onRefresh = async () => {
        this.setState({ refreshing: true, videos: [] });
        await this.getPlaylistVideos();
        this.setState({ refreshing: false });
    }

    async componentDidUpdate(prevProps: IPlaylistVideosListProps) {
        if (this.props.navigation.state.params.id != prevProps.navigation.state.params.id) {
            await this.getPlaylistVideos();
        }
    }

    async getMyPlaylists(playlistId: string, nextPageToken: string) {
        //let retrieveFreshToken = async () => { await this.props.navigation.state.params.retrieveFreshToken(); }
        let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/PlaylistContentGoogle?playlistId=${playlistId}`;
        if (nextPageToken != null) uri += `&nextPageToken=${nextPageToken}`;
        try {
            let accessToken = await this.props.navigation.state.params.retrieveFreshToken();
            console.log(`retrieved token is ${accessToken}`);
            var response =
                await (await fetch(uri,
                    {
                        method: 'POST', headers: { "Accept": "application/json", "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken: accessToken })
                    })).json();
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getPlaylistId = () => {
        let { navigation } = this.props;
        let { params } = navigation.state;
        let { id } = params;
        return id;
    }

    async getPlaylistVideos() {
        this.setState({ loading: true });
        let result: any = await (this.getMyPlaylists(this.getPlaylistId(), null));
        this.setState({
            videos: result.videosList,
            nextPageToken: result.nextPageToken,
            loading: false
        });
    }

    async getMorePlaylistVideos() {
        console.log('get more');
        if (this.state.loading || this.state.nextPageToken === "NO_MORE") return;
        this.setState({ loading: true });
        try {
            let additionalListItems: any = await (this.getMyPlaylists(this.getPlaylistId(), this.state.nextPageToken));
            this.setState({
                videos: this.state.videos.concat(additionalListItems.videosList),
                nextPageToken: additionalListItems.nextPageToken,
                loading: false
            });
        } catch (err) {
            this.setState({ loading: false });
            return;
        }
    }

    renderFooter() {
        return this.state.loading && this.state.nextPageToken !== "NO_MORE" &&
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <ActivityIndicator color="#00ff00" />
                <Text style={styles.description}>Loading...</Text>
            </View>
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.videos.length > 0 &&
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ backgroundColor: "#595959" }}>
                            <FlatList
                                data={this.state.videos}
                                renderItem={({ item }) =>
                                    <Item
                                        id={item.id}
                                        title={item.title}
                                        description={item.description}
                                        thumbnail={item.thumbnailUrl}
                                        onSelect={() => this.props.navigation.navigate(`MyPlaylistVideoDetails`, { id: item.id, description: item.description, title: item.title })}
                                    />}
                                keyExtractor={item => item.id}
                                onEndReached={this.getMorePlaylistVideos}
                                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                                ListFooterComponent={this.renderFooter.bind(this)}
                            />
                        </View>
                    </SafeAreaView>
                }
                {this.state.videos.length <= 0 &&
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator color="#00ff00" size="large" />
                        <Text style={styles.title}>Loading...</Text>
                    </View>
                }
            </View>
        );
    }
}

function Item({ id, title, description, thumbnail, onSelect }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onSelect(id)}>
            <Image source={{ uri: thumbnail }} style={styles.photo} />
            <View style={styles.container_text}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'cover',
        backgroundColor: '#737373',
        elevation: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#737373',
        elevation: 1,
    },
    title: {
        fontSize: 16,
        color: '#d9d9d9',
    },
    description: {
        fontSize: 11,
        color: '#d9d9d9',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    photo: {
        height: 90,
        width: 120,
    },
});

