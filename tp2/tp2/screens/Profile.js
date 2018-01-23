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


  

export default class Profile extends React.Component {


    state = {
        loaded:false,
        userKey:null,
        image: null,
        uploading: false,
        image: '',
        email: '',
        profileImg:'',
        firstName: '',
        lastName: '',
        postalCode: '',
        address: '',
        date:'',
        gender: '',
        salary: '',
        maxDate: '',
        minDate:'',

      selectedIndex: 0,
        currentPwd: '',
        newPwd: '',
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
    this.getProfile = this.getProfile.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

updateProfile = () => {
  // I ASSUME UPON LOG IN U SET THE ACCOUNTID le, if not let me know
  //var accountID = '-L2ehhEXY5TO_yDxz_Js';
  var accountID = this.state.userKey;
  
  console.log("USERKEY",this.state.userKey);

  // hardcoded value, CHANGE HERE
  var firstnameInput = this.state.firstName;
  var lastnameInput = this.state.lastName;
  var genderInput = '';

  if(this.state.selectedIndex==0){
    genderInput = 'female';
  }else{
    genderInput = 'male';

  }

  var dobInput = this.state.date;
  var salaryInput = this.state.salary;
  var postalInput = this.state.postalCode;
  var addrInput = this.state.address;
  var image = this.state.image;
  console.log(image);
   
 console.log( firstnameInput, lastnameInput, genderInput, dobInput, salaryInput, postalInput, addrInput);

  // check blank fields
  if(firstnameInput == null || lastnameInput == null || genderInput == null || dobInput == null || salaryInput == null || postalInput == null || addrInput == null){
    console.log("Please fill in all the fields!");
    Alert.alert("Please do not leave any fields blank.");
  }
  else{
  console.log(image);
      // update details
    firebase.database().ref('accounts').child(accountID).update({
      firstname: firstnameInput.toString(),
      lastname: lastnameInput.toString(),
      gender: genderInput.toString(),
      dob: dobInput.toString(),
      salary: salaryInput.toString(),
      postal: postalInput.toString(),
      addr: addrInput.toString(),
      imageUrl: image.toString(),
    }), (error) => {
      if (error) {
        console.log(error.message);
      }else{
        // Success
      }
    }




    Alert.alert("Profile is updated.");
  }  
}


getProfile = async () => {
  // hardcoded value, CHANGE HERE
  //var emailInput = 'KyleGore@gmail.com';

  console.log("HERE TESTING HERE!@#$%^&*(");

  var emailInput = this.state.email;
  var firstname, lastname, gender, dob, salary, postal, addr;
       // this.state.loaded = true;
  // get account details

  var query = firebase.database().ref('accounts').orderByChild('email').equalTo(emailInput);
  query.once( 'value', data => {
    if(!data.exists()){ 
      console.log('account not exists.');
    }else{
      data.forEach(userSnapshot => {
        let userKey = userSnapshot.key;
        var accountData = userSnapshot.val();
         firstname = accountData.firstname;
         lastname = accountData.lastname;
         gender = accountData.gender;
         dob = accountData.dob;
         salary = accountData.salary;
         postal = accountData.postal;
         addr = accountData.addr;
         img = accountData.imageUrl;
         console.log(accountData.imageUrl);
        // this.state.gender = accountData.gender;
        // this.state.date= accountData.dob;
        // this.state.salary = accountData.salary;
        // this.state.postalCode = accountData.postal;
        // this.state.address = accountData.addr;

         console.log( firstname, lastname, gender, dob, salary, postal, addr);
          this.setState({firstName:firstname, lastName:lastname, date:dob, salary:salary, postalCode:postal, address:addr, image:img});
          console.log(this.state.image);
          if(gender == 'male' || gender == 'Male'){
            this.setState({selectedIndex:1});
          }
          else{
            this.setState({selectedIndex:0});
          }

        });
    }
  });

console.log(this.state.firstName);
  // firebase.database().ref('accounts').orderByChild('email').equalTo(emailInput).once('value', function(snapshot) {
  //   var accountData = snapshot.val();
  //   if (accountData){
  //     snapshot.forEach(function(childSnapshot) {
  //       var accountID = childSnapshot.key;
  //       var item = childSnapshot.val();
  //       firstname = item.firstname;
  //        lastname = item.lastname;
  //        gender = item.gender;
  //        dob = item.dob;
  //        salary = item.salary;
  //        postal = item.postal;
  //        addr = item.addr;

  //       // DISPLAY IN COMPONENT BY THESE VALUES
  //       console.log("1");
  //       //console.log(this.state.firstName);
  //       });
  //   }else{
  //     console.log("Account does not exist!");
  //      // this.state.loaded = true;
  //   }

  // });

    this.state.loaded = true;



}


    handleRegister = () => {this.props.navigation.navigate('Main')};
    
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
        console.log(value);
        this.getProfile();
      }
    } catch (error) {
      // Error retrieving data
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    }
    var miny = yyyy-100;
    var minDate = miny+"-"+"01"+"-"+"01";
    var maxDate = yyyy+"-"+mm+"-"+dd;
    this.setState({maxDate:maxDate,minDate:minDate});
    console.log(maxDate);
  }

    static navigationOptions = {
    
    drawerLabel: 'Edit Profile',
    drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="person" size={24} style={{ color: tintColor }} />
  ),
  };

    render() {

  const buttons = ['Female', 'Male'];
  const { selectedIndex } = this.state;
  let { image } = this.state;


if (!this.state.loaded) {
  console.log("loaded? ");
  console.log(this.state.loaded);

      return loadRender.renderLoadingView();
      }

        return ( 
<BackgroundWrapper>
<ScrollView>            
            <View style={styles.loginContainer}>
        <View alignItems='center'>

        { this.renderDefault() }
        { this._maybeRenderImage() }
        { this._maybeRenderUploadingOverlay() }
          <Text onPress={()=>

                Alert.alert(
                  'Choose Profile Picture',
                  null,
                  [
                    {text: 'Choose from Photo Album', onPress:this._pickImage},
                    {text: 'Take from Camera', onPress: this._takePhoto},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  ],
                  { cancelable: true }
                )

          } style={{backgroundColor:'transparent', fontSize:19, fontFamily:'Raleway', fontWeight:'bold', color:'#58585B',textDecorationLine:'underline'}}><FontAwesome color='#58585B' name='edit' size={19} /> Change Profile Picture</Text>


        <StatusBar barStyle="default" />
          </View>
                <Animated.View style={{position: 'relative', top: this.state.animation.headerPositionTop}}>
                </Animated.View>
                <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
                    <Animated.View style={{position: 'relative', left: this.state.animation.formPositionLeft}}>

          <Card title='Personal Particulars' fontFamily='Raleway'>

                        <Input label="First Name"
                               value={this.state.firstName}
                               onChange={this.handleChangeInput.bind(this, 'firstName')}
                        />

                        <Input label="Last Name"
                               value={this.state.lastName}
                               onChange={this.handleChangeInput.bind(this, 'lastName')}
                        />

                      <ButtonGroup
                        textStyle={{ fontSize: 13, fontFamily: 'Raleway' }}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        selectedBackgroundColor='#59c3b5'
                        buttons={buttons}
                      />

                    <DatePicker
                            style={{width: 'auto', paddingTop:15}}
                            date={this.state.date}
                            mode="date"
                            placeholder="Date of Birth"
                            format="YYYY-MM-DD"
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                              },
                              dateInput: {
                                marginLeft: 36
                              }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                          />

                        <Input label="Salary"
                               value={this.state.salary}
                               onChange={this.handleChangeInput.bind(this, 'salary')}
                        />
                        <Input label="Postal Code"
                               value={this.state.postalCode}
                               onChange={this.handleChangeInput.bind(this, 'postalCode')}
                        />

                        <Input label="Address"
                               value={this.state.address}
                               onChange={this.handleChangeInput.bind(this, 'address')}
                        />       
        </Card> 

                    </Animated.View>
                    <Animated.View style={{position: 'relative', top: this.state.animation.buttonPositionTop}}>

                        <Button marginTop={getPlatformValue('android',25, 38)} width={300} onPress={this.updateProfile.bind(this)}>
                            Update Profile
                        </Button> 
                    </Animated.View>
              <View style={{ height: 60 }} />
            </KeyboardAvoidingView>
                </View>
        </ScrollView>
             <Button onPress={this.handleRegister.bind(this)}></Button>
        </BackgroundWrapper>
            );
    }

