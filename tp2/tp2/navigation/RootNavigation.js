import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Login';
import ProfileScreen from '../screens/Profile';
import RegisterScreen from '../screens/Register';
import ViewReceipts from '../screens/ViewReceipts';
import Home from '../screens/HomeScreen';
import EditReceipt from '../screens/EditReceipt';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

const RootStackNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    Home: {
      screen: Home,
    },
    Main: {
      screen: MainTabNavigator,
    },
    Profile: {
      screen: ProfileScreen,
    },
    ViewReceipts: {
      screen: ViewReceipts,
    },
    EditReceipt: {
      screen: EditReceipt,
    },
    Logout: {
      screen: LoginScreen,   
      navigationOptions: {
         logOut: true,
       },
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default class RootNavigator extends React.Component {
  componentDidMount() {
    // this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    // this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator />;
  }

  // _registerForPushNotifications() {
  //   // Send our push token over to our backend so we can receive notifications
  //   // You can comment the following line out if you want to stop receiving
  //   // a notification every time you open the app. Check out the source
  //   // for this function in api/registerForPushNotificationsAsync.js
  //   registerForPushNotificationsAsync();

  //   // Watch for incoming notifications
  //   this._notificationSubscription = Notifications.addListener(
  //     this._handleNotification
  //   );
  // }

  // _handleNotification = ({ origin, data }) => {
  //   console.log(
  //     `Push notification ${origin} with data: ${JSON.stringify(data)}`
  //   );
  // };
}
