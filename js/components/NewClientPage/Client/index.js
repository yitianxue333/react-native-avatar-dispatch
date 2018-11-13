import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, TextInput, ScrollView, Alert } from "react-native";
import { URLclass } from '../../lib/';
import { connect } from "react-redux";
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
import Spinner from 'react-native-loading-spinner-overlay';
import { send_propertyData, send_EditedpropertyData_New, send_EditedpropertyData, from_client_to_NewQuote, from_quote_to_editProperty, from_client_to_NewJob } from "../../../actions/user";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import mappinImage from '../../../../images/mappin1.png'

const addLineItemBtn = require("../../../../images/btn_add_line_item@3x.png");
const plusBtn = require("../../../../images/btn_radio_button_active@3x.png");
const checkBoxBtn = require("../../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../../images/check_box@3x.png");
const binIcon = require("../../../../images/bin.png");
const mappin = require("../../../../images/mappin1.png");
const mailIcon = require("../../../../images/mail1.png");
const phoneIcon = require("../../../../images/phone1.png");
const clientsTabIcon = require("../../../../images/ic_clients_not_active@3x.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ClientPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      quote_type: 'All',
      quote_array: [],
      billing_type1: 'Invocies',
      billing_type2: 'All',
      billing_array: [],
      job_type: 'All',
      job_array: [],
      note_array: [],
      foo:'',
      modalVisible_map: false,
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
    this.DoselectItem_ContactInfo_phone=this.DoselectItem_ContactInfo_phone.bind(this);
    this.DoselectItem_ContactInfo_email=this.DoselectItem_ContactInfo_email.bind(this);
    this.DoselectItem_Property=this.DoselectItem_Property.bind(this);
    this.DoclickPropertyBtn_parent=this.DoclickPropertyBtn_parent.bind(this);
  }

  componentWillMount() {
    var marker_location = {latitude: this.props.client_data.property[0].latitude, longitude:this.props.client_data.property[0].longitude}
    var map_location = {latitude: this.props.client_data.property[0].latitude, longitude:this.props.client_data.property[0].longitude, latitudeDelta: 0.0922, longitudeDelta:0.0421}
    this.setState({region: map_location})
    this.setState({markerRegion: marker_location})

  }

  setModalVisible_map(visible) {
    this.setState({modalVisible_map: visible})
  }

  clickMappinIcon() {
    this.setModalVisible_map(true)
  }


  handleOnNavigateBack = (foo) => {
    this.setState({
      foo
    })
  }

  clickPhoneIcon() {
    var temp = this.props.client_data.phones[0].value
    RNImmediatePhoneCall.immediatePhoneCall(temp);
  }

  DoselectItem_ContactInfo_phone(_counterFromChild) {
    var temp = this.props.client_data.phones[_counterFromChild].value
    RNImmediatePhoneCall.immediatePhoneCall(temp);
  }

  DoselectItem_ContactInfo_email(_counterFromChild) {
  }

  DoselectItem_Property(_counterFromChild) {
    this.props.send_EditedpropertyData_New(false);
    this.props.from_quote_to_editProperty(false);
    this.props.send_EditedpropertyData(this.props.client_data.property[_counterFromChild], _counterFromChild, false)
    this.props.navigation.navigate('NewPropertyPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
  } 

  DoclickPropertyBtn_parent() {
    this.props.send_EditedpropertyData_New(true);
    this.props.from_quote_to_editProperty(false);
    this.props.navigation.navigate('NewPropertyPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
  }

  selectQuoteType(value: string) {
    this.setState({
      quote_type: value
    });
  }

  selectJobType(value: string) {
    this.setState({
      job_type: value
    });
  }

  selectBillingType1(value: string) {
    this.setState({
      billing_type1: value
    });
  }

  selectBillingType2(value: string) {
    this.setState({
      billing_type2: value
    });
  }

  clickPlusBtn_client() {
  }

  clickPlusBtn_property() {
  }

  clickNewInvoice() {
    this.props.navigation.navigate('InvoicePage', {
      onNavigateBack: this.handleOnNavigateBack.bind(this)
    })
  }

  clickEditButton() {
    console.log('=====Client Data====', this.props.client_data)

    this.props.navigation.navigate('ClientEditPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
  }

  showInfoTab_ContactInfo_phone() {
    var i = -1;
    return this.props.client_data.phones.map((data) => {
      i++;
      return (
        <Child_phone key={i} itemData={data} index={i} selectItem={this.DoselectItem_ContactInfo_phone} />
      )
    })
  }

  showInfoTab_ContactInfo_email() {
    var i = -1;
    return this.props.client_data.emails.map((data) => {
      i++;
      return (
        <Child_email key={i} itemData={data} index={i} selectItem={this.DoselectItem_ContactInfo_email} />
      )
    })
  }

  showInfoTab_Property() {
    var i = -1;
    return this.props.client_data.property.map((data) => {
      i++;
      return (
        <Child_Property key={i} itemData={data} index={i} selectItem={this.DoselectItem_Property} property_count={this.props.client_data.property.length} clickPropertyBtn_parent={this.DoclickPropertyBtn_parent}  />
      )
    })
  }

  showInfoTab_Billing() {
    if (this.props.client_data.billing.billing_street1=="" && this.props.client_data.billing.billing_street2=="" && this.props.client_data.billing.billing_city=="" && this.props.client_data.billing.billing_state=="" && this.props.client_data.billing.billing_zip_code=="") {
      return (
        <View style={{marginRight:deviceWidth/30, marginLeft:deviceWidth/30}}>
          <View style={{marginTop:deviceWidth/20, backgroundColor:'#acacac', height:1}} />
          <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginTop:deviceHeight/50}}>Billing address</Text>
          <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/100, marginBottom:deviceHeight/20}}>There's no billing address for this client. This will default to the address of your frst property.</Text>
        </View>
      )
    } else {
      return (
        <View style={{marginRight:deviceWidth/30, marginLeft:deviceWidth/30, marginBottom:deviceHeight/20}}>
          <View style={{marginTop:deviceWidth/20, backgroundColor:'#acacac', height:1}} />
          <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginTop:deviceHeight/50, marginBottom:deviceHeight/50}}>Billing address</Text>
          {this.props.client_data.billing.billing_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'400'}}>{this.props.client_data.billing.billing_street1}</Text>
          : null
          }
          {this.props.client_data.billing.billing_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'400'}}>{this.props.client_data.billing.billing_street2}</Text>
          : null
          }
          {this.props.client_data.billing.billing_city == "" && this.props.client_data.billing.billing_state == "" && this.props.client_data.billing.billing_zip_code == "" ? null
          : <Text style={{color:'#828282', fontSize:16, fontWeight:'400', marginBottom:deviceHeight/20}}>{this.props.client_data.billing.billing_city}, {this.props.client_data.billing.billing_state} {this.props.client_data.billing.billing_zip_code}</Text>
          }
        </View>
      )
    }
  }

  click_NewQuote() {
    {this.props.from_client_to_NewQuote(true)}
    
    this.props.navigation.navigate('NewQuotePage', {
      onNavigateBack: this.handleOnNavigateBack.bind(this)
    })
  }

  click_NewJob() {
    {this.props.from_client_to_NewJob(true)}
    
    this.props.navigation.navigate('NewJobPage', {
      onNavigateBack: this.handleOnNavigateBack.bind(this)
    })
  }

  showQuoteTab() {
    return (
      <View>
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <Text style={{fontWeight:'700', fontSize:18, color:'#515151'}}>Quotes</Text>
          {this.props.login_data.permission == 5 ? null
          : <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.click_NewQuote()}>
              <Image source={clientsTabIcon} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} />
              <Text style={{fontWeight:'500', fontSize:16, color:'#ef5ac7'}}>  New Quote</Text>
            </TouchableOpacity>
          }
          
        </View>


        <View style={{alignItems:'center', height:deviceHeight/2}}>
          <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/10, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/4, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
            <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/13}}>This client has no quotes</Text>
            <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', margin:deviceHeight/50, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/20, textAlign:'center'}}>This section will list the quotes made for this client</Text>
          </View>
          <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/4-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
            <Image source={clientsTabIcon} style={{width:deviceWidth/12, height:deviceWidth*135/153/12}} />
          </View>
        </View>
      </View>
    );
  }

  showJobsTab() {
    return (
      <View>
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <Text style={{fontWeight:'700', fontSize:18, color:'#515151'}}>Jobs</Text>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.click_NewJob()}>
            <Image source={clientsTabIcon} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} />
            <Text style={{fontWeight:'500', fontSize:16, color:'#ef5ac7'}}>  New Job</Text>
          </TouchableOpacity>
        </View>

        <View style={{alignItems:'center', height:deviceHeight/2}}>
          <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/10, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/4, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
            <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/13}}>This client has no jobs</Text>
            <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', margin:deviceHeight/50, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/20, textAlign:'center'}}>This section will list the jobs made for this client</Text>
          </View>
          <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/4-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
            <Image source={clientsTabIcon} style={{width:deviceWidth/12, height:deviceWidth*135/153/12}} />
          </View>
        </View>
      </View>
    );
  }

  showBillingTab() {
    return (
      <View>
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
          <Text style={{fontWeight:'700', fontSize:18, color:'#515151'}}>Billing</Text>
          {this.props.login_data.permission == 5 ? null 
          : <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.clickNewInvoice()}>
              <Image source={clientsTabIcon} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} />
              <Text style={{fontWeight:'500', fontSize:16, color:'#ef5ac7'}}>  New Invoice</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={{alignItems:'center', height:deviceHeight/2}}>
          <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/10, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/4, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
            <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/13}}>This client has no invoices</Text>
            <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', margin:deviceHeight/50, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/20, textAlign:'center'}}>This section will list the invoces made for this client</Text>
          </View>
          <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/4-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
            <Image source={clientsTabIcon} style={{width:deviceWidth/12, height:deviceWidth*135/153/12}} />
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#3ead92'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Back</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Client</Text>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={() => this.clickEditButton()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Edit</Text>
            </Button>
          </Right>
        </Header>

        <Content style={{backgroundColor:'#f3f3f3'}}>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceWidth/30}}>
            <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>Balance: $0.00</Text>              
            
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30, alignItems:'center'}}>
              <View>
                <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.client_data.company}</Text>
                <Text style={{color:'#525252', fontSize:20, fontWeight:'700'}}>{this.props.client_data.first_name} {this.props.client_data.last_name}</Text>
              </View>
              {this.props.client_data.phones[0].value != "" ?
                <TouchableOpacity onPress={() => this.clickPhoneIcon()}>
                  <Image source={phoneIcon} style={{width:deviceWidth/15, height:deviceWidth/15}} />
                </TouchableOpacity>
              : null
              }
            </View>


            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30, alignItems:'center'}}>
              <View>
                {this.props.client_data.property[0].property_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.client_data.property[0].property_street1}</Text>
                : null
                }
                {this.props.client_data.property.property_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.client_data.property[0].property_street2}</Text>
                : null
                }
                {this.props.client_data.property[0].property_city == "" && this.props.client_data.property[0].property_state == "" && this.props.client_data.property[0].property_zip_code == "" ? null
                : <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.client_data.property[0].property_city}, {this.props.client_data.property[0].property_state} {this.props.client_data.property[0].property_zip_code}</Text>
                }
              </View>
              {this.props.client_data.property[0].property_street1 == ""  && this.props.client_data.property[0].property_street2 == "" && this.props.client_data.property[0].property_city == "" && this.props.client_data.property[0].property_state == "" && this.props.client_data.property[0].property_zip_code == "" ? null
              : <TouchableOpacity onPress={() => this.clickMappinIcon()}>
                  <Image source={mappin} style={{width:deviceWidth*50/80/13, height:deviceWidth/13, marginRight:3}} />
                </TouchableOpacity>
              }
            </View>

          </View>

          <Tabs initialPage={0} style={{marginTop:deviceHeight/150}}>
            <Tab heading="Info">
              {this.showInfoTab_ContactInfo_phone()}
              {this.showInfoTab_ContactInfo_email()}
              {this.showInfoTab_Property()}
              {this.showInfoTab_Billing()}
            </Tab>
            <Tab heading="Quotes">
              {this.showQuoteTab()}
            </Tab>
            <Tab heading="Jobs">
              {this.showJobsTab()}
            </Tab>
            <Tab heading="Billing">
              {this.showBillingTab()}
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
    send_propertyData: data => dispatch(send_propertyData(data)),
    send_EditedpropertyData: (data, index, flag) => dispatch(send_EditedpropertyData(data, index, flag)),
    send_EditedpropertyData_New: flag => dispatch(send_EditedpropertyData_New(flag)),
    from_client_to_NewQuote: flag => dispatch(from_client_to_NewQuote(flag)),
    from_client_to_NewJob: flag => dispatch(from_client_to_NewJob(flag)),
    from_quote_to_editProperty: flag => dispatch(from_quote_to_editProperty(flag)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
});

