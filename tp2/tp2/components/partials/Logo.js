import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {getStyleFromProps} from '../../utilities';

export default class Logo extends Component {
    render() {
        const style = [
            logoStyle.imageContainer,
            getStyleFromProps(['marginTop'], this.props)
        ]
        return <View style={style}>
            <Image source={require('../../assets/images/SR1.png')} style={logoStyle.image}/>
        </View>
    }
}

Logo.propTypes = {
    marginTop: PropTypes.number
}

const logoStyle = StyleSheet.create({
    imageContainer: {
        alignItems: 'center'
    },
    image: {
        width: 104,
        height: 104,
        resizeMode: 'contain',
    }
})

