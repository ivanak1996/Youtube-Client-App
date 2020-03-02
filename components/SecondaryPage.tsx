import React, { Component } from 'react';
import { View, StatusBar, Text } from 'react-native';

export default class CustomTextInput extends Component {

  render() {
    
    return (
      <View
        style={{paddingTop:StatusBar.currentHeight, flex:1, backgroundColor: '#fff'}}
      >
        <Text>Secondary Page Content</Text>
      </View>
    );
  }

}
