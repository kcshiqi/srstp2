import React, {Component, PropTypes} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    View, Text, Image, StyleSheet, Animated, InteractionManager, Alert, ScrollView,StatusBar,
  ActivityIndicator, AsyncStorage, KeyboardAvoidingView
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Input, Button, Logo, Heading, BackgroundWrapper, Status} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getPlatformValue} from '../utilities';
import firebase from '../firebase/firebase';
import loadRender from '../utilities/loadRender.js';

import {
  ImagePicker,Constants
} from 'expo';
import {
  Card,
  ButtonGroup,
  Tile,
  Grid,
  Col,
  Row,
  List,
  ListItem,
  Avatar
} from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

export default class Settings extends React.Component {
 
    state = {

    image: null,
    uploading: false,
        image: '',
        userKey:'',
        email: '',
        currentEmail:'',
        username:'',
        loaded:false,
        currentUser:'',
        currentPwd: '',
        newPwd: '',
        authenticated:'false',
        renewPwd:'',
        animation: {
            headerPositionTop: new Animated.Value(-148),
            formPositionLeft: new Animated.Value(614),
            buttonPositionTop: new Animated.Value(1354)
        }
    }
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }
    handleChangeInput(stateName, text) {
        this.setState({
            [stateName]: text
        })
    }

  constructor() {
    super();
    this.getCredentials();
    this.updateIndex = this.updateIndex.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
  }

    checkLogin = () => {
      var passwordInput = this.state.currentPwd;
      var emailInput = this.state.currentEmail;

      console.log("CURRENT EMAIL:");
      console.log(this.state.currentEmail);
      console.log("CURRENT EMAIL:");
      console.log(this.state.currentPwd);

      //var AES = require("crypto-js/aes");
      var CryptoJS = require("crypto-js");

        // check blank fields
        if(emailInput == '' || passwordInput == ''){
          console.log('blank fields.');
          return false;
        }

          var query = firebase.database().ref('accounts').orderByChild('email').equalTo(emailInput);
            query.once( 'value', data => {
              if(!data.exists()){ 
                console.log('account not exists.');
                return false;
              }else{
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
                    // check login credential, if failed, increment attempts counter
                    if(password != key512Bits500Iterations){
                      return false;
                    }else{

                      // update login credentials
                      firebase.database().ref('accounts').child(this.state.userKey).update({
                        email: this.state.email,
                      }), (error) => {
                        if (error) {
                          console.log(error.message);
                          
                        }else{
                          // Success
                        }
                        this.state.currentEmail = this.state.email;
                        AsyncStorage.setItem('userEmail',this.state.email);
                          console.log("successfully updated email");

                          //change password here if new password field not blank. 
                          if(this.state.newPwd != '' && this.state.renewPwd == this.state.newPwd){
                            console.log("Change password");
                            var newPassword = this.state.newPwd; 
                            var salt = CryptoJS.lib.WordArray.random(128/8);
                              var key512Bits500Iterations = CryptoJS.PBKDF2(newPassword, salt, { keySize: 512/32, iterations: 500 });
                            
                              // update login credentials
                              firebase.database().ref('accounts').child(this.state.userKey).update({
                                password: key512Bits500Iterations.toString(),
                                salt: salt.toString(),
                              }), (error) => {
                                if (error) {
                                  console.log(error.message);
                                }else{
                                  // Success
                                }
                              }
                          }else if(this.state.renewPwd != this.state.newPwd){
                            console.log("re enter password");
                          }

                      }


                    }
                      
                  });
              }
            });
    }

  
  validateEmail = (mail) => {  
     if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
      return true;
     }else{
      return false;
     }
   } 

updateAccount = async () => {
  var accountID = this.state.userKey;
  //change user name
  if(this.state.currentUser != this.state.username){
    //change user name no need password

    // update login credentials
    firebase.database().ref('accounts').child(accountID).update({
      username: this.state.username,
    }), (error) => {
      if (error) {
        console.log(error.message);
        return
      }else{
        // Success
      }
        console.log("successfully updated username");
    }
  }

  if(this.state.currentEmail != this.state.email || this.state.newPwd!=''){

    //validate password, then change email.;
    this.checkLogin();

  }

}

  //function to get number of receipts
  getUsername = async () => {
    var accountKey = this.state.userKey;
    console.log(this.state.userKey);
    var counter = 0;
    let promiseKey = new Promise((resolve, reject) => {
      var query = firebase.database().ref('receipts').child(accountKey);
      query.once('value').then(data => {
        data.forEach(snapshot => {
          counter++;
        });
        resolve(counter);
      });
    });

    var query = firebase.database().ref('accounts').orderByChild('email').equalTo(this.state.email);
    query.once( 'value', data => {
      if(!data.exists()){ 
        console.log('account not exists.');
      }else{
        data.forEach(userSnapshot => {
          let userKey = userSnapshot.key;
          var accountData = userSnapshot.val();
          var username = accountData.username;
          this.setState({username:username, currentUser:username});

          });
      }
    });
  }
validateEmail = (mail) => {  
  if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
    return true;
   }else{
    return false;
   }
}


getCredentials = async () => {

    try {
      const value = await AsyncStorage.getItem('userSession');
      if (value !== null){
        // We have data!!
        this.state.userKey = value;
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }

        try {
      const value = await AsyncStorage.getItem('userEmail');
      if (value !== null){
        // We have data!!
        this.state.email = value;
        this.state.currentEmail = value;
        console.log(value);
        this.getUsername();
        this.setState({loaded:true});
      }
    } catch (error) {
      // Error retrieving data
    }

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

    static navigationOptions = {
    
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="settings" size={24} style={{ color: tintColor }} />
  ),
  };

    render() {


if (!this.state.loaded) {
  console.log("loaded? ");
  console.log(this.state.loaded);

      return loadRender.renderLoadingView();
      }



        return (<BackgroundWrapper>
             
<ScrollView>
            <View style={styles.loginContainer}>
                <Animated.View style={{position: 'relative', top: this.state.animation.headerPositionTop}}>
                </Animated.View>
                <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
                    <Animated.View style={{position: 'relative', left: this.state.animation.formPositionLeft}}>


          <Card title='Account Settings' fontFamily='Raleway'>

                        <Input label="Username"
                               value={this.state.username}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'username')}
                        />
                        <Input label="Email"
                               value={this.state.email}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'email')}
                        />
                        <Input label="Current Password"
                               value={this.state.currentPwd}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'currentPwd')}
                               secureTextEntry
                        />

                        <Input label="New Password"
                               value={this.state.newPwd}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'newPwd')}
                               secureTextEntry
                        />

                        <Input label="Re-enter New Password"
                               value={this.state.renewPwd}
                               marginTop={23}
                               onChange={this.handleChangeInput.bind(this, 'renewPwd')}
                               secureTextEntry
                        />

                    <Animated.View style={{position: 'relative', top: this.state.animation.buttonPositionTop}}>
                        <Button marginTop={getPlatformValue('android',25, 38)} width={300} onPress={this.updateAccount.bind(this)}>
                            Save
                        </Button>
                    </Animated.View>
           </Card>
                    </Animated.View>
              <View style={{ height: 60 }} />
            </KeyboardAvoidingView>
                </View>
            
        </ScrollView>
        </BackgroundWrapper>);
    }
}



const styles = StyleSheet.create({
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
    },
    userImage: {
  height: 100,
  width: 100,
  borderRadius: 50,
  marginBottom: 20,
  paddingTop: 40,
  margin: 40,
},
})
