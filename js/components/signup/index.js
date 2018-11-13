import React, { Component } from "react";
import { Image, Dimensions, TouchableOpacity, Alert, TextInput } from "react-native";
import {URLclass} from '../lib/';
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
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import { login } from "../../actions/user";
import RNDeviceToken from 'react-native-device-token';
import FCM, { FCMEvent } from 'react-native-fcm';
import DeviceInfo from 'react-native-device-info';

const logo = require("../../../images/logo.png");
const startNowBtn = require("../../../images/btn_startNow@3x.png");
const googleLoginBtn = require("../../../images/login/btn_login_goole@3x.png");
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class Signup extends Component {
  static propTypes = {
    setUser: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      email: "",
      companyName: "",
      fullName: "",
      password: "",
      longitude: 0,
      latitude: 0,
      device_type: "android",
      access_token: null
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.state.longitude = position.coords.longitude;
        this.state.latitude = position.coords.latitude;
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
            console.log('======Update location success =======')
          })
        },
        (error) => console.log('======Update location error =======', error),
        { enableHighAccuracy: true, timeout: 20000 },
      );
    }, 1000*60)
  }



  
  clickSignupBtn() {
    if (this.state.email == "" || this.state.password == "" || this.state.fullName == "" || this.state.companyName == "") {
      Alert.alert("Please enter the all fields.")
    } else {

      this.setState({visible:true})

      FCM.getFCMToken().then(token => {
        console.log('DEVICE TOKEN=================signup============', token)
        var signup_url = URLclass.url + 'signup'
        fetch(signup_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'latitude': this.state.latitude,
                'longitude': this.state.longitude
            },
            body: JSON.stringify({
                email: this.state.email,
                name: this.state.fullName,
                company: this.state.companyName,
                password: this.state.password,
                device_id: token,
                device: this.state.device_type
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success == true) {
            this.setState({visible:false})
            this.props.login(responseData)

            this.setState({access_token: responseData.token})
            this.state.access_token = responseData.token
            {this.update_location()}

            this.props.navigation.navigate("IntroductPage")
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
          
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{marginTop:deviceHeight/30}}>
                <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                    <Icon active name="arrow-back" />
                </Button>              
            </View>

            <Image source={logo} style={styles.shadow}>
            </Image>

            <View style={styles.bg}>
              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12, marginBottom: deviceHeight/40}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Email' keyboardType = 'email-address' autoCapitalize = 'none' onChangeText={email => this.setState({ email })} />
              </Item>
              
              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12, marginBottom: deviceHeight/40}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Full Name' onChangeText={fullName => this.setState({ fullName })} />
              </Item>

              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12, marginBottom: deviceHeight/40}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Company Name' onChangeText={companyName => this.setState({ companyName })} />
              </Item>

              <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12}}>
                <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30}} placeholder='Password' secureTextEntry onChangeText={password => this.setState({ password })} />
              </Item>

              <TouchableOpacity onPress={() => this.clickSignupBtn()}>
                <Image source={startNowBtn} style={styles.loginBtnStyle} />
              </TouchableOpacity>
              
            </View>
            
          </Content>
        </View>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    login: data => dispatch(login(data))
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindAction)(Signup);

// const LoginSwag = reduxForm(
//   {
//     form: "test",
//     validate
//   },
//   function bindActions(dispatch) {
//     return {
//       setUser: name => dispatch(setUser(name))
//     };
//   }
// )(Signup);
// LoginSwag.navigationOptions = {
//   header: null
// };
// export default LoginSwag;
