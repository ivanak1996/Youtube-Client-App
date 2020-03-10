import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import MenuDrawer from '../components/MenuDrawer';
import HomeScreen from './navigation_screens/search_stack/HomeScreen';
import VideoDetailsPageWrapper from './navigation_screens/VideoDetailsPageWrapper';
import PlaylistVideosList from './navigation_screens/playlists_stack/PlaylistVideosList';
import PlaylistWrapperWithStack from './navigation_screens/playlists_stack/PlaylistWrapperWithStack';
import UrlStack from './navigation_screens/url_stack/UrlStack';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
	drawerWidth: WIDTH * 0.83,
	contentComponent: ({ navigation, screenProps }) => {
		return (<MenuDrawer
			navigation={navigation}
			email={screenProps.email}
			isLoggedInUser={screenProps.signedIn}
			name={screenProps.name}
			photoUrl={screenProps.photoUrl}
			signIn={() => screenProps.signIn()}
			signOut={() => screenProps.signOut()}
			//getMyPlaylists={async () => screenProps.getMyPlaylists()}
			getMyPlaylists={async () => { return await screenProps.getMyPlaylists() }}
			retrieveFreshToken={async () => { return await screenProps.retrieveFreshToken() }}
		/>)
	}
}

const DrawerPageWrapper = createDrawerNavigator(
	{
		Home: {
			screen: HomeScreen
		},
		VideoDetails: {
			screen: VideoDetailsPageWrapper,
		},
		VideoFromUrl: {
			screen: UrlStack
		},
		Playlists: {
			screen: PlaylistWrapperWithStack
		},
		PlaylistVideosList: {
			screen: PlaylistVideosList
		}
	},
	DrawerConfig,
);

export default createAppContainer(DrawerPageWrapper);
