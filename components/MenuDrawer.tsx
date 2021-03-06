import React from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import IPlaylistModel from '../models/IPlaylistModel';

interface IMenuDrawerProps {
	navigation: any;
	isLoggedInUser: boolean;
	name: string;
	photoUrl: string;
	email: string;
	signIn(): void;
	signOut(): void;
	getMyPlaylists(): Promise<IPlaylistModel[]>;
	retrieveFreshToken(): Promise<string>;
}

export default class MenuDrawer extends React.Component<IMenuDrawerProps, {}> {

	constructor(props: IMenuDrawerProps) {
		super(props);
		this.authLink = this.authLink.bind(this);
		this.getMyPlaylistsWrapper = this.getMyPlaylistsWrapper.bind(this);
		this.retrieveFreshTokenWrapper = this.retrieveFreshTokenWrapper.bind(this);
	}

	navLink(nav, text) {
		return (
			<TouchableOpacity style={{ height: 50 }} onPress={async () => this.props.navigation.navigate(nav)}>
				<Text style={styles.link}>{text}</Text>
			</TouchableOpacity>
		)
	}

	authLink() {
		if (!this.props.isLoggedInUser)
			return (
				<TouchableOpacity style={{ height: 50 }} onPress={() => this.props.signIn()}>
					<Text style={styles.link}>Sign In</Text>
				</TouchableOpacity>
			); else
			return (
				<TouchableOpacity style={{ height: 50 }} onPress={() => {
					this.props.signOut();
					this.props.navigation.navigate("Home");
				}}>
					<Text style={styles.link}>Sign Out</Text>
				</TouchableOpacity>
			);
	}

	getMyPlaylistsWrapper(): Promise<IPlaylistModel[]> {
		return this.props.getMyPlaylists();
	}

	async retrieveFreshTokenWrapper(): Promise<string> {
		return await this.props.retrieveFreshToken();
	}

	navToPlaylists() {
		return (
			<TouchableOpacity style={{ height: 50 }} onPress={() => {
				this.props.navigation.navigate('Playlists', {email: this.props.email, getMyPlaylists: this.getMyPlaylistsWrapper, retrieveFreshToken: this.retrieveFreshTokenWrapper });
			}}>
				<Text style={styles.link}>My Playlists</Text>
			</TouchableOpacity>
		);

	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scroller}>
					<View style={styles.topLinks}>
						<View style={styles.profile}>
							<View style={styles.imgView}>
								{this.props.isLoggedInUser && <Image style={styles.img} source={{ uri: this.props.photoUrl }} />}
								{!this.props.isLoggedInUser && <Image style={styles.img} source={{ uri: "https://1.bp.blogspot.com/_wxtdziSoI_M/S9Q5U8_jXYI/AAAAAAAACG8/kUtPqAALd0I/s1600/L+Death+Note+Anime.jpg" }} />}
							</View>
							<View style={styles.profileText}>
								{this.props.isLoggedInUser && <Text style={styles.name}>{this.props.name}</Text>}
							</View>
						</View>
					</View>
					<View style={styles.bottomLinks}>
						{this.navLink('Home', 'Home')}
						{this.navLink('VideoFromUrl', 'Get video from URL')}
						{this.props.isLoggedInUser && this.navToPlaylists()}
						{this.authLink()}
					</View>
				</ScrollView>
				<View style={styles.footer}>
					<Text style={styles.description}>Youtube Downloader</Text>
					<Text style={styles.version}>v1.0</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'lightgray',
	},
	scroller: {
		flex: 1,
	},
	profile: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#777777',
	},
	profileText: {
		flex: 3,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	name: {
		fontSize: 20,
		paddingBottom: 5,
		color: 'white',
		textAlign: 'left',
	},
	imgView: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	img: {
		height: 70,
		width: 70,
		borderRadius: 50,
	},
	topLinks: {
		height: 160,
		backgroundColor: 'black',
	},
	bottomLinks: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 10,
		paddingBottom: 450,
	},
	link: {
		flex: 1,
		fontSize: 20,
		padding: 6,
		paddingLeft: 14,
		margin: 5,
		textAlign: 'left',
	},
	footer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: 'lightgray'
	},
	version: {
		flex: 1,
		textAlign: 'right',
		marginRight: 20,
		color: 'gray'
	},
	description: {
		flex: 1,
		marginLeft: 20,
		fontSize: 16,
	}
});
