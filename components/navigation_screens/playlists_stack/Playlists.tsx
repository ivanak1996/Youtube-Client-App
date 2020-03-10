import React, { Component } from "react";
import IPlaylistModel from "../../../models/IPlaylistModel";
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import NetworkFailedScreen from "../NetworkFailedScreen";

interface IPlaylistsProps {
    navigation: any;
    getMyPlaylists(): Promise<IPlaylistModel[]>;
    retrieveFreshToken(): Promise<string>;
    email: string;
}

interface IPlaylistState {
    playlists: IPlaylistModel[];
    hasFailed: boolean;
}

export default class Playlists extends Component<IPlaylistsProps, IPlaylistState> {

    constructor(props: IPlaylistsProps) {
        super(props);
        this.state = ({ playlists: [], hasFailed: false });
        this.loadPlaylists = this.loadPlaylists.bind(this);
    }

    componentDidUpdate(prevProps: IPlaylistsProps) {
        if(prevProps.email !== this.props.email) {
            this.setState({playlists: []});
            this.loadPlaylists();
        }
    }

    async loadPlaylists() {
        try {
            var newPl = await this.props.getMyPlaylists();
            if (newPl == null) {
                this.setState({ hasFailed: true });
            }
            else {
                this.setState({ playlists: newPl, hasFailed: false });
            }
        } catch (err) {
            console.log('ne moze');
            this.setState({ hasFailed: true })
        }
    }

    async componentDidMount() {
        console.log('component did mount');
        this.loadPlaylists();
    }

    render() {
        if (this.state.hasFailed) {
            return <NetworkFailedScreen onRefreshCallback={this.loadPlaylists} />
        } else {
            if (this.state.playlists.length > 0)
                return (
                    <View style={{ flex: 1, backgroundColor: "#595959" }}>
                        <FlatList
                            data={this.state.playlists}
                            renderItem={({ item }) =>
                                <Item
                                    id={item.id}
                                    title={item.title}
                                    thumbnail={item.thumbnailUrl}
                                    onSelect={() => {
                                        console.log('on select');
                                        this.props.navigation.navigate(`MyPlaylistVideoList`, {
                                            id: item.id, title: item.title, retrieveFreshToken: this.props.retrieveFreshToken
                                        })
                                    }}
                                // onSelect={() => { }}
                                //isSelected={this.isSelected}
                                />}
                            keyExtractor={item => item.id}
                        // onEndReached={this.getSearchResultsOnEndReached}
                        // ListFooterComponent={this.renderFooter.bind(this)}
                        />
                    </View>
                );
            else return (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator color="#00ff00" size="large" />
                    <Text style={styles.title}>Loading...</Text>
                </View>
            );
        }
    }

}

function Item({ id, title, thumbnail, onSelect }) {
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
