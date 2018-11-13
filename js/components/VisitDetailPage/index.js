import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, TextInput, ScrollView, Alert } from "react-native";
import { URLclass } from '../lib/';
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
  Right, Item, Input, Tab, Tabs, Picker, Form
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setIndex } from "../../actions/list";
import { send_quoteData, send_clientData_from_quote, send_EditedpropertyData_New, send_EditedpropertyData_From_Quote, from_quote_to_editProperty, send_jobData_from_visit, timesheet } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import email from 'react-native-email'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import mappinImage from '../../../images/mappin1.png'
import moment from 'moment';

const draftBtn = require("../../../images/draftBtn.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const binIcon = require("../../../images/bin.png");
const mappin = require("../../../images/mappin1.png");
const mailIcon = require("../../../images/mail1.png");
const phoneIcon = require("../../../images/phone1.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'Email Quote', 'Convert to Job', 'Sign and Approve', 'Approved' ]
const title = 'Which one do you like?'

class VisitDetailPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    setIndex: React.PropTypes.func,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      is_checker: false,
      modalVisible: false,
      modalVisible_client: false,
      modalVisible_property: false,
      modalVisible_map: false,
      is_lineItem: false,
      subtotal_value: 0.00,
      tax_value: 0.00,
      total_value: 0.00,
      selected1: undefined,
      is_discount: false,
      is_deposit: false,
      service_list: [],
      selected_services: [],
      client_list:[],
      selected_client: null,
      property_list:[],
      selected_property: null,
      quote_description: "",
      discount_value:0,
      discount_type: "2",
      tax_type : "0.2",
      deposit_value: 0,
      deposit_type : "1",
      is_complete: -1,

      is_edit: false,
      selected: '',
      foo:'',
      description: "",

      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markerRegion: {
        latitude: 37.78825,
        longitude: -122.4324
      }
    };
  }

  componentWillMount() {
    console.log('VISIT DATA================', this.props.visit_data)
    console.log('TIMESHEET DATA================', this.props.timesheet_data)

    this.setState({is_complete: this.props.visit_data.is_complete})
    var marker_location = {latitude: this.props.visit_data.property_data.latitude, longitude:this.props.visit_data.property_data.longitude}
    var map_location = {latitude: this.props.visit_data.property_data.latitude, longitude:this.props.visit_data.property_data.longitude, latitudeDelta: 0.0922, longitudeDelta:0.0421}
    this.setState({region: map_location})
    this.setState({markerRegion: marker_location})

  }

  handleOnNavigateBack = (foo) => {
    this.setState({
      foo
    })
  }

  setModalVisible_map(visible) {
    this.setState({modalVisible_map: visible})
  }

  clickMappinIcon() {
    this.setModalVisible_map(true)
  }

  clickClient() {

    this.setState({visible:true})

    var temp=URLclass.url + 'client/' + this.props.visit_data.client_data.client_id + '/info'

    fetch(temp, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        }
    })

    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        this.setState({visible:false})
        console.log('========', responseData)
        this.props.send_clientData_from_quote(responseData)
        this.props.navigation.navigate("ClientPage")
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })

  }

  clickJob() {
    this.setState({visible:true})

    var temp=URLclass.url + 'job/' + this.props.visit_data.job_id + '/info'
    console.log('URL FOR VISIT=============', temp)
    fetch(temp, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        }
    })

    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        console.log('JOB DETAIL DATA==================', responseData)
        this.setState({visible:false})
        this.props.send_jobData_from_visit(responseData)
        this.props.navigation.navigate("JobDetailPage")
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
  }


  click_Edit_Cancel() {
    this.setState({is_edit: false})
  }

  click_Edit_Btn() {
    this.setState({is_edit: true})
  }

  clickSave_EditButton() {
    this.setState({is_edit: false})
  }

  showInfo() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Details</Text>
        {this.props.visit_data.description == "" ?
          <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/100, marginBottom:deviceHeight/20}}>There is no description.</Text>
        : <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginTop:deviceHeight/100}}>{this.props.visit_data.description}</Text>
        }
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Line Items</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50}}>
          <View style={{width:deviceWidth*23/30}}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>ITEMS</Text>
          </View>
          <View style={{backgroundColor:'#acacac', width:1}} />
          <View style={{width:deviceWidth*3/30, alignItems:'center'}}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>QTY</Text>
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:3, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

      </View>
    );
  }

  showInfo_services() {
    var i = -1;
    return this.props.visit_data.service_data.map((data) => {
      i++;
      return (
        <Child_service key={i} itemData={data} />
      )
    })
  }

  showInfo_teams_title() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginBottom:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Team</Text>
      </View>
    );
  }

  showInfo_teams() {
    var i = -1;
    return this.props.visit_data.team_data.map((data) => {
      i++;
      return (
        <Child_team key={i} itemData={data} />
      )
    })
  }

  showClient() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Client</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={() => this.clickClient()}>
            <View>
              <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.visit_data.client_data.client_company}</Text>
              <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.visit_data.client_data.client_firstName} {this.props.visit_data.client_data.client_lastName}</Text>
            </View>
            <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />


        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Contact information</Text>
        {this.props.visit_data.contact_info_phone != null && this.props.visit_data.contact_info_email != null ? null
        : <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/100, marginBottom:deviceHeight/50}}>There is no contact info</Text>}
        {this.props.visit_data.contact_info_phone == null? null
        : <TouchableOpacity style={{flexDirection:'row', marginTop:deviceHeight/50, alignItems:'center', justifyContent:'space-between'}}>
            <View>
              <Text style={{color:'#818181',fontWeight:'400', fontSize:15}}>Main</Text>
              <Text style={{color:'#818181',fontWeight:'500', fontSize:16}}>{this.props.visit_data.contact_info_phone.value}</Text>
            </View>
            <Image source={phoneIcon} style={{width:deviceWidth/15, height:deviceWidth/15}} />
          </TouchableOpacity>
        }
        {this.props.visit_data.contact_info_email == null? null
        : <TouchableOpacity style={{flexDirection:'row', marginTop:deviceHeight/50, alignItems:'center', justifyContent:'space-between'}}>
            <View>
              <Text style={{color:'#818181',fontWeight:'400', fontSize:15}}>Main</Text>
              <Text style={{color:'#818181',fontWeight:'500', fontSize:16}}>{this.props.visit_data.contact_info_email.value}</Text>
            </View>
            <Image source={mailIcon} style={{width:deviceWidth/15, height:deviceWidth/15}} />
          </TouchableOpacity>
        }

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />


        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Property</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <View>
            {this.props.visit_data.property_data.property_street1 != "" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.visit_data.property_data.property_street1}</Text>
            : null }
            {this.props.visit_data.property_data.property_street2 != "" ? <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.visit_data.property_data.property_street2}</Text>
            : null }
            {this.props.visit_data.property_data.property_city == "" && this.props.visit_data.property_data.property_state == "" && this.props.visit_data.property_data.property_zip_code == "" ? null
            : <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.visit_data.property_data.property_city}, {this.props.visit_data.property_data.property_state} {this.props.visit_data.property_data.property_zip_code}</Text>
            }
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

      </View>
    );
  }

  clickNewVisitBtn() {
    this.props.navigation.navigate("NewVisitPage")
  }

  showJobs() {
    if (this.props.login_data.permission == 3) {
      null
    } else {
      return (
        <View style={{margin:deviceWidth/30}}>
          <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Job</Text>
          <View style={{marginTop:deviceHeight/50}}>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress= {() => this.clickJob()}>
              <View>
                <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>#{this.props.visit_data.job_id}</Text>
                <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.visit_data.visit_detail}</Text>
              </View>
              <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }


  showStatus() {
    if (this.props.visit_data.is_anytime == 1) {
      return (
        <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.visit_data.date} - anytime</Text>
      );
    } else {
      return(
        <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.visit_data.date}, {this.props.visit_data.start_time} - {this.props.visit_data.end_time}</Text>
      );
    }
  }

  clickMarkCompleteBtn() {
    if (this.state.is_complete == 1) {
      this.setState({visible:true})

      var temp = URLclass.url + 'visit/complete'

      fetch(temp, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Token': this.props.login_data.token
          },
          body: JSON.stringify({
              is_complete: -1,
              visit_id: this.props.visit_data.visit_id
          })
      })

      .then((response) => response.json())
      .then((responseData) => {

        if (responseData.success == true) {
          this.setState({visible:false})
          this.setState({is_complete: -1})
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 300);
        }
      })
    } else {
      this.setState({visible:true})

      var temp = URLclass.url + 'visit/complete'

      fetch(temp, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Token': this.props.login_data.token
          },
          body: JSON.stringify({
              is_complete: 1,
              visit_id: this.props.visit_data.visit_id
          })
      })

      .then((response) => response.json())
      .then((responseData) => {

        if (responseData.success == true) {
          this.setState({visible:false})
          this.setState({is_complete: 1})
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

  clickStartTimerBtn() {
    this.setState({visible:true})

    var timesheet_clock_url = URLclass.url + 'timesheet/start'

    fetch(timesheet_clock_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            date: moment(new Date()).format("YYYY-MM-DD"),
            startedTime: moment(new Date()).format("HH:mm"),
            endedTime: "",
            duration: 0,
            visit_id: this.props.visit_data.visit_id
        })
    })

    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.success == true) {
        this.setState({visible:false})
        this.props.timesheet(responseData)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);
      }
    })
  }

  clickStopTimerBtn() {
    this.setState({visible:true})

    var end_currentTime = moment(new Date()).format("HH:mm")
    var index = this.props.timesheet_data.array.length-1;
    var minuteDiff = moment(this.props.timesheet_data.array[index].startedTime, "HH:mm").diff(moment(end_currentTime, "HH:mm"),'minutes');

    var timesheet_clock_url = URLclass.url + 'timesheet/stop'

    fetch(timesheet_clock_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            date: moment(new Date()).format("YYYY-MM-DD"),
            startedTime: this.props.timesheet_data.array[index].startedTime,
            endedTime: end_currentTime,
            duration: Math.abs(minuteDiff),
            visit_id: this.props.visit_data.visit_id
        })
    })

    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.success == true) {
        this.setState({visible:false})
        this.props.timesheet(responseData)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);
      }
    })
  }

  showTemp() {
    if (this.state.is_complete == 1) {
      return (
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <TouchableOpacity style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Completed</Text>
          </TouchableOpacity>
          <View style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
          </View>
        </View>
      )
    } else {
      if (this.props.timesheet_data.is_starting == 1) {
        return (
          <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
            <View style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Mark Complete</Text>
            </View>
            <TouchableOpacity style={{backgroundColor:'#ff5d35', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickStopTimerBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Stop Timer</Text>
            </TouchableOpacity>
          </View>
        ) 
      } else {
        return (
          <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
            <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Mark Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickStartTimerBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }
  }

  showTemp1() {
    if (this.state.is_complete == 1) {
      return (
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <TouchableOpacity style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Completed</Text>
          </TouchableOpacity>
          <View style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Mark Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickStartTimerBtn()}>
            <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  showTEMP_temp() {
    if (this.props.timesheet_data.array.length != 0) {
      if (this.props.timesheet_data.array[this.props.timesheet_data.array.length-1].visit_id == this.props.visit_data.visit_id) {
        return (
          <View>
            {this.showTemp()}
          </View>
        )
      } else {
        return (
          <View>
            {this.showTemp1()}
          </View>
        );
      }
    } else {
      if (this.state.is_complete == 1) {
        return (
          <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
            <TouchableOpacity style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Completed</Text>
            </TouchableOpacity>
            <View style={{backgroundColor:'#999', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
            </View>
          </View>
        )
      } else {
        return (
          <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
            <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickMarkCompleteBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Mark Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'#b36096', borderRadius: 5, width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickStartTimerBtn()}>
              <Text style={{color:'white', fontWeight:'500', fontSize:16}}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }  
  }


  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#b36096'}}>
          <Left style={{ flex: 1 }}>
            {this.state.is_edit == true ? <Button transparent onPress={() => this.click_Edit_Cancel()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
              </Button>
            : <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Back</Text>
              </Button>}
            
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Visit</Text>
          </Body>
          <Right style={{ flex: 1 }}>
            {this.state.is_edit == true ? <Button transparent onPress={() => this.clickSave_EditButton()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}> </Text>
              </Button>
            : <Button transparent onPress={() => this.click_Edit_Btn()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}> </Text>
              </Button>
            }
          </Right>
        </Header>

        <Content>
          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceWidth/30}}>
            {this.showStatus()}
          </View>

          <Text style={{color:'#515151', fontSize:20, fontWeight:'600', marginLeft:deviceWidth/30}}>{this.props.visit_data.description}</Text>

          <View style={{margin:deviceWidth/30}}>
            <Text style={{color:'#515151', fontSize:16, fontWeight:'500'}}>{this.props.visit_data.client_data.client_firstName} {this.props.visit_data.client_data.client_lastName}</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100, alignItems:'center'}}>
              <View>
                {this.props.visit_data.property_data.property_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.visit_data.property_data.property_street1}</Text>
                : null
                }
                {this.props.visit_data.property_data.property_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.visit_data.property_data.property_street2}</Text>
                : null
                }
                {this.props.visit_data.property_data.property_city == "" && this.props.visit_data.property_data.property_state == "" && this.props.visit_data.property_data.property_zip_code == "" ? null
                : <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.visit_data.property_data.property_city}, {this.props.visit_data.property_data.property_state} {this.props.visit_data.property_data.property_zip_code}</Text>
                }
              </View>
              {this.props.visit_data.property_data.property_street1 == ""  && this.props.visit_data.property_data.property_street2 == "" && this.props.visit_data.property_data.property_city == "" && this.props.visit_data.property_data.property_state == "" && this.props.visit_data.property_data.property_zip_code == "" ? null
              : <TouchableOpacity onPress={() => this.clickMappinIcon()}>
                  <Image source={mappin} style={{width:deviceWidth*50/80/13, height:deviceWidth/13, marginRight:3}} />
                </TouchableOpacity>
              }
            </View>
          </View>

          {this.showTEMP_temp()}

          <Tabs initialPage={0} style={{marginTop:deviceHeight/50}}>
            <Tab heading="Info">
              {this.showInfo()}
              {this.showInfo_services()}
              {this.showInfo_teams_title()}
              {this.showInfo_teams()}
            </Tab>
            <Tab heading="Job">
              {this.showJobs()}
            </Tab>
            <Tab heading="Client">
              {this.showClient()}
            </Tab>
          </Tabs>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_map}
            onRequestClose={() => this.setModalVisible_map(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Map</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_map(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            
            <MapView
              style={{width:deviceWidth, height:deviceHeight*8.6/10, backgroundColor:'#a3ccff'}}
              initialRegion={this.state.region}
            >
              <Marker
                coordinate={this.state.markerRegion}
                image={mappinImage}
              />
            </MapView>

          </Modal>

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_clientData_from_quote: data => dispatch(send_clientData_from_quote(data)),
    send_jobData_from_visit: data => dispatch(send_jobData_from_visit(data)),
    timesheet: data => dispatch(timesheet(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  visit_data: state.user.visit_data,
  timesheet_data: state.user.timesheet_data
});

export default connect(mapStateToProps, bindAction)(VisitDetailPage);



class Child_service extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{width:deviceWidth*23/30}}>
            <Text style={{fontWeight:'600', fontSize:15, color:'#515151'}}>{this.props.itemData.service_name}</Text>
            <Text style={{fontWeight:'400', fontSize:15, color:'#818181'}}>{this.props.itemData.service_description}</Text>
          </View>
          <View style={{backgroundColor:'#acacac', width:1}} />
          <View style={{width:deviceWidth*3/30, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontWeight:'400', fontSize:15, color:'#818181'}}>{this.props.itemData.service_quantity}</Text>
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />
      </View>
    );
  }
} 

class Child_team extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/7, marginBottom:deviceHeight/50}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{width:deviceWidth/15, height:deviceWidth/15, backgroundColor:'#93a1a9', borderRadius:deviceWidth/30, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontWeight:'400', fontSize:15, color:'white'}}>{this.props.itemData.team_name.charAt(0)}</Text>
          </View>
          <View style={{marginLeft:deviceWidth/30}}>
            <Text style={{fontWeight:'400', fontSize:15, color:'#515151'}}>{this.props.itemData.team_name}</Text>
          </View>
        </View>
      </View>
    );
  }
} 
