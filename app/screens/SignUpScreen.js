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
export default class SignUpScreen extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      placeColor: '#54545499',
      fontColor: '#545454',
      isVisible: true,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
      firstNameWarning: "",
      lastNameWarning: "",
      phoneWarning: "",
      sideEmailWarning: "",
      passwordWarning: "",
      rePasswordWarning: "",
      isEmailValid: false,
      emailWarning: ""
    }
    this.props.screenProps.on('addNewUserResponse', this.addNewUserResponseHandler);
    this.props.screenProps.on('checkEmailResponse', this.checkEmailResponseHandler)
  }
  componentWillMount(){
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    Realm.open({
      schema: [{name: 'user3', properties: {email: 'string', password: 'string', state: 'string', rememberMe: 'bool', get: 'int'}}]
    })
    .then(realm => {
      this.setState({ realm });
    });
  }
  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
    this.props.screenProps.removeListener('addNewUserResponse', this.addNewUserResponseHandler);
    this.props.screenProps.removeListener('checkEmailResponse', this.checkEmailResponseHandler);
  }
  addNewUserResponseHandler = (data) => {
    console.log("goin activation")
    if(data.status){
      this.props.navigation.navigate('Activation', {
          email: data.email,
          password: data.password
        });

      // this.props.navigation.dispatch({
      //   type: 'ReplaceCurrentScreen',
      //   routeName: 'Activation',
      //   params: {
      //     email: this.state.email,
      //     password: this.state.password
      //   }
      // });
    }
  }
  backPressed = () => {
    this.props.navigation.goBack();
  }
  checkEmailResponseHandler = (data) => {
    console.log(data);
    this.setState({
      emailWarning: data.message
    })
    if(data.status){
      this.setState({
        isEmailValid: true
      });
    }else{
      this.setState({
        isEmailValid: false
      });
    }
    this.checkEntryValidity();
  }
  renderButton = () => {
    var content;
    if(this.state.isVisible){
      content =
      <View style={{flex:2}}>
        <Button
          raised
          title="Kayıt ol"
          backgroundColor='#4080FF'
          onPress={this.checkEntryValidity}
          fontSize={15}
          color= {this.state.fontColor}
          buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
          containerViewStyle={{backgroundColor:'rgba(255, 255, 255, 0)', borderRadius:18, borderWidth: 1, marginRight:20, marginLeft:20, borderColor:this.state.fontColor}}
        />
        <View style={{flex: 1, paddingRight: 20, paddingLeft: 20,}}>

        </View>
      </View>
    }else{
      content = null
    }
    return content;
  }
  renderHeader = () => {
    var content;
    if(this.state.isVisible){
      content = <View style={{flex: 1, paddingRight: 20, paddingLeft: 20, justifyContent: 'center'}}>
      </View>
    }else{
      content =<View style={{flex: 1, paddingRight: 20, paddingLeft: 20, justifyContent: 'center'}}>
      </View>
    }
    return content
  }
  checkEntryValidity = () => {
    var emptyArr =  []
    var firstNameEmpty = this.checkEmpty(this.state.firstName, "firstName");
    var lastNameEmpty = this.checkEmpty(this.state.lastName, "lastName");
    var phoneEmpty = this.checkEmpty(this.state.phone, "phone");
    var emailEmpty = this.checkEmpty(this.state.email, "email");
    var passwordEmpty = this.checkEmpty(this.state.password, "password");
    var rePasswordEmpty = this.checkEmpty(this.state.rePassword, "rePassword");
    this.checkPassword();
    if(!firstNameEmpty && !lastNameEmpty && !phoneEmpty && !emailEmpty && !passwordEmpty && !rePasswordEmpty && this.checkPassword()){
      if(!this.state.isEmailValid){
        this.props.screenProps.emit('checkEmail', this.state.email);
      }
      if(this.state.isEmailValid){
        console.log("true") // activition key gonder //database e kaydet
        var number = Math.random(1);
        var s = number.toString();
        var activationKey = s.slice(2, s.length);

        var data = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phone: this.state.phone,
          email: this.state.email,
          password: this.state.password,
          activationKey: 2,
          activated: false,
          from: 'E'
        }
        this.props.screenProps.emit("addNewUser", data)

        this.state.realm.write(() => {
          this.state.realm.create('user3', {email: this.state.email, password: this.state.password, state: 'activation', rememberMe: true, get: 1});
        });
      }
    }else{
      console.log('false');
    }

  }

  checkEmpty = (str, nameForIndex) => {
    var regEmpty = new RegExp('^ {1,}$', 'g');
    var res = str.match(regEmpty)
    var isEmpty = true;
    console.log(res);
    if(res === null && str !== ""){
      isEmpty = false;
      if(nameForIndex === "firstName"){
        this.setState({firstNameWarning: ""});
      }else if(nameForIndex === "lastName"){
        this.setState({lastNameWarning: ""});
      }else if(nameForIndex === "phone"){
        this.setState({phoneWarning: ""});
      }else if(nameForIndex === "email"){
        this.setState({sideEmailWarning: ""});
      }else if(nameForIndex === "password"){
        this.setState({passwordWarning: ""});
      }else if(nameForIndex === "rePassword"){
        this.setState({rePasswordWarning: ""});
      }
    }else{
      if(nameForIndex === "firstName"){
        this.setState({firstNameWarning: "Zorunlu alan"});
      }else if(nameForIndex === "lastName"){
        this.setState({lastNameWarning: "Zorunlu alan"});
      }else if(nameForIndex === "phone"){
        this.setState({phoneWarning: "Zorunlu alan"});
      }else if(nameForIndex === "email"){
        this.setState({sideEmailWarning: "Zorunlu alan"});
      }else if(nameForIndex === "password"){
        this.setState({passwordWarning: "Zorunlu alan"});
      }else if(nameForIndex === "rePassword"){
        this.setState({rePasswordWarning: "Zorunlu alan"});
      }
    }
    console.log("aaaa " + this.state.firstNameWarning);
    console.log("bbb " + this.state.firstName);
    return isEmpty;
  }
  checkPassword = () => {
    var result = true;
    if(this.state.password !== this.state.rePassword){
      result = false;
      this.setState({
        rePasswordWarning: "Şifreler uyuşmuyor"
      })
    }
    return result;

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
          <View style={{flex: 1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20}}>
            <Text style={{flex: 7, position: 'absolute', right:'10%', color:'#ff4500', top: '22%', alignSelf: 'flex-end'}}>{this.state.firstNameWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
              placeholder="Ad"
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              maxLength={17}
              onChangeText = {(firstName) => this.setState({firstName : firstName})}
              ref={component => this.firstNameInput = component}
            />
          </View>
          <View style={{flex: 1 , flexDirection: 'row', paddingRight: 20, paddingLeft: 20,}}>
            <Text style={styles.warning}>{this.state.lastNameWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 1.7, paddingLeft:10}}
              placeholder="Soyad "
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              maxLength={17}
              onChangeText = {(lastName) => this.setState({lastName : lastName})}
              ref={component => this.lastNameInput = component}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20,}}>
            <Text style={styles.warning}>{this.state.phoneWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
              placeholder="Telefon (5xx) xxx xx xx"
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              maxLength={10}
              keyboardType={'numeric'}
              onChangeText = {(phone) => this.setState({phone : phone})}
              ref={component => this.phoneInput = component}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20,}}>
            <Text style={styles.warning}>{this.state.sideEmailWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
              placeholder="E-posta"
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              maxLength={30}
              keyboardType={'email-address'}
              onChangeText = {(email) => this.setState({email : email})}
              ref={component => this.emailInput = component}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20,}}>
            <Text style={styles.warning}>{this.state.passwordWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
              placeholder="Şifre"
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              maxLength={8}
              onChangeText = {(password) => this.setState({password : password})}
              ref={component => this.passwordInput = component}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20,}}>
            <Text style={styles.warning}>{this.state.rePasswordWarning}</Text>
            <TextInput style={{flex: 7, fontSize:16, borderColor: this.state.fontColor, borderBottomWidth: 2, paddingLeft:10}}
              placeholder="Şifre tekrar"
              placeholderTextColor={this.state.placeColor}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              maxLength={8}
              onChangeText = {(rePassword) => this.setState({rePassword : rePassword})}
              ref={component => this.rePasswordInput = component}
            />
          </View>
          <View style={{flex: 1, paddingRight: 20, paddingLeft: 20, justifyContent: 'center'}}>
            <Text style={{color:'#ff4500'}}>{this.state.emailWarning}</Text>
          </View>
          {this.renderButton()}
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
    right: '10%',
    color:'#ff4500',
    top: '25%',
    alignSelf: 'flex-end'
  }
});
