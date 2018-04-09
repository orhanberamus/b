import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, AppState
} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import io from 'socket.io-client/dist/socket.io';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
console.disableYellowBox = true;
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      seconds: 5,
      m: ""
    }
    this.socket = io('http://192.168.1.24:5000', {jsonp: false});
  }
  componentDidMount(){
  }
  componentWillMount() {

  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={styles.container}>
        <HomeScreen socket={this.socket}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
