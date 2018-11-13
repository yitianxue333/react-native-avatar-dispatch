import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View } from "react-native";
import { connect } from "react-redux";
import BlankPage2 from "../blankPage2";
import Home from "../home";
import DrawBar from "../DrawBar";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right, Item, Input
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";

import { setIndex } from "../../actions/list";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";

const loginBtn = require("../../../images/login/linkAccount.png");
const checkerImage = require("../../../images/login/accountChecker1.png");
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class AccountCheckerPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    setIndex: React.PropTypes.func,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };

  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
            <View style={{marginTop:deviceHeight/30}}>
                <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                    <Icon active name="arrow-back" />
                </Button>              
            </View>    
                    
            <Image source={checkerImage} style={styles.shadow}>
            </Image>
            
            <View style={{alignSelf: 'center', marginTop:deviceHeight/20, marginRight:deviceWidth/12, marginLeft:deviceWidth/12}}>
                <Text style={{textAlign:'center', fontSize:18, fontWeight:'700', color:'#515151', marginBottom:deviceHeight/50}}>You are almost done.</Text>
                <Text style={{textAlign:'center', fontSize:16, fontWeight:'500', color:'#515151'}}>Finish linking Google and Avatar accounts by logging bellow</Text>
            </View>

            <View style={styles.bg}>
                <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12, marginBottom: deviceHeight/40}}>
                    <Input placeholder='Email' />
                </Item>

                <Item regular style={{marginLeft: deviceWidth/12, marginRight: deviceWidth/12}}>
                    <Input placeholder='Password' secureTextEntry />
                </Item>

                <TouchableOpacity onPress={() => this.props.navigation.navigate("IntroductPage")}>
                    <Image source={loginBtn} style={styles.loginBtnStyle} />
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
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setUser: name => dispatch(setUser(name)),
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  login_data: state.user.login_data,
});

export default connect(mapStateToProps, bindAction)(AccountCheckerPage);


// function bindAction(dispatch) {
//   return {
//     setIndex: index => dispatch(setIndex(index)),
//     openDrawer: () => dispatch(openDrawer())
//   };
// }
// const mapStateToProps = state => ({
//   name: state.user.name,
//   list: state.list.list
// });

// const HomeSwagger = connect(mapStateToProps, bindAction)(AccountCheckerPage);
// const DrawNav = DrawerNavigator(
//   {
//     AccountCheckerPage: { screen: HomeSwagger },
//     BlankPage2: { screen: BlankPage2 }
//   },
//   {
//     contentComponent: props => <DrawBar {...props} />
//   }
// );
// const DrawerNav = null;
// DrawNav.navigationOptions = ({ navigation }) => {
//   DrawerNav = navigation;
//   return {
//     header: null
//   };
// };
// export default DrawNav;
