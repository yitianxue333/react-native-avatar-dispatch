import React, { Component } from "react";
import { Image, Dimensions, TouchableOpacity, Alert, TextInput } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser, login } from "../../actions/user";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import {URLclass} from '../lib/';
// import {Update_location} from '../UpdateLocation/';
// import {checkPermission} from 'react-native-android-permissions';
import RNDeviceToken from 'react-native-device-token';
import DeviceInfo from 'react-native-device-info';
import FCM, { FCMEvent } from 'react-native-fcm';
import BackgroundTimer from 'react-native-background-timer';

const logo = require("../../../images/logo.png");
const loginBtn = require("../../../images/login/btn_login@3x.png");
const signupBtn = require("../../../images/btn_signup@3x.png");
const googleLoginBtn = require("../../../images/login/btn_login_goole@3x.png");
// const clockGif = require("../../images/Clock.gif")

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class Login extends Component {

  static navigationOptions = {
    header: {
      visible: false,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      visible: false,
      longitude: 0,
      latitude: 0,
      device_type: "android",
      access_token: null
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // this.state.longitude = position.coords.longitude;
        // this.state.latitude = position.coords.latitude;
        this.setState({longitude: position.coords.longitude})
        this.setState({latitude: position.coords.latitude})
      },
      (error) => console.log('======ERROR =======', error),
      { enableHighAccuracy: true, timeout: 20000 },
    );

    var temp_device_type = DeviceInfo.getSystemName()
    if (temp_device_type == "Android") {
      this.state.device_type = "android"
      this.setState({device_type: "android"})
    } else {
      this.state.device_type = "iphone"
      this.setState({device_type: "iphone"})
    }
  }

  update_location() {
    setInterval( () => {
      console.log('======ACCESS TOKEN =======', this.state.access_token)
      navigator.geolocation.getCurrentPosition(
        (position) => {

          var chanage_location_url = URLclass.url + 'user/location/update'
          fetch(chanage_location_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': this.state.access_token
            },
            body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
          })
          .then((response) => response.json())
          .then((responseData) => {
            console.log('======Update location success =======', position.coords.latitude, position.coords.longitude)
          })
        },
        (error) => console.log('======Update location error =======', error),
        { enableHighAccuracy: true, timeout: 20000 },
      );
    }, 1000*60)
  }

  clickLoginBtn() {
    if (this.state.email == "" || this.state.password == "") {
      Alert.alert("Please enter the fields.")
    } else {

      this.setState({visible:true})
      var login_url = URLclass.url + 'login'
      
      FCM.getFCMToken().then(token => {
        console.log('DEVICE_TOKEN==================', token)

        FCM.getInitialNotification().then(notif => {
          console.log("INITIAL NOTIFICATION", notif)
        });

        fetch(login_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'latitude': this.state.latitude,
                'longitude': this.state.longitude
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                device_id: token,
                device: this.state.device_type
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success == true) {
            console.log('LOGIN DATA=======================', responseData)
            this.setState({visible:false})
            this.setState({access_token: responseData.token})
            this.state.access_token = responseData.token
            // {Update_location.start111()}

            {this.update_location()}

            this.props.login(responseData)
            this.props.navigation.navigate("Home")
          } else {
            var self=this
            self.setState({visible:false})

            setTimeout(function(){
              Alert.alert(responseData.errorMessage)
            }, 300);            
          }
        })
      });
    }
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <Content>

            <Image source={logo} style={styles.shadow}>
            </Image>

            <View style={styles.bg}>
              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12, marginBottom: deviceHeight/40}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Email' keyboardType = 'email-address' autoCapitalize = 'none' onChangeText={email => this.setState({ email })} />
              </Item>

              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Password' secureTextEntry onChangeText={password => this.setState({ password })} />
              </Item>

              <TouchableOpacity onPress={() => this.clickLoginBtn()}>
                <Image source={loginBtn} style={styles.loginBtnStyle} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.navigate("Signup")}>
                <Image source={signupBtn} style={styles.signupBtnStyle} />
              </TouchableOpacity>
              
              <View style={styles.orStyle}>
                <View style={styles.lineStyle} />
                <Text style={{color: '#888888', marginLeft:deviceWidth/30, marginRight: deviceWidth/30, fontSize: 20, fontWeight: '600'}}>or</Text>
                <View style={styles.lineStyle} />
              </View>

              <TouchableOpacity onPress={() => this.props.navigation.navigate("AccountCheckerPage")}>
                <Image source={googleLoginBtn} style={styles.googleLoginBtnStyle} />
              </TouchableOpacity>

              <View style={{flexDirection: 'row', margin: deviceWidth/12, alignSelf: 'center', alignItems: 'center'}}>
                <TouchableOpacity>
                  <Text style={{color: '#728dd5'}}>Privacy Policy</Text>
                </TouchableOpacity>
                <View style={{backgroundColor: '#728dd5', width:1, height: deviceHeight/50, marginLeft:deviceWidth/30, marginRight: deviceWidth/30}} />
                <TouchableOpacity>
                  <Text style={{color: '#728dd5'}}>Terms of use</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          </Content>
        </View>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setUser: name => dispatch(setUser(name)),
    login: data => dispatch(login(data)),
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list,
  data: state.user.data
});

export default connect(mapStateToProps, bindAction)(Login);
