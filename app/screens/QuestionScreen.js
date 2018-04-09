import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,TouchableOpacity,
  View, AppState, FlatList, Dimensions, ActivityIndicator
} from 'react-native';

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Icon, Button } from 'react-native-elements'
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      choice: 0,
      timeOut: false,
      time: 30,
      choices: null,
      question: null
    }
    this.props.socket.on('countDownMsg', this.countDownMsgHandler);
    this.props.socket.on('closeQuestion', this.closeQuestionHandler);
  }
  componentDidMount(){
  }
  getQuestionFromApiAsync = () => {
    this.setState({
      isLoading: true
    });
    fetch('http://192.168.1.24/tetris1/question.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.choices);
        this.setState({
          isLoading: false,
          question: responseJson.question,
          choices: responseJson.choices,
          id: responseJson.id
        });
        this.props.socket.emit('requestCountDown');
      })
      .catch((error) => {
        console.error(error);
      });
  }
  countDownMsgHandler = (data) => {
    this.setState({
      time: data
    })
  }
  closeQuestionHandler = () => {
    this.props.closeQuestion();
  }
  emitAnswer = () => {
    var data = {
      id: this.state.id,
      choice: this.state.choice,
      userName: "amyamy"
    }
    this.props.socket.emit('emitUserAnswer', data);
    this.state.popupConfirm.dismiss();
  }
  countDownHandler = () => {

  }
  getChoice = (choice) => {
    this.setState({
      choice: choice
    })
    this.state.popupConfirm.show();
  }
  renderContent = () => {
    let content;
    if(this.state.isLoading){
        content = <View style={{flex: 1, padding: 20, alignItems:'center', justifyContent:'center'}}>
              <ActivityIndicator size="large" color="#0000ff"/>
            </View>
    }else{
      if(!this.state.timeOut){
        content =
        <View style={styles.container}>
          <View style={{flex: 0.5}}><Text style={{fontSize:24, color: 'black'}}>{this.state.time}</Text></View>
          <View style={{flex: 2.2}}>
            <FlatList
              data={this.state.question}
              horizontal={false}
              extraData={this.state}
              style={styles.questionContainer}
              renderItem={ ({item}) =>
              <Text style={styles.question}>{item.question}</Text>
              }
            />
          </View>
          <View style={{flex:6}}>
            <FlatList
              data={this.state.choices}
              horizontal={false}
              extraData={this.state}
              style={styles.choiceContainer}
              renderItem={ ({item}) =>
                <TouchableOpacity  onPress={() => this.getChoice(item.choice)}>
                  <Text style={styles.choice}><Text style={{fontWeight: 'bold', color: 'black'}}>{item.choice})</Text> {item.choiceText}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      }else{
        content = null;
      }
    }
    return content;
  }

  noPressed = () => {
    this.state.popupConfirm.dismiss();
  }
  render() {
    return (
      <View style={{flex:1}}>
      {this.renderContent()}
      <PopupDialog
        ref={((popupDialog)=>this.popupConfirm = popupDialog)}
        ref={d => !this.state.popupConfirm && this.setState({ popupConfirm: d })}
        dialogAnimation={slideAnimation}
        height={0.25}
        dismissOnTouchOutside={true}
        dismissOnHardwareBackPress={true}
        containerViewStyle={{left: 60}}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0)'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.confirmText}>{this.state.choice} şıkkından emin misin?</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
          <View style={styles.button}>
            <Button
              raised
              title='Hayır'
              backgroundColor='white'
              fontSize={18}
              color='#888'
              buttonStyle={{borderRadius:12, borderColor:'#888', borderWidth:1.5, }}
              containerViewStyle={{backgroundColor:'#e7e7d6', borderRadius:12, }}
            	onPress={() => this.noPressed()}
            />
          </View>
          <View style={styles.button}>
            <Button
              raised
              title='Evet'
              backgroundColor='#3793fc'
              fontSize={18}
              color="#e7e7d6"
              buttonStyle={{borderRadius:12,}}
              containerViewStyle={{backgroundColor:'#e7e7d6', borderRadius:12,}}
              onPress={() => this.emitAnswer()}
            />
          </View>
          </View>
        </View>
      </PopupDialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 0
  },
  question: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    width:  Dimensions.get('window').width
  },
  questionContainer: {
    flex: 5,
    padding: 10
   },
  choiceContainer: {
    flex: 6,
  },
  choice: {
    padding: 10,
    fontSize: 20,
    color: '#444'
  },
  confirmText: {
    alignSelf: 'center',
    fontSize: 20,
    color:'#545454'
  },
  button: {
    flex: 1,
    justifyContent:'center',
    margin:5
  }
});
