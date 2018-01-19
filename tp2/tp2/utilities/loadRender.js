import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';

import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Alert,
} from 'react-native';

const loadRender ={
  renderLoadingView(){
    return (
      <ActivityIndicator
        animating={true}
        style={[styles.centering, {height: 80}]}
        size="large"
      />
    );
  }
}

const styles = StyleSheet.create({
	centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default loadRender;

