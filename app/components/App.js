import React, { Component } from 'react';
import {Text} from 'react-native';
import {StackNavigator, DrawerNavigator, TabNavigator} from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { Icon, Button } from 'react-native-elements'
import FCM, { FCMEvent } from "react-native-fcm";
import DrawerScreen from '../screens/DrawerScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginFirebaseScreen from '../screens/LoginFirebaseScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ActivationScreen from '../screens/ActivationScreen';
import LadderBoardScreen from '../screens/LadderBoardScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
  const TabScreens = TabNavigator({
    Home: { screen: HomeScreen },
    LadderBoard: { screen: LadderBoardScreen },
    Drawer: { screen: DrawerScreen },
    Profile: { screen: ProfileScreen },

  }, {
      initialRouteName: 'Home',
      tabBarPosition: 'bottom',
      swipeEnabled: false,
      navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = "home";
          iconType = "simple-line-icon";
          iconSize = 24;
        }else if (routeName === 'LadderBoard') {
          iconName = "trophy";
          iconType = "evilicon";
          iconSize = 36;
        }else if (routeName === 'Drawer') {
          iconName = "chart";
          iconType = "simple-line-icon";
          iconSize = 24;
        }else if (routeName === 'Profile') {
          iconName = "user";
          iconType = "simple-line-icon";
          iconSize = 24;
        }

        return <Icon
          name={iconName}
          type={iconType}
          color={tintColor}
          size={iconSize}
          containerStyle={{flex:1}}
        />;
      },
      tabBarOnPress :()=>{
        const { routeName } = navigation.state;
        if(routeName === 'Drawer'){
          navigation.navigate('Drawer');
          if (typeof navigation.state.params.cancelState!=="undefined"){
               navigation.state.params.cancelState();
               console.log("cancelstated called from app");
          }
          else{
          //your stuff
          }
        }else if(routeName === 'Home'){
          navigation.navigate('Home');
        }else if(routeName === 'LadderBoard'){
          navigation.navigate('LadderBoard');
        }else if(routeName === 'Profile'){
          navigation.navigate('Profile');
        }

           }
    }),
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#545454',
      inactiveTintColor: 'gray',
      showLabel: false,
      style: {
        backgroundColor: "#EDE9F0",
        height: 43
      },
      indicatorStyle: {
          backgroundColor: '#cac7cc',
          height: 43
      },
    },
    });
const StackScreens = StackNavigator({
  Activation: { screen: ActivationScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      }) },
  Home: { screen: TabScreens,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      }) },
  SignUp: { screen: SignUpScreen,
    navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })},
  LoginFirebase: { screen: LoginFirebaseScreen,
    // navigationOptions: ({navigation}) => ({
    //     drawerLockMode: 'locked-closed'
    //   })
  },

}, {
    initialRouteName: 'LoginFirebase',
    navigationOptions:{ header: null},
    initialRouteParams: { status: ' ' }
  });




const DrawerRoutes ={
  Register: { screen: StackScreens },
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
