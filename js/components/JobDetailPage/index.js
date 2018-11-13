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
import { send_quoteData, send_clientData_from_quote, send_EditedpropertyData_New, send_EditedpropertyData_From_Quote, from_quote_to_editProperty, send_jobData } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import email from 'react-native-email'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import mappinImage from '../../../images/mappin1.png'

const draftBtn = require("../../../images/draftBtn.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const binIcon = require("../../../images/bin.png");
const mappin = require("../../../images/mappin1.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'Email Quote', 'Convert to Job', 'Sign and Approve', 'Approved' ]
const title = 'Which one do you like?'

class JobDetailPage extends Component {
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
      modalVisible_description: false,
      modalVisible_map: false,
      is_lineItem: false,
      subtotal_value: "0.00",
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

      is_edit: false,
      selected: '',
      foo:'',
      description: "",
      description_list: [],
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
    this.DoselectJob=this.DoselectJob.bind(this);
    this.DoselectJob_delete=this.DoselectJob_delete.bind(this)
    this.DoselectClient=this.DoselectClient.bind(this)
    this.DoselectProperty=this.DoselectProperty.bind(this)
    this.DoselectDescription=this.DoselectDescription.bind(this)
    this.DoChange_QTY=this.DoChange_QTY.bind(this)
    this.DoChange_Cost=this.DoChange_Cost.bind(this)
    this.DoChange_Name=this.DoChange_Name.bind(this)
    this.DoChange_Description=this.DoChange_Description.bind(this)
  }

  componentWillMount() {
    console.log('9999999999999----------------', this.props.job_data)
    this.setState({description: this.props.job_data.description})

    this.setState({selected_services: this.props.job_data.service_data})
    this.state.selected_services = this.props.job_data.service_data

    var temp = 0;
    this.state.selected_services.map((data) => {
      temp += parseInt(data.service_cost) * parseInt(data.service_quantity)
    })
    this.setState({subtotal_value: temp.toString()})

    var marker_location = {latitude: this.props.job_data.property_data.latitude, longitude:this.props.job_data.property_data.longitude}
    var map_location = {latitude: this.props.job_data.property_data.latitude, longitude:this.props.job_data.property_data.longitude, latitudeDelta: 0.0922, longitudeDelta:0.0421}
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

  onValueChange1(value: string) {
    this.setState({
      selected1: value
    });
  }

  setModalVisible(visible) {
      this.setState({modalVisible: visible});
  }

  setModalVisible_client(visible) {
    this.setState({modalVisible_client: visible})
  }

  setModalVisible_property(visible) {
    this.setState({modalVisible_property: visible})
  }

  setModalVisible_description(visible) {
    this.setState({modalVisible_description: visible})
  }

  DoselectJob(_counterFromChild) {
    this.setModalVisible(false)
    this.setState({is_lineItem:true})

    var temp_array = this.state.selected_services
    var temp= this.state.service_list[_counterFromChild]
    temp_array.push(temp)
    this.setState({selected_services:temp_array})
  }

  DoselectJob_delete(_counterFromChild) {
    var temp_array = this.state.selected_services
    temp_array.splice(_counterFromChild, 1)
    this.setState({selected_services:temp_array})

    if (this.state.selected_services.length == 0) {
      this.setState({is_lineItem: false})
    }

    var temp = 0;
    this.state.selected_services.map((data) => {
      temp += parseInt(data.service_cost) * parseInt(data.service_quantity)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoselectClient(_counterFromChild) {
    this.setState({modalVisible_client: false})
    this.setState({selected_client:this.state.client_list[_counterFromChild]})
    this.setState({selected_property:null})
  }

  DoselectProperty(_counterFromChild) {
    this.setState({modalVisible_property: false})
    this.setState({selected_property:this.state.property_list[_counterFromChild]})
  }

  DoselectDescription(_counterFromChild) {
    this.setState({modalVisible_description: false})
    this.setState({description:this.state.description_list[_counterFromChild]})
  }

  DoChange_QTY(value, index) {
    var temp = 0;

    this.state.selected_services[index].service_quantity = value

    this.state.selected_services.map((data) => {
      temp += parseInt(data.service_cost) * parseInt(data.service_quantity)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Cost(value, index) {
    var temp = 0;

    this.state.selected_services[index].service_cost = value

    this.state.selected_services.map((data) => {
      temp += parseInt(data.service_cost) * parseInt(data.service_quantity)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Name(value, index) {
    this.state.selected_services[index].service_name = value
  }

  DoChange_Description(value, index) {
    this.state.selected_services[index].service_description = value
  }

  clickChecker() {
    if (this.state.is_checker == false) {
      this.setState({is_checker: true})
    } else {
      this.setState({is_checker: false})
    }
  }

  click_Edit_Cancel() {
    this.setState({is_edit: false})
  }

  click_Edit_Btn() {
    this.setState({is_edit: true})
  }


  clickClient() {

    this.setState({visible:true})

    var temp=URLclass.url + 'client/' + this.props.job_data.client_data.client_id + '/info'

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

  clickPlusBtn_description() {
    this.setState({modalVisible_description:true})
    this.setState({visible:true})
    var temp=URLclass.url + 'job/descriptions'

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
        this.setState({description_list:responseData.descriptions})
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

      }
    })
  }


  clickSave_EditButton() {
    this.setState({visible:true})
    var sss = {
      job_id: this.props.job_data.job_id,
      description: this.state.description,
      property_id: this.props.job_data.property_data.property_id,
      client_id: this.props.job_data.client_data.client_id,
      service_data: this.state.selected_services,
      visit_data: this.props.job_data.visit_data,
      team_data: this.state.final_selectedTeam,
      billing_type: this.props.job_data.billing_type
    }
    console.log('----------+++++++++++++----------', sss)

    var temp=URLclass.url + 'job/update'

    fetch(temp, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Token': this.props.login_data.token
      },
      body: JSON.stringify({
        job_id: this.props.job_data.job_id,
        description: this.state.description,
        property_id: this.props.job_data.property_data.property_id,
        client_id: this.props.job_data.client_data.client_id,
        service_data: this.state.selected_services,
        visit_data: this.props.job_data.visit_data,
        team_data: this.state.final_selectedTeam,
        billing_type: this.props.job_data.billing_type
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        this.setState({visible:false})
        this.setState({is_edit: false})
        this.props.send_jobData(responseData)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

      }
    })
    
  }

  showInfo() {
    return (
      <View style={{margin:deviceWidth/30}}>
        {this.state.is_edit == true ?
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Details</Text>
            <TouchableOpacity onPress={() => this.clickPlusBtn_description()}>
              <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
            </TouchableOpacity>
          </View>
        : <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Details</Text>
          </View>
        }

        <View style={{marginTop:deviceHeight/100, alignSelf:'center', width:deviceWidth*28/30}}>
          <Text style={{fontSize:16, fontWeight:'500', color:'#818181'}}>{this.state.description}</Text>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />        

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Client</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={() => this.clickClient()}>
            <View>
              <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.job_data.client_data.client_company}</Text>
              <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.job_data.client_data.client_firstName} {this.props.job_data.client_data.client_lastName}</Text>
            </View>
            <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Property</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <View>
            {this.props.job_data.property_data.property_street1 != "" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.job_data.property_data.property_street1}</Text>
            : null }
            {this.props.job_data.property_data.property_street2 != "" ? <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.job_data.property_data.property_street2}</Text>
            : null }
            {this.props.job_data.property_data.property_city == "" && this.props.job_data.property_data.property_state == "" && this.props.job_data.property_data.property_zip_code == "" ? null
            : <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.job_data.property_data.property_city}, {this.props.job_data.property_data.property_state} {this.props.job_data.property_data.property_zip_code}</Text>
            }
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Schedule</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <View>
            {this.props.job_data.schedule_data.starts == null ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181', fontStyle:'italic'}}>This job hasn't been scheduled</Text>
            : <View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{width:deviceWidth/3, color:'#818181', fontWeight:'400', fontSize:15}}>Starts</Text>
                  <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>{this.props.job_data.schedule_data.starts}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{width:deviceWidth/3, color:'#818181', fontWeight:'400', fontSize:15}}>Ends</Text>
                  <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>{this.props.job_data.schedule_data.ends}</Text>
                </View>
              </View>
            }
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Billing</Text>
        <View style={{flexDirection:'row', marginTop:deviceHeight/50, alignItems:'center'}}>
          <Text style={{width: deviceWidth/3, color:'#515151', fontWeight:'400', fontSize:15}}>Reminder frequency</Text>
          {this.props.job_data.billing_type == 1 ? <Text style={{width: deviceWidth*1.9/3, color:'#818181', fontWeight:'400', fontSize:15}}>Once when the job is complete</Text>
          : <Text style={{width: deviceWidth*1.9/3, color:'#515151', fontWeight:'400', fontSize:15}}>Don't remind me to invoice</Text>
          }
        </View>
      </View>
    );
  }

  showLineItems() {
    if (this.state.is_edit == true) {
      var i=-1;
      return this.props.job_data.service_data.map((data) => {
        i++;
        return (
          <Child key={i} itemData={data} index={i} selectService={this.DoselectJob_delete} changeQTY={this.DoChange_QTY} changeCost={this.DoChange_Cost} changeName={this.DoChange_Name} changeDescription={this.DoChange_Description} />
        )
      })
    } else {
      var i=-1;
      return this.props.job_data.service_data.map((data) => {
        i++;
        return (
          <Child_services key={i} itemData={data} index={i} />
        )
      })
    }
    
  }

  showValues() {
    if (this.props.job_data.service_data.length != 0) {
      return (
        <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginBottom:deviceHeight/30}}>
          <View style={{backgroundColor:'#a0a0a0', height:3, marginTop:-deviceWidth/30}} />
          <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100}}>
            <Text style={{marginLeft:deviceWidth/2.7, fontWeight:'400', fontSize:15, color:'#818181'}}>Subtotal</Text>
            <Text style={{fontWeight:'600', fontSize:15, color:'#818181'}}>${this.state.subtotal_value}</Text>
          </View>
        </View>
      );
    } 
  }

  clickNewVisitBtn() {
    this.props.navigation.navigate("NewVisitPage")
  }

  showVisits_title() {
    return (
      <View style={{margin: deviceWidth/30}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{fontWeight:'500', fontSize:16, color:'#515151'}}>Visits</Text>
          <TouchableOpacity onPress={() => this.clickNewVisitBtn()}>
            <Text style={{fontWeight:'500', fontSize:16, color:'#ef5ac7'}}>New Visit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  showVisits_data() {
    var i = -1;
    return this.props.job_data.visit_data.map((data) => {
      i++;
      return (
        <Child_visit key={i} itemData={data} />
      )
    })
  }

  showBilling() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <TouchableOpacity>
          <Text style={{fontWeight:'500', fontSize:16, color:'#ef5ac7'}}>New Billing</Text>
        </TouchableOpacity>
      </View>
    );
  }


  showDescriptions() {
    var i=-1;
    return this.state.description_list.map((data) => {
      i++;
      return (
        <Child_description key={i} itemData={data} index={i} selectDescription={this.DoselectDescription} />
      )
    })
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
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Job #{this.props.job_data.job_id}</Text>
          </Body>
          <Right style={{ flex: 1 }}>
            {this.state.is_edit == true ? <Button transparent onPress={() => this.clickSave_EditButton()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
              </Button>
            : <Button transparent onPress={() => this.click_Edit_Btn()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Edit</Text>
              </Button>
            }
          </Right>
        </Header>

        <Content>
          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceWidth/30, height:deviceHeight/25, width:deviceWidth/6, backgroundColor:'#ecf3db', borderRadius:5, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'#7db000', fontSize:13, fontWeight:'500'}}>ACTIVE</Text>
          </View>
          <Text style={{color:'#515151', fontSize:20, fontWeight:'600', marginLeft:deviceWidth/30}}>{this.state.description}</Text>

          <View style={{margin:deviceWidth/30}}>
            <Text style={{color:'#515151', fontSize:16, fontWeight:'500'}}>{this.props.job_data.client_data.client_firstName} {this.props.job_data.client_data.client_lastName}</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100, alignItems:'center'}}>
              <View>
                {this.props.job_data.property_data.property_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.job_data.property_data.property_street1}</Text>
                : null
                }
                {this.props.job_data.property_data.property_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.job_data.property_data.property_street2}</Text>
                : null
                }
                {this.props.job_data.property_data.property_city == "" && this.props.job_data.property_data.property_state == "" && this.props.job_data.property_data.property_zip_code == "" ? null
                : <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.job_data.property_data.property_city}, {this.props.job_data.property_data.property_state} {this.props.job_data.property_data.property_zip_code}</Text>
                }
              </View>
              {this.props.job_data.property_data.property_street1 == ""  && this.props.job_data.property_data.property_street2 == "" && this.props.job_data.property_data.property_city == "" && this.props.job_data.property_data.property_state == "" && this.props.job_data.property_data.property_zip_code == "" ? null
              : <TouchableOpacity onPress={() => this.clickMappinIcon()}>
                  <Image source={mappin} style={{width:deviceWidth*50/80/13, height:deviceWidth/13, marginRight:3}} />
                </TouchableOpacity>
              }
            </View>
          </View>

          <Tabs initialPage={0} style={{marginTop:deviceHeight/50}}>
            <Tab heading="Info">
              {this.showInfo()}
            </Tab>
            <Tab heading="Line Items">
              {this.showLineItems()}

              {this.showValues()}
            </Tab>
            <Tab heading="Visits">
              {this.showVisits_title()}
              {this.showVisits_data()}
            </Tab>
            <Tab heading="Billing">
              {this.showBilling()}
            </Tab>
          </Tabs>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_description}
            onRequestClose={() => this.setModalVisible_description(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Descriptions</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_description(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showDescriptions()}
            </ScrollView>
          </Modal>


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
    send_jobData: data => dispatch(send_jobData(data))
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  job_data: state.user.job_data
});

