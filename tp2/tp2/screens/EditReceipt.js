import React, {Component, PropTypes} from 'react';
import { DrawerNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    View, Text, Image, StyleSheet, Animated, InteractionManager, Alert, ScrollView,StatusBar,
  ActivityIndicator, Picker, AsyncStorage, KeyboardAvoidingView
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Input, Button, Logo, Heading, BackgroundWrapper, Status} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getPlatformValue} from '../utilities';
import loadRender from '../utilities/loadRender.js';
import Main from '../screens/HomeScreen';
import firebase from '../firebase/firebase';
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

export default class EditReceipt extends React.Component {
     static navigationOptions = {
        header: {

          visible:false,

        }
    };
    state = {

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

    handleChangeItemList(type, text, index){
      var itemList = this.state.itemList;
        itemList[index].item = "this";
        console.log(index);
        this.setState({itemList:itemList});
    }

  constructor() {
    super();

    state = {
      receiptData: null, //receive from homescreen
      merchant: null,
      branch: null,
      receiptNo: null,
      transactionDate: null,
      subTotal: null,
      total: null,
      paymentType: null,
      amountPaid: null,
      member: null,
      noItemsPurchased: null,
      change: null,
      success: false,
      itemList:null,
    }
    this.updateIndex = this.updateIndex.bind(this);

  }

    
    //ADD NEW RECEIPT FUNCTION HERE.
addNewReceipt = () => {

      // var merchantName = 'Giant';
      // var branchName = 'Ang Mo Kio 525 Branch';
      // var branchAddress = 'Blk 525 Ang Mo Kio Avenue 10 #01-2401/2403/2405 Singapore 560525';
      // var currencyName = 'Singapore Dollar';
      // var currencySymbol = '$';

      // var receiptNumber = 'A543414124122';
      // var receiptDate = '2017/07/20';
      // var receiptIssuedTime = '5.00pm';
      // var receiptTotalAmount = 63.40;
      // var receiptPaymentType = 'cash'; // cash/creditcard/membershipcard
      // var cardNumber = '1234-5678-9911-0000'; // card number for creditcard or membershipcard
      // var amountPaid = 70.00;
      // var changeGiven = 6.60;
      // var discount = false;

      // var items = [
      // {name: 'NATURES WONDERS Baked Almonds 220g', category: 'food', type: 'snacks', price: 6.90, quantity: 2, brand: 'Natures Wonders'},
      // //{name: 'CHANGYOU Egg Pull Noodle 1kg', category: 'food', type: 'noodles & pasta', price: 3.30, quantity: 2, brand: 'Changyou'},
      // {name: 'FANTASTIC Rice Crackers - Seaweed 100g', category: 'food', type: 'bisuits & cakes', price: 2.70, quantity: 2, brand: 'Fantastic'},
      // //{name: 'LONDON Jumbo Chocolate Roll 12sX35g', category: 'food', type: 'bisuits & cakes', price: 2.95, quantity: 4, brand: 'London'},
      // //{name: 'JACK N JILL Potato Chips - Barbecue 75g', category: 'food', type: 'snacks', price: 1.40, quantity: 4, brand: 'Jack N Jill'},
      // {name: 'AYAM BRAND Baked Bean Hi-Fibre 425g', category: 'food', type: 'canned food', price: 1.50, quantity: 4, brand: 'Ayam Brand'},
      // {name: 'OREO Sandwich Biscuits - Golden 264g', category: 'food', type: 'bisuits & cakes', price: 1.95, quantity: 4, brand: 'Oreo'},
      // //{name: 'CRAB Ground Pepper Mixture 300g', category: 'food', type: 'cooking needs', price: 6.50, quantity: 1, brand: 'Crab'},
      // //{name: 'AMOCAN Singapore Chicken Curry Paste 340g', category: 'food', type: 'cooking needs', price: 7.20, quantity: 1, brand: 'Amocan'},
      // {name: 'APOLLO Blueberry Layer Cake 24s', category: 'food', type: 'bisuits & cakes', price: 3.20, quantity: 4, brand: 'Apollo'},
      // {name: 'JACK N JILL Roller Coaster Barbeque Flavour 100g', category: 'food', type: 'snacks', price: 1.70, quantity: 2, brand: 'Jack N Jill'},
      // {name: 'LONDON Potato Chips Barbeque 160g', category: 'food', type: 'snacks', price: 3.55, quantity: 4, brand: 'London'},
      // ]

      var merchantName = this.state.merchant;
      var branchName = "";
      var branchAddress = this.state.branch;
      var currencyName = 'Singapore Dollar';
      var currencySymbol = '$';

      var receiptNumber = this.state.receiptNo;
      var receiptDate = this.state.transactionDate;
      var receiptIssuedTime = "";
      var receiptTotalAmount = this.state.total;
      var receiptPaymentType = this.state.paymentType; // cash/creditcard/membershipcard
      var cardNumber = this.state.member; // card number for creditcard or membershipcard
      var amountPaid = this.state.amountPaid;
      var changeGiven = this.state.change;
      var discount = false;

      // var items = [
      // {name: 'NATURES WONDERS Baked Almonds 220g', category: 'food', type: 'snacks', price: 6.90, quantity: 2, brand: 'Natures Wonders'},
      // //{name: 'CHANGYOU Egg Pull Noodle 1kg', category: 'food', type: 'noodles & pasta', price: 3.30, quantity: 2, brand: 'Changyou'},
      // {name: 'FANTASTIC Rice Crackers - Seaweed 100g', category: 'food', type: 'bisuits & cakes', price: 2.70, quantity: 2, brand: 'Fantastic'},
      // //{name: 'LONDON Jumbo Chocolate Roll 12sX35g', category: 'food', type: 'bisuits & cakes', price: 2.95, quantity: 4, brand: 'London'},
      // //{name: 'JACK N JILL Potato Chips - Barbecue 75g', category: 'food', type: 'snacks', price: 1.40, quantity: 4, brand: 'Jack N Jill'},
      // {name: 'AYAM BRAND Baked Bean Hi-Fibre 425g', category: 'food', type: 'canned food', price: 1.50, quantity: 4, brand: 'Ayam Brand'},
      // {name: 'OREO Sandwich Biscuits - Golden 264g', category: 'food', type: 'bisuits & cakes', price: 1.95, quantity: 4, brand: 'Oreo'},
      // //{name: 'CRAB Ground Pepper Mixture 300g', category: 'food', type: 'cooking needs', price: 6.50, quantity: 1, brand: 'Crab'},
      // //{name: 'AMOCAN Singapore Chicken Curry Paste 340g', category: 'food', type: 'cooking needs', price: 7.20, quantity: 1, brand: 'Amocan'},
      // {name: 'APOLLO Blueberry Layer Cake 24s', category: 'food', type: 'bisuits & cakes', price: 3.20, quantity: 4, brand: 'Apollo'},
      // {name: 'JACK N JILL Roller Coaster Barbeque Flavour 100g', category: 'food', type: 'snacks', price: 1.70, quantity: 2, brand: 'Jack N Jill'},
      // {name: 'LONDON Potato Chips Barbeque 160g', category: 'food', type: 'snacks', price: 3.55, quantity: 4, brand: 'London'},
      // ]

      var items=[];

        for(let i = 0; i < this.state.noItemsPurchased; i++){
          items.push(
            {
              name: this.props['receiptData']['itemList'][i],
              quantity: this.props['receiptData']['quantityList'][i],
              price:this.props['receiptData']['priceList'][i],
              category:this.props['receiptData']['categoryList'][i], 
            },
          )
        }


      // use promises to return response from asynchronous call

      // check if merchant exists before add
      let promiseMerchantKey = new Promise((resolve, reject) => {
        firebase.database().ref('merchants').orderByChild('merchantName').equalTo(merchantName).once('value', function(snapshot) {
          var merchantData = snapshot.val();
          if (merchantData){
            console.log('merchant exists');
            // get the matching merchant unique push ID
            snapshot.forEach(function(childSnapshot) {
              var item = childSnapshot.val();
              item.key = childSnapshot.key;
              resolve(item.key);
            });
          }else{
            // get newly created merchant unique push ID
            var merchantKey = firebase.database().ref('merchants').push({
              merchantName : merchantName
            }).getKey();

            resolve(merchantKey);
          }
        });
      });

      // check if branch for merchant exists before add
      let promiseBranchKey = new Promise((resolve, reject) => {

        promiseMerchantKey.then((merchantKey) => {
          firebase.database().ref('merchants').child(merchantKey).child('branches').orderByChild('branchAddress').equalTo(branchAddress).once('value', function(snapshot) {
            var branchData = snapshot.val();
            if (branchData){
              console.log('branch exists');
              // get the matching branch unique push ID
              snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                resolve(item.key);
              });
            }else{
                // get newly created branch unique push ID
                var branchKey = firebase.database().ref('merchants').child(merchantKey).child('branches').push({
                  branchName : branchName,
                  branchAddress : branchAddress
                }).getKey();
                resolve(branchKey);
              }
            });
        });
      });

