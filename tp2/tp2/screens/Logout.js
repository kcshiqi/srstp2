import {AsyncStorage} from 'react-native';
import React, { Component } from 'react';

class YourComponent extends Component {
    constructor(props) {
        super(props);
     }

    componentWillMount() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
}

export default YourComponent;