export default connect(mapStateToProps, bindAction)(JobDetailPage);


class Child extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.itemData.service_name,
      description: this.props.itemData.service_description,
      cost: this.props.itemData.service_cost,
      qty: this.props.itemData.service_quantity,
      total: this.props.itemData.service_cost * this.props.itemData.service_quantity
    }
  }

  textFunction(i) {
    this.props.selectService(i)
  }

  changeName(value, index) {
    this.setState({name: value});
    this.props.changeName(value, index)
  }

  changeDescription(value, index) {
    this.setState({description: value});
    this.props.changeDescription(value, index)
  }

  changeQTY(value, index) {
    this.setState({qty: value});
    this.props.changeQTY(value, index)
    this.setState({total: parseInt(value)*parseInt(this.state.cost)})
  }

  changeCost(value, index) {
    this.setState({cost: value});
    this.props.changeCost(value, index)
    this.setState({total: parseInt(this.state.qty)*parseInt(value)})
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceWidth/30}}>
        <View style={{flexDirection:'row', alignSelf:'center'}}>
          <View>
            <View style={{marginTop:deviceHeight/100, borderBottomColor:'rgba(0,0,0,0)', borderColor:'#888', borderWidth:1, borderTopLeftRadius:5, borderTopRightRadius:5, width:deviceWidth*28/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10}} placeholder='Title' value={this.state.name} onChangeText={name => this.changeName(name, this.props.index)} />
            </View>
            <View style={{borderColor:'#888', borderWidth:1, borderTopColor:'rgba(0,0,0,0)',borderBottomLeftRadius:5, borderBottomRightRadius:5, width:deviceWidth*28/30, height:deviceHeight/7}}>
                <Input multiline={true} numberOfLines={10} style={{paddingLeft:10}} placeholder='Description' value={this.state.description} onChangeText={description => this.changeDescription(description, this.props.index)} />
            </View>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50}}>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>QTY</Text>
            <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, width:deviceWidth*8/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10}} placeholder='0' value={this.state.qty.toString()} onChangeText={qty => this.changeQTY(qty, this.props.index)} />
            </View>
          </View>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>UNIT COST</Text>
            <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, width:deviceWidth*8/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10, height:deviceHeight/100}} placeholder='$0.00' value={this.state.cost.toString()} onChangeText={cost => this.changeCost(cost, this.props.index)} />
            </View>
          </View>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>TOTAL</Text>
            <View style={{marginTop:deviceHeight/50, width:deviceWidth*8/30, height:deviceHeight/15}}>
              <Text style={{fontWeight:'600', fontSize:17, color:'#515151'}}>: ${this.state.total.toString()}</Text>
            </View>
          </View>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginBottom:deviceHeight/30}} />
      </View>
    );
  }
} 

