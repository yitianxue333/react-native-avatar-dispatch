import React, { Component }  from "react";
import { connect } from "react-redux";
import { AppRegistry, Image, TouchableOpacity, Dimensions, View } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon
} from "native-base";
const routes = ["Home", "BlankPage2"];
const personImage = require("../../../images/person.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DrawBar extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      foo:'',
    };
  }

  handleOnNavigateBack = (foo) => {
    this.setState({
      foo
    })
  }

  clickSettingBtn() {
    this.props.navigation.navigate('SettingPage', {
      onNavigateBack: this.handleOnNavigateBack.bind(this)
    })
  }


  render() {
    return (
      <Container style={{backgroundColor:'#012939'}}>
        <View style={{alignSelf: 'center'}}>
          <Image
            source={personImage}
            style={{
              marginTop: deviceHeight/20,
              height: deviceWidth/4,
              width: deviceWidth/4,
              borderRadius: deviceWidth/8,
              justifyContent: "center",
              alignSelf: "center"
            }}
          />
          <Text style={{alignSelf:'center', fontSize:20, fontWeight:'700', color:'white', marginTop:deviceHeight/50}}>{this.props.login_data.userName}</Text>
          <Text style={{alignSelf:'center', fontSize:18, fontWeight:'400', color:'white', marginTop:deviceHeight/50}}>{this.props.login_data.email}</Text>
          <View style={{backgroundColor:'#0f3544', width:deviceWidth/1.3, height:2, marginTop:deviceWidth/10}} />
        </View>

        <Text style={{color:'white', fontSize:18, fontWeight:'700', margin:deviceWidth/20}}>{this.props.login_data.company}</Text>

        <View style={{flexDirection:'row', position:'absolute', bottom:0, height:50,}}>
          <TouchableOpacity style={{backgroundColor:'#011d28', width:deviceWidth/2-33, justifyContent:'center'}}>
            <Text style={{color:'#6b9b12', fontSize:20, fontWeight:'500', alignSelf:'center', alignItems:'center'}}>Need Help?</Text>
          </TouchableOpacity>
          <View style={{backgroundColor:'#0f3544', height:50, width:2}} />
          <TouchableOpacity style={{backgroundColor:'#011d28', width:deviceWidth/2-33, justifyContent:'center'}} onPress={() => this.clickSettingBtn()}>
            <Text style={{color:'#6b9b12', fontSize:20, fontWeight:'500', alignSelf:'center', alignItems:'center'}}>Settings</Text>
          </TouchableOpacity>
        </View>
        
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

export default connect(mapStateToProps, bindAction)(DrawBar);