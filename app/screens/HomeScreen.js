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


const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
const window = Dimensions.get('window');
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
    this.props.screenProps.on('requestQuestionMsg', this.requestQuestionMsgHandler);

  }
  componentDidMount(){
    //console.log(this.props);
    setTimeout(
       () => {
         var data1 = {
           socketID: this.props.screenProps.id,
           email: this.props.navigation.state.params.email
         }
         this.props.screenProps.emit("setOnlineUser", data1);
       },500
     );

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
        <View style={{flex: 1.5, backgroundColor:'#EEE', justifyContent: 'center', flexDirection: 'row'}}>
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
            containerStyle={{backgroundColor:'white'}}
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
      				color="#545454"
      				buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
      				containerViewStyle={styles.buttonContainer}
      			/>
          </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    width:  Dimensions.get('window').width
  },
  button: {
    flex: 2,
    justifyContent: 'center',
		marginBottom: 100,
		zIndex: 5,
		paddingLeft: 20,
		paddingRight:20,
	},
  buttonContainer: {
    backgroundColor:'#EDE9F0',
    borderRadius:18,
    marginRight:20,
    marginLeft:20,
    elevation:10
  }
});