      // check if currency symbol exist before add
      let promiseCurrencyKey = new Promise((resolve, reject) => {
        firebase.database().ref('currencies').orderByChild('currencySymbol').equalTo(currencySymbol).once('value', function(snapshot) {
          var currencyData = snapshot.val();
          if (currencyData){
            console.log('currency exists.');
            // get the matching currency unique push ID
            snapshot.forEach(function(childSnapshot) {
              var item = childSnapshot.val();
              item.key = childSnapshot.key;
              resolve(item.key);
            });
          }else{
            // get newly created currency unique push ID
            var currencyKey = firebase.database().ref('currencies').push({
              currencyName : currencyName,
              currencySymbol : currencySymbol
            }).getKey();
            resolve(currencyKey);
          }
        });
      });

      // get unique push ID from session
      let promiseUserKey = new Promise((resolve, reject) => {
        AsyncStorage.getItem('userSession').then((keyValue) => {
          resolve(keyValue);
        }, (error) => {
          console.log(error);
        });
      });

      // check if receipt exists before add
      let promiseReceiptKey = new Promise((resolve, reject) => {
        promiseUserKey.then((userKey) => {
          if(userKey != null){

            // temporary array to store all the receipt dates and times for logged in user
            var datelist = [];
            // get all receipt dates and times
            firebase.database().ref('receipts').child(userKey).orderByChild('date').equalTo(receiptDate).once('value', function(snapshot) {
              var receiptData = snapshot.val();
              if (receiptData){
                snapshot.forEach(function(childSnapshot) {
                  // get receipt issued time from firebase
                  var data = childSnapshot.val();
                  data.timeIssued = childSnapshot.val().timeIssued;
                  data.date = childSnapshot.val().date;
                  
                  datelist.push({date: data.date, time: data.timeIssued});
                });
              }

              var insert = false;

              // check by date followed by timereceiptDate
              for(let i = 0; i < datelist.length; i++){
                if(datelist[i].date == receiptDate){
                  // condition for same date same time, do not insert
                  if(datelist[i].time == receiptIssuedTime){
                    
                    insert = true; //CHANGE TO FALSE!!!
                  }
                  // condition for same date different time, insert
                  else if(datelist[i].time != receiptIssuedTime){
                    insert = true;
                  }
                }
              }

              // condition for different date, insert
              if(datelist.length == 0){
                insert = true;
              }

              if(insert == true){
                // add new receipt, check payment method & insert data differently
                if(receiptPaymentType == 'cash'){
                  var receiptKey = firebase.database().ref('receipts').child(userKey).push({
                    receiptNumber: receiptNumber,
                    date: receiptDate,
                    timeIssued: receiptIssuedTime,
                    merchantName: merchantName,
                    branch : {
                      branchName : branchName,
                      branchAddress : branchAddress
                    },
                    currency : {
                      currencyName : currencyName,
                      currencySymbol : currencySymbol
                    },
                    totalAmount: receiptTotalAmount,
                    paymentMethod: 'cash',
                    amountPaid: amountPaid,
                    changeGiven: changeGiven,
                    discount: discount
                  }).getKey();
                }else{
                  var receiptKey = firebase.database().ref('receipts').child(userKey).push({
                    receiptNumber: receiptNumber,
                    date: receiptDate,
                    timeIssued: receiptIssuedTime,
                    merchantName: merchantName,
                    branch : {
                      branchName : branchName,
                      branchAddress : branchAddress
                    },
                    currency : {
                      currencyName : currencyName,
                      currencySymbol : currencySymbol
                    },
                    totalAmount: receiptTotalAmount,
                    paymentMethod: receiptPaymentType,
                    cardNumber: cardNumber,
                    amountPaid: amountPaid,
                    changeGiven: changeGiven,
                    discount: discount
                  }).getKey();
                }

                resolve(receiptKey);
              }else{
                console.log('duplicate receipt.');
              }

            });
          }else{
            console.log('No logged in user.');
          }
        });
      });

