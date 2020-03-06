import React from 'react'
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface IMenuButtonProps {
	navigation: any;
}

export default class MenuButton extends React.Component<IMenuButtonProps, {}> {

	constructor(props: IMenuButtonProps) {
		super(props);
	}

	render() {
		return (
			<Ionicons
				name="md-menu"
				color="#ffffff"
				size={32}
				style={styles.menuIcon}
				onPress={() => this.props.navigation.toggleDrawer()}
			/>
		)
	}
}

const styles = StyleSheet.create({
	menuIcon: {
		zIndex: 9,
		position: 'absolute',
		top: 40,
		left: 20,
	}
})