export default connect(mapStateToProps, bindAction)(ClientPage);


class Child_phone extends Component {
  constructor(props) {
      super(props);
      this.state = {
        option: 'Main',
      };
  }

  componentWillMount() {
    if (this.props.itemData.option == '1') {
      this.setState({option: 'Main'})
    } else if (this.props.itemData.option == '2') {
      this.setState({option: 'Work'})
    } else if (this.props.itemData.option == '3') {
      this.setState({option: 'Mobile'})
    } else if (this.props.itemData.option == '4') {
      this.setState({option: 'Home'})
    } else if (this.props.itemData.option == '5') {
      this.setState({option: 'Fax'})
    } else {
      this.setState({option: 'Other'})
    }
  }

  showTitle() {
    if (this.props.index == 0) {
      return (
        <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginTop:deviceHeight/50}}>Contact information</Text>
      );
    }
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        {this.showTitle()}
        {this.props.itemData.value != '' ? 
          <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, alignItems:'center'}}>
              <View>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.state.option}</Text>
                <Text style={{fontSize:16, fontWeight:'400', color:'#717171'}}>{this.props.itemData.value}</Text>
              </View>
              <Image source={require("../../../../images/phone1.png")} style={{width:deviceWidth/15, height:deviceWidth/15}} />
            </View>
          </TouchableOpacity>
        : <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/100}}>There is no contact information</Text>}
        
      </View>
    );
  }
} 