class NewItem extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectJob(i)
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50}}>
          <Text style={{fontSize:15, fontWeight:'700', color:'#515151'}}>{this.props.itemData.service_name}</Text>
          <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>${this.props.itemData.service_cost}</Text>
        </View>
        <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>{this.props.itemData.service_description}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/80}} />
      </TouchableOpacity>
    );
  }
} 

class Child_client extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectClient(i)
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50}}>
          <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.itemData.name}</Text>
        </View>
        <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.props.itemData.company}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/80}} />
      </TouchableOpacity>
    );
  }
} 

class Child_property extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectProperty(i)
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
        {this.props.itemData.street1=="" ? null
        : <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.props.itemData.property_street1}</Text> 
        }
        {this.props.itemData.street2=="" ? null
        : <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.props.itemData.property_street2}</Text> 
        }
        <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.props.itemData.property_city}, {this.props.itemData.property_state} {this.props.itemData.property_zip_code}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/80}} />
      </TouchableOpacity>
    );
  }
} 


class Child_description extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectDescription(i)
  }

  render() {
    return (
      <TouchableOpacity style={{width:deviceWidth*28/30}} onPress={() => this.textFunction(this.props.index)}>
        <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.itemData}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />
      </TouchableOpacity>
    );
  }
} 

