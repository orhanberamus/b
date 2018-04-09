import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, AppState, Dimensions, ActivityIndicator, FlatList, ScrollView
} from 'react-native';
import QuestionScreen from '../screens/QuestionScreen';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Icon, Button } from 'react-native-elements'

import AnimatedBar from '../components/AnimatedBar';
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
const window = Dimensions.get('window');
const DELAY = 100;
export default class App extends Component<Props> {
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
    this.props.socket.on('answerStatisticsMsg', this.answerStatisticsMsgHandler);
    this.props.socket.on('requestQuestionMsg', this.requestQuestionMsgHandler);

  }
  componentDidMount(){
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
      this.props.socket.emit("requestQuestion", "amyamy")
    }
  }
  closeQuestion = () => {//question text
    this.state.popupQuestion.dismiss();
    setTimeout(() => {
      this.state.popupStatistics.show();
    }, 500);
    //this.props.socket.emit("getAnswerStatistics", 2);
    //this.props.socket.emit("updateUserAnswer", data)
  }
  renderStatistics = () => {
    var  content = <PopupDialog
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
            {this.state.data.map((index) => <AnimatedBar value={index.width} socket={this.props.socket} email="orhanfidan@hotmail.com" text={index.text} percent={index.percent} color={index.color} delay={DELAY * index} key={index.k} />)}
          </View>
        </View>
        </ScrollView>
      </PopupDialog>
    return content;
  }
  render() {
    return (
      <View style={styles.container}>
      <View style={{flex: 1, backgroundColor:'#EEE', justifyContent: 'center'}}><Text style={{alignSelf: 'center', fontSize: 20}}>REKLAM</Text></View>
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
              closeQuestion={this.closeQuestion} socket={this.props.socket}/>
        </PopupDialog>
        <Text style={{fontWeight:'bold', fontSize:20, alignSelf: 'center'}}>Anasayfa</Text>
        <View style={styles.button}>
    			<Button
    				raised
    				title='Sor'
    				backgroundColor='#545454'
    				onPress={() => this.requestQuestion()}
    				fontSize={22}
    				color="#e7e7d6"
    				buttonStyle={{borderRadius:12,}}
    				containerViewStyle={{backgroundColor:'#e7e7d6', borderRadius:12, marginRight:20, marginLeft:20}}
    			/>
        </View>

        <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
      {this.renderStatistics()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    width:  Dimensions.get('window').width
  },button: {
    flex: 1,
    justifyContent: 'center',
		marginBottom: 20,
		marginTop: 20,
		zIndex: 5,
		paddingLeft: 20,
		paddingRight:20,
	},
});
