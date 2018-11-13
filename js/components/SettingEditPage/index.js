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
  Text, Header, Body, Right, Left
} from "native-base";
import { Field, reduxForm } from "redux-form";
import Spinner from 'react-native-loading-spinner-overlay';
import { URLclass } from '../lib/';
import {change_loginData} from "../../actions/user"

const logo = require("../../../images/logo.png");
const startNowBtn = require("../../../images/btn_startNow@3x.png");
const googleLoginBtn = require("../../../images/login/btn_login_goole@3x.png");
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class SettingEditPage extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      name:"",
      email: "",
      is_password: false,
      confirm_ps: "",
      new_ps: "",
      visible: false
    };
  }

  componentWillMount() {
    this.setState({name: this.props.login_data.userName})
    this.setState({email: this.props.login_data.email})
  }

  clickPassword() {
      if (this.state.is_password == true) {
          this.setState({is_password:false})
      } else {
          this.setState({is_password: true})
      }
  }

  showPassword() {
      if (this.state.is_password == true) {
          return (
            <View style={{margin:deviceWidth/20, marginTop:-deviceWidth/50}}>
                <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>Your password</Text>
                <View style={{borderRadius:5, borderWidth:1, borderColor:'#818181', marginTop:deviceHeight/50}}>
                    <Text style={{color:'#515151', fontSize:15, fontWeight:'400', paddingLeft:deviceWidth/30, marginTop:deviceHeight/200}}>New Password</Text>
                    <TextInput secureTextEntry underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30, }} placeholder='' onChangeText={(new_ps) => {this.setState({new_ps})}} />
                </View>
                <View style={{borderRadius:5, borderWidth:1, borderColor:'#818181', marginTop:deviceHeight/30}}>
                    <Text style={{color:'#515151', fontSize:15, fontWeight:'400', paddingLeft:deviceWidth/30, marginTop:deviceHeight/200}}>Confirm Password</Text>
                    <TextInput secureTextEntry underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30, }} placeholder='' onChangeText={(confirm_ps) => {this.setState({confirm_ps})}} />
                </View>
            </View>
          );
      } else {
          return (
            <View style={{margin:deviceWidth/20, marginTop:-deviceWidth/50}}>
                <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>Your password</Text>
                <TouchableOpacity style={{marginTop:deviceWidth/15}} onPress={() => this.clickPassword()}>
                    <Text style={{color:'#6b9b12', fontSize:17, fontWeight:'500'}}>Change Your Password</Text>
                </TouchableOpacity>
            </View>
          );
      }
  }

  clickSaveBtn() {
    if (this.state.new_ps != this.state.confirm_ps) {
      Alert.alert("Please enter the password correctly")
    } else {
      this.setState({visible:true})

      var temp=URLclass.url + 'user/change_password'
      fetch(temp, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Token': this.props.login_data.token
          },
          body: JSON.stringify({
              name: this.state.name,
              email: this.state.email,
              password: this.state.confirm_ps
          })
      })

      .then((response) => response.json())
      .then((responseData) => {

        if (responseData.success == true) {
          console.log('LOGIN============', responseData)
          this.setState({visible:false})
          this.props.change_loginData(responseData)
          // this.props.navigation.state.params.onNavigateBack(this.state.foo)
          this.props.navigation.goBack(null)        
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 300);

        }
      })
    }    
  }


  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#3ead92'}}>
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
                </Button>
            </Left>
            <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Edit Settings</Text>
            </Body>
            <Right style={{ flex: 1 }}>
                <Button transparent onPress={() => this.clickSaveBtn()}>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
                </Button>
            </Right>
        </Header>

        <Content>
          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceWidth/20}}>
              <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>Your details</Text>
              <View style={{borderRadius:5, borderWidth:1, borderColor:'#818181', marginTop:deviceHeight/50}}>
                  <Text style={{color:'#515151', fontSize:15, fontWeight:'400', paddingLeft:deviceWidth/30, marginTop:deviceHeight/200}}>Name</Text>
                  <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30, }} placeholder='Full Name' value={this.state.name} onChangeText={(name) => {this.setState({name})}} />
              </View>
              <View style={{borderRadius:5, borderWidth:1, borderColor:'#818181', marginTop:deviceHeight/30}}>
                  <Text style={{color:'#515151', fontSize:15, fontWeight:'400', paddingLeft:deviceWidth/30, marginTop:deviceHeight/200}}>Email address</Text>
                  <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*10/12, paddingLeft:deviceWidth/30, }} placeholder='Email' value={this.state.email} onChangeText={(email) => {this.setState({email})}} />
              </View>
              <View style={{backgroundColor:'#818181', height:1, marginTop:deviceHeight/30}} />
          </View>

          {this.showPassword()}

        </Content>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    change_loginData: data => dispatch(change_loginData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data
});

export default connect(mapStateToProps, bindAction)(SettingEditPage);
