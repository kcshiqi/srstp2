import React, { Component } from 'react';
import { Text, View, StyleSheet, WebView } from 'react-native';
import { Constants } from 'expo';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default class App extends Component {

   static navigationOptions = {
      drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="star" size={24} style={{ color: tintColor }} />),
  };
  onNavigationStateChange = navState => {
    if (navState.url.indexOf('https://www.google.com') === 0) {
      const regex = /#access_token=(.+)/;
      let accessToken = navState.url.match(regex)[1];
      console.log(accessToken);
    }
  };
  render() {
    const url = 'https://srfyp.000webhostapp.com/production/index.html';
    return (
      <WebView
        source={{
          uri: url,
        }}
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled
        style={{ flex: 1 }}
      />
    );
  }
}