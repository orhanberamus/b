import React, { Component } from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View, Image, Touchable, Dimensions, TouchableOpacity,  BackHandler, FlatList, ToastAndroid
,ImageBackground } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
export default class Profile extends Component{
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.s = 1;
  }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress');
  }
  handleBackButton(){
      if(this.props.navigation.state.routes[0].routes.length === 1){
        return true;
      }
      else if(this.props.navigation.state.routes[0].routes.length === 4){
        return true;
      }else if(this.props.navigation.state.routes[0].routes[1].routeName === "Activation"){
        return true;
      }else if(this.props.navigation.state.routes[0].routes[2] !== undefined){
        if(this.props.navigation.state.routes[0].routes[2].routeName === "Activation"){
          return true;
        }else if(this.props.navigation.state.routes[0].routes[2].routeName === "SignUp"){
          return false;
        }
      }else if(this.props.navigation.state.routes[0].routes[1].routeName === "SignUp"){
        return false
      }else{
        return true;
      }
  }
  renderEmail = () => {
    var content;
    if(this.props.navigation.state.params !== undefined){
      content = <Text>{this.props.navigation.state.params.email}</Text>
    }else{
      content = <Text>boş</Text>
    }
    return content;
  }
  render(){
    //console.log(this.props.navigation.state.routes[0].routes);
    const shadowOpt = {
     width:220,
     height:50,
     color:"#000",
     border:2,
     radius:18,
     opacity:0.2,
     x:0,
     y:3,
     style:{marginVertical:5}
		}
    return  (
      <ImageBackground
        source={require('../imgs/d.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          alignSelf: 'stretch',
          width: '100%',
          height: '100%',
          borderRadius:35,
          position:'absolute',
          alignItems:'center',
          justifyContent: 'center'
        }}
        >
          {this.renderEmail()}
        </ImageBackground>
        )
  }
}
