import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IVideoListItem from '../../../models/IVideoListItem';
import { YOUTUBE_SERVER_URI } from '../../../constants';

interface IVideosListProps {
    keyword: string;
    navigation: any;
}

interface IVideosListState {
    selected: number;
    list: IVideoListItem[];
    nextPageToken: string;
    loading: boolean;
    //hasLoadedResults: boolean;
}

async function getSearchResultsFromApi(keyword: string) {
    let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/GetVideosByKeyword?keyword=${keyword}`;
    //console.log(uri);
    try {
        let response = await fetch(uri).then((response) => response.json());
        return response;
    } catch (error) {
        this.setState({list: list1});
        //console.error(error);
    }
}

async function getNextPageSearchResultsFromApi(keyword: string, nextPageToken: string) {
    let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/GetVideosByKeyword?keyword=${keyword}&nextPageToken=${nextPageToken}`;
    //console.log(uri);
    try {
        let response = await fetch(uri).then((response) => response.json());
        return response;
    } catch (error) {
        console.error(error);
    }
}

export default class VideosList extends Component<IVideosListProps, IVideosListState> {

    constructor(props: IVideosListProps) {
        super(props);
        this.state = { selected: -1, list: [], nextPageToken: '', loading: false };

        this.handleItemClick = this.handleItemClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getSearchResultsOnEndReached = this.getSearchResultsOnEndReached.bind(this);
    }

    async componentDidMount() {
        await this.getSearchResults();
    }

    async componentDidUpdate(prevProps: IVideosListProps) {
        if (this.props.keyword != prevProps.keyword) {
            await this.getSearchResults();
        }
    }

    handleItemClick(id: number) {
        this.setState(this.state.selected === id ? { selected: -1 } : { selected: id });
    }

    isSelected(id: number) {
        return this.state.selected === id ? true : false;
    }

    async getSearchResults() {
        this.setState({ list: [], nextPageToken: "" });
        try {
            let res = await (getSearchResultsFromApi(this.props.keyword));
            this.setState({ list: res.videosList, nextPageToken: res.nextPageToken });
        } catch (error) {
            console.log(error);
        }
    }

    async getSearchResultsOnEndReached() {
        this.setState({ loading: true });
        let additionalListItems = await (getNextPageSearchResultsFromApi(this.props.keyword, this.state.nextPageToken));
        this.setState({
            list: arrayUnique(this.state.list.concat(additionalListItems.videosList)),
            nextPageToken: additionalListItems.nextPageToken,
            loading: false
        });
    }

    renderFooter() {
        return this.state.loading &&
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <ActivityIndicator color="#00ff00" />
                <Text style={styles.description}>Loading...</Text>
            </View>
    }

    render() {
        if (this.state.list.length > 0)
            return (
                <View style={{ paddingBottom: 64, backgroundColor: "#595959" }}>
                    <FlatList
                        data={this.state.list}
                        renderItem={({ item }) =>
                            <Item
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                thumbnail={item.thumbnailUrl}
                                onSelect={() => this.props.navigation.navigate(`VideoDetails`, { id: item.id, description: item.description, title: item.title })}
                                isSelected={this.isSelected}
                            />}
                        keyExtractor={item => item.id}
                        onEndReached={this.getSearchResultsOnEndReached}
                        ListFooterComponent={this.renderFooter.bind(this)}
                    />
                </View>
            ); else return (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator color="#00ff00" size="large" />
                    <Text style={styles.title}>Loading...</Text>
                </View>
            );
    }

}

function Item({ id, title, description, thumbnail, onSelect, isSelected }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onSelect(id)}>
            <Image source={{ uri: thumbnail }} style={styles.photo} />
            <View style={styles.container_text}>
                <Text style={styles.title}>{title}</Text>
                {isSelected(id) &&
                    <View style={styles.container_expanded}>
                        <Text style={styles.description}>{description}</Text>
                        <View style={styles.container_icons}>
                            <Ionicons name='ios-add-circle-outline' size={48} />
                            <Ionicons name='md-download' size={48} />
                        </View>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
}

function arrayUnique(array: IVideoListItem[]) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i].id === a[j].id)
                a.splice(j--, 1);
        }
    }

    return a;
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
        alignItems:'center'
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
        fontSize: 11,
        color: '#d9d9d9',
    },
    photo: {
        height: 90,
        width: 120,
    },
});


