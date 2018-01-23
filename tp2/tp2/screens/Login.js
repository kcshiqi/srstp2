import React, {Component, PropTypes} from 'react';
import {AsyncStorage, View, Text, Image, ScrollView, StyleSheet, Alert, Animated, Keyboard,TouchableWithoutFeedback, KeyboardAvoidingView, TextInput} from 'react-native';
import {Input, Button, Logo, Heading, BackgroundWrapper, AlertStatus} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StackNavigator, NavigationActions} from 'react-navigation';
import firebase from '../firebase/firebase';
import {getPlatformValue} from '../utilities';
import loadRender from '../utilities/loadRender.js';


export default class Login extends React.Component {

  static navigationOptions = {    
    headerTitleStyle:{fontFamily:'American Typewriter',  fontWeight: 'normal'  },
    drawerLabel: 'Logout',
    drawerIcon: ({ tintColor }) => (

    <MaterialIcons name="input" size={24} style={{ color: tintColor }} />
  ),
    header:null,
  };

      state = {
        username: '',
        userKey: '',
        loading:false,
        password: '',
        logOut: this.props.logOut,
        animation: {
            usernamePostionLeft: new Animated.Value(795),
            passwordPositionLeft: new Animated.Value(905),
            loginPositionTop: new Animated.Value(1402),
            statusPositionTop: new Animated.Value(1542)
        }
    }


    handleChangeInput(stateName, text) {

        this.setState({
            [stateName]: text
        })
    }

    _handlePressSignIn = () => {
      this.setState({loading:true});
      // var passwordInput = 'abcd1234';
      // var emailInput = 'testuser1@gmail.com';
      var passwordInput = this.state.password.replace(/\s/g,'');
      var emailInput = this.state.username.replace(/\s/g,'');

      //var AES = require("crypto-js/aes");
      var CryptoJS = require("crypto-js");

      // set counter to async storage cause react native does not support global variable
      var counterStr;
      let counterKey = new Promise((resolve, reject) => {
        AsyncStorage.getItem('attempts').then((keyValue) => {
          resolve(keyValue);
        }, (error) => {
          console.log(error);
        });
      });

      counterKey.then((counterStr) => {
        // convert the counter into integer
        var counter = counterStr * 1;

        // check blank fields
        if(emailInput == '' || passwordInput == ''){
          console.log('blank fields.');
          this.setState({loading:false});
          Alert.alert("Please do not leave any fields blank.");
        }else{
          //check email format
          if(this.validateEmail(emailInput) == false){
            console.log('invalid email format.');
            Alert.alert("Invalid email format.");
            this.setState({loading:false});
          }else{
            var query = firebase.database().ref('accounts').orderByChild('email').equalTo(emailInput);
            query.once( 'value', data => {
              if(!data.exists()){ 
                console.log('account not exists.');
                this.setState({loading:false});
                Alert.alert("User does not exist.");
              }else{

                //store email into asyncstorage
                AsyncStorage.setItem('userEmail',emailInput);

                data.forEach(userSnapshot => {
                  let userKey = userSnapshot.key;
                  var accountData = userSnapshot.val();
                  var password = accountData.password;
                  var userType = accountData.accountType;
                  var salt = accountData.salt;
                  var expiryTime = accountData.expiryTime;

                  //var decrypted= CryptoJS.AES.decrypt(password, '736d61727420726563656970742073797374656d');
                  //var decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
                  var key512Bits500Iterations = CryptoJS.PBKDF2(passwordInput, CryptoJS.enc.Hex.parse(salt), { keySize: 512/32, iterations: 500 });

                  var now = new Date();
                  // convert expiryTime into date format
                  var expiryTimeDate = new Date(expiryTime);

                  // check current time is after expiry time
                  if(now.getTime() < expiryTimeDate.getTime()) {
                      // account still locked, simply skip all validations
                      console.log("Account locked! Please relogin at " + expiryTimeDate.toLocaleDateString() + " " + expiryTimeDate.toLocaleTimeString() + "!");
                      Alert.alert("Account locked. Please relogin at "+ expiryTimeDate.toLocaleDateString() + " " + expiryTimeDate.toLocaleTimeString() + "!");

                  }else{
                      // account no longer locked, check number of attempts
                      if(counter < 2){
                        if(userType != 'user'){
                           console.log("Please register for user account!");
                            Alert.alert("Please register for user account.");
                        }else{
                          // check login credential, if failed, increment attempts counter
                          if(password != key512Bits500Iterations){
                            console.log("Invalid login credential! You have " + (2-counter) + " more attempts!");
                            Alert.alert("Invalid login credentials! You have " + (2-counter) + " more attempts!");
                            counter++;
                            this.setState({loading:false});
                            AsyncStorage.setItem('attempts', (counter++).toString());
                          }else{
                            // create logged in session
                            AsyncStorage.setItem('userSession', userKey);
                            this.setState({userKey:userKey});
                            console.log("USER KEY HERE --- >> "+userKey);
                            console.log("Successfully logged in");
                            this.setState({loading:false});
                            this.handleSuccessfulLogin();
                            // update expiryTime to null
                            this.updateAccountExpiryTime(userKey, '');
                          }
                        }
                      }else{
                        AsyncStorage.setItem('attempts', "0");
                        // reached maximum attempts, start to lock the account
                        var in20 = new Date(now.getTime() + (1000*60*20)); // add 20 minutes
                        // update account expiryTime to twenty minutes later
                        this.updateAccountExpiryTime(userKey, in20.toLocaleDateString() + " " + in20.toLocaleTimeString());
                        
                        this.setState({loading:false});
                        console.log("Account locked! Please relogin at " + in20.toLocaleDateString() + " " + in20.toLocaleTimeString() + "!");
                      }
                  }
                  });
              }
            });
          }
        }
    });
    }

