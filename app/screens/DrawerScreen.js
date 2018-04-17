import React, { Component } from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View, Image, Touchable, Dimensions, TouchableOpacity,  BackHandler, FlatList, ToastAndroid, ImageBackground } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
import AnimatedBar from '../components/AnimatedBar';
import AnimatedCircle from '../components/AnimatedCircle';
const DELAY = 1000;
const window = Dimensions.get('window');
export default class DrawerScreen extends Component{
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.s = 1;
    this.state = {
      data: [],
      data1: [
        {
          width: 50 * window.width / 100,
          text: 'Doğru',
          percent: 50,
          color: '#13B25B',
          k: 1,
          r:"D"
        },
        {
          width: 50 * window.width / 100,
          text: 'Yanlış',
          percent: 50,
          color: '#FF5F4F',
          k: 2,
          r: "Y"
        }
      ],
      dataArrived: false,
      data2: [],
    }
    if(this.props.screenProps !== undefined){
      this.props.screenProps.on('getTotalTrueFalseResponse', this.getTotalTrueFalseResponseHandler);
    }

    //console.log(this.props.navigation);
  }
  componentDidMount(){
    this.props.navigation.setParams({
      cancelState:this.cancelState
    })
    this.getTotalTrueFalse();
    console.log("drawer mounteD");
  }
  cancelState=()=>{
      if(this.state.dataArrived){
        let d1 = this.state.data.slice();
        let d2 = this.state.data2.slice();;
        this.setState({data: [], data2: []});
        this.setState({data: d1, data2: d2});
      }

  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress');
     this.props.screenProps.removeListener('getTotalTrueFalseResponse', this.getTotalTrueFalseResponseHandler);
  }
  handleBackButton(){
      if(this.props.navigation.state.routes[0].routes.length === 1){
        return true;
      }else if(this.props.navigation.state.routes[0].routes.length === 4){
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
  getTotalTrueFalse = () => {
    console.log("getTruefalse called");
    if(this.props.screenProps !== undefined){
      this.props.screenProps.emit('getTotalTrueFalse', this.props.navigation.state.params.email);
    }
  }
  getTotalTrueFalseResponseHandler = (data) => {
    const data1 = [];
    let data2 = [];
    let item;
    item = {
      width: data.true.percent * window.width / 100,
      text: 'Doğru',
      percent: data.true.percent,
      color: '#13B25B',
      k: 1
    }
    data1.push(item);
    item = {
      width: data.false.percent * window.width / 100,
      text: 'Yanlış',
      percent: data.false.percent,
      color: '#FF5F4F',
      k: 2
    }
    data1.push(item);

    var d = {
      seconds: data.averageTime
    }
    data2.push(d);
    this.setState({
      data: data1,
      dataArrived: true,
      data2: data2
    });

    // this.animatedRef.D.startAnimation();
    // this.animatedRef.Y.startAnimation();
  }
  renderStatistics = () => {
    var content;
    if(this.state.dataArrived){
      content = <ScrollView>
        <View style={{ flex: 1, justifyContent: 'center'}}>
        <Text style={{fontSize: 20, marginBottom:10, color:'#545454'}}>Başarı yüzden</Text>
          <View >
            {this.state.data.map((index) => <AnimatedBar value={index.width}  email="orhanfidan@hotmail.com" text={index.text} percent={index.percent} color={index.color} delay={DELAY * index} key={index.k}
                                              />)}
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', }}>
          <Text style={{fontSize: 20, marginBottom:10, alignSelf: 'center', color:'#545454'}}>Ortalama soru çözme süren</Text>
          <View style={{ alignItems:'center'}}>
            {this.state.data2.map((index) =>   <AnimatedCircle seconds={index.seconds}/>)}
          </View>

        </View>
      </ScrollView>
    }else{
      content = null;
    }
    return content;
  }
  render(){
    //console.log(this.props.navigation.state.routes[0].routes);
    console.log(this.animatedRef);
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
        {this.renderStatistics()}
      </ImageBackground>
        )
  }
}
