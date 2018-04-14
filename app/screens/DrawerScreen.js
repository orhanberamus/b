import React, { Component } from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View, Image, Touchable, Dimensions, TouchableOpacity,  BackHandler, FlatList, ToastAndroid } from 'react-native';
export default class DrawerScreen extends Component{
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
  render(){
    console.log(this.props.navigation.state.routes[0].routes);
    return  (
      <View style={{borderWidth:0, flex:1, backgroundColor:'white', marginTop:-20, paddingTop:40}}>
      <Text style={{fontSize:36,color:'black'}}>Hoşgeldin </Text>
          </View>
        )
  }
}