    // function to update account locked expiry time
     updateAccountExpiryTime = (accountID, expiryTime) => {
        firebase.database().ref('accounts').child(accountID).update({
              expiryTime: expiryTime,
          }), (error) => {
              if (error) {
                  console.log(error.message);
              }else{
                  // Success
              }
          }
    }

    validateEmail = (mail) => {  
     if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
      return true;
     }else{
      return false;
     }
   } 
    handleSuccessfulLogin = () => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Main'})
        ]
      })
        this.props.navigation.dispatch(resetAction)
      // this.props.navigation.navigate('Main', {userKey:this.state.userKey.replace(/\s/g,''), email:this.state.username.replace(/\s/g,'')});

    };

    handlePressSignUp = () => {this.props.navigation.navigate('Register')};



    componentDidMount() {
        const timing = Animated.timing;
        Animated.parallel([
            timing(this.state.animation.usernamePostionLeft, {
                toValue: 0,
                duration: 700
            }),
            timing(this.state.animation.passwordPositionLeft, {
                toValue: 0,
                duration: 900
            }),
            timing(this.state.animation.loginPositionTop, {
                toValue: 0,
                duration: 700
            }),
            timing(this.state.animation.statusPositionTop, {
                toValue: 0,
                duration: 700
            })

        ]).start()
    }

render() {


    console.log(this.props.navigation.state);
      
        if(this.state.logOut){

          AsyncStorage.removeItem('userSession');
          console.log("TEXSTHEIUGRGNDIKG");

        }else if(this.state.loading){
          return loadRender.renderLoadingView();
        }




        return (<BackgroundWrapper>
            <ScrollView style={loginStyle.loginContainer}>
                <Logo/>
                <Heading marginTop={16} color="#808284" fontFamily="Pacifico" textAlign="center">
                    {'Smart Receipt'}
                </Heading>
                <KeyboardAvoidingView behavior="padding" style={loginStyle.formContainer}>
                    <Animated.View style={{position: 'relative', left: this.state.animation.usernamePostionLeft}}>
                        <Input label="Email"
                               icon={<Icon name="envelope-o"/>}
                               value={this.state.username.replace(/\s/g,'')}
                               onChange={this.handleChangeInput.bind(this, 'username')}
                        />
                    </Animated.View>
                    <Animated.View style={{position: 'relative', left: this.state.animation.passwordPositionLeft}}>
                        <Input label="Password"
                               icon={<Icon name="key"/>}
                               value={this.state.password.replace(/\s/g,'')}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'password')}
                               secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View style={{position: 'relative', top: this.state.animation.loginPositionTop}}>
                      
                        <Button marginTop={60} onPress={this.state.loading? 0 : this._handlePressSignIn.bind(this)} >
                            Sign in
                        </Button>

						      <Button marginTop={20} onPress={this.handlePressSignUp}>
                            Sign Up
                        </Button>

                    </Animated.View>
              <View style={{ height: 60 }} />
                </KeyboardAvoidingView>
            </ScrollView>

        </BackgroundWrapper>);
    }

}

const loginStyle = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 49,
    },
    formContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: getPlatformValue('android', 25, 45)
    }
})