class Child_email extends Component {
  constructor(props) {
      super(props);
      this.state = {
        option: 'Main',
      };
  }

  componentWillMount() {
    if (this.props.itemData.option == '1') {
      this.setState({option: 'Main'})
    } else if (this.props.itemData.option == '2') {
      this.setState({option: 'Work'})
    } else if (this.props.itemData.option == '3') {
      this.setState({option: 'Personal'})
    } else {
      this.setState({option: 'Other'})
    }
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        {this.props.itemData.value != '' ? <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, alignItems:'center'}}>
              <View>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.state.option}</Text>
                <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.itemData.value}</Text>
              </View>
              <Image source={require("../../../../images/mail1.png")} style={{width:deviceWidth/15, height:deviceWidth/15}} />
            </View>
          </TouchableOpacity>
        : null}
      </View>
    );
  }
} 

class Child_Property extends Component {
  constructor(props) {
      super(props);
  }

  clickPropertyBtn() {
    {this.props.clickPropertyBtn_parent()}
  }

  showTitle() {
    if (this.props.index == 0) {
      return (
        <View>
          <View style={{marginTop:deviceWidth/20, backgroundColor:'#acacac', height:1}} />
          <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginTop:deviceHeight/50}}>Properties</Text>
        </View>
      );
    }
  }

  showContent() {
    if (this.props.itemData.property_street1=="" && this.props.itemData.property_street2=="" && this.props.itemData.property_city=="" && this.props.itemData.property_state=="" && this.props.itemData.property_zip_code=="" && this.props.index != 0) {
      return (
        <View>
          <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/100, marginBottom:deviceHeight/20}}>There are no properties for this client</Text>
          <View style={{alignSelf:'center'}}>
            <TouchableOpacity style={{backgroundColor:'#4f70ca', borderRadius:5, height:deviceHeight/15, width:deviceWidth*0.7, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickPropertyBtn()}>
              <Text style={{fontWeight:'500', fontSize:16, color:'white'}}>New Property</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, alignItems:'center'}}>
              <View>
                {this.props.itemData.property_street1 != "" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.itemData.property_street1}</Text>
                : null }
                {this.props.itemData.property_street2 != "" ? <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.itemData.property_street2}</Text>
                : null }
                {this.props.itemData.property_city == "" && this.props.itemData.property_state == "" && this.props.itemData.property_zip_code == "" ? null
                : <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.itemData.property_city}, {this.props.itemData.property_state} {this.props.itemData.property_zip_code}</Text>
                }
                
              </View>
              {this.props.itemData.property_street1=="" && this.props.itemData.property_street2=="" && this.props.itemData.property_city=="" && this.props.itemData.property_state=="" && this.props.itemData.property_zip_code=="" ? null
              : <Image source={require("../../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />}
            </View>
          </TouchableOpacity>

          {this.props.index+1 == this.props.property_count ?
            <View style={{alignSelf:'center', marginTop:deviceHeight/20}}>
              <TouchableOpacity style={{backgroundColor:'#4f70ca', borderRadius:5, height:deviceHeight/15, width:deviceWidth*0.7, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickPropertyBtn()}>
                <Text style={{fontWeight:'500', fontSize:16, color:'white'}}>New Property</Text>
              </TouchableOpacity>
            </View>
          : null
          }
        </View>
      );
    }
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        {this.showTitle()}
        {this.showContent()}
      </View>
    );
  }
} 



