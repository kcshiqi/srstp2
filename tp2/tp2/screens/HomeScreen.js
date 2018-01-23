import { DrawerNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/firebase';
import Achievements from '../screens/DashboardScreen';
import Receipts from '../screens/ReceiptList';
import EditReceipt from '../screens/EditReceipt';
import React from 'react';
import loadRender from '../utilities/loadRender.js';
import BackgroundWrapper from '../components/partials';
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
import { MonoText } from '../components/StyledText';
import {
  Card,
  ButtonGroup,
  Tile,
  Grid,
  Col,
  Row,
  Icon,
  List,
  ListItem,
  Avatar
} from 'react-native-elements';
import {
  AsyncStorage,
  ActivityIndicator,
  Clipboard,
  Share,
  StatusBar,
} from 'react-native';
import Exponent, { Constants, ImagePicker, registerRootComponent } from 'expo';

const recList = [
  {
    name: 'SUCCESSFUL MISSIONS',
    avatar_url: '',
    subtitle: 'View all your saved receipts!',
    path: 'Receipts',
  },
  {
    name: 'ABOUT YOURSELF',
    avatar_url: '',
    subtitle: 'Find out about your spending habits!',
    path: 'Achievements',
  },
];

export default class HomeScreen extends React.Component {

  //change state to rerender screen
  state = {
    image: '',
    profileImage: '',
    uploading: false,
    receiptCounter: '-1',
    receiptData: null,
    email: '', //retrieve from login page
    userKey: '',
    user: '',
  };

  //top bar style
  static navigationOptions = {
    headerTitleStyle:{fontFamily:'American Typewriter',  fontWeight: 'normal'  },
    title:            <Text style={{textAlign: 'center', color: 'white', fontFamily: 'Pacifico', fontSize: 20, }}>
            Smart Receipt
            </Text>,
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="home" size={24} style={{ color: tintColor }} />
  ),
  };

  constructor() {
    super();

  }
  //function to get number of receipts
  getReceiptCounter = () => {
    // console.log(this.props['user']+'  AND  '+this.state.userKey);
    // hardcoded key for testing purpose
    // var accountKey = '-Ks8mW__nETimDbu6jP5';
    //var accountKey = AsyncStorage.getItem('userSession');
    // var accountKey = this.state.userKey;

      // get unique push ID from session



    // AsyncStorage.getItem("userSession").then((value) => {
    //     this.setState({"userKey": value});
    // var accountKey = this.state.userKey;
    // }).done();

    // var accountKey = this.props.userKey;

    //console.log("here:"+this.props.navigation.state.params.userKey);
    // console.log("here:"+userKey);
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
          var image = accountData.imageUrl;
          this.setState({user:username});
          this.setState({profileImage:image});

          });
      }
    });


    promiseKey.then((counter) => {
      console.log('ACCOUNTID: ' + accountKey + ' ,NO.OF RECEIPT: ' + counter);
      //update state
      this.setState({receiptCounter:counter});
    });
  }

  //choose photo album / camera (for adding receipts)
  _handlePhoto = () => {
        if(Platform.OS == 'ios') {
              Alert.alert(
            'Upload Receipt',
            null,
            [
              {text: 'Choose from Photo Album', onPress: () => this._pickImage()},
              {text: 'Take from Camera', onPress: () => this._takePhoto()},
              {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
            ],
            { cancelable: true }
          );

        }else{
              Alert.alert(
            'Upload Receipt',
            null,
            [
              {text: 'Cancel', onPress: () => console.log('Cancelled'), style: 'cancel'},
              {text: 'Take from Camera', onPress: () => this._takePhoto()},
              {text: 'Choose from Photo Album', onPress: () => this._pickImage()},
            ],
            { cancelable: true }
          );


        }
  }

  //camera
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  //photo album
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });
    this._handleImagePicked(pickerResult);
  }

  //upload to server
  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true }); //uploading true to go into loading screen
      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        console.log({ uploadResponse });
        console.log({ uploadResult });
        this.setState({ image: uploadResult.location });
        this.setState({ receiptData: uploadResult });
        // console.log(this.props.navigation);

      }
        // this.handleReceipt();

    } catch (e) {
      console.log({ uploadResponse });
      //console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false }); //done uploading
    }
  }


  renderDefault = () =>{

    //no profile image, display default.
    if(this.state.profileImage=='' || this.state.profileImage == null){
      return(
          <Image 
            source={require('../assets/images/sjkUserImage.jpg')}
            style={styles.userImage} 
          />
      );
    }

  }

  _maybeRenderImage = () => {
    let { profileImage } = this.state;
    if (!profileImage) {
      return;
    }

    return (
        <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
          <Image
            source={{uri: profileImage}}
            style={styles.userImage}
          />
        </View>
    );
  }
  getCredentials = async () => {


    try {
      const value = await AsyncStorage.getItem('userSession');
      if (value !== null){
        // We have data!!
        this.setState({userKey:value});
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }

        try {
      const value = await AsyncStorage.getItem('userEmail');
      if (value !== null){
        // We have data!!
        this.setState({email:value});
        this.getReceiptCounter();
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);

    }

  }


  // handleReceipt = () => {this.navigation.navigate('EditReceipt', {receiptData:this.state.receiptData})};

  handleReceipt(){
    // var navigation = this.navigation;
    // console.log("NAVIGATION HERE");
    // console.log(navigation);

    // console.log(this.props.navigation);
    // console.log(this.state.receiptData);
    // console.log(this.state.receiptData['merchantName']);
    var param = this.state.receiptData;
    this.props.navigation.navigate('EditReceipt', {receiptData:param});

  }

  componentDidMount() {

    this.getCredentials();

  }

  render() {


    //if receipt counter is empty or till uploading, display loading screen
    if (this.state.receiptCounter=='-1' || this.state.uploading) { 
      return loadRender.renderLoadingView();
    }
    else if(this.state.receiptData!=null){  //if receive receipt data from server, go to edit receipt page & pass data over using props

      this.handleReceipt();

      // console.log("here");
      // return(
      //     <EditReceipt navigation={this.props.navigation}
      //     receiptData={
      //       this.state.receiptData
      //     }/>
      //   );
    }

    return (
      <Image source={require('../assets/images/bg.jpg')} style={styles.backgroundImage}>
  
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            { this.renderDefault() }
            { this._maybeRenderImage() }
            <Text style={styles.helloUser}>
              {'Hello, '+this.state.user.toUpperCase()}
            </Text>

            <Text style={styles.heading}>You have submitted <Text style={styles.boldUnderline}>{this.state.receiptCounter} receipts</Text> for this month. Good Job!
            </Text>
          </View>
          <View style={styles.cardContainer}>
            <Card borderColor='#84D3EB' backgroundColor='rgba(255,255,255,0.7)'>
              <List borderTopWidth={0} borderBottomWidth={0} backgroundColor='transparent' style={styles.listStyle}>
                <ListItem
                  key = {0}
                  roundAvatar
                  onPress={() => this._handlePhoto()}
                  title='START MISSION'
                  subtitle='Snap 3 Receipts!'
                  fontFamily='Raleway'
                  titleStyle={{paddingLeft: 10,fontWeight: 'bold', fontSize: 18}}
                  subtitleStyle={{paddingLeft: 10}}
                  avatarContainerStyle = {{height: 50, width: 50}}
                  avatarStyle = {{height: 50, width: 50}}
                  containerStyle= {{borderBottomWidth: 0}}
                  wrapperStyle= {{borderBottomWidth: 0}}
                  borderBottomWidth= '0' 
                />
              </List>
            </Card>

            {recList.map((l, i) => (
            <Card borderColor='#84D3EB' backgroundColor= 'rgba(255,255,255,0.7)' key={i}>
              <List borderTopWidth={0} borderBottomWidth={0} backgroundColor='transparent' style={styles.listStyle} key={i}>
                <ListItem
                  roundAvatar
                  key = {i}
                  //avatar={{ uri: l.avatar_url }}
                  onPress={() => this.props.navigation.navigate(l.path, { userKey: this.state.userKey })}
                  userKey
                  title={l.name}
                  subtitle={l.subtitle}
                  fontFamily='Raleway'
                  titleStyle={{paddingLeft: 10,fontWeight: 'bold', fontSize: 18}}
                  subtitleStyle={{paddingLeft: 10}}
                  avatarContainerStyle = {{height: 50, width: 50}}
                  avatarStyle = {{height: 50, width: 50}}
                  containerStyle= {{borderBottomWidth: 0}}
                  wrapperStyle= {{borderBottomWidth: 0}}
                  borderBottomWidth= '0' 
                />
              </List>
            </Card>
            ))}


            </View>
        </View>
      </Image>
    );
  }
}
//upload receipt to server for processing
async function uploadImageAsync(uri) {
  
  //let apiUrl = 'http://13.250.7.67:8000/scanning/detect/' //free AWS
  let apiUrl = 'http://13.229.81.160/scanning/detect/' //paid AWS

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
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
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    //backgroundColor: '#5e08dd',
    //backgroundColor: '#9dc0f9',
    backgroundColor: '#135899',
  },
  imageContainer:{
    flex:4,
    alignItems:'center',
    justifyContent:'center',
  },
  container:{
    flex:11,
    justifyContent: 'space-around',
  },
  cardContainer:{
    flex:7,
    justifyContent: 'space-around',
  },
  heading: {
    color: 'grey',
    marginTop: 10,
    padding: 5,
    fontSize: 18,
    fontFamily: 'Raleway',
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
  userImage: {

  height: 100,
  width: 100,
  borderRadius: 50
},
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
  helloUser: {
    backgroundColor:'transparent',
    fontSize:19, 
    alignSelf: 'center',
    fontFamily:'Raleway', 
    fontWeight:'bold', 
    color:'#58585B'
  },
  boldUnderline: {
    textDecorationLine:'underline',
    fontWeight:'bold', 
    color:'#84D3EB'
  }
});