      // loop through each items in receipt
      for(let i = 0; i < items.length; i++){

        // check item exists before add
        let promiseItemKey = new Promise((resolve, reject) => {
          // asynchronous call to check if new receipt added before add in items
          promiseReceiptKey.then((receiptKey) => {
            if(receiptKey != null){
              firebase.database().ref('items').orderByChild('name').equalTo(items[i].name).once('value', function(snapshot) {
                var itemData = snapshot.val();
                if (itemData){
                  console.log('item exists.');
                // get the matching item unique push ID
                snapshot.forEach(function(childSnapshot) {
                  var item = childSnapshot.val();
                  item.key = childSnapshot.key;
                  resolve(item.key);
                });
              }else{
                // get newly created item unique push ID
                var itemKey = firebase.database().ref('items').push({
                  name : items[i].name,
                  category : items[i].category,
                  type : "test",
                  brand : "test"
                }).getKey();
                resolve(itemKey);
              }
            });
            }else{
              console.log('No receipt created.');
            }
          });
        });

      // add receipt items
      let promiseReceiptItemKey = new Promise((resolve, reject) => {
        promiseItemKey.then((itemKey) => {
          promiseReceiptKey.then((receiptKey) => {
            if(receiptKey != null){
              var receiptItemKey = firebase.database().ref('receiptItems').push({
                itemID : itemKey,
                // category : items[i].category,
                // type : items[i].type,
                // brand : items[i].brand,
                category : items[i].category,
                type : "test",
                brand : "test",
                price : items[i].price,
                quantity : items[i].quantity,
                receiptID : receiptKey
              }).getKey();
              resolve(receiptItemKey);

              console.log("receipt created");

              Alert.alert(
                'Receipt Added.',
                null,
                [
                  {text: 'Okay', onPress: this.handleAdded()},
                ],
              );

            }else{
              console.log('No receipt created.');
            }
          });
        });
      });

      // update lookup table to get how much spend on each types/categories
      promiseReceiptItemKey.then((receiptItemKey) => {
        firebase.database().ref('receiptItemIDsByCategory').child(items[i].category).update({
          [receiptItemKey] : true,
        });

        // update lookup table to group receipt items by brand
        firebase.database().ref('receiptItemIDsByBrand').child(items[i].category).child(items[i].brand).update({
          [receiptItemKey] : true,
        });
      });

    }

