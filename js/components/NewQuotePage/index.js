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
import { send_quoteData } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

const draftBtn = require("../../../images/draftBtn.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const binIcon = require("../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class NewQuotePage extends Component {
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
      deposit_type : "1"
    };
    this.DoselectJob=this.DoselectJob.bind(this);
    this.DoselectJob_delete=this.DoselectJob_delete.bind(this)
    this.DoselectClient=this.DoselectClient.bind(this)
    this.DoselectProperty=this.DoselectProperty.bind(this)
    this.DoChange_QTY=this.DoChange_QTY.bind(this)
    this.DoChange_Cost=this.DoChange_Cost.bind(this)
    this.DoChange_Name=this.DoChange_Name.bind(this)
    this.DoChange_Description=this.DoChange_Description.bind(this)
  }

  componentWillMount() {
    if (this.props.from_client_to_NewQuote == true) {
      var temp_name = this.props.client_data.first_name + ' ' + this.props.client_data.last_name;
      var temp_company = this.props.client_data.company;
      var temp_id = this.props.client_data.client_id;
      var temp = {name: temp_name, company: temp_company, client_id:temp_id}
      this.setState({selected_client: temp})
      if (this.props.client_data.property[0].property_id != 0) {
        this.setState({selected_property: this.props.client_data.property[0]})
      }
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
      temp += parseInt(data.cost) * parseInt(data.name)
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

    this.state.selected_services[index].quantity = value

    this.state.selected_services.map((data) => {
      temp += parseInt(data.cost) * parseInt(data.quantity)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Cost(value, index) {
    var temp = 0;

    this.state.selected_services[index].cost = value

    this.state.selected_services.map((data) => {
      temp += parseInt(data.cost) * parseInt(data.name)
    })
    this.setState({subtotal_value: temp.toString()})
  }

  DoChange_Name(value, index) {
    this.state.selected_services[index].name = value
  }

  DoChange_Description(value, index) {
    this.state.selected_services[index].description = value
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
    var i=-1;
    return this.state.selected_services.map((data) => {
      i++;
      return (
        <Child key={i} itemData={data} index={i} selectService={this.DoselectJob_delete} changeQTY={this.DoChange_QTY} changeCost={this.DoChange_Cost} changeName={this.DoChange_Name} changeDescription={this.DoChange_Description} />
      )
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

  clickSaveButton() {
    if (this.state.selected_client == null) {
      Alert.alert('Client is required.')
    } else if (this.state.selected_property == null) {
      Alert.alert('Property is required.')
    } else if (this.state.selected_services.length == 0) {
      Alert.alert('You must have at least 1 line item.')
    } else {
      this.setState({visible:true})

      var aaa = {
        quote_id: 0,
        created_date: moment(new Date()).format("YYYY-MM-DD"),
        client_id: this.state.selected_client.client_id,
        property_id: this.state.selected_property.property_id,
        description: this.state.quote_description,
        discount_value: this.state.discount_value,
        discount_type: this.state.discount_type,
        tax: this.state.tax_type,
        deposit_value: this.state.deposit_value,
        deposit_type: this.state.deposit_type,
        services: this.state.selected_services
      }
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX=========11111111111', this.props.client_data)
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX=========22222222222', this.state.selected_client)
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX=========33333333333', aaa)
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX=========44444444444', this.state.selected_property)

      var temp=URLclass.url + 'quote/add'

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            quote_id: 0,
            created_date: moment(new Date()).format("YYYY-MM-DD"),
            client_id: this.state.selected_client.client_id,
            property_id: this.state.selected_property.property_id,
            description: this.state.quote_description,
            discount_value: this.state.discount_value,
            discount_type: this.state.discount_type,
            tax: this.state.tax_type,
            deposit_value: this.state.deposit_value,
            deposit_type: this.state.deposit_type,
            services: this.state.selected_services
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          console.log('QUOTE DATA+++++++++++++++', responseData)
          this.setState({visible:false})
          this.props.send_quoteData(responseData)
          this.props.navigation.navigate("QuoteDetailPage")
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

  showLineItems() {
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
                {this.state.discount_type==1 ? 
                  <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${this.state.discount_value.toString()}</Text>
                : <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${((this.state.subtotal_value*this.state.discount_value/100).toFixed(2)).toString()}</Text>
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
          <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${ ((this.state.subtotal_value*this.state.tax_type/100).toFixed(2)).toString()}</Text>
          
        </View>

        <View style={{backgroundColor:'#979fa8', height:1, marginTop:deviceHeight/100, marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} />

        <View style={{flexDirection:'row', marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/100, justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'400', color:'#929292', marginLeft:deviceWidth/30}}>Total</Text>
            {this.state.discount_type==1 ? <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${(this.state.subtotal_value-this.state.discount_value+this.state.subtotal_value*this.state.tax_type/100).toFixed(2)}</Text>
            : <Text style={{fontSize:14, fontWeight:'700', color:'#515151', marginRight:deviceWidth/30}}>${(this.state.subtotal_value*this.state.discount_value/100-this.state.discount_value+this.state.subtotal_value*this.state.tax_type/100).toFixed(2)}</Text>}
            
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
              <Text style={{fontSize:14, fontWeight:'700', color:'#515151'}}>${((this.state.subtotal_value*this.state.deposit_value/100).toFixed(2)).toString()}</Text>
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

  showDetails() {
    return (
      <View>
        <View style={{margin:deviceWidth/30, marginTop:deviceHeight/20, marginBottom:deviceHeight/20}}>
          <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100}}>Client</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            {this.state.selected_client==null? 
              <Text style={{fontSize:16, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/40, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/40, textAlign:'center'}}>Tap the add button to select a client</Text>
              :
              <View style={{marginTop:deviceHeight/50}}>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>{this.state.selected_client.company}</Text>
                <Text style={{fontSize:16, fontWeight:'600', color:'#818181'}}>{this.state.selected_client.name}</Text>
              </View>
            }
            
            <TouchableOpacity onPress={() => this.clickPlusBtn_client()}>
              <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
            </TouchableOpacity>
          </View>

          {this.state.selected_client==null? null
          :
          <View>
            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30, marginBottom:deviceHeight/30}} />
            <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100}}>Property quoted</Text>

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              {this.state.selected_property==null? 
                <Text style={{fontSize:16, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginTop:deviceHeight/40, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/40, textAlign:'center'}}>Tap the add button to select a property</Text>
                :
                <View style={{marginTop:deviceHeight/50}}>
                  {this.state.selected_property.property_street1=="" ? null
                  : <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.state.selected_property.property_street1}</Text> 
                  }
                  {this.state.selected_property.street2=="" ? null
                  : <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.state.selected_property.property_street2}</Text> 
                  }
                  <Text style={{fontSize:16, fontWeight:'700', color:'#818181'}}>{this.state.selected_property.city}, {this.state.selected_property.property_state} {this.state.selected_property.property_zip_code}</Text>
                </View>
              }
              
              <TouchableOpacity onPress={() => this.clickPlusBtn_property()}>
                <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
              </TouchableOpacity>
            </View>
          </View>
          }

          <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />
          <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100, marginTop:deviceHeight/30}}>Quote description</Text>
          <View style={{marginTop:deviceHeight/40, backgroundColor:'white', borderRadius:5, borderColor:'#888', borderWidth:1, height:deviceHeight/6}}>
            <Input multiline={true} numberOfLines={10} style={{paddingLeft:20}} placeholder='Message' onChangeText={quote_description => this.setState({ quote_description })} />
          </View>

        </View>
      </View>
    );
  }


  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#b36096'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>New Quote</Text>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={() => this.clickSaveButton()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <Content>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{margin:deviceHeight/30, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{color:'#515151', fontSize:18, fontWeight:'700'}}>$0.00</Text>
              <TouchableOpacity>
                  <Image source={draftBtn} style={{width:deviceWidth/5, height:deviceWidth*132/393/5}} />
              </TouchableOpacity>
          </View>
          <View style={{margin:deviceHeight/30, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{width:deviceWidth*13/30}}>
                  <Text style={{color:'#828282', fontSize:15, fontWeight:'500'}}>Created</Text>
                  <Text style={{color:'#525252', fontSize:15, fontWeight:'600'}}>Nov 29, 2016</Text>
              </View>
              <View style={{backgroundColor:'#acacac', width:1, height:deviceHeight/15}} />
              <View style={{width:deviceWidth*14/30, marginLeft:deviceWidth/10}}>
                  <Text style={{color:'#828282', fontSize:15, fontWeight:'500'}}>Sent</Text>
                  <Text style={{color:'#525252', fontSize:15, fontWeight:'600'}}>Not sent</Text>
              </View>
          </View>

          <Tabs initialPage={0} style={{marginTop:deviceHeight/150}}>
            <Tab heading="Line Items">
              {this.showLineItems()}
            </Tab>
            <Tab heading="Details">
              {this.showDetails()}
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
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Scheduled clients for today</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_property(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showProerties()}
            </ScrollView>
          </Modal>


        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_quoteData: data => dispatch(send_quoteData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  from_client_to_NewQuote: state.user.from_client_to_NewQuote
});

export default connect(mapStateToProps, bindAction)(NewQuotePage);


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
