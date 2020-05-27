import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { View, StatusBar, Text } from 'react-native';
import VideosList from './VideosList';

interface ICustomTextInputProps {
  navigation: any;
}

interface ICustomTextInputState {
  search: string;
  submittedSearch: string;
}

export default class CustomTextInput extends Component<ICustomTextInputProps, ICustomTextInputState> {

  constructor(props) {
    super(props);
    this.state = (
      {
        search: "",
        submittedSearch: ""
      });
  }

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <View
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          onSubmitEditing={() => {
            this.setState({ submittedSearch: this.state.search });
          }}
          value={search}
        />
        {this.state.submittedSearch !== "" &&
          <VideosList keyword={this.state.submittedSearch} navigation={this.props.navigation} />}
        {this.state.submittedSearch === "" &&
          <View style={{ flex: 1, backgroundColor: "#999999" }}>
            <View style={{ flex: 1, margin: 24, alignContent: 'center', justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', color: "#ffccff", fontSize: 24, marginBottom: 15 }}>Welcome to Youtube Downloader app!</Text>
              <Text style={{ textAlign: 'center', color: "#ffccff", fontSize: 16 }}>Search for a song you like, or log in with your Google account to access your saved playlists</Text>
            </View>
          </View>
        }
      </View>
    );
  }

}

const list2 = [
  {
    id: 'b-1CTdVXJqM',
    title: 'Winx Club - Musa Singing Just Us Girls',
    thumbnail: 'https://i.ytimg.com/vi/b-1CTdVXJqM/mqdefault.jpg',
    channel: 'iwanyca96',
    description: 'This is video about Musa of Winx Club'
  },
  {
    id: 'HSwwPgJmTxA',
    title: 'WINX CHIBI:STELLA VS CHIMERA',
    thumbnail: 'https://i.ytimg.com/vi/HSwwPgJmTxA/mqdefault.jpg',
    channel: 'Jonatha Winx2',
    description: 'NOVO NO CANAL? DE UMA OLHADA NO 1°CANAL.'
  },
  {
    id: 'xwpAGVStaq4',
    title: 'Info about next round of my best video contest',
    thumbnail: 'https://i.ytimg.com/vi/xwpAGVStaq4/mqdefault.jpg',
    channel: 'BelievixFlora2000',
    description: 'You have 5 themes for making videos!'
  },
  {
    id: 'L9TVi1eFokg',
    title: 'Video 1',
    thumbnail: 'https://i.ytimg.com/vi/L9TVi1eFokg/mqdefault.jpg',
    channel: 'channel 1',
    description: 'desc 1'
  },
  {
    id: 'gtGxZjmR1Ys',
    title: 'Video 2',
    thumbnail: 'https://i.ytimg.com/vi/gtGxZjmR1Ys/mqdefault.jpg',
    channel: 'channel 2',
    description: ' desc 2'
  },
  {
    id: '0iQGaFbj-F8',
    title: 'Video 3',
    thumbnail: 'https://i.ytimg.com/vi/0iQGaFbj-F8/mqdefault.jpg',
    channel: 'channel 3',
    description: 'desc 3'
  },
  {
    id: 'AyvpA8z6FRM',
    title: 'Video 4',
    thumbnail: 'https://i.ytimg.com/vi/AyvpA8z6FRM/mqdefault.jpg',
    channel: 'channel 4',
    description: 'desc4'
  },
  {
    id: 'UzhBo7bqf4w',
    title: 'Winx Club na Srpskom - Sezona 1 Epizoda 4',
    thumbnail: 'https://i.ytimg.com/vi/UzhBo7bqf4w/mqdefault.jpg',
    channel: 'WinxClubSerbian1',
    description: 'WinxClubSerbian1'
  },
  {
    id: '4AJy-XOOrnQ',
    title: 'Winx Club 3 -  Enchantix Transformation - English',
    thumbnail: 'https://i.ytimg.com/vi/4AJy-XOOrnQ/mqdefault.jpg',
    channel: 'enchantix',
    description: 'winx club transformation'
  },
  {
    id: 'u2FVX38xeMg',
    title: 'Winx Club - Winx VS Dark Bloom',
    thumbnail: 'https://i.ytimg.com/vi/u2FVX38xeMg/mqdefault.jpg',
    channel: 'WinxClubEnglish',
    description: 'WINX CLUB ENGLISH is your destination to enter the magic Winx world!'
  }
];
