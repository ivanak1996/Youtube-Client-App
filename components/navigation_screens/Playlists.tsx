import React, { Component } from "react";
import IPlaylistModel from "../../models/IPlaylistModel";
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

interface IPlaylistsProps {
    navigation: any;
    getMyPlaylists(): Promise<IPlaylistModel[]>;
    retrieveFreshToken(): Promise<string>;
}

interface IPlaylistState {
    playlists: IPlaylistModel[];
}

export default class Playlists extends Component<IPlaylistsProps, IPlaylistState> {

    constructor(props: IPlaylistsProps) {
        super(props);
        this.state = ({ playlists: [] });
    }

    async componentDidMount() {
        console.log('component did mount');
        try {
            var newPl = await this.props.getMyPlaylists();
            this.setState({ playlists: newPl });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <View style={{ paddingBottom: 64, backgroundColor: "#595959" }}>
                <FlatList
                    data={this.state.playlists}
                    renderItem={({ item }) =>
                        <Item
                            id={item.id}
                            title={item.title}
                            thumbnail={item.thumbnailUrl}
                            onSelect={() => this.props.navigation.navigate(`PlaylistVideosList`, { id: item.id, title: item.title, retrieveFreshToken: this.props.retrieveFreshToken })}
                        // onSelect={() => { }}
                        //isSelected={this.isSelected}
                        />}
                    keyExtractor={item => item.id}
                // onEndReached={this.getSearchResultsOnEndReached}
                // ListFooterComponent={this.renderFooter.bind(this)}
                />
            </View>
        );
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
