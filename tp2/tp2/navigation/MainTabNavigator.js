/**
 * @flow
 */

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { DrawerNavigator,TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditReceipt from '../screens/EditReceipt';
import LoginScreen from '../screens/Login';
import ProfileScreen from '../screens/Profile';
import AchievementScreen from '../screens/DashboardScreen';
import ReceiptScreen from '../screens/ReceiptList';
import LinearGradient from 'react-native-linear-gradient';
import { Font } from 'expo';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import ViewReceipts from '../screens/ViewReceipts';
import ReceiptList from '../screens/ReceiptList';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import { Button } from 'react-native';


const ReceiptScreenTab = StackNavigator(
    {
      Receipts: {
        screen: ReceiptScreen,
      },
      ListReceipts: {
        screen: ReceiptList,
      },
      ViewReceipts: {
        screen: ViewReceipts,
      },
    },
      { headerMode: 'none' }
  )


export default DrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Profile:{
      screen: ProfileScreen,
    },
    Achievements: {
      screen: AchievementScreen,
    },
    Receipts: {
      screen: ReceiptScreenTab,
      path: '/ReceiptScreen',
    },
    // Settings: {
    //   screen: SettingsScreen,
    // },
    Logout: {
      screen: LoginScreen
    }
  },
  {
    navigationOptions: ({ navigation, banner }) => ({
      // Set the tab bar icon
      headerTintColor: 'white',    
      headerLeft: 
        <View style={{padding: 5}}>
          <FontAwesome name='bars' size={25} color='white' onPress={() => navigation.navigate('DrawerOpen')} />
        </View>,
      title:    
            <Text style={{textAlign: 'center', color: 'white', fontFamily: 'Pacifico', fontSize: 20, }}>
            Smart Receipt
            </Text>,
            headerStyle: {backgroundColor:'#59c3b5'},
      //     tabBarIcon: ({ focused }) => {
      //       const { routeName } = navigation.state;
      //       let iconName;
      //       switch (routeName) {
      //         case 'Home':
      //           iconName = 'home';
      //           break;
      //         case 'Achievements':
      //           iconName = 'trophy';
      //           break;
      //         case 'Scan':
      //           iconName = 'camera-retro';
      //           break;
      //         case 'Receipts':
      //           iconName = 'book';
      //           break;
      //         case 'Drawer':
      //           iconName = 'book';
      //           break;
      //       }
    

      //   return (
      //     <FontAwesome
      //       name={iconName}
      //       size={25}
      //       color={focused ? '#58585B' : '#808284'}
      //     />


      //   );
      // },
    }),

    
    // Put tab bar on bottom of screen on both platforms
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    // Disable animation so that iOS/Android have same behaviors
    animationEnabled: false,
    // Don't show the labels
    showLabels: false,
    tabBarOptions: {
      style:{backgroundColor:'#84D3EB'},
      activeBackgroundColor: '#84D3EB',
      inactiveBackgroundColor: '#84D3EB',
    },
  }
);





const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

