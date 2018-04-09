import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, Dimensions, Animated
} from 'react-native';
export default class AnimatedBar extends Component {
  constructor(props) {
    super(props);

    this._width = new Animated.Value(0); // Added
    this.state = {
      color: "red",
    };
  }
  componentDidMount() {
    const { delay, value } = this.props;
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this._width, {
        toValue: value,
      }),
    ]).start();
  }
  render() {
    const barStyles = {
      backgroundColor: this.props.color,
      height: 60,
      width: this._width, // Changed
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <Animated.View style={barStyles} >
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>{this.props.text}</Text>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>%{this.props.percent}</Text>
      </Animated.View>
    );
  }
}
