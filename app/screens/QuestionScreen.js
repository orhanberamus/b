import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,TouchableOpacity,
  View, AppState, FlatList, Dimensions, ActivityIndicator, ScrollView, ImageBackground
} from 'react-native';
import AnimatedBar from '../components/AnimatedBar';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Icon, Button } from 'react-native-elements'
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
const DELAY = 1000;
const window = Dimensions.get('window');
export default class QuestionScreen extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      choice: 0,
      timeOut: false,
      time: 30,
      choices: null,
      question: null,
      answered: false,
      data: []
    }
    this.props.socket.on('countDownMsg', this.countDownMsgHandler);
    this.props.socket.on('closeQuestion', this.closeQuestionHandler);


    this.props.socket.on('answerStatisticsMsg', this.answerStatisticsMsgHandler);//new
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
      color: '#13B25B',
      k: 1
    }
    if( data.true.percent < 15){
      item.text =  "";
      item.percent = Math.floor(data.true.percent);
    }
    data1.push(item);

    item = {
      width: data.false.percent * window.width / 100,
      text: 'Yanlış',
      percent: data.false.percent,
      color: '#FF5F4F',
      k: 2
    }
    if( data.false.percent < 15){
      item.text =  ""
      item.percent = Math.floor(data.false.percent);
    }
    data1.push(item);
    this.setState({
      data: data1,
      answerMessage: data.message
    });
    //this.closeQuestion();
    // this.textRef.`${data.answer}`.setNativeProps({
    //   backgroundColor: 'green'
    // });
 this.state.popupStatistics.show()
    if(data.answer === "A"){
      this.touchRef.A.setNativeProps({ style:{borderColor: '#3b8a25', borderWidth: 4, borderRadius: 14 } })
    }else if(data.answer === "B"){
      this.touchRef.B.setNativeProps({ style:{borderColor: '#3b8a25', borderWidth: 4, borderRadius: 14 } })
    }else if(data.answer === "C"){
      this.touchRef.C.setNativeProps({ style:{borderColor: '#3b8a25', borderWidth: 4, borderRadius: 14 } })
    }else if(data.answer === "D"){
      this.touchRef.D.setNativeProps({ style:{borderColor: '#3b8a25', borderWidth: 4, borderRadius: 14 } })
    }else if(data.answer === "E"){
      this.touchRef.E.setNativeProps({ style:{borderColor: '#3b8a25', borderWidth: 4, borderRadius: 14 } })
    }
    if(this.state.choice === data.answer){
      if(this.state.choice === "A"){
        this.textRef.A.setNativeProps({ style:{color: 'white'} })
        this.touchRef.A.setNativeProps({ style:{ backgroundColor: '#3b8a25', borderRadius: 14} })
      }else if(this.state.choice === "B"){
        this.textRef.B.setNativeProps({ style:{color: 'white'} })
        this.touchRef.B.setNativeProps({ style:{ backgroundColor: '#3b8a25', borderRadius: 14} })
      }else if(this.state.choice === "C"){
        this.textRef.C.setNativeProps({ style:{color: 'white'} })
        this.touchRef.C.setNativeProps({ style:{ backgroundColor: '#3b8a25', borderRadius: 14} })
      }else if(this.state.choice === "D"){
        this.textRef.D.setNativeProps({ style:{color: 'white'} })
        this.touchRef.D.setNativeProps({ style:{ backgroundColor: '#3b8a25', borderRadius: 14} })
      }else if(this.state.choice === "E"){
        this.textRef.E.setNativeProps({ style:{color: 'white'} })
        this.touchRef.E.setNativeProps({ style:{ backgroundColor: '#3b8a25', borderRadius: 14} })
      }
    }else{
      if(this.state.choice === "A"){
        this.textRef.A.setNativeProps({ style:{color: 'white'} })
        this.touchRef.A.setNativeProps({ style:{ backgroundColor: '#e81300', borderRadius: 14} })
      }else if(this.state.choice === "B"){
        this.textRef.B.setNativeProps({ style:{color: 'white'} })
        this.touchRef.B.setNativeProps({ style:{ backgroundColor: '#e81300', borderRadius: 14} })
      }else if(this.state.choice === "C"){
        this.textRef.C.setNativeProps({ style:{color: 'white'} })
        this.touchRef.C.setNativeProps({ style:{ backgroundColor: '#e81300', borderRadius: 14} })
      }else if(this.state.choice === "D"){
        this.textRef.D.setNativeProps({ style:{color: 'white'} })
        this.touchRef.D.setNativeProps({ style:{ backgroundColor: '#e81300', borderRadius: 14} })
      }else if(this.state.choice === "E"){
        this.textRef.E.setNativeProps({ style:{color: 'white'} })
        this.touchRef.E.setNativeProps({ style:{ backgroundColor: '#e81300', borderRadius: 14} })
      }
    }
  }
  renderStatistics = () => {
    var content;
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
          <Text style={{fontSize: 20, marginBottom:10}}>Diğer kullanıcıların cevapları</Text>
            <View>
              {this.state.data.map((index) => <AnimatedBar value={index.width} socket={this.props.socket} email="orhanfidan@hotmail.com" text={index.text} percent={index.percent} color={index.color} delay={DELAY * index} key={index.k} />)}
            </View>
          </View>
          </ScrollView>
        </PopupDialog>

    return content;
  }
  getQuestionFromApiAsync = () => {
    this.setState({
      isLoading: true
    });
    //fetch('http://192.168.1.24/tetris1/question.json')
    fetch('https://tezorhan.herokuapp.com/j')
      .then((response) => response.json())
      .then((responseJson) => {
      //  console.log(responseJson.choices);
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
    //this.props.closeQuestion();
    this.setState({answered: true})
  }
  emitAnswer = () => {
    var data = {
      id: this.state.id,
      choice: this.state.choice,
      email: this.props.email
    }
    this.props.socket.emit('emitUserAnswer', data);
    this.setState({
      answered: true
    })
    this.state.popupConfirm.dismiss();
  }
  countDownHandler = () => {

  }
  getChoice = (choice) => {
    this.setState({
      choice: choice
    })
    if(!this.state.answered){
      this.state.popupConfirm.show();
    }
  }
  renderContent = () => {
    let content;
    if(this.state.isLoading){
        content = <View style={{flex: 1, padding: 20, alignItems:'center', justifyContent:'center'}}>
              <ActivityIndicator size="large" color="#3793fc"/>
            </View>
    }else{
      if(!this.state.timeOut){
        content =
        <View style={styles.container}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <View style={{flex:1, alignItems: 'flex-end'}}>
              <Text style={{fontSize:24, color: 'black'}}>{this.state.time}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Icon
                name='close'
                type='font-awesome'
                color='black'
                size={30}
              />
            </View>
          </View>
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
              ref="REF-FLATLIST"
              data={this.state.choices}
              horizontal={false}
              extraData={this.state}
              style={styles.choiceContainer}
              renderItem={ ({item}) =>
                <TouchableOpacity  onPress={() => this.getChoice(item.choice)} ref={(ref) => this.touchRef = {...this.touchRef, [`${item.choice}`]: ref}}>
                  <Text style={styles.choice} ref={(ref) => this.textRef = {...this.textRef, [`${item.choice}`]: ref}}><Text style={{fontWeight: 'bold', color: 'black'}}>{item.choice})</Text> {item.choiceText}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
          if(this.textRef !== undefined){
          }
      }else{
        content = null;
      }
    }
    return content;
  }

  noPressed = () => {
    this.setState({choice: 0});
    this.state.popupConfirm.dismiss();
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
          position:'absolute',

        }}
        >
        <View style={{flex:1 ,  marginBottom: 50}}>
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
        {this.renderStatistics()}
        </View>
      </ImageBackground>
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