    Promise.all([promiseBranchKey, promiseCurrencyKey, promiseReceiptKey]).then(values => { 
        console.log('branchkey' + values[0]); 
        console.log('currencykey' + values[1]);
        console.log('receiptkey' + values[2]);
        
        // update lookup table to get how much spend on each currencies
        firebase.database().ref('receiptIDsByCurrency').child(values[1]).update({
          [values[2]] : true,
        });

        // update lookup table to get how much spend on each branches
        firebase.database().ref('receiptIDsByBranch').child(values[0]).update({
          [values[2]] : true,
        });

      });



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
      header:null,
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="settings" size={24} style={{ color: tintColor }} />
  ),
  };


    handleAdded = () => {this.props.navigation.navigate('Main')};
    handleBack = () => {this.props.navigation.navigate('Main')};

    componentWillMount(){
       
      // this.setState({receiptData: "test1"})
       this.setState({receiptData: this.props});
      //  this.setState({merchant: "test2"});

       //console.log(this.props['receiptData']['changeReturned']);
        //transaction details
        this.setState({merchant: this.props['receiptData']['merchantName']});
        this.setState({branch: this.props['receiptData']['branchAddress']});
        this.setState({receiptNo: this.props['receiptData']['receiptNo']});
        this.setState({transactionDate: this.props['receiptData']['date']});
        
        //item details
        // console.log("HERE")
        console.log("NUMBER OF ITEMS PURCHASED");
        console.log(this.props['receiptData']['noItemsPurchased']);
        this.setState({noItemsPurchased: this.props['receiptData']['noItemsPurchased']});
        
        //payment details
        this.setState({total: this.props['receiptData']['total']});
        this.setState({paymentType: this.props['receiptData']['paymentType']});
        this.setState({subTotal: this.props['receiptData']['subTotal']});
        this.setState({amountPaid: this.props['receiptData']['paymentAmount']});
        this.setState({member: this.props['receiptData']['memberCard']});
        this.setState({change: this.props['receiptData']['changeReturned']});

        this.setState({success: this.props['receiptData']['success']});

        // this.setState({merchant: "merch"})
        // this.setState({branch: "branch address"})
        // this.setState({receiptNo: "1234"})
        // this.setState({transactionDate: "1234"})
        // this.setState({total: "this.props['receiptData']['total']"})
        // this.setState({paymentType: "this.props['receiptData']['paymentType']"})
        // this.setState({subTotal: "this.props['receiptData']['subTotal']"})
        // this.setState({amountPaid: "test"})
        // this.setState({member: "this.props['receiptData']['memberCard']"})
        // this.setState({change: "this.props['receiptData']['changeReturned']"})
        //this.setState({noItemsPurchased: "1"});
        var itemList = [];

        for(let i = 0; i < this.state.noItemsPurchased; i++){


          itemList.push(
            {
              item: this.props['receiptData']['itemList'][i],
              qty: this.props['receiptData']['quantityList'][i],
              price:this.props['receiptData']['priceList'][i],
              category: this.props['receiptData']['categoryList'][i],

              // item: "test1",
              // qty: "test2",
              // price: "test3",

            },
          )
        }     
        this.setState({itemList:itemList});

    }

    render() {
    if(this.state.receiptData!=null && this.state.success){

        var itemList = [];

        for(let i = 0; i < this.state.noItemsPurchased; i++){


          itemList.push(
            {
              item: this.props['receiptData']['itemList'][i],
              qty: this.props['receiptData']['quantityList'][i],
              price:this.props['receiptData']['priceList'][i],
              category: this.props['receiptData']['categoryList'][i],

              // item: "test1",
              // qty: "test2",
              // price: "test3",

            },
          )
        }        
      
    }


/*
{

  ---  DONE
  
  "receiptNo": "53858", 
  "merchantName": "GIANT", 
  "branchAddress": "BLK 883 WOODLANDS ST 82 801-498 WOODLANDS NORTH PLAZA SE 730883", 
  "date": "12/07/17",

  "changeReturned": "38.00", 
  "memberCard": "8008T600T0432365", 
  "total": ".", 
  "subTotal": "12.50", 
  "paymentType": "CASH", 
  "paymentAmount": "50.50", 

  "noItemsPurchased": "2"}


  ---  TO DO
  
  //LISTS
  "quantityList": ["2.000"], 
  "itemList": ["FARMHOUSE LOW FAT 2L ZL"],
  "priceList": ["12.50"],  

  ---  NO USE
  "nric": "", 
  "time": "08:22", 
  "success": "true", 
  "telephone": "6365 7103", 


  */

   /*   if (!this.state.receiptCounter) {
        return this.renderLoadingView();
      }*/

        return (
          <BackgroundWrapper iconLeft="arrow-left-circle" color="#58585B" onPressIcon={this.handleBack.bind(this)}>
             
<ScrollView>
            <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>

                <View style={styles.formContainer}>
                    <View style={{position: 'relative'}}>
                    <Card title='Transaction Details' fontFamily='Raleway'>
                                      <Input label="Merchant Name"
                                             value={this.state.merchant}
                                             onChange={this.handleChangeInput.bind(this, 'merchant')}
                                             autoCapitalize="words"
                                      />
                                      <Input label="Branch Address"
                                             value={this.state.branch}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'branch')}
                                      />

                                      <Input label="Receipt Number"
                                             value={this.state.receiptNo}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'receiptNo')}
                                      />

                                      <Input label="Transaction Date"
                                             value={this.state.transactionDate}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'transactionDate')}
                                      />
                            </Card>


                    {itemList.map((l, i) => (
                <Card key={i} fontFamily='Raleway'>
                        <Input label="Item Name"
                               value={l.item}
                               marginTop={23}
                               key = {i}
                               onChange={this.handleChangeItemList.bind(this, 'item', i)}

                        />

                        <Input label="Quantity"
                               value={l.qty}
                               marginTop={23}
                               key = {i+1}


                        />
                        <Input label="Price"
                               value={l.price}
                               marginTop={23}
                               key = {i+2}

                        />
                        <Input label="Category"
                               value={l.category}
                               marginTop={23}
                               key = {i+3}

                        />
                </Card>
                    ))}
                 <Card title='Payment Details' fontFamily='Raleway'>
                                      <Input label="Subtotal"
                                             value={this.state.subTotal}
                                             onChange={this.handleChangeInput.bind(this, 'subTotal')}
                                      />
                                      <Input label="Total"
                                             value={this.state.total}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'total')}
                                      />
                                      <Input label="Member Card"
                                             value={this.state.member}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'member')}
                                      />

                                      <Input label="Payment Type"
                                             value={this.state.paymentType}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'paymentType')}
                                      />

                                      <Input label="Amount Paid"
                                             value={this.state.amountPaid}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'paymentAmount')}
                                      />

                                      <Input label="Change Due"
                                             value={this.state.change}
                                             marginTop={23}
                                             onChange={this.handleChangeInput.bind(this, 'change')}
                                      />
                            </Card>
 
                      <Button onPress={this.addNewReceipt.bind(this)}>Save</Button>
                    </View>
  
            </View>

              <View style={{ height: 60 }} />
            </KeyboardAvoidingView>
        </ScrollView>
             <Button onPress={this.addNewReceipt.bind(this)}></Button>

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
},centering: {
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
})