renderDefault =()=>{

  if(this.state.image==''|| this.state.image == null){
    console.log(this.state.image);
    return(

        <Image source={require('../assets/images/sjkUserImage.jpg')} style={styles.userImage}/>
    );
  }

}

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator
            color="#fff"
            animating
            size="large"
          />
        </View>
      );
    }
  }

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
        <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
          <Image
            source={{uri: image}}
            style={styles.userImage}
          />
        </View>
    );
  }


handleChangeProfilePic = () => {
    Alert.alert(
  'Choose Profile Picture',
  null,
  [
    {text: 'Choose from photo album', onPress: () => this._pickImage},
    {text: 'Take from camera', onPress: () => this._takePhoto},
    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  ],
  { cancelable: true }
)
}
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    this._handleImagePicked(pickerResult);
  }

  
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    this._handleImagePicked(pickerResult);
  }


  _handleImagePicked = async (pickerResult) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({uploading: true});

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        console.log({ uploadResponse });
      console.log({ uploadResult });
        this.setState({image: uploadResult.url});
      }
    } catch(e) {
      console.log({uploadResponse});
      console.log({uploadResult});
      console.log(this.state.image);
      console.log({e});
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({uploading: false});
    }
  }
}

async function uploadImageAsync(uri) {
   let apiUrl = 'http://13.250.7.67:8000/scanning/image/';
   //http://13.229.81.160/scanning/image/  //paid AWS

 //   if (Constants.isDevice) {
 //     apiUrl = `http://13.250.7.67:8000/scanning/detect/`;
 //   } else {
 //     apiUrl = `http://localhost:19000/upload`
 // }
  let uriParts = uri.split('.');
  let fileType = uri[uri.length - 1];
  let formData = new FormData();
  formData.append('image', {
    uri,
    name: `image.jpg`,
    filename: `image.jpg`,
    type: 'image/jpeg'
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: getPlatformValue('android', 10, 30),
    },
    formContainer: {
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
