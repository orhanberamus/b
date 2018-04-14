import React, { Component } from 'react';
import {Text, Button } from 'react-native';
import {StackNavigator, DrawerNavigator} from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import FCM, { FCMEvent } from "react-native-fcm";
import DrawerScreen from '../screens/DrawerScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginFirebaseScreen from '../screens/LoginFirebaseScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ActivationScreen from '../screens/ActivationScreen';

const NotificationScreen = () => <Text> Notification </Text>

import io from 'socket.io-client/dist/socket.io';

/*const NavConfig = {
		Home: { screen: HomeScreen},
		Profile: { screen: ProfileScreen },
		Notification: { screen: NotificationScreen }
	};*/

//const AppWithNavigation = StackNavigator(NavConfig);
//
	//Deneme: { screen: DenemeScreen}

const StackScreens = StackNavigator({
  Activation: { screen: ActivationScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      }) },
  Home: { screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      }) },
  SignUp: { screen: SignUpScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })},
  LoginFirebase: { screen: LoginFirebaseScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })},

}, {
    initialRouteName: 'LoginFirebase',
    navigationOptions:{ header: null},
    initialRouteParams: { status: ' ' }
  });

  const StackScreense = StackNavigator({
    Activation: { screen: ActivationScreen },
    Home: { screen: HomeScreen},
    SignUp: { screen: SignUpScreen},
    LoginFirebase: { screen: LoginFirebaseScreen},

  }, {
      initialRouteName: 'LoginFirebase',
      navigationOptions:{ header: null},
      initialRouteParams: { status: ' ' }
    });



const DrawerRoutes ={
  Register: { screen: StackScreens }
}
const AppNavigator = DrawerNavigator(
    DrawerRoutes,
  {
    initialRouteName:'Register',
    contentComponent:({navigation})=> <DrawerScreen navigation={navigation} routes={DrawerRoutes} name="hehehe" />,

  }
)
const defaultGetStateForAction = StackScreens.router.getStateForAction;

StackScreens.router.getStateForAction = (action, state) => {
  if (state && action.type === 'ReplaceCurrentScreen') {
    //const routes = state.routes.slice(0, state.routes.length -1);
		const routes = state.routes.slice(state.routes.length, state.routes.length);
		routes.push(action);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }
  return defaultGetStateForAction(action, state);
};
/*const prevGetStateForActionHomeStack = AppWithNavigation.router.getStateForAction;
AppWithNavigation.router = {*
  getStateForAction(action, state) {
    if (state && action.type === 'ReplaceCurrentScreen') {
      const routes = state.routes.slice(0, state.routes.length - 1);
      routes.push(action);
      return {
        ...state,
        routes,
        index: routes.length - 1,
      };
    }
    return prevGetStateForActionHomeStack(action, state);
  },
};*/

console.disableYellowBox = true;
export default class App extends Component{
	constructor(){
		super();
	this.socket = io('http://192.168.1.24:5000', {jsonp: false});
  //this.socket = io("https://ossorhan.herokuapp.com/");

    FCM.on(FCMEvent.RefreshToken, token => {
      console.log(token);
    });
	}
		//this.socket = this.props.socket;
		//this.orhan = this.props.deneme;



	render(){
		return(
			<AppNavigator  screenProps={this.socket}/>

		);
	}
}
