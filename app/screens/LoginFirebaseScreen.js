import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image, ActivityIndicator, TextInput, ImageBackground, TouchableOpacity, StatusBar, Keyboard, ScrollView, Dimensions
} from 'react-native';
import { Icon, Button  } from 'react-native-elements';
import AnimatedBar from '../components/AnimatedBar';
import AnimatedCircle from '../components/AnimatedCircle';
import {CheckBox} from 'native-base';
const FBSDK = require('react-native-fbsdk');
import Realm from 'realm';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
const slideAnimation = new SlideAnimation({
	slideFrom: 'bottom',
});
import * as firebase from "firebase";
var config = {
    apiKey: "AIzaSyBT_SohPao5OJf78fOWSBap7wpkx3fsChg",
    authDomain: "fcmdeneme-db320.firebaseapp.com",
    databaseURL: "https://fcmdeneme-db320.firebaseio.com",
    projectId: "fcmdeneme-db320",
    storageBucket: "fcmdeneme-db320.appspot.com",
    messagingSenderId: "829281769500"
 };
 const DELAY = 1000;
 const window = Dimensions.get('window');
export const firebaseRef = firebase.initializeApp(config);
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} = FBSDK;
export default class LoginFirebaseScreen extends Component{
  constructor(){
    super();
    this.state = {
      realm: null,
      d: "",
      token: null,
      email: "",
      password: "",
      name: "",
      id: "",
      accounts: "",
      userName: "",
      userIcon: "",
      items: [],
      user: null,
      loading: false,
      placeColor: '#54545499',
      fontColor: '#545454',
      isVisible: true,
      checked: false,
      rememberMe: false,
      loginMessage: "",
      buttonCooldown: false,
      data1: [
        {
          width: 50 * window.width / 100,
          text: 'Doğru',
          percent: 50,
          color: '#3b8a25',
          k: 1,
          r:"D"
        },
        {
          width: 50 * window.width / 100,
          text: 'Yanlış',
          percent: 50,
          color: '#e81300',
          k: 2,
          r: "Y"
        }
      ]
    }
      this.itemsRef = this.getRef().child('users');

  }
  getRef = () => {
    return firebaseRef.database().ref();
  }
  componentDidMount(){
   //this.getItems(this.itemsRef);
   console.log(this.props.screenProps);
   this.props.screenProps.on('loginResponse', this.loginResponseHandler);
   this.props.screenProps.on('addFacebookUserResponse', this.addFacebookUserResponseHandler);

  }
  componentWillMount(){
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);

    this.props.screenProps.removeListener('loginResponse', this.loginResponseHandler);
    this.props.screenProps.removeListener('addFacebookUserResponse', this.addFacebookUserResponseHandler);

