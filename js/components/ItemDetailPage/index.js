import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions, Image } from "react-native";
import { connect } from "react-redux";
import BlankPage2 from "../blankPage2";
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
  Right, Item, Input, Tab, Tabs
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";

import { setIndex } from "../../actions/list";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const personImage = require("../../../images/person.png");
const switchImage = require("../../../images/switch.png");
const carImage = require("../../../images/ic_delivery@3x.png");
const collectPaymentBtn = require("../../../images/btn_collect_payment@3x.png");
const emailInvoiceBtn = require("../../../images/btn_email_invoice@3x.png");
const collectSignatureBtn = require("../../../images/btn_collect_signature@3x.png");
const nonTaxableBtn = require("../../../images/btn_non_taxable@3x.png");

class ItemDetailPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  componentWillMount() {
    console.log('EVENT DATA==========',this.props.event_data)
  }

  showInfo() {
    return (
      <View style={{margin:deviceWidth/30, marginTop:deviceHeight/20}}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <View style={{marginLeft:deviceWidth/30}}>
            <Text style={{color:'#818181', fontSize:14, fontWeight:'700'}}>Nov 28, 2016</Text>
            <Text style={{color:'#515151', fontSize:14, fontWeight:'700', marginTop:deviceHeight/100}}>Hours</Text>
          </View>
          <TouchableOpacity style={{marginRight:deviceWidth/10}}>
            <Image source={nonTaxableBtn} style={{width:deviceWidth/3.5, height:deviceWidth*165/660/3.5}} />
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/50}} />
        <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:deviceHeight/50}}>
          <View style={{marginLeft:deviceWidth/40}}>
            <Text style={{color:'#818181', fontSize:15, fontWeight:'600'}}>QTY</Text>
            <Text style={{color:'#515151', fontSize:15, fontWeight:'700'}}>1</Text>
          </View>
          <View style={{backgroundColor:'#888', width:1, marginTop:-deviceHeight/50, marginBottom:-deviceHeight/50}} />
          <View>
            <Text style={{color:'#818181', fontSize:15, fontWeight:'600'}}>UNIT COST</Text>
            <Text style={{color:'#515151', fontSize:15, fontWeight:'700'}}>$200.00</Text>
          </View>
          <View style={{backgroundColor:'#888', width:1, marginTop:-deviceHeight/50, marginBottom:-deviceHeight/50}} />
          <View style={{marginRight:deviceWidth/40}}>
            <Text style={{color:'#818181', fontSize:15, fontWeight:'600', textAlign:'right'}}>TOTAL</Text>
            <Text style={{color:'#515151', fontSize:15, fontWeight:'700', textAlign:'right'}}>$200.00</Text>
          </View>
        </View>
        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/50}} />
        
        <View style={{flexDirection:'row', marginLeft:deviceWidth/2.5, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Subtotal:</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>$200.00</Text>
        </View>
        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/2.5, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Tax (5%):</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#4f70ca'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/2.5, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>Total:</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/100}} />

        <TouchableOpacity style={{marginTop:deviceHeight/20}}>
            <Image source={collectSignatureBtn} style={{width:deviceWidth*28/30, height:deviceWidth*28*222/1935/30}} />
        </TouchableOpacity>

      </View>
    );
}

render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#4f70ca'}}>
          <Left style={{ flex: 1,}}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Event</Text>
          </Body>
          <Right style={{ flex: 1,}}>
            <Button transparent>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}> </Text>
            </Button>
        </Right>
       </Header>

        <View style={{margin:deviceWidth/30}}>
          {this.props.event_data.is_anytime == 1 ?
            <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>Anytime</Text>
          : <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>{this.props.event_data.start_time} - {this.props.event_data.end_time}</Text>}
          <Text style={{color:'#515151', fontSize:18, fontWeight:'600', marginTop:deviceHeight/30}}>{this.props.event_data.event_title}</Text>
        </View>
        <View style={{backgroundColor:'white', height:deviceHeight}}>
          <Text style={{color:'#515151', fontSize:17, fontWeight:'600', marginTop:deviceHeight/30, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>Details</Text>
          <Text style={{color:'#818181', fontSize:17, fontWeight:'400', marginTop:deviceHeight/30, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>{this.props.event_data.event_description}</Text>
        </View>
        
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
  event_data: state.user.event_data
});

export default connect(mapStateToProps, bindAction)(ItemDetailPage);

