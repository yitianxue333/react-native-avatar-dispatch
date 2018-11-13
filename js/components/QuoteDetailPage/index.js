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
import { send_quoteData, send_clientData_from_quote, send_EditedpropertyData_New, send_EditedpropertyData_From_Quote, from_quote_to_editProperty } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import email from 'react-native-email'

const draftBtn = require("../../../images/draftBtn.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const binIcon = require("../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'Email Quote', 'Convert to Job', 'Sign and Approve', 'Approved' ]
const title = 'Which one do you like?'

class QuoteDetailPage extends Component {
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

      is_edit: false,
      selected: '',
      foo:'',
    };
    this.DoselectJob=this.DoselectJob.bind(this);
    this.DoselectJob_delete=this.DoselectJob_delete.bind(this)
    this.DoselectClient=this.DoselectClient.bind(this)
    this.DoselectProperty=this.DoselectProperty.bind(this)
    this.DoChange_QTY=this.DoChange_QTY.bind(this)
    this.DoChange_Cost=this.DoChange_Cost.bind(this)
    this.DoChange_Name=this.DoChange_Name.bind(this)
    this.DoChange_Description=this.DoChange_Description.bind(this)
    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
  }

  componentWillMount() {
    this.setState({quote_description: this.props.quote_data.description})
    this.setState({selected_services: this.props.quote_data.services})
    this.setState({selected_client: this.props.quote_data.client_data})
    this.setState({selected_property: this.props.quote_data.property_data})
  }

  handleOnNavigateBack = (foo) => {
    this.setState({
      foo
    })
  }

  sendEmail() {
    console.log('EMAIL============', this.props.quote_data)
    this.setState({visible:true})

    var temp=URLclass.url + 'quote/send_email'

    fetch(temp, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Token': this.props.login_data.token
      },
      body: JSON.stringify({
        quote_id: this.props.quote_data.quote_id
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        this.setState({visible:false})
        setTimeout(function(){
          Alert.alert("Email was sent successfully")
        }, 300);
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

      }
    })
  }

  showActionSheet() {
    this.ActionSheet.show()
  }

  handlePress(i) {
    if (i == 1) {

    } else if (i == 2) {

    } else if (i==3) {

    } else {

      this.setState({visible:true})

      var temp=URLclass.url + 'quote/approve'

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
          quote_id: this.props.quote_data.quote_id
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('APPROVED=================', responseData)
        if (responseData.success == true) {
          this.setState({visible:false})
          this.props.send_quoteData(responseData)
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 500);            

        }
      })
    }
  }

  onValueChange1(value: string) {
    this.setState({
      selected1: value
    });
  }

  select_DiscountType(value: string) {
    this.setState({
      discount_type: value
    });
  }

  select_DepositType(value: string) {
    this.setState({
      deposit_type: value
    });
  }

  select_TaxType(value: string) {
    this.setState({
      tax_type: value
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

  clickChecker() {
    if (this.state.is_checker == false) {
      this.setState({is_checker: true})
    } else {
      this.setState({is_checker: false})
    }
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
      temp += parseInt(data.service_cost) * parseInt(data.service_name)
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
      temp += parseInt(data.service_cost) * parseInt(data.service_name)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Name(value, index) {
    this.state.selected_services[index].service_name = value
  }

  DoChange_Description(value, index) {
    this.state.selected_services[index].service_description = value
  }

  showJobs() {
    var i=-1;
    return this.state.service_list.map((data) => {
      i++;
      return (
        <NewItem key={i} itemData={data} index={i} selectJob={this.DoselectJob} />
      )
    })
  }

  showClients() {
    var i=-1;
    return this.state.client_list.map((data) => {
      i++;
      return (
        <Child_client key={i} itemData={data} index={i} selectClient={this.DoselectClient} />
      )
    })
  }

  showProerties() {
    var i=-1;
    return this.state.property_list.map((data) => {
      i++;
      return (
        <Child_property key={i} itemData={data} index={i} selectProperty={this.DoselectProperty} />
      )
    })
  }

  show_addedLineItems() {
    console.log('XXXXXXXXXXXXXX=====', this.state.selected_services)
    var i=-1;
    return this.props.quote_data.services.map((data) => {
      i++;
      return (
        <Child key={i} itemData={data} index={i} selectService={this.DoselectJob_delete} changeQTY={this.DoChange_QTY} changeCost={this.DoChange_Cost} changeName={this.DoChange_Name} changeDescription={this.DoChange_Description} />
      )
    })
  }

  click_Edit_Cancel() {
    this.setState({is_edit: false})
  }

  click_Edit_Btn() {
    this.setState({is_edit: true})
  }

  clickDiscount() {
    if (this.state.is_discount == false) {
      this.setState({is_discount: true})
    } else {
      this.setState({is_discount: false})
    }
  }

  clickDeposit() {
    if (this.state.is_deposit == false) {
      this.setState({is_deposit: true})
    } else {
      this.setState({is_deposit: false})
    }
  }

  clickRemove_discount() {
    this.setState({is_discount: false})
    this.setState({discount_value: 0})
  }

  clickRemove_deposit() {
    this.setState({is_deposit: false})
    this.setState({deposit_value: 0})
  }

  clickPlus_AddLineItemBtn() {
    this.setState({modalVisible:true})
    this.setState({visible:true})
    var temp=URLclass.url + 'service/getall'

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
        this.setState({service_list:responseData.services})
        
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
  }

  clickPlusBtn_client() {
    this.setState({modalVisible_client:true})
    this.setState({visible:true})
    var temp=URLclass.url + 'client/getall'

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
        console.log('CLIENT+++++++++++', responseData.clients)
        this.setState({visible:false})
        this.setState({client_list:responseData.clients})
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
  }

  clickPlusBtn_property() {
    this.setState({modalVisible_property:true})
    this.setState({visible:true})
    var temp=URLclass.url + 'client/' + this.state.selected_client.client_id + '/property/getall'

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
        this.setState({property_list:responseData.properties})
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
  }

  clickSave_EditButton() {
    if (this.state.is_edit == true) {

      if (this.state.selected_client == null) {
        Alert.alert('Client is required.')
      } else if (this.state.selected_property == null) {
        Alert.alert('Property is required.')
      } else {
        this.setState({visible:true})

        var InputValue_Checker ={
                                  client_id: this.state.selected_client.client_id,
                                  property_id: this.state.selected_property.property_id,
                                  description: this.state.quote_description,
                                  discount: this.state.discount_value,
                                  discount_percent: this.state.discount_type,
                                  tax: this.state.tax_type,
                                  deposit: this.state.deposit_value,
                                  deposit_percent: this.state.deposit_type,
                                  services: this.state.selected_services
                                }
        console.log('QUOTE CHECKER======', InputValue_Checker)

        var temp=URLclass.url + 'quote/update'

        fetch(temp, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': this.props.login_data.token
            },
            body: JSON.stringify({
                client_id: this.state.selected_client.client_id,
                property_id: this.state.selected_property.property_id,
                description: this.state.quote_description,
                discount: this.state.discount_value,
                discount_percent: this.state.discount_type,
                tax: this.state.tax_type,
                deposit: this.state.deposit_value,
                deposit_percent: this.state.deposit_type,
                services: this.state.selected_services
            })
          })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.success == true) {
              this.setState({visible:false})
              this.setState({is_edit: false})
              this.props.send_quoteData(responseData)
            } else {
              var self=this
              self.setState({visible:false})

              setTimeout(function(){
                Alert.alert(responseData.errorMessage)
              }, 500);            

            }
          })
        }
    } else {
      this.setState({is_edit: true})
    }
  }

  showLineItems_Edit() {
    return (
      <View style={{marginBottom:deviceHeight/20}}>
        <View style={{margin:deviceWidth/30, marginTop:deviceHeight/20}}>
          {this.state.is_lineItem == false ? 
            <View style={{backgroundColor:'#f3f3f3', borderColor:'#888', borderWidth:1, borderRadius:5}}>
              <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#515151', marginTop:deviceHeight/40, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/40, textAlign:'center'}}>Add a line item in order to complete this quote</Text>
            </View>
            :
            <View>
              {this.show_addedLineItems()}
            </View>
          }
          <TouchableOpacity style={{marginTop:deviceHeight/40}} onPress={() => this.clickPlus_AddLineItemBtn(true)}>
              <Image source={addLineItemBtn} style={{width:deviceWidth*28/30, height:deviceWidth*28*222/1935/30}} />
          </TouchableOpacity>

          <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/20}} />

          <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
              <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Subtotal</Text>
              <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${this.state.subtotal_value.toString()}</Text>
          </View>
          <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100}} />

          {this.state.is_discount==true ? 
            <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/50}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Discount</Text>
                <View style={{flexDirection:'row'}}>
                  <View>
                    <Item regular style={{marginRight: deviceWidth/100, height:deviceWidth/9.8}}>
                      <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth/5, paddingLeft:deviceWidth/30}} placeholder='0' onChangeText={discount_value => this.setState({ discount_value })} />
                    </Item>
                  </View>
                  <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth/5, height:deviceHeight/15}}>
                    <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
                      <Picker
                        mode="dropdown"
                        placeholder="Select One"
                        selectedValue={this.state.discount_type}
                        onValueChange={this.select_DiscountType.bind(this)}
                      >
                        <Item label="$" value="1" />
                        <Item label="%" value="2" />
                      </Picker>
                    </Form>
                  </View>
                </View>
                {this.state.discount_type==1 ? <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${this.state.discount_value.toString()}</Text>
                :
                <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${((parseInt(this.state.subtotal_value)/parseInt(this.state.discount_value)).toFixed(2)).toString()}</Text>
                }
                
              </View>
              <TouchableOpacity style={{flexDirection:'row', alignSelf:'flex-end', marginTop:deviceHeight/30}} onPress={() => this.clickRemove_discount()}>
                <Image source={binIcon} style={{width:deviceWidth/25, height:deviceWidth*28/19/25}} />
                <Text style={{fontSize:14, fontWeight:'400', color:'#f06747', marginLeft:deviceWidth/50}}>Remove</Text>
              </TouchableOpacity>
            </View>

            :
            <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Discount</Text>
              
              <TouchableOpacity onPress={() => this.clickDiscount()}>
                  <Text style={{fontSize:14, fontWeight:'700', color:'#4f70ca'}}>Add Discount</Text>
              </TouchableOpacity>
            </View>
          }

        </View>
        <View style={{backgroundColor:'#979fa8', height:1, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between', alignItems:'center'}}>
          <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth/1.65, height:deviceHeight/15, marginLeft:deviceWidth/30,}}>
            <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
              <Picker
                mode="dropdown"
                placeholder="Select One"
                selectedValue={this.state.tax_type}
                onValueChange={this.select_TaxType.bind(this)}
              >
                <Item label="tax1(0.2%) (Default)" value="0.2" />
                <Item label="tax2(0.3%)" value="0.3" />
                <Item label="tax3(0.5%)" value="0.5" />
              </Picker>
            </Form>
          </View>
          <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${ ((parseInt(this.state.subtotal_value)*parseInt(this.state.tax_type)).toFixed(2)).toString()}</Text>
          
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Total</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.subtotal_value}</Text>
        </View>

        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/50, marginRight:deviceWidth/30, marginLeft:deviceWidth/30}} />


        {this.state.is_deposit == true ?
          <View style={{marginTop:deviceHeight/100, marginRight:deviceWidth/30, marginLeft:deviceWidth/30}}>
            <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, justifyContent:'space-between', alignItems:'center'}}>
              <View>
                  <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Required</Text>
                  <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>deposit</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <View>
                  <Item regular style={{marginRight: deviceWidth/100, height:deviceWidth/9.8}}>
                    <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth/5, paddingLeft:deviceWidth/30}} placeholder='0' onChangeText={deposit_value => this.setState({ deposit_value })} />
                  </Item>
                </View>
                <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth/5, height:deviceHeight/15}}>
                  <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
                    <Picker
                      mode="dropdown"
                      placeholder="Select One"
                      selectedValue={this.state.deposit_type}
                      onValueChange={this.select_DepositType.bind(this)}
                    >
                      <Item label="$" value="1" />
                      <Item label="%" value="2" />
                    </Picker>
                  </Form>
                </View>
              </View>
              {this.state.deposit_type==1 ? <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${this.state.deposit_value.toString()}</Text>
              :
              <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${((parseInt(this.state.subtotal_value)/parseInt(this.state.deposit_value)).toFixed(2)).toString()}</Text>
              }
            </View>  
            <TouchableOpacity style={{flexDirection:'row', alignSelf:'flex-end', marginTop:deviceHeight/30, marginRight:deviceWidth/30}} onPress={() => this.clickRemove_deposit()}>
              <Image source={binIcon} style={{width:deviceWidth/25, height:deviceWidth*28/19/25}} />
              <Text style={{fontSize:14, fontWeight:'400', color:'#f06747', marginLeft:deviceWidth/50}}>Remove</Text>
            </TouchableOpacity>           
          </View>
          :
          <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between', alignItems:'center'}}>
            <View style={{marginLeft:deviceWidth/30}}>
                <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>Required</Text>
                <Text style={{fontSize:14, fontWeight:'400', color:'#929292'}}>deposit</Text>
            </View>

            <TouchableOpacity onPress={() => this.clickDeposit()}>
                <Text style={{fontSize:14, fontWeight:'700', color:'#4f70ca'}}>Add Required Deposit</Text>
            </TouchableOpacity>                
          </View>
        }
          
      </View>
    );
  }

  showServices() {
    var i=-1;
    return this.props.quote_data.services.map((data) => {
      i++;
      return (
        <Child_services key={i} itemData={data} index={i} />
      )
    })
  }

  showValues() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <View style={{backgroundColor:'#a0a0a0', height:3, marginTop:-deviceWidth/30}} />
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100}}>
          <Text style={{marginLeft:deviceWidth/2.7, fontWeight:'400', fontSize:15, color:'#818181'}}>Subtotal</Text>
          <Text style={{fontWeight:'600', fontSize:15, color:'#818181'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#acacac', height:1}} />
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100}}>
          <Text style={{marginLeft:deviceWidth/2.7, fontWeight:'400', fontSize:15, color:'#818181'}}>Discount</Text>
          <Text style={{fontWeight:'600', fontSize:15, color:'#818181'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#acacac', height:1}} />
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100}}>
          <Text style={{marginLeft:deviceWidth/2.7, fontWeight:'400', fontSize:15, color:'#818181'}}>Tax ({this.props.quote_data.tax}%)</Text>
          <Text style={{fontWeight:'600', fontSize:15, color:'#818181'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#acacac', height:1}} />
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100}}>
          <Text style={{marginLeft:deviceWidth/2.7, fontWeight:'600', fontSize:15, color:'#515151'}}>Total</Text>
          <Text style={{fontWeight:'600', fontSize:15, color:'#515151'}}>$0.00</Text>
        </View>
        <View style={{backgroundColor:'#a9a9a9', height:3}} />
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceHeight/100, marginBottom:deviceHeight/20}}>
          <Text style={{marginLeft:deviceWidth/3.2, fontWeight:'400', fontSize:15, color:'#818181'}}>Required deposit</Text>
          <Text style={{fontWeight:'600', fontSize:15, color:'#818181'}}>$0.00</Text>
        </View>
      </View>
    );
  }

  clickClient() {

    this.setState({visible:true})

    var temp=URLclass.url + 'client/' + this.props.quote_data.client_data.client_id + '/info'

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

  clickProperty() {
    this.props.send_EditedpropertyData_New(false);
    this.props.from_quote_to_editProperty(true);
    this.props.send_EditedpropertyData_From_Quote(this.props.quote_data.property_data)
    this.props.navigation.navigate('NewPropertyPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
  }

  showDetails() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Client</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={() => this.clickClient()}>
            <View>
              <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.quote_data.client_data.company}</Text>
              <Text style={{fontWeight:'600', fontSize:16, color:'#818181'}}>{this.props.quote_data.client_data.first_name} {this.props.quote_data.client_data.last_name}</Text>
            </View>
            <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Property</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={() => this.clickProperty()}>
            <View>
              {this.props.quote_data.property_data.property_street1 != "" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_street1}</Text>
              : null }
              {this.props.quote_data.property_data.property_street2 != "" ? <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_street2}</Text>
              : null }
              {this.props.quote_data.property_data.property_city == "" && this.props.quote_data.property_data.property_state == "" && this.props.quote_data.property_data.property_zip_code == "" ? null
              : <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_city}, {this.props.quote_data.property_data.property_state} {this.props.quote_data.property_data.property_zip_code}</Text>
              }
            </View>
            <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Quote Message</Text>
        {this.props.quote_data.description == null ? <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#515151', marginTop:deviceHeight/100, marginBottom:deviceHeight/20}}>There is no description</Text>
        : <Text style={{fontWeight:'400', fontSize:15, color:'#818181', marginTop:deviceHeight/100}}>{this.props.quote_data.description}</Text>}
      </View>
    );
  }

  showDetails_Edit() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Client</Text>
        <View style={{marginTop:deviceHeight/50}}>
          <Text style={{fontWeight:'400', fontSize:16, color:'#818181'}}>{this.props.quote_data.client_data.company}</Text>
          <Text style={{fontWeight:'600', fontSize:16, color:'#818181'}}>{this.props.quote_data.client_data.first_name} {this.props.quote_data.client_data.last_name}</Text>
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Property</Text>
        <View style={{marginTop:deviceHeight/50}}>
          {this.props.quote_data.property_data.property_street1 != "" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_street1}</Text>
          : null }
          {this.props.quote_data.property_data.property_street2 != "" ? <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_street2}</Text>
          : null }
          {this.props.quote_data.property_data.property_city == "" && this.props.quote_data.property_data.property_state == "" && this.props.quote_data.property_data.property_zip_code == "" ? null
          : <Text style={{fontSize:16, fontWeight:'400', color:'#818181'}}>{this.props.quote_data.property_data.property_city}, {this.props.quote_data.property_data.property_state} {this.props.quote_data.property_data.property_zip_code}</Text>
          }
        </View>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>Quote Message</Text>
        <View style={{marginTop:deviceHeight/40, backgroundColor:'white', borderRadius:5, borderColor:'#888', borderWidth:1, height:deviceHeight/6}}>
          <Input multiline={true} numberOfLines={10} style={{paddingLeft:20}} placeholder='Message' value={this.state.quote_description} onChangeText={quote_description => this.setState({ quote_description })} />
        </View>
      </View>
    );
  }

  showQuote_type() {
    if (this.props.quote_data.quote_type == '1') {
      return (
        <View style={{backgroundColor:'#e8ebed', borderRadius:5, width:deviceWidth/5, height:deviceHeight/20, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#657884', fontWeight:'400', fontSize:15}}>DRAFT</Text>
        </View>
      );
    } else if (this.props.quote_data.quote_type == '2') {
      return (
        <View style={{backgroundColor:'#fdcfde', borderRadius:5, width:deviceWidth/2, height:deviceHeight/20, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#f39624', fontWeight:'400', fontSize:15}}>Awaiting Response</Text>
        </View>
      );
    } else {
      return (
        <View style={{backgroundColor:'#ecf3db', borderRadius:5, width:deviceWidth/3, height:deviceHeight/20, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#7db00e', fontWeight:'400', fontSize:15}}>Approved</Text>
        </View>
      );
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
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Quote #{this.props.quote_data.quote_id}</Text>
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

          <View style={{margin:deviceHeight/30, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{color:'#515151', fontSize:18, fontWeight:'700'}}>$0.00</Text>
              {this.showQuote_type()}
          </View>
          <View style={{margin:deviceHeight/30, marginTop:deviceHeight/100, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{width:deviceWidth*13/30}}>
                  <Text style={{color:'#828282', fontSize:15, fontWeight:'500'}}>Created</Text>
                  <Text style={{color:'#525252', fontSize:15, fontWeight:'600'}}>{this.props.quote_data.created_date}</Text>
              </View>
              <View style={{backgroundColor:'#acacac', width:1, height:deviceHeight/15}} />
              <View style={{width:deviceWidth*14/30, marginLeft:deviceWidth/10}}>
                <Text style={{color:'#828282', fontSize:15, fontWeight:'500'}}>Sent</Text>
                <Text style={{color:'#525252', fontSize:15, fontWeight:'600'}}>Not sent</Text>
              </View>
          </View>

          {this.state.is_edit==false ?
            <View style={{flexDirection:'row', justifyContent:'space-between', margin:deviceWidth/30}}>
              <TouchableOpacity style={{borderRadius:5, backgroundColor:'#7db000', width:deviceWidth/2.5, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.sendEmail()}>
                <Text style={{fontWeight:'600', fontSize:16, color:'white'}}>Email Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderRadius:5, backgroundColor:'#7db000', width:deviceWidth/2.5, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.showActionSheet()}>
                <Text style={{fontWeight:'600', fontSize:16, color:'white'}}>Actions</Text>
              </TouchableOpacity>
            </View>
          : null
          }

          <Tabs initialPage={0} style={{marginTop:deviceHeight/150}}>
            <Tab heading="Line Items">
              {this.state.is_edit == true ? 
                <View>
                  {this.showLineItems_Edit()}
                </View>
              : <View>
                  {this.showServices()}
                  {this.showValues()}
                </View>
              }
            </Tab>
            <Tab heading="Details">
              {this.state.is_edit == true ? 
                <View>
                  {this.showDetails_Edit()}
                </View>
              : <View>
                  {this.showDetails()}
                </View>
              }
              
            </Tab>
          </Tabs>

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Services and products</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{margin:deviceWidth/30}}>
                {this.showJobs()}
              </View>
            </ScrollView>

          </Modal>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_client}
            onRequestClose={() => this.setModalVisible_client(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Scheduled clients for today</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_client(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showClients()}
            </ScrollView>
          </Modal>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_property}
            onRequestClose={() => this.setModalVisible_property(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Properties for this client</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_property(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showProerties()}
            </ScrollView>
          </Modal>

          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.handlePress}
          />


        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_clientData_from_quote: data => dispatch(send_clientData_from_quote(data)),
    send_EditedpropertyData_New: flag => dispatch(send_EditedpropertyData_New(flag)),
    send_EditedpropertyData_From_Quote: data => dispatch(send_EditedpropertyData_From_Quote(data)),
    from_quote_to_editProperty: flag => dispatch(from_quote_to_editProperty(flag)),
    send_quoteData: data => dispatch(send_quoteData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  quote_data: state.user.quote_data
});

export default connect(mapStateToProps, bindAction)(QuoteDetailPage);


class Child extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.itemData.service_name,
      description: this.props.itemData.service_description,
      cost: this.props.itemData.service_cost,
      qty: '',
      total: ''
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
      <View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View>
            <View style={{marginTop:deviceHeight/100, borderBottomColor:'rgba(0,0,0,0)', borderColor:'#888', borderWidth:1, borderTopLeftRadius:5, borderTopRightRadius:5, width:deviceWidth*24/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10}} placeholder='Title' value={this.state.name} onChangeText={name => this.changeName(name, this.props.index)} />
            </View>
            <View style={{borderColor:'#888', borderWidth:1, borderTopColor:'rgba(0,0,0,0)',borderBottomLeftRadius:5, borderBottomRightRadius:5, width:deviceWidth*24/30, height:deviceHeight/7}}>
                <Input multiline={true} numberOfLines={10} style={{paddingLeft:10}} placeholder='Description' value={this.state.description} onChangeText={description => this.changeDescription(description, this.props.index)} />
            </View>
          </View>
          <TouchableOpacity style={{marginLeft:deviceWidth/20}} onPress={() => this.textFunction(this.props.index)}>
            <Image source={binIcon} style={{width:deviceWidth/20, height:deviceWidth*28/19/20}} />
          </TouchableOpacity>
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

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/20, marginBottom:deviceHeight/30}} />
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

class Child_services extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectJob(i)
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