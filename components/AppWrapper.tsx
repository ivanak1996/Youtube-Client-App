import React, { Component } from 'react';
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
        this.retrieveFreshToken = this.retrieveFreshToken.bind(this);
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

    retrieveFreshToken = async () => {
        try {
            console.log('retrieve token');
            let uri = `https://oauth2.googleapis.com/tokeninfo?access_token=${this.state.accessToken}`;
            fetch(uri, { method: 'GET' })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.error === "invalid_token") {
                        let uri = `https://oauth2.googleapis.com/token?refresh_token=${this.state.refreshToken}&grant_type=refresh_token&clientId=${androidClientId}`;
                        fetch(uri, {
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
                    }
                })
        } catch (e) {
            console.log("error", e)
        } finally {
            console.log(`ACCESS TOKEN: ${this.state.accessToken}`)
            return this.state.accessToken;
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
                checkTokenValidity: () => { this.checkTokenValidity() },
                retrieveFreshToken: async () => { return await this.retrieveFreshToken() }
            }}
        />);
    }
}
