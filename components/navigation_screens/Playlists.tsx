import React, { Component } from "react";
import IPlaylistModel from "../../models/IPlaylistModel";
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

interface IPlaylistsProps {
    //navigation: any;
    //playlists: IPlaylistModel[];
    getMyPlaylists(): Promise<IPlaylistModel[]>;
}

interface IPlaylistState {
    playlists: IPlaylistModel[];
}

export default class Playlists extends Component<IPlaylistsProps, IPlaylistState> {

    constructor(props: IPlaylistsProps) {
        super(props);
        //console.log(this.props.playlists);
        this.state = ({ playlists: [] });
    }

    async componentDidUpdate(prevProps: IPlaylistsProps) {
        console.log('component did update');
        //console.log(this.props.playlists);
        // if (this.props.playlists != prevProps.playlists) {
        var newPl = await this.props.getMyPlaylists();
        this.setState({ playlists: newPl });
        //}
    }

    /*async componentDidMount() {
        try {
            console.log('catching playlists');
            var pl = await this.props.getMyPlaylists();
            this.setState({ playlists: pl });
        } catch (err) {
            console.log(err);
            console.log('not possible to populate the playlist');
        }
    }*/

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
                            //onSelect={() => this.props.navigation.navigate(`VideoDetails`, { id: item.id, description: item.description, title: item.title })}
                            onSelect={() => { }}
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
