import React, {Component, PropTypes} from 'react';
import {
    ScrollView, View, Text, Image, StyleSheet, Animated, InteractionManager, Alert
} from 'react-native';
import {Input, Button, Logo, Heading, BackgroundWrapper, AlertStatus} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getPlatformValue} from '../utilities';
import firebase from '../firebase/firebase';
import loadRender from '../utilities/loadRender.js';

export default class Login extends Component {

    static navigationOptions = {
        header:null,
    };

    state = {
        username: '',
        email: '',
        password: '',
        password2:'',
        error: true,
        loading: '',

        animation: {
            headerPositionTop: new Animated.Value(-148),
            formPositionLeft: new Animated.Value(614),
            buttonPositionTop: new Animated.Value(1354)
        }
    }

    handleChangeInput(stateName, text) {
        this.setState({
            [stateName]: text
        })
    }

    
    unmountComponent(callback) {
        const timing = Animated.timing;
        Animated.parallel([
            timing(this.state.animation.headerPositionTop, {
                toValue: -148,
                duration: 400,
                delay: 100
            }),
            timing(this.state.animation.formPositionLeft, {
                toValue: 614,
                duration: 500,
                delay: 120
            }),
            timing(this.state.animation.buttonPositionTop, {
                toValue: 1354,
                duration: 400,
                delay: 130
            })
        ]).start(callback);
    }


    componentDidMount() {
        Animated.timing(this.state.animation.headerPositionTop, {
            toValue: 0,
            duration: 725,
            delay: 100
        }).start();
        Animated.timing(this.state.animation.formPositionLeft, {
            toValue: 0,
            duration: 700,
            delay: 120
        }).start();
        Animated.timing(this.state.animation.buttonPositionTop, {
            toValue: 0,
            duration: 600,
            delay: 130
        }).start();
    }

    
    addNewAccount = (downloadURL) => {

      // var emailInput = 'testuser1@gmail.com';
      // var usernameInput = 'user';
      // var passwordInput = 'abcd1234';
      // var confirmPasswordInput = 'abcd1234';
      // var genderInput = 'male';
      // var ageInput = 23;

      var emailInput = this.state.email;
      var usernameInput = this.state.username;
      var passwordInput = this.state.password;
      var confirmPasswordInput = this.state.password2;
      var error = this.state.error;
      var success = true;

      console.log('email : '+emailInput+' ; user : '+usernameInput+' ; Pwd1 : '+passwordInput+' ; Pwd2 : '+confirmPasswordInput);

      //var AES = require("crypto-js/aes");
      var CryptoJS = require("crypto-js");
      var salt = CryptoJS.lib.WordArray.random(128/8);
      var key512Bits500Iterations = CryptoJS.PBKDF2(passwordInput, salt, { keySize: 512/32, iterations: 500 });
      //var encryptedString = CryptoJS.AES.encrypt(passwordInput, '736d61727420726563656970742073797374656d');

      // check blank fields
      if(usernameInput == '' || emailInput == '' ||  passwordInput == '' || confirmPasswordInput == ''){
        console.log('blank fields.');
          Alert.alert("Please do not leave any fields blank.");
      }else{
        // check email format
        if(this.validateEmail(emailInput) == false){
          console.log('invalid email format.');
            success = false;
          Alert.alert("Invalid email format.");
        }
        // check password & confirm password
        else if(passwordInput != confirmPasswordInput){
          console.log('password & confirm password do not match.');
            success = false;
          Alert.alert("Passwords does not match.");
        }
        // check password length
        else if(passwordInput.length < 8 || confirmPasswordInput.length < 8){
            success = false;
          Alert.alert("Password length must be more than 8 characters.");
        }else{
          // check email exists before add
          firebase.database().ref('accounts').orderByChild('email').equalTo(emailInput).once('value', function(snapshot) {
            // console.log(this.navigate);
            // this.navigation.navigate("Login");
            var accountData = snapshot.val();
            if (accountData){
              console.log('account exists');
                Alert.alert("A user with this email address already exists.");
                return;
            success = false;
            }else{
             firebase.database().ref('accounts').push().set({
              email: emailInput,
              username: usernameInput,
              password: key512Bits500Iterations.toString(),
              salt: salt.toString(),
              // gender: genderInput,
              // age: ageInput,
              accountType: 'user',
              // imageURL: downloadURL,
              expiryTime: ''
            },function(error){

              if(!error){

                Alert.alert('Successfully Registered!', '', [ {text:'Okay', onPress: ()=>this.navigation.navigate("Login")} ]);
                console.log("no error");
              }else{

                Alert.alert("An error has occurred. Account is not created.");

              }

            }.bind( {navigation: this.navigation} ));

          }
          }.bind( {navigation: this.props.navigation} ));
        }

          //Alert.alert('Successfully Registered!', '', [ {text:'Okay', onPress: this.handleBack()} ]);

      }
    }

    atob = (input) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        let str = input
          .replace(/=+$/, '')
          .replace(/^data:image\/‌​(png|jpg);base64,/, '‌​');
        let output = '';

        // if (str.length % 4 == 1) {   throw new Error("'atob' failed: The string to be
        // decoded is not correctly encoded."); }
        for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4
          ? bs * 64 + buffer
          : buffer, bc++ % 4)
          ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6))
          : 0) {
          buffer = chars.indexOf(buffer);
        }

        return output;
    }

    convertToByteArray = (input) => {
        var binary_string = this.atob(input);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

        

    handleBack = () => {this.props.navigation.goBack(null)};
    handleRegister = () => {this.props.navigation.navigate('Main')};
    validateEmail = (mail) => {  
     if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
      return true;
     }else{
      return false;
     }
   }
    render() {

    if (this.state.loading) { 
      return loadRender.renderLoadingView();
    }



        return <BackgroundWrapper iconLeft="arrow-left-circle" color="#58585B" onPressIcon={this.handleBack.bind(this)}>
            <ScrollView style={loginStyle.loginContainer}>

                <Logo marginTop={25}/>
                <Animated.View style={{position: 'relative', top: this.state.animation.headerPositionTop}}>
                </Animated.View>
                <View style={loginStyle.formContainer}>
                    <Animated.View style={{position: 'relative', left: this.state.animation.formPositionLeft}}>
                        <Input label="Username"
                               icon={<Icon name="user"/>}
                               value={this.state.username}
                               onChange={this.handleChangeInput.bind(this, 'username')}
                        />
                        <Input label="Email"
                               icon={<Icon name="envelope-o"/>}
                               value={this.state.email}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'email')}
                        />
                        <Input label="Password"
                               icon={<Icon name="key"/>}
                               value={this.state.password}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'password')}
                               secureTextEntry
                        />
                        <Input label="Confirm Password"
                               icon={<Icon name="key"/>}
                               value={this.state.password2}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'password2')}
                               secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View style={{position: 'relative', top: this.state.animation.buttonPositionTop}}>
                        <Button marginTop={getPlatformValue('android',25, 38)} width={200} onPress={this.addNewAccount.bind(this)}>
                            Sign Up
                        </Button>
                    </Animated.View>
                </View>
            </ScrollView>
            
        </BackgroundWrapper>
    }
}

const loginStyle = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: getPlatformValue('android', 10, 30),
    },
    formContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: getPlatformValue('android', 5, 34)
        //backgroundColor: '#ffffff'
    }
})
