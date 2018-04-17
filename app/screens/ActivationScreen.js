import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,TouchableOpacity,
  View, AppState, FlatList, Dimensions, ActivityIndicator, TextInput, ImageBackground, Keyboard
} from 'react-native';
import Realm from 'realm';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Icon, Button } from 'react-native-elements'
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
export default class ActivationScreen extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      placeColor: '#54545499',
      fontColor: '#545454',
      isVisible: true,
      activationKey: "",
      warnings: [],
      activationMsg: ""
    }
    this.props.screenProps.on('activationMsg', this.activationMsgHandler)
  }
  componentWillMount(){
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    Realm.open({
      schema: [{name: 'user3', properties: {email: 'string', password: 'string', state: 'string', rememberMe: 'bool', get: 'int'}}]
    })
    .then(realm => {
      // realm.write(() => {
      //   realm.create('user1', {email: 'orhannfidann@gmail.com', password: '123', state: 'activation', rememberMe: true, get: 1});
      // });
      this.setState({ realm });
    });
  }
  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
    this.props.screenProps.removeListener('activationMsg', this.activationMsgHandler)
  }
  keyboardWillShow = (event) => {
    this.setState({
      isVisible: false,
    })
  }

  keyboardWillHide = (event) => {
    this.setState({
      isVisible: true,
    })
  }
  activationMsgHandler = (data) => {
    this.setState({
      activationMsg: data.message
    })
    if(data.status){
      let update = this.state.realm.objects('user3');
          this.state.realm.write(() => {
            update[0].state = "activated";
          })
      setTimeout(
         () => {
           this.props.navigation.navigate('Home', {
             email: this.props.navigation.state.params.email,
             password: this.props.navigation.state.params.password
           });
         },
           1000
         );
    }
  }
  renderFooter = () => {
    var content;
    if(this.state.isVisible){
      content = <View style={{flex: 3}}></View>
    }else{
      content = <View style={{flex: 1}}></View>;
    }
    return content;
  }
  renderHeader = () => {
    var content;
    if(this.state.isVisible){
      content = <View style={{flex: 3}}><Text style={{alignSelf: 'center', fontSize: 14, fontColor: this.state.fontColor}}>{this.state.activationMsg}  {this.state.activationKey}</Text></View>
    }else{
      content = <View style={{flex: 1}}></View>
    }
    return content;
  }
  activationPressed = () => {
    var data = {
      email: this.props.navigation.state.params.email,
      activationKey: this.state.activationKey
    }
    this.props.screenProps.emit('activateAccount', data);
  }
  newAccountPressed = () => {
    let users = this.state.realm.objects('user3').filtered('get = 1');
    let user = users[0];
    console.log("activation");
    console.log(users[0]);
    this.state.realm.write(() => {
      this.state.realm.delete(user);
    })
    this.props.navigation.goBack();
    this.props.screenProps.emit('deleteAccount', this.props.navigation.state.params.email);

  }
  newCodePressed = () => {
    this.props.screenProps.emit('requestNewActivationKey', this.props.navigation.state.params.email)
  }
  renderChangeButtons = () => {
    var content;
    if(this.state.isVisible){
      content = <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex:1}}>
          <Button
            raised
            title="Başka üyelik al"
            onPress={this.newAccountPressed}
            fontSize={15}
            color= {this.state.fontColor}
            buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
            containerViewStyle={styles.buttonSmall}
          />
        </View>
        <View style={{flex:1}}>
          <Button
            raised
            title="Kod gönder"
            onPress={this.newCodePressed}
            fontSize={15}
            color= {this.state.fontColor}
            buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
            containerViewStyle={styles.buttonSmall}
          />
        </View>
      </View>
    }else{
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
        {this.renderHeader()}
        <View style={{flex: 2, paddingRight: 20, paddingLeft: 20}}>
          <Text style={{fontSize: 16}}>Hesabınızı etkinleştirmek için <Text style={{fontWeight: 'bold', fontSize: 16}}> {this.props.navigation.state.params.email}</Text> a gönderilen kodu giriniz</Text>
        </View>
        {this.renderChangeButtons()}
        <View style={{flex: 2, paddingRight: 20, paddingLeft: 20}}>
          <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
            placeholder="Kod"
            placeholderTextColor={this.state.fontColor}
            underlineColorAndroid="transparent"
            maxLength={17}
            onChangeText = {(activationKey) => this.setState({activationKey : activationKey})}
            ref={component => this.activationInput = component}
          />
        </View>
          <Button
            raised
            title="Etkinleştir"
            onPress={this.activationPressed}
            fontSize={15}
            color= {this.state.fontColor}
            buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
            containerViewStyle={styles.buttonContainer}
          />
        {this.renderFooter()}

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
  },
  warning: {
    flex: 7,
    position: 'absolute',
    left: '70%',
    color:'#ff4500',
    top: '25%'
  },
  buttonSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor:'#E8ECF8',
    borderRadius:18,
    elevation:10
  },
  buttonContainer: {
    backgroundColor:'#EEE9EF',
    borderRadius:18,
    marginRight:20,
    marginLeft:20,
    marginTop:50,
    elevation:10
  }
});
