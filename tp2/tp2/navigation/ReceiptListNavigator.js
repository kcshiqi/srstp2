import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import ViewReceipts from '../screens/ViewReceipts';
import ReceiptList from '../screens/ReceiptList';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

const ReceiptStackNavigator = StackNavigator(
  {
    ViewReceipts: {
      screen: ViewReceipts,
    },
    ReceiptList: {
      screen: ReceiptList,
    },
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

  render() {
    return <RootStackNavigator />;
  }

}
