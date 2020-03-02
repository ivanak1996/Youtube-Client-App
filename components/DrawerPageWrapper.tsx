import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, View, Text, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import MenuDrawer from '../components/MenuDrawer';
import MenuButton from './MenuButton';
import MainPage from './MainPage';
import VideoDetailsPage from './VideoDetailsPage';
import { TextInput } from 'react-native-gesture-handler';
import { YOUTUBE_SERVER_URI } from '../constants';
import IVideoListItem from '../models/IVideoListItem';
import { Input, Button } from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
	drawerWidth: WIDTH * 0.83,
	contentComponent: ({ navigation }) => {
		return (<MenuDrawer navigation={navigation} />)
	}
}

function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
				<MenuButton navigation={navigation} />
			</View>
			<View style={{ flex: 9 }}>
				<MainPage navigation={navigation} />
			</View>
		</View>
	);
}

function SettingsScreen({ navigation }) {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
				<MenuButton navigation={navigation} />
			</View>
			<View style={{ flex: 9 }}>
				<Button onPress={() => navigation.goBack()} title="Go back home" />
			</View>
		</View>
	);
}

function VideoDetailsPageWrapper({ navigation }) {
	const { params } = navigation.state;
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
				<MenuButton navigation={navigation} />
			</View>
			<View style={{ flex: 9 }}>
				<VideoDetailsPage
					id={params.id}
					description={params.description}
					title={params.title}
				/>
			</View>
		</View>
	);
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

function VideoFromUrlGetter({ navigation }) {
	var input: string = "";
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, paddingBottom: StatusBar.currentHeight, }}>
				<MenuButton navigation={navigation} />
			</View>
			<View style={styles.videoByUrlContainer}>
				<Input
					placeholder="paste video URL here"
					onChangeText={(text) => { input = text }}
				/>
				<Button
					onPress={async () => {
						let videoId: string = extractIdFromUrl(input);
						let res: IVideoListItem = await (getVideoDetails(videoId));
						if (res !== null) {
							navigation.navigate(`VideoDetails`, { id: videoId, description: res.description, title: res.title });
						} else {
							navigation.navigate(`VideoDetails`, { id: "RG-DK2Th7FY", description: "Juzni vetar", title: "Juzni vetar" });
						}
					}}
					title="Download" />
			</View>
		</View>
	);
}

const DrawerPageWrapper = createDrawerNavigator(
	{
		Home: {
			screen: HomeScreen
		},
		VideoDetails: {
			screen: VideoDetailsPageWrapper,
		},
		Settings: {
			screen: VideoFromUrlGetter
		},
	},
	DrawerConfig
);


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
		paddingLeft: 60,
		paddingRight: 60
	},
	ytContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: StatusBar.currentHeight,
		backgroundColor: '#ecf0f1',
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 30,
	}
});

export default createAppContainer(DrawerPageWrapper);
