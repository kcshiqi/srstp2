import React, {Component, PropTypes} from 'react';
import {
    View, Image, Dimensions, TouchableOpacity, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {getStyleFromProps, getPlatformValue} from '../../utilities';

const window = Dimensions.get('window');

export default class BackgroundWrapper extends Component {
    renderChildren() {
        let children = [];
        if (this.props.iconLeft) children.push(
            <TouchableOpacity key="icon_left" onPress={this.props.onPressIcon} style={{height: 35}}>
                <Icon color="#ffffff" size={25} name={this.props.iconLeft} style={styleWrapper.icon}/>
            </TouchableOpacity>
        );
        children.push(this.props.children);
        return children;
    }

    renderImageBackground() {
        return (
            <Image source={require('../../assets/images/bg.jpg')} style={styleWrapper.containerImage}>
                {this.renderChildren()}
            </Image>

        );
    }

    renderViewBackground() {
        const style = [
            styleWrapper.containerView,
            getStyleFromProps(['paddingTop'], this.props)
        ]
        return <View style={style}>
            {this.renderChildren()}
        </View>
    }

    render() {
        if(this.props.transparent){
            return this.renderViewBackground();
        }
        else{
            return this.renderImageBackground();
        }
    }
}

BackgroundWrapper.propTypes = {
    iconLeft: PropTypes.string,
    onPressIcon: PropTypes.func,
    paddingTop: PropTypes.number
}

const styleWrapper = {
    containerImage: {
        width: window.width,
        height: window.height,
        resizeMode: getPlatformValue('android', 'cover', 'contain'),
        paddingTop: getPlatformValue('android', 5, 22),
    },
    containerView: {
        flex: 1,
        backgroundColor: '#9dc0f9',
        paddingTop: getPlatformValue('android', 5, 22),
    },
    icon: {
        marginLeft: 10,
        position: 'relative',
        top: 6,
        opacity: .8,
        backgroundColor: 'transparent',
        color:'#58585B'
    }
}