import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, AppState, Dimensions, ActivityIndicator, FlatList, ScrollView, Image, ImageBackground
} from 'react-native';
import QuestionScreen from '../screens/QuestionScreen';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Icon, Button } from 'react-native-elements'

import AnimatedBar from '../components/AnimatedBar';
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
const window = Dimensions.get('window');
const DELAY = 1000;
export default class HomeScreen extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      seconds: 5,
      timeout: false,
      width : Dimensions.get('window').width * Dimensions.get('window').scale,
      height : Dimensions.get('window').height * Dimensions.get('window').scale,
      widthforcolortool: Dimensions.get('window').width,
      heightforcolortool: Dimensions.get('window').height,
      questionInfo: "",
      getQuestion: true

    }
    this.props.screenProps.on('answerStatisticsMsg', this.answerStatisticsMsgHandler);
    this.props.screenProps.on('requestQuestionMsg', this.requestQuestionMsgHandler);

  }
  componentDidMount(){
    console.log(this.props);
  }
  answerStatisticsMsgHandler = (data) => {
    console.log("answerstatistics geldi");
    const data1 = [];
    let item;
    item = {
      width: data.true.percent * window.width / 100,
      text: 'Doğru',
      percent: data.true.percent,
      color: 'green',
      k: 1
    }
    data1.push(item);
    item = {
      width: data.false.percent * window.width / 100,
      text: 'Yanlış',
      percent: data.false.percent,
      color: 'red',
      k: 2
    }
    data1.push(item);
    this.setState({
      data: data1,
      answerMessage: data.message
    });
    this.closeQuestion();
  }
  showQuestion = () => {
    if(!this.state.timeout){
      this.state.popupQuestion.show();
      this.state.ss.getQuestionFromApiAsync();
    }
  }
  requestQuestionMsgHandler = (data) => {
    if(data){
      this.showQuestion();
    }else{
      this.setState({
        questionInfo: 'Soruyu zaten cevapladınız',
        getQuestion: false
      })
    }
  }
  requestQuestion = () => {
    if(this.state.getQuestion){
      this.props.screenProps.emit("requestQuestion", this.props.navigation.state.params.email)
    }
  }
  closeQuestion = () => {//question text
    this.state.popupQuestion.dismiss();
    this.setState({
      timeOut: true
    })
    this.state.popupStatistics.show();
    //this.props.socket.emit("getAnswerStatistics", 2);
    //this.props.socket.emit("updateUserAnswer", data)
  }
  renderStatistics = () => {
    var content;
    if(this.state.timeOut){
      content =
      <PopupDialog
          ref={((popupDialog)=>this.popupStatistics = popupDialog)}
          ref={d => !this.state.popupStatistics && this.setState({ popupStatistics: d })}
          dialogAnimation={slideAnimation}
          height={0.5}
          dismissOnTouchOutside={true}
          dismissOnHardwareBackPress={true}
        >
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: '#F5FCFF', justifyContent: 'center'}}>
          <Text style={{fontSize: 24, alignSelf: 'center', fontWeight: 'bold'}}>{this.state.answerMessage}</Text>
          <Text style={{fontSize: 20}}>Diğer kullanıcıların cevapları</Text>
            <View>
              {this.state.data.map((index) => <AnimatedBar value={index.width} socket={this.props.screenProps} email="orhanfidan@hotmail.com" text={index.text} percent={index.percent} color={index.color} delay={DELAY * index} key={index.k} />)}
            </View>
          </View>
          </ScrollView>
        </PopupDialog>
    } else{
      content = null;
    }
    return content;
  }
  render() {
    return (
      <ImageBackground
        source={require('../imgs/d.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          alignSelf: 'stretch',
          width: '100%',
          height: '100%',
          borderRadius:35,
          position:'absolute'
        }}
      >
        <View style={{flex: 2, backgroundColor:'#EEE', justifyContent: 'center', flexDirection: 'row'}}>
        <Image
          source={require('../imgs/chanel1.gif')}
          resizeMode="stretch"
          style={{
            flex: 1,
            alignSelf: 'stretch',
            width: "100%",
            height: "100%",
            borderRadius:35
          }}
          />
          <Image
            source={require('../imgs/shoes.gif')}
            resizeMode="stretch"
            style={{
              flex: 1,
              alignSelf: 'stretch',
              width: "100%",
              height: "100%",
              borderRadius:35
            }}
            />
        </View>
          <View style={{flex: 1.25, justifyContent: 'center'}}>
            <Text style={{fontWeight:'bold', fontSize:20, alignSelf: 'center'}}>Anasayfa</Text>
          </View>
          <View style={{flex: 1.25, justifyContent: 'center'}}>
            <Text style={{alignSelf: 'center', fontSize: 20}}>{this.state.questionInfo}</Text>
          </View>
          <PopupDialog
        		ref={((popupDialog)=>this.popupQuestion = popupDialog)}
        		ref={d => !this.state.popupQuestion && this.setState({ popupQuestion: d })}
        		dialogAnimation={slideAnimation}
            height={1}
      			dismissOnTouchOutside={false}
      			dismissOnHardwareBackPress={false}
      		>
              <QuestionScreen ref={((popupDialog)=>this.ss = popupDialog)}
                ref={d => !this.state.ss && this.setState({ ss: d })}
                closeQuestion={this.closeQuestion} socket={this.props.screenProps} email={this.props.navigation.state.params.email}/>
          </PopupDialog>

          <View style={styles.button}>
      			<Button
      				raised
      				title='Sor'
      				backgroundColor='#54545499'
      				onPress={() => this.requestQuestion()}
      				fontSize={18}
      				color="#e7e7d6"
      				buttonStyle={{borderRadius:12,}}
      				containerViewStyle={{backgroundColor:'#e7e7d6', borderRadius:12, marginRight:20, marginLeft:20}}
      			/>
          </View>

        {this.renderStatistics()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    width:  Dimensions.get('window').width
  },button: {
    flex: 2,
    justifyContent: 'center',
		marginBottom: 100,
		zIndex: 5,
		paddingLeft: 20,
		paddingRight:20,
	},
});
