import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, Dimensions, Animated
} from 'react-native';
var inter;
var inter1;
var inter2;
import PercentageCircle from 'react-native-percentage-circle';
export default class AnimatedCircle extends Component {
  constructor(props) {
    super(props);

    this._width = new Animated.Value(0); // Added
    this.state = {
      color: "red",
      secondS: 0,
      milliS: 0,
      fakeMillis: 0,
      realMillis: null,
      scale: null,
      targetSecond: null,
      targetMilli: null,
      targetSecondReach: false,
      targetMilliReacth: false,
      saniye: ""
    };
  }
  componentDidMount() {
    console.log(this.props.seconds);
    this.setState({
      scale: 2000,
      targetSecond: Math.floor(this.props.seconds /1000),
      targetMilli: Math.floor((this.props.seconds % 1000 ) / 10),
      realMillis: (this.props.seconds % 100)/ 10,
      count: 0,
      targetCount: 2,
      targetPercent: Math.floor(((this.props.seconds / 60000)* 100)),
      currentPercent: 0
    })
    inter = setInterval(
       () => {
              this.countMillis()

              //this.setState({fakeMillis : this.state.fakeMillis + 10})
             },
         30
     );
     inter1 = setInterval(
        () => {
               this.setState({count: this.state.count + 1})
               //this.setState({fakeMillis : this.state.fakeMillis + 10})
              },
          1000
      );
      inter2 = setInterval(
         () => {

               this.setState({currentPercent: this.state.currentPercent + ((this.props.seconds / 60000)* 100) / (2000/50 ) })
               if(this.state.targetPercent === Math.floor(this.state.currentPercent)){
                 clearInterval(inter2);
               }
                //this.setState({fakeMillis : this.state.fakeMillis + 10})
               },
           50
       );
  }
  startAnimation = () => {

  }
  countMillis = () => {
    // this.setState({milliS: this.state.milliS + 1})
    // if(this.state.milliS === 10){
    //   this.setState({secondS: this.state.secondS + 1, milliS: 0})
    // }
    // if(this.state.targetSecond === this.state.secondS){
    //   this.setState({targetSecondReach: true})
    // }
    // if(this.state.targetSecondReach){
    //   if(this.state.targetMilli === this.state.milliS){
    //     this.setState({targetMilliReacth: true})
    //   }
    // }
    // if(this.state.targetSecondReach && this.state.targetMilliReacth){
    //   clearInterval(inte);
    //   this.setState({fakeMillis: this.state.realMillis, milliS:""})
    // }
    var rand1 = Math.floor(Math.random() * 90) + 10
    var rand2 = Math.floor(Math.random() * 90) +10

    this.setState({secondS: rand1, milliS: rand2})
    if(this.state.count === this.state.targetCount){
      this.setState({secondS: this.state.targetSecond, milliS: this.state.targetMilli, saniye: " Saniye"})
      clearInterval(inter);
      clearInterval(inter1);
    }

  }
  render() {
    const circleStyle = {
      backgroundColor: this.props.color,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
      height:200,
      width:200,
      borderColor: '#545454',
      borderWidth: 2
    };

    return (
      <PercentageCircle radius={60} percent={this.state.currentPercent}  borderWidth={8} color={"#FCC927"} bgcolor={"#F2826E"} innerColor={"rgba(255, 255, 255, 0)"}>
      <Text style={{color:'white', fontSize: 20}}>{this.state.secondS}.{this.state.milliS}</Text>
      <Text style={{color:'white', fontSize: 20}}>{this.state.saniye}</Text>
      </PercentageCircle>
    );
  }
}