    Realm.open({
      schema: [{name: 'user3', properties: {email: 'string', password: 'string', state: 'string', rememberMe: 'bool', get: 'int'}}]
    })
    .then(realm => {
      // realm.write(() => {
      //   realm.create('user1', {email: 'orhannfidann@gmail.com', password: '123', state: 'activation', rememberMe: true, get: 1});
      // });
      this.setState({ realm });
    });
    setTimeout(
       () => {
               let users = this.state.realm.objects('user3').filtered('get = 1');
               if(users.length > 0){
                 let user = users[0];
                 console.log(users[0]);
                 if(user.state === 'activated'){
                   if(user.rememberMe){
                     this.setState({
                       email: user.email,
                       password: user.password,
                       rememberMe: user.rememberMe
                     })
                     //this.props.navigation.navigate('Home', {email: user.email});
                   }
                 }else if(user.state === 'activation'){
                   this.props.navigation.navigate('Activation', {email: user.email});
                 }
               }

               console.log("component mount" + this.state.rememberMe)
             },
         1000
     );

  }
  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
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
  loginResponseHandler = (data) => {
    if(this.state.rememberMe){
      let update = this.state.realm.objects('user3');
      if(update.length > 0){
        this.state.realm.write(() => {
          update[0].rememberMe = this.state.rememberMe;
          update[0].email = data.email;
          update[0].password = this.state.password;
          update[0].state = 'activated';
        })
      }else if(update.length  === 0){
        this.state.realm.write(() => {
          this.state.realm.create('user3', { email: data.email, password: this.state.password.toString(), state: 'activated', rememberMe: this.state.rememberMe, get: 1 });
        });
      }
    }
    this.setState({
      loginMessage: data.message
    })
    if(data.status){

      this.props.navigation.navigate('Home', {email: data.email});
    }
  }
  addFacebookUserResponseHandler = (data) => {
    if(data.status && !data.member){//ilk girişi ondan realme de kaydet
      let update = this.state.realm.objects('user3');
      if(update.length > 0){
        this.state.realm.write(() => {
          update[0].rememberMe = true;
          update[0].email = data.email;
          update[0].password = data.password.toString();
          update[0].state = 'activated';
        })
      }else if(update.length  === 0){
        this.state.realm.write(() => {
          this.state.realm.create('user3', { email: data.email, password: data.password.toString(), state: 'activated', rememberMe: true, get: 1 });
        });
      }

      this.props.navigation.navigate('Home', { email: data.email, password: data.password });

    }else if(data.status && data.member){//direk home a yolla
      this.props.navigation.navigate('Home', { email: data.email, password: data.password });
      let update = this.state.realm.objects('user3');
      if(update.length > 0){
        this.state.realm.write(() => {
          update[0].rememberMe = true;
          update[0].email = data.email;
          update[0].password = data.password.toString();
          update[0].state = 'activated';
        })
      }else if(update.length  === 0){
        this.state.realm.write(() => {
          this.state.realm.create('user3', { email: data.email, password: data.password.toString(), state: 'activated', rememberMe: true, get: 1 });
        });
      }
    }

  }
  getUser = () => {

    let users = this.state.realm.objects('user3').filtered('get = 1');;
    let user = users[0];
    console.log(user.email);
    console.log(user.password);
    this.setState({
      email: user.email,
      password: user.password
    })
  }

  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log('Success fetching data: ' + JSON.stringify(result));
      var number = Math.random(1);
      var data = {
        firstName: result.first_name,
        lastName: result.last_name,
        phone: "F",
        email: result.email,
        password: number,
        activationKey: "F",
        activated: 1,
        from: "F"
      }
      this.props.screenProps.emit("addFacebookUser", data)

    }
  }

  signUp = () => {
    if(!this.state.buttonCooldown){
      this.setState({buttonCooldown: true})
      setTimeout(
         () => {this.setState({buttonCooldown: false})},
           200
       );

      this.props.navigation.navigate('SignUp');
    }
  }
  login = () => {
    if(!this.state.buttonCooldown){
      console.log("button pressed");
      var data = {
        email: this.state.email,
        password: this.state.password
      }
      this.props.screenProps.emit('login', data)
      this.setState({buttonCooldown: true})
      setTimeout(
         () => {this.setState({buttonCooldown: false})},
           1500
       );
    }
  }
  deleteAll = () => {
    let d = this.state.realm.objects('user3');
    console.log(d.length);
    for(var i = 0; i < d.length; i++){
      this.state.realm.write(() => {
        this.state.realm.delete(d[i]);
      })
    }

  }
  rememberMeHandler = (status) => {

    this.setState({rememberMe: !status})

  }
  _fbAuth = () => {

    if(!this.state.buttonCooldown){
      this.setState({buttonCooldown: true})
      LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
        (result) => {
          if(result.isCancelled){
            alert('login cancelled');
            this.setState({
              loading: false
            })
          }else {
            this.setState({
              loading: true
            })
            AccessToken.getCurrentAccessToken().then( (accessTokenData) => {
              const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
              /*this.setState({
                token: accessTokenData.accessToken
              });*/
              firebase.auth().signInWithCredential(credential).then((result) =>{
                //promise was succesful

                this.setState({
                  user: firebase.auth().currentUser
                });
                let infoRequest = new GraphRequest(
                  '/me',
                  {
                    accessToken: accessTokenData.accessToken,
                    parameters: {
                      fields: {
                        string: 'first_name, last_name, email, id'
                      }
                    }
                  },
                  this._responseInfoCallback
                );
                new GraphRequestManager().addRequest(infoRequest).start();

              }, (error) => {
                //promise was rejected
                console.log(error)
              })
              //this.getItems(this.itemsRef);
            }, (error) =>{
              console.log('some error occured '+ error)
            })
          }
        }
      )
      setTimeout(
         () => {this.setState({buttonCooldown: false})},
           2000
      );
    }
  }

  renderButtons = () => {
    var content;
    if(this.state.isVisible){
      content =
      <View style={{flex: 2}}>
        <View style={{flex:1, zIndex: 5, paddingBottom:30}}>
          <Button
            raised
            title="Facebook'la bağlan"
            backgroundColor='#4080FF'
            onPress={this._fbAuth}
            fontSize={14}
            buttonStyle={{padding:5}}
            buttonStyle={{borderRadius:18,}}
            containerViewStyle={styles.buttonContainer}
          />
          <Button
            raised
            title="sil"
            backgroundColor='#4080FF'
            onPress={this.deleteAll}
            fontSize={14}
            buttonStyle={{padding:5}}
            buttonStyle={{borderRadius:18,}}
            containerViewStyle={styles.buttonContainer}
          />

          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems:'center',  marginRight:40, }}>
            <TouchableOpacity onPress={this.signUp} style={{flex: 7, marginRight: 50}}>
              <Text style={{alignSelf: 'center'}}>Üyeliğin mi yok? Hemen kaydol</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.state.popupTerms.show()} style={{flex: 1,}}>
              <Image
                source={require('../imgs/terms.png')}
                resizeMode="contain"
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  width: '80%',
                  height: '100%',
                }}
                />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, }}>
          </View>
      </View>
    }else{
      content = null
    }
    return content;
  }
  renderEnvelope = () => {
    var content;
    if(this.state.rememberMe){
      content =

    <View style={{flex: 1, flexDirection: 'row', paddingRight: 40, paddingLeft: 40,}}>
      <Icon
        name='email'
        iconType='font-awesome'
        color={this.state.fontColor}
        size={20}
        iconStyle={{paddingRight:10}}
        containerStyle={{borderColor: this.state.fontColor, borderBottomWidth: 1, }}
      />
      <TextInput style={{flex:7, fontSize:14, borderColor: this.state.fontColor, borderBottomWidth: 1,}}
        placeholder="E-posta"
        placeholderTextColor={this.state.fontColor}
        underlineColorAndroid="transparent"
        maxLength={40}
        value={this.state.email}
        onChangeText = {(email) => this.setState({email : email})}
        ref={component => this.emailInput = component}
      />
    </View>

    }else{
      content =
      <View style={{flex: 1, flexDirection: 'row', paddingRight: 40, paddingLeft: 40,}}>
        <Icon
          name='envelope'
          type='simple-line-icon'
          color={this.state.fontColor}
          size={18}
          iconStyle={{paddingRight:10}}
          containerStyle={{borderColor: this.state.fontColor, borderBottomWidth: 1, }}
        />
        <TextInput style={{flex:7, fontSize:14, borderColor: this.state.fontColor, borderBottomWidth: 1, paddingLeft: 6}}
          placeholder="E-posta"
          placeholderTextColor={this.state.fontColor}
          underlineColorAndroid="transparent"
          maxLength={40}
          value={this.state.email}
          onChangeText = {(email) => this.setState({email : email})}
          ref={component => this.emailInput = component}
        />
      </View>

    }
    return content;
  }
  renderLock = () => {
    var content;
    if(this.state.rememberMe){
      content =
      <View style={{flex: 1, flexDirection: 'row', paddingRight: 40, paddingLeft: 40,}}>
        <Icon
          name='lock'
          iconType='font-awesome'
          color={this.state.fontColor}
          size={22}
          iconStyle={{paddingRight:10}}
          containerStyle={{borderColor: this.state.fontColor, borderBottomWidth: 1}}
        />
        <TextInput style={{flex: 7, fontSize:14, borderColor: this.state.fontColor, borderBottomWidth: 1,}}
          placeholder="Şifre"
          placeholderTextColor={this.state.fontColor}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          maxLength={20}
          value={this.state.password}
          onChangeText = {(password) => this.setState({password : password})}
          ref={component => this.passwordInput = component}
        />
      </View>

    }else{
      content =
      <View style={{flex: 1, flexDirection: 'row', paddingRight: 40, paddingLeft: 40,}}>
        <Icon
          name='lock'
          type='simple-line-icon'
          color={this.state.fontColor}
          size={18}
          containerStyle={{borderColor: this.state.fontColor, borderBottomWidth: 1}}
        />
        <TextInput style={{flex: 7, fontSize:14, borderColor: this.state.fontColor, borderBottomWidth: 1, paddingLeft:18}}
          placeholder="Şifre"
          placeholderTextColor={this.state.fontColor}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          maxLength={20}
          value={this.state.password}
          onChangeText = {(password) => this.setState({password : password})}
          ref={component => this.passwordInput = component}
        />
      </View>

    }
    return content;

  }
  renderContent = () => {
    var content ;
    const shadowOpt = {
			width:160,
			height:170,
			color:"#000",
			border:2,
			radius:3,
			opacity:0.2,
			x:0,
			y:3,
			style:{marginVertical:5}
		}
    if(this.state.loading){
      content = <View style={{flex: 1, padding: 20, alignItems:'center', justifyContent:'center', backgroundColor:'#F5FCFF'}}>
            <ActivityIndicator size="large" color="#4080FF"/>
          </View>
    }else{
      content =   <View style={{flex:1,}}>
          <View style={{flex:1, justifyContent: 'center'}}>
            <Text style={{alignSelf:'center', fontSize:20, color:'red'}}>{this.state.loginMessage}{this.state.email}</Text>
          </View>
            {this.renderEnvelope()}

            {this.renderLock()}

          <View style={{flex: 1, flexDirection: 'row', paddingRight: 40, paddingLeft: 32,}}>
            <TouchableOpacity style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start' }} onPress={() => this.rememberMeHandler(this.state.rememberMe)}>
              <CheckBox
                checked={this.state.rememberMe}
                color={this.state.fontColor}
                onPress={() => this.rememberMeHandler(this.state.rememberMe)}
              />
              <Text style={{marginLeft: 20, color: this.state.fontColor }}>Beni hatırla</Text>
            </TouchableOpacity>
            <View style={{flex:4, justifyContent: 'center', alignItems:'flex-end', }}><Text style={{ color: this.state.fontColor}}>Şifremi unuttum</Text></View>
          </View>
          <View style={{flex:1, zIndex: 5, paddingTop:30}}>
            <Button
              raised
              title="Giriş yap"
              fontSize={14}
              color= {this.state.fontColor}
              onPress={this.login}
              buttonStyle={{borderRadius:12, backgroundColor:'rgba(255, 255, 255, 0)'}}
              containerViewStyle={styles.buttonContainer}
            />

          </View>

          <PopupDialog
              ref={((popupDialog)=>this.popupTerms = popupDialog)}
              ref={d => !this.state.popupTerms && this.setState({ popupTerms: d })}
              dialogAnimation={slideAnimation}
              height={1}
              dismissOnTouchOutside={true}
              dismissOnHardwareBackPress={true}
            >
            <ScrollView style={{zIndex: 10, }}>
              <View style={{ flex: 1, backgroundColor: '#F5FCFF', justifyContent: 'center',padding: 20 }}>
              <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20}}>Kullanım Koşulları</Text>
              <Text style={{fontSize: 14, zIndex: 100}}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
               explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
               eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
               adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
               enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
                 fugiat quo voluptas nulla pariatur?Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                   ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
                    sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
                     eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
                      ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
                       voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                         quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                          voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt
                          . Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
                           modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
                            ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
                            ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                            </Text>
              <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 50,}} onPress={() => {this.setState({checked: true}); setTimeout(() => {this.state.popupTerms.dismiss();},1000); } }>
                <CheckBox
                  checked={this.state.checked}
                  onPress={() => { this.setState({checked: true}); setTimeout(() => {this.state.popupTerms.dismiss();},1000); } }
                  color="green"
                />
                <Text style={{marginLeft: 20}}>Anladım ve kabul ediyorum</Text>
              </TouchableOpacity>
              <Text >{this.state.checked}</Text>
              </View>
              <View style={{marginBottom: 50}}></View>
              </ScrollView>
            </PopupDialog>
          {this.renderButtons()}
        </View>
    }
    return content;
  }
  render(){
    return(

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
          <StatusBar backgroundColor="#545454"/>

     			 {this.renderContent()}
           </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  gameIcon: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf:'center'
  },
  buttonContainer: {
    backgroundColor:'#ECEAF3',
    borderRadius:18,
    marginRight:20,
    marginLeft:20,
    elevation:10
  }
});