class Child_services extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{fontSize:15, fontWeight:'700', color:'#515151'}}>{this.props.itemData.service_name}</Text>
        <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.itemData.service_description}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />
        <View style={{flexDirection:'row', marginTop:deviceHeight/100}}>
          <View style={{width:deviceWidth/5, marginLeft:deviceWidth/50}}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>QTY</Text>
            <Text style={{fontWeight:'600', fontSize:15, color:'#515151'}}>{this.props.itemData.service_quantity}</Text>
          </View>
          <View style={{height:deviceHeight/13, width:1, backgroundColor:'#acacac'}} />
          <View style={{width:deviceWidth/2.7,  marginLeft:deviceWidth/30}}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>UNIT COST</Text>
            <Text style={{fontWeight:'600', fontSize:15, color:'#515151'}}>${this.props.itemData.service_cost}</Text>
          </View>
          <View style={{height:deviceHeight/13, width:1, backgroundColor:'#acacac'}} />
          <View style={{alignItems: 'flex-end', width:deviceWidth/3.5}}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#818181'}}>TOTAL</Text>
            <Text style={{fontWeight:'600', fontSize:15, color:'#515151'}}>${this.props.itemData.service_quantity*this.props.itemData.service_cost}</Text>
          </View>
        </View>
        <View style={{backgroundColor:'#acacac', height:1}} />
      </View>
    );
  }
} 

class Child_visit extends Component {
  constructor(props) {
      super(props);
  }

  show_teams() {
    if (this.props.itemData.teams.length == 0) {
      return (
        <Text style={{fontSize:15, fontWeight:'400', color:'#818181', width:deviceWidth/3, fontStyle:'italic'}}>no team</Text>
      );
    } else {
      return (
        <Text style={{fontSize:15, fontWeight:'400', color:'#515151', width:deviceWidth/3}}>{this.props.itemData.teams[0].team_name}...</Text>
      );
    }
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{fontSize:15, fontWeight:'700', color:'#515151', width:deviceWidth/3}}>{this.props.itemData.date}</Text>
          {this.props.itemData.is_anytime == 1 ? <Text style={{fontSize:15, fontWeight:'400', color:'#515151', width:deviceWidth/3}}>anytime</Text>
          : <Text style={{fontSize:15, fontWeight:'400', color:'#515151', width:deviceWidth/3}}>{this.props.itemData.start_time} - {this.props.itemData.end_time}</Text>
          }
          
          {this.show_teams()}
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/100, marginBottom:deviceHeight/100}} />
      </View>
    );
  }
} 