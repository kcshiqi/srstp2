import React from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import navigation from 'react-navigation'
import {Input, Button, Logo, Heading, BackgroundWrapper} from '../components';
import loadRender from '../utilities/loadRender.js';

var paymentList = [];
var receiptDetList = [];
var itemList = [];

export default class HomeScreen extends React.Component {

   static navigationOptions = {
      headerMode: 'none',
      header: null,
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
      loaded: false,
    };

    this.updateIndex = this.updateIndex.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
getReceiptDetails = () => {
    // hardcoded ID for testing purpose
    //var receiptKey = '-KrEJCttj3gjUOIo1VYR'; 
    var receiptKey = this.props.navigation.state.params.key;//pass receipt key here
    
    console.log('test'+receiptKey);
    
    var resultObject;

    // get receipt details
    let promiseReceiptKey = new Promise((resolve, reject) => {
      var query = firebase.database().ref('receipts');
      query.once('value').then(data => {   
        data.forEach(snapshot => {
          snapshot.forEach(childSnapshot => {
            // if matching receipt ID, check for date
            if(childSnapshot.key == receiptKey){
              var receiptDetail = childSnapshot.val();
              // branch details
              var merchantName = receiptDetail.merchantName;
              var branchName = receiptDetail.branch.branchName;
              var branchAddress = receiptDetail.branch.branchAddress;

              // currency details
              var currencyName = receiptDetail.currency.currencyName;
              var currencySymbol = receiptDetail.currency.currencySymbol;

              // receipt details
              var receiptNumber = receiptDetail.receiptNumber;
              var date = receiptDetail.date;
              var timeIssued = receiptDetail.timeIssued;
              var totalAmount = receiptDetail.totalAmount;
              var amountPaid = receiptDetail.amountPaid;
              var changeGiven = receiptDetail.changeGiven;
              var discount = receiptDetail.discount;
              var paymentType = receiptDetail.paymentMethod;
              var cardNumber;
              if(paymentType == 'cash'){
                cardNumber = '';
              }else{
                cardNumber = receiptDetail.cardNumber;
              }
               
              resultObject = {merchantName: merchantName, branchName: branchName, branchAddress: branchAddress,
                              currencyName: currencyName, currencySymbol: currencySymbol,
                              receiptNumber: receiptNumber, date: date, timeIssued: timeIssued, totalAmount: totalAmount, amountPaid: amountPaid, changeGiven: changeGiven,
                              discount: discount, paymentType: paymentType, cardNumber: cardNumber};
              resolve(resultObject);
            }
          });
        });
      });
    });

    promiseReceiptKey.then((resultObject) => {
      console.log('-----------------------RECEIPT DETAIL-------------------------');
      console.log('MERCHANT: ' + resultObject.merchantName + ' ,BRANCH: ' + resultObject.branchName + ' ,ADDR: ' + resultObject.branchAddress + ' ,CURRENCY: ' + resultObject.currencyName + ' ,SYMBOL: ' + resultObject.currencySymbol + ' ,RECEIPTNO: ' + resultObject.receiptNumber + ' ,DATE: ' +
                  resultObject.date + ' ,TIME: ' + resultObject.timeIssued + ' ,TOTAL: ' + resultObject.totalAmount + ' ,PAID: ' + resultObject.amountPaid + ' ,GIVEBACK: ' + resultObject.changeGiven + ' ,DISCOUNT: ' + resultObject.discount + ' ,PAYMENTTYPE: ' + resultObject.paymentType + ' ,CARDNO: ' + resultObject.cardNumber);
      
receiptDetList=[]
itemList=[]
paymentList=[]
    receiptDetList.push(
      {
        receiptNo: resultObject.receiptNumber,
        merchName: resultObject.merchantName,
        brAddr: resultObject.branchAddress,
        date: resultObject.date,
      },
    )

    paymentList.push(
      {
        payment: resultObject.paymentType.toUpperCase(),
        total: resultObject.currencySymbol+resultObject.totalAmount,
        member: 'N.A.',
        discount: 'N.A.',
      },
    )

      console.log('-----------------------RECEIPT ITEMS DETAIL-------------------');
      // get receipt item details
      var datasetarr = [];
      let promiseList = new Promise((resolve, reject) => {
      // get receipt items by receiptID
      var query = firebase.database().ref('receiptItems').orderByChild('receiptID').equalTo(receiptKey);
        query.once( 'value', data => {
          var promises = []; 

          data.forEach(snapshot => {
            var receiptItemDetail = snapshot.val();
            var unitprice = receiptItemDetail.price;
            var quantity = receiptItemDetail.quantity;
            var type = receiptItemDetail.type;
            var brand = receiptItemDetail.brand;
            var category = receiptItemDetail.category;
            var itemKey = receiptItemDetail.itemID;
                
            // get item name by itemID
            var query = firebase.database().ref('items').child(itemKey);
            var promise = query.once('value');
            promises.push(promise);

            promise.then(data => { 
              var itemDetail = data.val();
              var itemName = itemDetail.name;
              // push data to array
              datasetarr.push({itemName: itemName, category: category, type: type, brand: brand, price: unitprice, quantity: quantity});
            });
          });
          // wait till all promises are finished then resolve the result array
          Promise.all(promises).then(() => resolve(datasetarr)); 
        });             
      });

      promiseList.then((arr) => {
        for(var i = 0; i < arr.length; i++){
          console.log('NAME: ' + arr[i].itemName + ' ,CATEGORY: ' + arr[i].category + ' ,TYPE: ' + arr[i].type + ' ,BRAND: ' + arr[i].brand + ' ,PRICE: ' + arr[i].price + ' ,QTY: ' + arr[i].quantity);
        

        itemList.push(
          {
            item: arr[i].itemName,
            qty: arr[i].quantity,
            price: resultObject.currencySymbol+arr[i].price,
          },
        )

        }

        this.setState({loaded:true})
      });
    });
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

    handleBack = () => {this.props.navigation.goBack(null)};


  componentDidMount() {
    this.getReceiptDetails();
  }

  render() {
  const { selectedIndex } = this.state;

    if (!this.state.loaded) {
      return loadRender.renderLoadingView();
    }
    return (
 <BackgroundWrapper iconLeft="arrow-left-circle" color="#58585B" onPressIcon={this.handleBack.bind(this)}>
<Image source={require('../assets/images/bg.jpg')} style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}>

        <View style={styles.headerContainer}>
          <FontAwesome color="#84D3EB" style={{backgroundColor:'transparent'}} name="book" size={62} />
          <Text style={styles.heading}>Receipt Details</Text>
        </View>

          <Card title='TRANSACTION DETAILS' fontFamily='Raleway' fontSize='25' borderColor='#84D3EB' >
            
              {receiptDetList.map((l, i) => (<List key={'90'}  borderTopWidth= {0}>
                <ListItem
                  hideChevron
                  key={'20'}
                  title={'Merchant Name'}
                  subtitle= {l.merchName}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                  hideChevron
                  key = {'21'}
                  title={'Branch Address'}
                  subtitle= {<Text style={{textAlign:'right', fontFamily:'Raleway', fontSize:16, color:'grey'}}>{l.brAddr}</Text>}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                  hideChevron
                  key={'22'}
                  title={'Receipt Number'}
                  subtitle= {l.receiptNo}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                key= {'23'}
                  hideChevron
                  title={'Date of Transaction'}
                  subtitle= {l.date}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
            </List>
              ))}
          </Card>

 <Card title='ITEMS DETAIL' fontFamily='Raleway' fontSize='25' borderColor='#84D3EB'>
            <List key={'101'}  borderTopWidth= {0}>
              {itemList.map((l, i) => (
                <ListItem
                  hideChevron
                  key={i}
                  title={l.item}
                  subtitle= {<Text style={{textAlign:'right', fontFamily:'Raleway', fontSize:16, color:'grey'}}>{'Quantity : ' + l.qty + ' | ' + 'Price : ' + l.price}</Text>}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
              ))}
            </List>
          </Card>

 <Card title='PAYMENT DETAILS' fontFamily='Raleway' fontSize='25' borderColor='#84D3EB'>
              {paymentList.map((l, i) => (
            <List 
                  key={'122'} borderTopWidth= {0}>
                <ListItem
                  hideChevron
                  key={'111'}
                  title={'Payment Type'}
                  subtitle= {l.payment}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                  hideChevron
                  key = {'181'}
                  title={'Discount'}
                  subtitle= {l.discount}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                  hideChevron
                  key={'121'}
                  title={'Membership'}
                  subtitle= {l.member}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
                <ListItem
                key= {'131'}
                  hideChevron
                  title={'Total Price'}
                  subtitle= {l.total}
                  fontFamily='Raleway'
                  titleStyle={{
                    fontSize: 18, fontWeight: 'bold',}}
                  borderBottomWidth= {0}
                  borderTopWidth= {0}
                  subtitleStyle={{textAlign:'right'}}
                />
            </List>
              ))}
          </Card>

          <View style={{ height: 60 }} />
        </ScrollView>
        </Image>
        </BackgroundWrapper>
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
