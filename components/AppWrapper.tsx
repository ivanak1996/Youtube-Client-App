import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as Google from "expo-google-app-auth";
import * as SecureStore from 'expo-secure-store';
import { YOUTUBE_SERVER_URI, KEY_LOGIN_RESULT, androidClientId } from '../constants';
import DrawerPageWrapper from './DrawerPageWrapper';

interface IAppWrapperState {
    signedIn: boolean;
    name: string;
    photoUrl: string;
    accessToken: string | undefined;
    refreshToken: string | undefined;
}

export default class AppWrapper extends Component<{}, IAppWrapperState> {

    constructor(props) {
        super(props);
        this.state = { signedIn: false, name: "", photoUrl: "", accessToken: "", refreshToken: "" };
    }

    async componentDidMount() {
        try {
            await SecureStore.getItemAsync(KEY_LOGIN_RESULT).then((value) => {
                let val = JSON.parse(value);
                console.log(val);
                let user = val.user;
                this.setState({
                    signedIn: true,
                    name: user.name,
                    accessToken: val.accessToken,
                    refreshToken: val.refreshToken,
                    photoUrl: user.photoUrl
                });
            });
        } catch (e) {
            console.log("error", e)
        }
    }

    refreshToken() {
        try {
            let uri = `https://oauth2.googleapis.com/token?refresh_token=${this.state.refreshToken}&grant_type=refresh_token&clientId=${androidClientId}`;
            let response = fetch(uri, {
                method: 'POST',
                headers: {
                    "HOST": "oauth2.googleapis.com",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
            ).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({ accessToken: responseJson.access_token });

                });
        } catch (e) {
            console.log("error", e)
        }
    }

    checkTokenValidity = async () => {
        try {
            let uri = `https://oauth2.googleapis.com/tokeninfo?access_token=${this.state.accessToken}`;
            let response = fetch(uri, { method: 'GET' })
                .then((response) => response.json())
                .then((responseJson) => {
                    //... if error, get new one
                    console.log(responseJson.error);
                    if (responseJson.error === "invalid_token")
                        this.refreshToken();
                })
        } catch (e) {
            console.log("error", e)
        }
    }

    signIn = async () => {
        console.log("sign in called");
        try {
            const result = await Google.logInAsync({
                androidClientId: androidClientId,
                //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
                scopes: ["profile", "email", "https://www.googleapis.com/auth/youtube.readonly"]
            })

            if (result.type === "success") {
                this.setState({
                    signedIn: true,
                    name: result.user.name,
                    photoUrl: result.user.photoUrl,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                })
                SecureStore.setItemAsync(KEY_LOGIN_RESULT, JSON.stringify(result));
                console.log("access token " + result.accessToken)
                console.log("refresh token " + result.refreshToken)
            } else {
                console.log("cancelled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    signOut = async () => {
        try {
            const result = await Google.logOutAsync({ accessToken: this.state.accessToken, androidClientId: androidClientId });

            if (result.type === "default") {
                this.setState({
                    signedIn: false,
                    name: "",
                    photoUrl: "",
                    accessToken: "",
                    refreshToken: ""
                })
                SecureStore.deleteItemAsync(KEY_LOGIN_RESULT);
            } else {
                console.log(result.type)
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    getMyPlaylistsAsync = async () => {
        let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/GetMyPlaylistsGoogle`;
        try {
            await (this.checkTokenValidity());
            let response =
                await fetch(uri,
                    {
                        method: 'POST', headers: { "Accept": "application/json", "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken: this.state.accessToken })
                    })
                    .then((response) => response.json());
            //console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    getMyPlaylists = () => {
        let uri = `${YOUTUBE_SERVER_URI}/api/Youtube/GetMyPlaylistsGoogle`;
        try {
            this.checkTokenValidity().then(() => {
                var response =
                    fetch(uri,
                        {
                            method: 'POST', headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({ accessToken: this.state.accessToken })
                        })
                        .then((response) => response.json());
                //console.log(response);
                return response;
            })
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (<DrawerPageWrapper
            screenProps={{
                signedIn: this.state.signedIn,
                name: this.state.name,
                photoUrl: this.state.photoUrl,
                signIn: () => { this.signIn() },
                signOut: () => { this.signOut() },
                refreshToken: () => { this.refreshToken() },
                getMyPlaylists: async () => { return await this.getMyPlaylistsAsync() },
                checkTokenValidity: () => { this.checkTokenValidity() }
            }}
        />);
    }

    /*render() {
        return (
            //<MainPageWrapper/>
            <View style={styles.container}>
                {this.state.signedIn ? (
                    <LoggedInPage
                        name={this.state.name}
                        photoUrl={this.state.photoUrl}
                        signOut={this.signOut}
                        getMyPlaylists={this.getMyPlaylists}
                    />
                ) : (
                        <LoginPage signIn={this.signIn} />
                    )}
            </View>
        );
    }*/

}

const LoginPage = props => {
    return (
        <View>
            <Text style={styles.header}>Sign In With Google</Text>
            <Button title="Sign in with Google" onPress={() => props.signIn()} />
        </View>
    )
}

const LoggedInPage = props => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome:{props.name}</Text>
            <Image style={styles.image} source={{ uri: props.photoUrl }} />
            <Button title="Sign out" onPress={() => props.signOut()} />
            <Button title="Get my playlists" onPress={() => props.getMyPlaylists()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        fontSize: 25
    },
    image: {
        marginTop: 15,
        width: 150,
        height: 150,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 3,
        borderRadius: 150
    }
});
