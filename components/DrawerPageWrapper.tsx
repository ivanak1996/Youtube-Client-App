import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import MenuDrawer from '../components/MenuDrawer';
import VideoFromUrlGetter from './navigation_screens/VideoFromUrlGetter';
import HomeScreen from './navigation_screens/HomeScreen';
import VideoDetailsPageWrapper from './navigation_screens/VideoDetailsPageWrapper';
import PlaylistWrapper from './navigation_screens/PlaylistWrapper';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
	drawerWidth: WIDTH * 0.83,
	contentComponent: ({ navigation, screenProps }) => {
		return (<MenuDrawer
			navigation={navigation}
			isLoggedInUser={screenProps.signedIn}
			name={screenProps.name}
			photoUrl={screenProps.photoUrl}
			signIn={() => screenProps.signIn()}
			signOut={() => screenProps.signOut()}
			//getMyPlaylists={async () => screenProps.getMyPlaylists()}
			getMyPlaylists={async () => {return await screenProps.getMyPlaylists()}}
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
			screen: VideoFromUrlGetter
		},
		Playlists: {
			screen: PlaylistWrapper
		}
	},
	DrawerConfig,
);

export default createAppContainer(DrawerPageWrapper);
