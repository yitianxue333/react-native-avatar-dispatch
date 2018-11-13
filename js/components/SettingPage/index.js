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
  Text, Header, Left, Right, Body, Title
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser } from "../../actions/user";
import moment from 'moment';
import {URLclass} from '../lib/';

const logo = require("../../../images/logo.png");
const startNowBtn = require("../../../images/btn_startNow@3x.png");
const googleLoginBtn = require("../../../images/login/btn_login_goole@3x.png");
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class SettingPage extends Component {
  static propTypes = {
    setUser: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
        timezone: ""
    };
  }

  componentWillMount() {
    var temp = new Date();
    this.setState({timezone: temp.toString()})
  }


  clickSignOutBtn() {
    var logout_url = URLclass.url + 'logout'
    fetch(logout_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
        })
    })
    .then((response) => response.json())
    .then((responseData) => {
    })
    
    this.props.navigation.navigate("Login")
  }

  
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#3ead92'}}>
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                    <Icon transparent light name="arrow-back" />
                </Button>
            </Left>
            <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                <Title style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Settings</Title>
            </Body>
            <Right style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.navigate('SettingEditPage')}>
                        <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Edit</Text>
                </Button>
            </Right>
        </Header>

        <Content>
            <View style={{margin:deviceWidth/20}}>
                <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>Your account</Text>
                <View style={{flexDirection:'row', marginTop:deviceHeight/40}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Name</Text>
                    </View>
                    <View style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.login_data.userName}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginTop:deviceHeight/100}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Email</Text>
                    </View>
                    <View style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.login_data.email}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginTop:deviceHeight/100}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Password</Text>
                    </View>
                    <View style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.login_data.password}</Text>
                    </View>
                </View>
                <View style={{ height:1, backgroundColor:'#818181', marginTop:deviceHeight/30}} />
            </View>


            <View style={{margin:deviceWidth/20, marginTop:-deviceWidth/50}}>
                <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>Avatar information</Text>
                <View style={{flexDirection:'row', marginTop:deviceHeight/40}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>App version</Text>
                    </View>
                    <View style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.login_data.appVersion}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginTop:deviceHeight/100}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Account timezone</Text>
                    </View>
                    <View style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181', marginRight:deviceWidth/20}}>{this.state.timezone}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginTop:deviceHeight/40}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Privacy policy</Text>
                    </View>
                    <TouchableOpacity style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Read Policy</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', marginTop:deviceHeight/40}}>
                    <View style={{width:deviceWidth/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Terms of use</Text>
                    </View>
                    <TouchableOpacity style={{width:deviceWidth*2/3}}>
                        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>Read Terms</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={{borderRadius:5, borderColor:'#6b9b12', borderWidth:1, marginTop:deviceHeight/15, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickSignOutBtn()}>
                    <Text style={{color:'#6b9b12', fontWeight:'700', fontSize:20}}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </Content>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {

  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data
});

export default connect(mapStateToProps, bindAction)(SettingPage);