const list1 = [{ "id": "ju1RWSZIZ2A", "thumbnailUrl": "https://i.ytimg.com/vi/ju1RWSZIZ2A/mqdefault.jpg", "title": "Winx Club na Srpskom - Sezona 1 Epizoda 1 Neočekivani Događaj", "description": "I do not own \"Winx Club\" and this is used only for entertainment and promotion. All rights go to Rainbow SRL.", "channel": "WinxClubFansEurope" }, { "id": "5ZF0mWjxdv0", "thumbnailUrl": "https://i.ytimg.com/vi/5ZF0mWjxdv0/mqdefault.jpg", "title": "Winx Club - Season 8 Episode 3 - Attack on the Core [FULL EPISODE]", "description": "Led by Obscurum, the Staryummies absorb all the light of Lumenia's core, plunging the star into darkness, but the Winx manage to rekindle it, thanks to their ...", "channel": "Winx Club" }, { "id": "aSI4eKcaSAU", "thumbnailUrl": "https://i.ytimg.com/vi/aSI4eKcaSAU/mqdefault.jpg", "title": "Winx Club - Season 8 Episode 2 - A Kingdom of Lumens [FULL EPISODE]", "description": "The Winx arrive on Lumenia with Twinkly. Here, Queen Dorana explains that the stars of the Magic Universe are in danger. While the Winx discover what ...", "channel": "Winx Club" }, { "id": "djqCzhIbPSE", "thumbnailUrl": "https://i.ytimg.com/vi/djqCzhIbPSE/mqdefault.jpg", "title": "Winx Club na Srpskom - Sezona 3 Epizoda 8 Nelojalni Protivnik", "description": "I do not own \"Winx Club\" and this is used only for entertainment and promotion. All rights go to Rainbow SRL.", "channel": "WinxClubFansEurope" }, { "id": "CAZmQUJuvu4", "thumbnailUrl": "https://i.ytimg.com/vi/CAZmQUJuvu4/mqdefault.jpg", "title": "Winx Club na Srpskom - Sezona 1 Epizoda 5", "description": "Winx Club™ created by Iginio Straffi © 2003-2013 Rainbow S.r.l. and Viacom International Inc. All Rights Reserved.", "channel": "WinxClubSerbian1" }, { "id": "FeRiJVsRBqY", "thumbnailUrl": "https://i.ytimg.com/vi/FeRiJVsRBqY/mqdefault.jpg", "title": "Winx Club - Season 8 Episode 1 - Night of the Stars [FULL EPISODE]", "description": "During the night of the shooting stars, the Winx meet Twinkly, a Lumen coming from space. The Winx save her from mysterious creatures called Staryummies, ...", "channel": "Winx Club" }, { "id": "DfHCOPdbFBs", "thumbnailUrl": "https://i.ytimg.com/vi/DfHCOPdbFBs/mqdefault.jpg", "title": "Winx Club - My favourite 10 transformation!", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "9eqSn6GADgA", "thumbnailUrl": "https://i.ytimg.com/vi/9eqSn6GADgA/mqdefault.jpg", "title": "Winx Club - Winx Công chúa phép thuật - Phần 8 Tập 3 [trọn bộ]", "description": "Chỉ có ở trên kênh Winx Club Vietnam… Mỗi ngày một tập phim mới, đừng bỏ qua! Winx Club - Phần 1: http://goo.gl/gI9uwr Winx Club - Phần 2: ...", "channel": "Winx Club Việt Nam" }, { "id": "MPrFo-2A4Ik", "thumbnailUrl": "https://i.ytimg.com/vi/MPrFo-2A4Ik/mqdefault.jpg", "title": "Winx Club - Winx Công chúa phép thuật - Phần 8 Tập 2 [trọn bộ]", "description": "Chỉ có ở trên kênh Winx Club Vietnam… Mỗi ngày một tập phim mới, đừng bỏ qua! Winx Club - Phần 1: http://goo.gl/gI9uwr Winx Club - Phần 2: ...", "channel": "Winx Club Việt Nam" }, { "id": null, "thumbnailUrl": "https://i.ytimg.com/vi/cfHiGUoocio/mqdefault.jpg", "title": "Winx Club - Česky - Celý Díl - Série 1, 5", "description": "Winx Club Czech / Česky Full Episodes / Celý Díl Season 1, 5 / Série 1, 5.", "channel": "Magic Winx All Languages" }, { "id": "be5JyTsiaPY", "thumbnailUrl": "https://i.ytimg.com/vi/be5JyTsiaPY/mqdefault.jpg", "title": "Winx Club - Enchantix power&#39;s comeback", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "zUrDMlrA1xo", "thumbnailUrl": "https://i.ytimg.com/vi/zUrDMlrA1xo/mqdefault.jpg", "title": "Winx Club - Musa and Riven: rediscovering love [EXCLUSIVE IMAGES]", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "W6BxVAXL4Nk", "thumbnailUrl": "https://i.ytimg.com/vi/W6BxVAXL4Nk/mqdefault.jpg", "title": "Winx Club - Winx Công chúa phép thuật - Phần 8 Tập 23 [trọn bộ]", "description": "Chỉ có ở trên kênh Winx Club Vietnam… Mỗi ngày một tập phim mới, đừng bỏ qua! Winx Club - Phần 1: http://goo.gl/gI9uwr Winx Club - Phần 2: ...", "channel": "Winx Club Việt Nam" }, { "id": "_r9nWse_wtg", "thumbnailUrl": "https://i.ytimg.com/vi/_r9nWse_wtg/mqdefault.jpg", "title": "Winx Club - Season 8 - Sky and Diaspro... together!", "description": "Subscribe now: http://goo.gl/SWGZDB FACEBOOK: http://www.facebook.com/winxclub WEBSITE: http://www.winxclub.com INSTAGRAM: ...", "channel": "Winx Club" }, { "id": "G8xLaNtWY3A", "thumbnailUrl": "https://i.ytimg.com/vi/G8xLaNtWY3A/mqdefault.jpg", "title": "Winx Club - Season 1 Episode 7 [4Kids] - Grounded [HQ]", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "acdRLzSls9Q", "thumbnailUrl": "https://i.ytimg.com/vi/acdRLzSls9Q/mqdefault.jpg", "title": "Winx Club -  Season 8 - Final Battle", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "lWsEC7Vkils", "thumbnailUrl": "https://i.ytimg.com/vi/lWsEC7Vkils/mqdefault.jpg", "title": "Winx Club - Musa VS Darcy", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "mzib7B1Qvqs", "thumbnailUrl": "https://i.ytimg.com/vi/mzib7B1Qvqs/mqdefault.jpg", "title": "Clube das Winx Club Flora Musa Bloom Tecna Aisha Stella | Desenho de Pintar para Criança | Desenhos", "description": "Inscreva-se no Canal: https://goo.gl/f2B6MN Clube das Winx Club Flora Musa Bloom Tecna Aisha Stella | Desenho de Pintar para Criança | Desenhos Hoje ...", "channel": "Desenholandia" }, { "id": "k_huLZPULZg", "thumbnailUrl": "https://i.ytimg.com/vi/k_huLZPULZg/mqdefault.jpg", "title": "Winx Club: Magical Adventure [FULL MOVIE]", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "DKk1uRTZQCA", "thumbnailUrl": "https://i.ytimg.com/vi/DKk1uRTZQCA/mqdefault.jpg", "title": "Winx Club Characters In Real Life", "description": "Winx Club In Real Life (En La Vida Real) Winx Club Beautiful Fashion Doll - Bloom: https://amzn.to/36dDnz0 Winx Club Cute Fashion Doll - Stella: ...", "channel": "Hitlist 10" }, { "id": "M-RJJDhPRTQ", "thumbnailUrl": "https://i.ytimg.com/vi/M-RJJDhPRTQ/mqdefault.jpg", "title": "Winx Club - Season 8 - Love moments!", "description": "WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d DISCOVER: Winx + Specialists Love Stories ...", "channel": "WinxClubEnglish" }, { "id": "73exHabQGzM", "thumbnailUrl": "https://i.ytimg.com/vi/73exHabQGzM/mqdefault.jpg", "title": "WINX CLUB Live Action Fanmade Trailer (2021) Katherine McNamara, Ariana Grande Movie HD", "description": "Contact me: Instagram: @jomer1304 Mail: omiko134@gmail.com This is NOT an official trailer, but just something I edited for entertainment. Please respect this ...", "channel": "Omer Menashe" }, { "id": "DM8T7zqNsNE", "thumbnailUrl": "https://i.ytimg.com/vi/DM8T7zqNsNE/mqdefault.jpg", "title": "Winx Club - The Secret of The Lost Kingdom [FULL MOVIE 1080p ᴴᴰ]", "description": "Watch it and Enjoy the First Movie of Winx Club! WINX CLUB ENGLISH is your destination to enter the magic Winx world! Subscribe now: https://goo.gl/Qk3n8d ...", "channel": "WinxClubEnglish" }, { "id": "BFbmvoB3zDM", "thumbnailUrl": "https://i.ytimg.com/vi/BFbmvoB3zDM/mqdefault.jpg", "title": "Winx Club - Season 6 Full Episodes [4-5-6]", "description": "Watch and Like I Will Release New full episodes soon Stay Tuned! The Trix come back and start to conquer all the Magic Dimension colleges. The Winx will ...", "channel": "WinxClubEnglish" }, { "id": "B3j-QEnEWAk", "thumbnailUrl": "https://i.ytimg.com/vi/B3j-QEnEWAk/mqdefault.jpg", "title": "Winx Club - World Of Winx | Season 2 Ep.10 - Technomagic trap (Clip)", "description": "Straight from World Of Winx, here is a super WOW clip! Subscribe now: http://goo.gl/SWGZDB FACEBOOK: http://www.facebook.com/winxclub WEBSITE: ...", "channel": "Winx Club" }];
