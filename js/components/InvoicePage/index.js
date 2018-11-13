import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions, Image, ScrollView,Modal, TextInput, Alert } from "react-native";
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
import Spinner from 'react-native-loading-spinner-overlay';
import { URLclass } from '../lib/';
import styles from "./styles";
import moment from 'moment';
import DatePicker from 'react-native-datepicker'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const personImage = require("../../../images/person.png");
const switchImage = require("../../../images/switch.png");
const carImage = require("../../../images/ic_delivery@3x.png");
const collectPaymentBtn = require("../../../images/btn_collect_payment@3x.png");
const emailInvoiceBtn = require("../../../images/btn_email_invoice@3x.png");
const collectSignatureBtn = require("../../../images/btn_collect_signature@3x.png");
const nonTaxableBtn = require("../../../images/btn_non_taxable@3x.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const binIcon = require("../../../images/bin.png");

class InvoicePage extends Component {
  static navigationOptions = {
    header: null
  };

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      is_new: true,
      is_edit: false,
      created_date: moment(new Date()).format("YYYY-MM-DD"),
      issued_date: "",
      payment_term: 1,
      payment_term_string: "Upon receipt",
      due_date: "",
      total_money: 0.00,
      invoice_type: 1,
      selected_services: [],
      service_list: [],
      visible: false,
      modalVisible_service: false,
      subtotal_value: 0,
      is_discount: false,
      is_deposit: false,
      tax_value: 0.00,
      total_value: 0.00,
      discount_value:0,
      discount_type: "2",
      tax_type : "0.2",
      deposit_value: 0,
      deposit_type : "1",
      invoice_description: "",

      response_result: null
    };
    this.DoselectService=this.DoselectService.bind(this);
    this.DoselectJob_delete=this.DoselectJob_delete.bind(this)
    this.DoChange_QTY=this.DoChange_QTY.bind(this)
    this.DoChange_Cost=this.DoChange_Cost.bind(this)
    this.DoChange_Name=this.DoChange_Name.bind(this)
    this.DoChange_Description=this.DoChange_Description.bind(this)
  }

  componentWillMount() {
  }

  setModalVisible_service(visible) {
    this.setState({modalVisible_service: visible});
  }

  DoselectService(_counterFromChild) {
    this.setModalVisible_service(false)

    var temp_array = this.state.selected_services
    var temp= this.state.service_list[_counterFromChild]
    temp_array.push(temp)
    this.setState({selected_services:temp_array})
  }

   DoselectJob_delete(_counterFromChild) {
    var temp_array = this.state.selected_services
    temp_array.splice(_counterFromChild, 1)
    this.setState({selected_services:temp_array})

    var temp = 0;
    this.state.selected_services.map((data) => {
      temp += data.service_cost * data.service_quantity
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_QTY(value, index) {
    var temp = 0;

    this.state.selected_services[index].service_quantity = value

    this.state.selected_services.map((data) => {
      temp += data.service_cost * data.service_quantity
    })
    console.log('*****', this.state.selected_services[0].service_quantity)
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Cost(value, index) {
    var temp = 0;

    this.state.selected_services[index].service_cost = value

    this.state.selected_services.map((data) => {
      temp += data.service_cost * data.service_quantity
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Name(value, index) {
    this.state.selected_services[index].service_name = value
  }

  DoChange_Description(value, index) {
    this.state.selected_services[index].service_description = value
  }

  select_DiscountType(value: string) {
    this.setState({discount_type: value});
  }

  select_DepositType(value: string) {
    this.setState({deposit_type: value});
  }

  select_TaxType(value: string) {
    this.setState({tax_type: value});
  }

  select_paymentTerm(value: string) {
    this.setState({payment_term: value});

    if (value == 1) {
      this.setState({payment_term_string: "Upon receipt"})
      this.setState({due_date: ""})
    } else if (value == 2) {
      this.setState({payment_term_string: "Net 15"})
      this.setState({due_date: ""})
    } else if (value == 3) {
      this.setState({payment_term_string: "Net 30"})
      this.setState({due_date: ""})
    } else {
      this.setState({payment_term_string: "Net 45"})
      this.setState({due_date: ""})
    }
  }

  clickIssuedDate(date) {
    this.setState({issued_date: date})
  }

  clickDueDate(date) {
    this.setState({due_date: date})
  }

  showSave_EditBtn() {
    if (this.state.is_new == true) {
      return (
        <Button transparent onPress={() => this.clickSave_newBtn()}>
          <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
        </Button>
      );
    } else {
      if (this.state.is_edit == true) {
        return (
          <Button transparent onPress={() => this.clickSave_editBtn()}>
            <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
          </Button>
        );
      } else {
        return (
          <Button transparent onPress={() => this.clickEditBtn()}>
            <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Edit</Text>
          </Button>
        );
      }
    }
  }

  clickBackBtn() {
    this.props.navigation.state.params.onNavigateBack(this.state.foo)
    this.props.navigation.goBack(null)
  }

  clickEdit_CancelBtn() {
    this.setState({is_edit: false})
  }

  clickSave_editBtn() {
    if (this.state.selected_services.length == 0) {
      Alert.alert('You must have 1 line item at least.')
    } else { 
      this.setState({visible:true})

      var temp=URLclass.url + 'invoice/update'
      var temp_discount ={
        type: this.state.discount_type,
        value: this.state.discount_value
      }

      var sss= {
        invoice_id: this.state.response_result.invoice_id,
        client_id: this.props.client_data.client_id,
        created_date: this.state.created_date,
        issued_date: this.state.issued_date,
        payment_term: this.state.payment_term,
        due_date: this.state.due_date,
        invoice_description: this.state.invoice_description,
        services: this.state.selected_services,
        discount: temp_discount,
        tax: this.state.tax_type
      }
      console.log('+++++++++++++--------------+++++++++++++', sss)

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            invoice_id: this.state.response_result.invoice_id,
            client_id: this.props.client_data.client_id,
            created_date: this.state.created_date,
            issued_date: this.state.issued_date,
            payment_term: this.state.payment_term,
            due_date: this.state.due_date,
            invoice_description: this.state.invoice_description,
            services: this.state.selected_services,
            discount: temp_discount,
            tax: this.state.tax_type
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          console.log('INVOICE DATA+++++++++++++++', responseData)
          this.setState({visible:false})
          this.setState({is_new: false})
          this.setState({is_edit: false})
          this.setState({response_result: responseData})
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

  clickSave_newBtn() {
    if (this.state.selected_services.length == 0) {
      Alert.alert('You must have 1 line item at least.')
    } else { 
      this.setState({visible:true})

      var temp=URLclass.url + 'invoice/add'
      var temp_discount ={
        type: this.state.discount_type,
        value: this.state.discount_value
      }

      var sss= {
        invoice_id: 0,
        client_id: this.props.client_data.client_id,
        created_date: this.state.created_date,
        issued_date: this.state.issued_date,
        payment_term: this.state.payment_term,
        due_date: this.state.due_date,
        invoice_description: this.state.invoice_description,
        services: this.state.selected_services,
        discount: temp_discount,
        tax: this.state.tax_type
      }
      console.log('+++++++++++++--------------', sss)

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            invoice_id: 0,
            client_id: this.props.client_data.client_id,
            created_date: this.state.created_date,
            issued_date: this.state.issued_date,
            payment_term: this.state.payment_term,
            due_date: this.state.due_date,
            invoice_description: this.state.invoice_description,
            services: this.state.selected_services,
            discount: temp_discount,
            tax: this.state.tax_type
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          console.log('INVOICE DATA+++++++++++++++', responseData)
          this.setState({visible:false})
          this.setState({is_new: false})
          this.setState({is_edit: false})
          this.setState({response_result: responseData})
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

  clickEditBtn() {
    this.setState({is_edit: true}) 
  }

  clickPlus_AddLineItemBtn() {
    this.setState({modalVisible_service:true})
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
        console.log('SERVIES=================', responseData.services)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
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

  showLineItems_title() {
    if (this.state.selected_services.length == 0) {
      return (
        <View style={{backgroundColor:'#f3f3f3', borderColor:'#888', borderWidth:1, borderRadius:5, margin:deviceWidth/30}}>
          <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#515151', marginTop:deviceHeight/40, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/40, textAlign:'center'}}>Add a line item in order to complete this invoice</Text>
        </View>
      );
    }
  }

  showLineItems() {
    var i=-1;
    return this.state.selected_services.map((data) => {
      i++;
      return (
        <Child_selectedServices key={i} itemData={data} index={i} selectService={this.DoselectJob_delete} changeQTY={this.DoChange_QTY} changeCost={this.DoChange_Cost} changeName={this.DoChange_Name} changeDescription={this.DoChange_Description} />
      )
    })
  }

  showLineItems_button() {
    return (
      <TouchableOpacity style={{marginTop:deviceHeight/50, marginLeft:deviceWidth/30}} onPress={() => this.clickPlus_AddLineItemBtn(true)}>
          <Image source={addLineItemBtn} style={{width:deviceWidth*28/30, height:deviceWidth*28*222/1935/30}} />
      </TouchableOpacity>
    );
  }

  showLineItems_result() {
    return (
      <View style={{marginBottom:deviceHeight/30}}>
        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/20, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Subtotal</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.subtotal_value.toString()}</Text>
        </View>
        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        {this.state.is_discount==true ? 
          <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/50}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Discount</Text>
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
              {this.state.discount_type==1 ? 
                <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.discount_value.toString()}</Text>
              : <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${((this.state.subtotal_value*this.state.discount_value/100).toFixed(2)).toString()}</Text>
              }
            </View>
            <TouchableOpacity style={{flexDirection:'row', alignSelf:'flex-end', marginTop:deviceHeight/30, marginRight:deviceWidth/30, marginBottom:deviceHeight/100}} onPress={() => this.clickRemove_discount()}>
              <Image source={binIcon} style={{width:deviceWidth/25, height:deviceWidth*28/19/25}} />
              <Text style={{fontSize:14, fontWeight:'400', color:'#f06747', marginLeft:deviceWidth/50}}>Remove</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, marginBottom:deviceHeight/100, justifyContent:'space-between', alignItems:'center'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Discount</Text>
            
            <TouchableOpacity onPress={() => this.clickDiscount()}>
                <Text style={{fontSize:14, fontWeight:'700', color:'#4f70ca', marginRight:deviceWidth/30}}>Add Discount</Text>
            </TouchableOpacity>
          </View>
        }

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
          <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${ (((this.state.subtotal_value-this.state.discount_value)*this.state.tax_type/100).toFixed(2)).toString()}</Text>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Total</Text>
            {this.state.discount_type==1 ? <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${(this.state.subtotal_value-this.state.discount_value+this.state.subtotal_value*this.state.tax_type/100).toFixed(2)}</Text>
            : <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${(this.state.subtotal_value*this.state.discount_value/100-this.state.discount_value+this.state.subtotal_value*this.state.tax_type/100).toFixed(2)}</Text>}
            
        </View>

        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/50, marginRight:deviceWidth/30, marginLeft:deviceWidth/30}} />

      </View>
    );
  }

  showServices() {
    var i=-1;
    return this.state.service_list.map((data) => {
      i++;
      return (
        <Child_services key={i} itemData={data} index={i} selectService={this.DoselectService} />
      )
    })
  }

  showServices_saved() {
    var i=-1;
    return this.state.selected_services.map((data) => {
      i++;
      return (
        <Child_services_result key={i} itemData={data} index={i} />
      )
    })
  }

  showLineItems_result_saved() {
    return (
      <View style={{marginBottom:deviceHeight/30}}>
        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/20, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Subtotal</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.subtotal_value.toString()}</Text>
        </View>
        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, marginBottom:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Discount</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.discount_value.toString()}</Text>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Tax</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.tax_value.toString()}</Text>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'600', color:'#515151', marginLeft:deviceWidth/30}}>Total</Text>
            <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${this.state.total_money.toString()}</Text>
        </View>

        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/50, marginRight:deviceWidth/30, marginLeft:deviceWidth/30}} />

      </View>
    );
  }

  showDetails() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{marginTop:deviceHeight/100, fontSize:17, fontWeight:'600', color:'#515151'}}>Client</Text>
        <Text style={{marginTop:deviceHeight/50, fontSize:15, fontWeight:'400', color:'#818181'}}>{this.props.client_data.company}</Text>
        <Text style={{fontSize:16, fontWeight:'600', color:'#818181'}}>{this.props.client_data.first_name} {this.props.client_data.last_name}</Text>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />

        {this.state.is_new == true || this.state.is_edit == true 
        ? <View>
            <Text style={{marginTop:deviceHeight/100, fontSize:17, fontWeight:'600', color:'#515151'}}>Invoice Details</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, alignItems:'center'}}>
              <Text style={{fontSize:17, fontWeight:'400', color:'#818181'}}>Issued date</Text>
              <DatePicker
                  style={{width: deviceWidth/1.65}}
                  date={this.state.issued_date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 0
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => this.clickIssuedDate(date)}
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:deviceHeight/50}}>
              <Text style={{fontSize:17, fontWeight:'400', color:'#818181'}}>Payment terms</Text>
              <View style={{borderWidth:1, borderColor:'#acacac', width:deviceWidth/1.65, height:deviceHeight/15,}}>
                <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50, marginTop:-5}}>
                  <Picker
                    mode="dropdown"
                    placeholder="Select One"
                    selectedValue={this.state.payment_term}
                    onValueChange={this.select_paymentTerm.bind(this)}
                  >
                    <Item label="Upon receipt" value="1" />
                    <Item label="Net 15" value="2" />
                    <Item label="Net 30" value="3" />
                    <Item label="Net 45" value="4" />
                    <Item label="Custom" value="5" />
                  </Picker>
                </Form>
              </View>
            </View>
            {this.state.payment_term == 5 ?
              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, alignItems:'center'}}>
                <Text style={{fontSize:17, fontWeight:'400', color:'#818181'}}>Due date</Text>
                <DatePicker
                    style={{width: deviceWidth/1.65}}
                    date={this.state.due_date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 0
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => this.clickDueDate(date)}
                  />
              </View>
            : null}

            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30, marginBottom:deviceHeight/50}} />

            <Text style={{marginTop:deviceHeight/100, fontSize:17, fontWeight:'600', color:'#515151'}}>Invoice message</Text>
            <View style={{marginTop:deviceHeight/40, backgroundColor:'white', borderRadius:5, borderColor:'#888', borderWidth:1, height:deviceHeight/6}}>
              <Input multiline={true} numberOfLines={10} style={{paddingLeft:20}} placeholder='Message' onChangeText={invoice_description => this.setState({ invoice_description })} />
            </View>
          </View>
        : <View>
            <Text style={{marginTop:deviceHeight/100, fontSize:17, fontWeight:'600', color:'#515151'}}>Invoice message</Text>
            {this.state.invoice_description == "" ?
              <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/40, marginLeft:deviceWidth/100}}>There is no message for this invoice</Text>
            : <Text style={{marginTop:deviceHeight/100, fontSize:16, fontWeight:'400', color:'#818181'}}>{this.state.invoice_description}</Text>
            }
            
          </View>
        }
      </View>
    );
  }

  clickEmailInvoiceBtn() {
    console.log('EMAIL============', this.props.quote_data)
    this.setState({visible:true})

    var temp=URLclass.url + 'invoice/send_email'

    fetch(temp, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Token': this.props.login_data.token
      },
      body: JSON.stringify({
        invoice_id: this.state.response_result.invoice_id
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

render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#4f70ca'}}>
          <Left style={{ flex: 1,}}>
            {this.state.is_edit == true 
              ? <Button transparent onPress={() => this.clickEdit_CancelBtn()}>
                  <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Cancel</Text>
                </Button>
            : <Button transparent onPress={() => this.clickBackBtn()}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Back</Text>
              </Button>
            }
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>New Invoice</Text>
          </Body>
          <Right style={{ flex: 1,}}>
            {this.showSave_EditBtn()}
          </Right>
        </Header>

        <Content>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceWidth/30}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'600', color:'#515151'}}>${this.state.total_money}</Text>
              {this.state.invoice_type == 1 
              ? <View style={{backgroundColor:'#e8ebed', width:deviceWidth/5, height:deviceHeight/20, borderRadius:5, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{color:'#818181', fontWeight:'400', fontSize:14}}>DRAFT</Text>
                </View>
              : <View style={{backgroundColor:'#fdefde', width:deviceWidth/2.5, height:deviceHeight/20, borderRadius:5, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{color:'#f6b571', fontWeight:'400', fontSize:14}}>AWAITING PAYMENT</Text>
                </View>
              }
            </View>

            <View style={{marginTop:deviceHeight/30, justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
              <View>
                <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>Created</Text>
                <Text style={{color:'#818181', fontWeight:'500', fontSize:15}}>{this.state.created_date}</Text>
              </View>
              <View>
                <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>Issued</Text>
                {this.state.issued_date == "" ? <Text style={{color:'#818181', fontWeight:'500', fontSize:15}}>Not issued</Text>
                : <Text style={{color:'#818181', fontWeight:'500', fontSize:15}}>{this.state.issued_date}</Text>
                }
              </View>
              <View>
                {this.state.due_date == "" 
                ? <View>
                    <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>Terms</Text>
                    <Text style={{color:'#818181', fontWeight:'500', fontSize:15}}>{this.state.payment_term_string}</Text>
                  </View>
                : <View>
                    <Text style={{color:'#818181', fontWeight:'400', fontSize:15}}>Due</Text>
                    <Text style={{color:'#818181', fontWeight:'500', fontSize:15}}>{this.state.due_date}</Text>
                  </View>
                }                
              </View>
            </View>

            {this.state.is_new == false && this.state.is_edit == false 
            ? <TouchableOpacity style={{backgroundColor:'#4e70ca', borderRadius:5, alignItems:'center', justifyContent:'center', height:deviceHeight/15, width:deviceWidth*24/30, marginLeft:deviceWidth*2/30, marginTop:deviceHeight/30}} onPress={() => this.clickEmailInvoiceBtn()}>
                <Text style={{color:'white', fontSize:16, fontWeight:'500'}}>Email Invoice</Text>
              </TouchableOpacity>
            : null
            }
          </View>

          <Tabs initialPage={0} style={{marginTop:deviceHeight/150}}>
            <Tab heading="Line Items">
              {this.state.is_new == true || this.state.is_edit == true 
              ? <View>
                  {this.showLineItems_title()}
                  {this.showLineItems()}
                  {this.showLineItems_button()}
                  {this.showLineItems_result()}
                </View>
              : <View>
                  {this.showServices_saved()}
                  {this.showLineItems_result_saved()}
                </View>
              }
            </Tab>
            <Tab heading="Details">
              {this.showDetails()}
            </Tab>
          </Tabs>

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_service}
            onRequestClose={() => this.setModalVisible_service(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Services and products</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_service(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{margin:deviceWidth/30}}>
                {this.showServices()}
              </View>
            </ScrollView>
          </Modal>

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
  event_data: state.user.event_data,
  client_data: state.user.client_data
});

export default connect(mapStateToProps, bindAction)(InvoicePage);


class Child_services extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectService(i)
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


class Child_selectedServices extends Component {
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

  componentWillMount() {
    console.log('SELCTED SERVICES LIST===========', this.props.itemData)
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
    this.setState({total: (value*this.state.cost).toFixed(2)})
  }

  changeCost(value, index) {
    this.setState({cost: value});
    this.props.changeCost(value, index)
    this.setState({total: (this.state.qty*value).toFixed(2)})
  }

  render() {
    return (
      <View style={{margin: deviceWidth/30}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View>
            <View style={{marginTop:deviceHeight/100, borderBottomColor:'rgba(0,0,0,0)', borderColor:'#888', borderWidth:1, borderTopLeftRadius:5, borderTopRightRadius:5, width:deviceWidth*25/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10}} placeholder='Title' value={this.state.name} onChangeText={name => this.changeName(name, this.props.index)} />
            </View>
            <View style={{borderColor:'#888', borderWidth:1, borderTopColor:'rgba(0,0,0,0)',borderBottomLeftRadius:5, borderBottomRightRadius:5, width:deviceWidth*25/30, height:deviceHeight/7}}>
                <Input multiline={true} numberOfLines={10} style={{paddingLeft:10}} placeholder='Description' value={this.state.description} onChangeText={description => this.changeDescription(description, this.props.index)} />
            </View>
          </View>
          <TouchableOpacity style={{marginLeft:deviceWidth/30}} onPress={() => this.textFunction(this.props.index)}>
            <Image source={binIcon} style={{width:deviceWidth/20, height:deviceWidth*28/19/20}} />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50}}>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>QTY</Text>
            <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, width:deviceWidth*9/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10}} placeholder='0' value={this.state.qty.toString()} onChangeText={qty => this.changeQTY(qty, this.props.index)} />
            </View>
          </View>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>UNIT COST</Text>
            <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, width:deviceWidth*9/30, height:deviceHeight/15}}>
                <Input style={{paddingLeft:10, height:deviceHeight/100}} placeholder='$0.00' value={this.state.cost.toString()} onChangeText={cost => this.changeCost(cost, this.props.index)} />
            </View>
          </View>
          <View>
            <Text style={{fontSize:13, fontWeight:'400', color:'#515151'}}>TOTAL</Text>
            <View style={{marginTop:deviceHeight/50, width:deviceWidth*7/30, height:deviceHeight/15}}>
              <Text style={{fontWeight:'600', fontSize:17, color:'#515151'}}>: ${this.state.total.toString()}</Text>
            </View>
          </View>
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100}} />
      </View>
    );
  }
} 


class Child_services_result extends Component {
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