/*************  263  ****************/
/*        <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth*28/30, height:deviceHeight/15, marginLeft:deviceWidth/30, marginTop:deviceHeight/100}}>
          <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
            <Picker
              mode="dropdown"
              placeholder="Select One"
              selectedValue={this.state.quote_type}
              onValueChange={this.selectQuoteType.bind(this)}
            >
              <Item label="All" value="All" />
              <Item label="Draft" value="Draft" />
              <Item label="Awaiting response" value="Awaiting response" />
              <Item label="Changes requested" value="Changes requested" />
              <Item label="Approved" value="Approved" />
              <Item label="Converted" value="Converted" />
              <Item label="Archived" value="Archived" />
            </Picker>
          </Form>
        </View>  */

/*************  288  ****************/
/*        <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth*28/30, height:deviceHeight/15, marginLeft:deviceWidth/30, marginTop:deviceHeight/100}}>
          <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
            <Picker
              mode="dropdown"
              placeholder="Select One"
              selectedValue={this.state.job_type}
              onValueChange={this.selectJobType.bind(this)}
            >
              <Item label="All" value="All" />
              <Item label="Requires invoicing" value="Requires invoicing" />
              <Item label="On hold" value="On hold" />
              <Item label="Active" value="Active" />
              <Item label="Unscheduled" value="Unscheduled" />
              <Item label="Archived" value="Archived" />
            </Picker>
          </Form>
        </View>  */

/**************  312  ***************/
/*        <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
          <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth*13/30, height:deviceHeight/15, marginTop:deviceHeight/100}}>
            <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
              <Picker
                mode="dropdown"
                placeholder="Select One"
                selectedValue={this.state.billing_type1}
                onValueChange={this.selectBillingType1.bind(this)}
              >
                <Item label="Invoices" value="Invoices" />
                <Item label="Payments" value="Payments" />
              </Picker>
            </Form>
          </View>
          <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth*13/30, height:deviceHeight/15, marginTop:deviceHeight/100}}>
            <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
              <Picker
                mode="dropdown"
                placeholder="Select One"
                selectedValue={this.state.billing_type2}
                onValueChange={this.selectBillingType2.bind(this)}
              >
                <Item label="All" value="All" />
                <Item label="Past due" value="Past due" />
                <Item label="Awaiting payment" value="Awaiting payment" />
                <Item label="Draft" value="Draft" />
                <Item label="Paid" value="Paid" />
                <Item label="Bad debt" value="Bad debt" />
              </Picker>
            </Form>
          </View>
        </View>  */