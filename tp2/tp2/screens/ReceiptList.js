//Landing page
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebase/firebase';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListView,
  View,
  ActivityIndicator,
  AsyncStorage,
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
  SearchBar,
} from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import navigation from 'react-navigation'
var receiptList = [];
var receiptNo = '5';
export default class ReceiptList extends React.Component {

  state = {
    test:false,
    noReceipts:false,
    email:'',
    userKey: '',
    //userKey: this.props.navigation.state.params.userKey,
  };

  static navigationOptions = {
      headerMode: 'none',
      drawerLabel: 'Receipts',
      drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="receipt" size={24} style={{ color: tintColor }} />),
  };

  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      selectedIndex: 0,
      value: 0.5,
    };

    this.updateIndex = this.updateIndex.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
  getCredentials = async () => {
    try {
      const value = await AsyncStorage.getItem('userSession');
      if (value !== null){
        // We have data!!
        this.setState({userKey:value});
    this.getAllReceipt();

      }
    } catch (error) {
      // Error retrieving data
              console.log("ERROROORORORRORO");
    }

        try {
      const value = await AsyncStorage.getItem('userEmail');
      if (value !== null){
        // We have data!!
        this.setState({email:value});
      }
    } catch (error) {
      // Error retrieving data
    }

  }
  getAllReceipt = () => {
      // hardcoded key for testing purpose
      //var accountKey = '-L1Cf_9IoQj8QpMKbVeP';
      //var accountKey = AsyncStorage.getItem('userSession');
      //var accountKey = this.props.navigation.state.params.userKey;
      var accountKey = this.state.userKey;
      var datasetarr = [];

      console.log("ACCOUNT KEY  >>>> "+accountKey);

      let promiseKey = new Promise((resolve, reject) => {
        var query = firebase.database().ref('receipts').child(accountKey);
        query.once('value').then(data => {
          data.forEach(snapshot => {
            var receiptData = snapshot.val();
            var receiptKey = snapshot.key;
            var receiptNumber = receiptData.receiptNumber;
            var date = receiptData.date;
            var totalAmount = receiptData.totalAmount;
            var merchantName = receiptData.merchantName;
            var branchName = receiptData.branch.branchName;
            datasetarr.push({receiptNumber: receiptNumber, receiptKey: receiptKey, date: date, totalAmount: totalAmount, merchantName: merchantName, branchName: branchName});
          });
          resolve(datasetarr);
        });
      });

      promiseKey.then((arr) => {
        receiptList = []
        if(arr.length==0){

          this.state.noReceipts = true;

        }
        for(var i = 0; i < arr.length; i++){
          console.log('KEY: ' + arr[i].receiptKey + ' ,RECEIPTNO: ' + arr[i].receiptNumber + ' ,DATE: ' + arr[i].date + ' ,TOTAL: ' + arr[i].totalAmount + ' ,MERCHANT: ' + arr[i].merchantName + ' ,BRANCH: ' + arr[i].branchName);
          this.setState({array:arr});
          receiptList.push(
            {
              date: 'Date: '+arr[i].date,
              name: 'Receipt No.: '+arr[i].receiptNumber,
              path: arr[i].receiptKey,
            })
        }
        this.setState({test:true});
      });
    }

  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={true}
        style={[styles.centering, {height: 80}]}
        size="large"
      />
    );
  }
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  renderRow(rowData, sectionID) {
    return (
      <ListItem
        key={sectionID}
        onPress={log}
        title={rowData.title}
        icon={{ name: rowData.icon }}
      />
    );
  }

  componentDidMount() {
    this.getCredentials();
  }

  render() {

  const { selectedIndex } = this.state;

    if (!this.state.test) {
      return this.renderLoadingView();
    }

    if(this.state.noReceipts){

      return (

<Image source={require('../assets/images/bg.jpg')} style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}>

        <View style={styles.headerContainer}>
          <FontAwesome color="#84D3EB" style={{backgroundColor:'transparent'}} name="book" size={62} />
          <Text style={styles.heading}>Receipts</Text>
        </View>

          <Card fontFamily='Raleway' fontSize='25' borderColor='#84D3EB' >
            <Text >No receipts captured yet.</Text>
          </Card>

        </ScrollView>
        </Image>

        );

    }

    return (

<Image source={require('../assets/images/bg.jpg')} style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}>

        <View style={styles.headerContainer}>
          <FontAwesome color="#84D3EB" style={{backgroundColor:'transparent'}} name="book" size={62} />
          <Text style={styles.heading}>Receipts</Text>
        </View>

          <Card fontFamily='Raleway' fontSize='25' borderColor='#84D3EB'>


            <List>
              {receiptList.map((l, i) => (
                <ListItem
                  key={i}
                  onPress={() => this.props.navigation.navigate('ViewReceipts', {key: l.path})}
                  title= {l.date}
                  subtitle = {l.name}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18}}
                />
              ))}
            </List>
          </Card>

        </ScrollView>
        </Image>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Raleway',
  },
  contentContainer: {
    paddingTop: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    color: '#58585B',
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Raleway',
    backgroundColor: 'transparent',
  },
  welcomeImage: {
    width: 140,
    height: 38,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null,
  },
});
