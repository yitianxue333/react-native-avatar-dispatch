import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, Alert, ScrollView } from "react-native";
import { URLclass } from '../../../lib/';
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
  Right, Item, Input, Picker, Form
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";
import CheckBox from 'react-native-checkbox';

import { setIndex } from "../../../../actions/list";
import { send_edited_clientData, send_clientData } from "../../../../actions/user";
// import CountryCodeList from 'react-native-country-code-list'
import Spinner from 'react-native-loading-spinner-overlay';

const checkBoxBtn = require("../../../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../../../images/check_box@3x.png");
const binIcon = require("../../../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class ClientEditPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      company: '',
      client_id: 0,
      phones: [],
      emails: [],
      use_company: '-1',
      property_id: 0,
      property_street1: '',
      property_street2: '',
      property_city: '',
      property_state: '',
      property_zip_code: '',
      property_country: 'United States',
      tax: '0.2',
      billing_id: 0,
      billing_street1: '',
      billing_street2: '',
      billing_city: '',
      billing_state: '',
      billing_zip_code: '',
      billing_country: 'United States',
      is_property: '1',
      modalVisible: false,
      visible: false,
      countries: [
        "Afghanistan", 
        "Åland Islands", 
        "Albania",
        "Algeria",
        "American Samoa",
        "AndorrA",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize", 
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory", 
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada", 
        "Cape Verde", 
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China", 
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo", 
        "Congo, The Democratic Republic of the",
        "Cook Islands",
        "Costa Rica",
        "Cote D\"Ivoire", 
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands (Malvinas)",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar", 
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey", 
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and Mcdonald Islands", 
        "Holy See (Vatican City State)",
        "Honduras",
        "Hong Kong",
        "Hungary", 
        "Iceland", 
        "India",
        "Indonesia",
        "Iran, Islamic Republic Of",
        "Iraq",
        "Ireland", 
        "Isle of Man",
        "Israel",
        "Italy", 
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea, Democratic People\"S Republic of",
        "Korea, Republic of",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People\"S Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho", 
        "Liberia",
        "Libyan Arab Jamahiriya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Macedonia, The Former Yugoslav Republic of",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia, Federated States of",
        "Moldova, Republic of",
        "Monaco",
        "Mongolia",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "Netherlands Antilles",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestinian Territory, Occupied",
        "Panama", 
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Reunion",
        "Romania",
        "Russian Federation",
        "RWANDA", 
        "Saint Helena",
        "Saint Kitts and Nevis", 
        "Saint Lucia", 
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines", 
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia", 
        "Senegal", 
        "Serbia and Montenegro", 
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan, Province of China",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "United States Minor Outlying Islands",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Viet Nam",
        "Virgin Islands, British",
        "Virgin Islands, U.S.",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe"
      ],
    };
    this.DoSelectItem=this.DoSelectItem.bind(this)
    this.DoSelectItem_Email=this.DoSelectItem_Email.bind(this)
    this.DochangePhoneNumber=this.DochangePhoneNumber.bind(this)
    this.DochangePhoneType=this.DochangePhoneType.bind(this)
    this.DochangeEmailAddress=this.DochangeEmailAddress.bind(this)
    this.DochangeEmailType=this.DochangeEmailType.bind(this)
    this.DoSelectCountry=this.DoSelectCountry.bind(this)
  }

  componentWillMount() {
    this.setState({first_name: this.props.client_data.first_name})
    this.setState({last_name: this.props.client_data.last_name})
    this.setState({company: this.props.client_data.company})
    this.setState({client_id: this.props.client_data.client_id})
    this.setState({phones: this.props.client_data.phones})
    this.setState({emails: this.props.client_data.emails})
    this.setState({property_id: this.props.client_data.property[0].property_id})
    this.setState({property_street1: this.props.client_data.property[0].property_street1})
    this.setState({property_street2: this.props.client_data.property[0].property_street2})
    this.setState({property_city: this.props.client_data.property[0].property_city})
    this.setState({property_state: this.props.client_data.property[0].property_state})
    this.setState({property_zip_code: this.props.client_data.property[0].property_zip_code})
    this.setState({property_country: this.props.client_data.property[0].property_country})
    this.setState({billing_id: this.props.client_data.billing.billing_id})
    this.setState({billing_street1: this.props.client_data.billing.billing_street1})
    this.setState({billing_street2: this.props.client_data.billing.billing_street2})
    this.setState({billing_city: this.props.client_data.billing.billing_city})
    this.setState({billing_state: this.props.client_data.billing.billing_state})
    this.setState({billing_zip_code: this.props.client_data.billing.billing_zip_code})
    this.setState({billing_country: this.props.client_data.billing.billing_country})
  }

  setModalVisible(visible) {
      this.setState({modalVisible: visible});
  }

  onValueChange1(value: string) {
    this.setState({
      selected1: value
    });
  }

  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }

  onValueChange3(value: string) {
    this.setState({
      tax: value
    });
  }

  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }

  clickChecker() {
    if (this.state.use_company == '-1') {
      this.setState({use_company: '1'})
    } else {
      this.setState({use_company: '-1'})
    }
  }

  showBillingAddress() {
    return (
      <View style={{marginTop:deviceHeight/100}}>
        <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
            <Input placeholder='street1' value={this.state.billing_street1} onChangeText={billing_street1 => this.setState({billing_street1})} />
        </Item>
        <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
            <Input placeholder='street2' value={this.state.billing_street2} onChangeText={billing_street2 => this.setState({billing_street2})} />
        </Item>
        <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
            <Input placeholder='city' value={this.state.billing_city} onChangeText={billing_city => this.setState({billing_city})} />
        </Item>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Item regular style={{width:deviceWidth*21/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
              <Input placeholder='Province' value={this.state.billing_state} onChangeText={billing_state => this.setState({billing_state})} />
          </Item>
          <Item regular style={{width:deviceWidth*22/50, backgroundColor:'white', marginTop:deviceHeight/50, marginRight:3}}>
              <Input placeholder='Postal code' value={this.state.billing_zip_code} onChangeText={billing_zip_code => this.setState({billing_zip_code})} />
          </Item>
        </View>

        <TouchableOpacity style={{borderWidth:1, borderColor:'#acacac', height:deviceHeight/11, marginTop:deviceHeight/50, justifyContent:'center', alignItems:'center'}} onPress={() => this.clickBillingCountry()}>
          <Text style={{fontSize:17, fontWeight:'500', color:'#515151'}}>{this.state.billing_country}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  DoSelectCountry(_counterFromChild) {
    if (this.state.is_property=='1') {
      this.setState({property_country:this.state.countries[_counterFromChild]})  
    } else {
      this.setState({billing_country:this.state.countries[_counterFromChild]})
    }
    
    this.setModalVisible(false)
  }

  clickPropertyCountry() {
    this.setState({is_property:'1'})
    this.setModalVisible(true)
  }

  clickBillingCountry() {
    this.setState({is_property:'-1'})
    this.setModalVisible(true)
  }

  add_phoneNumber() {
    var temp_array = this.state.phones
    var temp={option:'1', value:''}
    temp_array.push(temp)
    this.setState({phones:temp_array})
  }

  add_emailAddress() {
    var temp_array = this.state.emails
    var temp={option:'1', value:''}
    temp_array.push(temp)
    this.setState({emails:temp_array})
  }

  DoSelectItem(_counterFromChild) {
    var temp_array = this.state.phones
    temp_array.splice(_counterFromChild, 1)
    this.setState({phones:temp_array})
  }

  DoSelectItem_Email(index) {
    var temp_array = this.state.emails
    temp_array.splice(index, 1)
    this.setState({emails:temp_array})
  }

  DochangePhoneNumber(number, index) {
    this.state.phones[index].value = number
  }

  DochangePhoneType(type, index) {
    this.state.phones[index].option = type
  }

  DochangeEmailAddress(address, index) {
    this.state.emails[index].value = address
  }

  DochangeEmailType(type, index) {
    this.state.emails[index].option = type
  }

  addedPhoneComponent() {
    var i=-1
    return this.state.phones.map((data) => {
      i++
      return (
        <Child_Phone key={i} itemData={data} index={i} selectItem={this.DoSelectItem} changePhoneNumber={this.DochangePhoneNumber} changePhoneType={this.DochangePhoneType} />
      )
    })
  }

  addedEmailComponent() {
    var i=-1
    return this.state.emails.map((data) => {
      i++
      return (
        <Child_Email key={i} itemData={data} index={i} selectItem_Email={this.DoSelectItem_Email} changeEmailAddress={this.DochangeEmailAddress} changeEmailType={this.DochangeEmailType} />
      )
    })
  }

  clickSaveBtn() {
    if (this.state.first_name == "" || this.state.last_name=="") {
      Alert.alert('First name/Last name is required.')
    } else {
      this.setState({visible:true})
      var temp=URLclass.url + 'client/update'

      var InputValue_check = {
                              client_id: this.state.client_id,
                              first_name: this.state.first_name,
                              last_name: this.state.last_name,
                              company: this.state.company,
                              use_company: this.state.use_company,
                              property_id: this.state.property_id,
                              property_street1: this.state.property_street1,
                              property_street2: this.state.property_street2,
                              property_city: this.state.property_city,
                              property_state: this.state.property_state,
                              property_zip_code: this.state.property_zip_code,
                              property_country: this.state.property_country,
                              billing_id: this.state.billing_id,
                              billing_street1 : this.state.billing_street1,
                              billing_street2 : this.state.billing_street2,
                              billing_city : this.state.billing_city,
                              billing_state : this.state.billing_state,
                              billing_zip_code : this.state.billing_zip_code,
                              billing_country : this.state.billing_country,
                              phones: this.state.phones,
                              emails: this.state.emails,
                              tax: '0.2',
                              is_billing : -1,
                            }
      console.log('=======CHECK=', InputValue_check)
      this.props.send_edited_clientData(InputValue_check)

      fetch(temp, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Token': this.props.login_data.token
          },
          body: JSON.stringify({
              client_id: this.state.client_id,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              company: this.state.company,
              use_company: this.state.use_company,
              property_id: this.state.property_id,
              property_street1: this.state.property_street1,
              property_street2: this.state.property_street2,
              property_city: this.state.property_city,
              property_state: this.state.property_state,
              property_zip_code: this.state.property_zip_code,
              property_country: this.state.property_country,
              billing_id: this.state.billing_id,
              billing_street1 : this.state.billing_street1,
              billing_street2 : this.state.billing_street2,
              billing_city : this.state.billing_city,
              billing_state : this.state.billing_state,
              billing_zip_code : this.state.billing_zip_code,
              billing_country : this.state.billing_country,
              phones: this.state.phones,
              emails: this.state.emails,
              tax: '0.2',
              is_billing : 1,
          })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          this.setState({visible:false})
          console.log('00000000--------', responseData)

          this.props.send_clientData(responseData)

          this.props.navigation.state.params.onNavigateBack(this.state.foo)
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
  }

  showCountryList() {
    var i=-1
    return this.state.countries.map((data) => {
      i++
      return (
        <Child_country key={i} itemData={data} index={i} selectCountry={this.DoSelectCountry} />
      )
    })
  }


  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>

        <Header style={{backgroundColor: '#3ead92'}}>
          <Left style={{ flex: 1, }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Client</Text>
          </Body>
          <Right style={{ flex: 1, }}>
            <Button transparent onPress={() => this.clickSaveBtn()}>
                    <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <Content>
          <View>
            <View style={{margin:deviceHeight/50, marginTop:deviceHeight/30}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100}}>Basic information</Text>
              <View style={{flexDirection:'row', marginTop:deviceHeight/50}}>
                <Item regular style={{width:deviceWidth*23/50, backgroundColor:'white'}}>
                    <Input placeholder='First name' value={this.state.first_name} onChangeText={first_name => this.setState({first_name})} />
                </Item>
                <Item regular style={{width:deviceWidth*23/50, backgroundColor:'white'}}>
                    <Input placeholder='Last name' value={this.state.last_name} onChangeText={last_name => this.setState({last_name})} />
                </Item>
              </View>
              <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
                  <Input placeholder='Company name' value={this.state.company} onChangeText={company => this.setState({company})} />
              </Item>
              <View style={{marginTop:deviceHeight/50, marginLeft:deviceWidth/150, flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.clickChecker()}>
                  {this.state.use_company == '1' ? <Image source={checkBoxBtn} style={{width:deviceWidth/14, height:deviceWidth/14}} /> : <Image source={checkBoxBtn_not} style={{width:deviceWidth/14, height:deviceWidth/14}} />}
                </TouchableOpacity>
                <Text style={{fontSize:17, fontWeight:'400', color:'#515151', marginLeft:deviceWidth/100}}>Use company name as primary name</Text>
              </View>
              <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50}} />

              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100, marginTop:deviceHeight/30}}>Contact information</Text>
              {this.addedPhoneComponent()}

              <TouchableOpacity style={{marginTop:deviceHeight/40, marginLeft:deviceWidth/100}} onPress={() => this.add_phoneNumber()}>
                <Text style={{color:'#4f70ca', fontSize:18, fontWeight:'600'}}>Add Phone Number</Text>
              </TouchableOpacity>

              {this.addedEmailComponent()}
              <TouchableOpacity style={{marginTop:deviceHeight/40, marginLeft:deviceWidth/100}} onPress={() => this.add_emailAddress()}>
                <Text style={{color:'#4f70ca', fontSize:18, fontWeight:'600'}}>Add Email Address</Text>
              </TouchableOpacity>

            </View>
          </View>

          <View style={{backgroundColor:'#ffffff', marginTop:deviceHeight/30,}}>

            <View style={{margin:deviceHeight/50, marginBottom:deviceHeight/20,}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100, marginTop:deviceHeight/30}}>Billing address</Text>
              {this.showBillingAddress()}
            </View>

          </View>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
          >
            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Countries</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{width:deviceWidth, height:deviceHeight,}}>
              {this.showCountryList()}
            </ScrollView>
          </Modal>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_edited_clientData: data => dispatch(send_edited_clientData(data)),
    send_clientData: data => dispatch(send_clientData(data))
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data
});

export default connect(mapStateToProps, bindAction)(ClientEditPage);


class Child_Phone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: "1",
      phone: ''
    };
    this.onValueChange1 = this.onValueChange1.bind(this)
  }

  componentWillMount() {
    this.setState({selected1: this.props.itemData.option})
    this.setState({phone: this.props.itemData.value})
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  onValueChange1(value: string) {

    this.setState({selected1 : value})
    this.props.changePhoneType(value, this.props.index)
  }

  changePhone(number, index) {
    this.setState({phone: number})
    this.props.changePhoneNumber(number, index)
  }

  render() {
    return (
      <View>
        {this.props.index!=0 ?
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{backgroundColor:'white', borderColor:'#888', borderWidth:1, borderRadius:5, flexDirection:'row', marginTop:deviceHeight/40}}>
              <View style={{width:deviceWidth*1.1/3}}>
                <Form>
                  <Picker
                    mode="dropdown"
                    placeholder="Select One"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange1.bind(this)}
                  >
                    <Item label="Main" value="1" />
                    <Item label="Work" value="2" />
                    <Item label="Mobile" value="3" />
                    <Item label="Home" value="4" />
                    <Item label="Fax" value="5" />
                    <Item label="Other" value="6" />
                  </Picker>
                </Form>
              </View>
              <View style={{backgroundColor:'#888', width:1}} />
              <View style={{width:deviceWidth*1.2/3}}>
                <Input placeholder='Phone number' keyboardType='numeric' value={this.state.phone} onChangeText={phone => this.changePhone(phone, this.props.index)} />
              </View>
            </View>
            <TouchableOpacity style={{marginLeft:deviceWidth/20}} onPress={() => this.textFunction(this.props.index)}>
              <Image source={binIcon} style={{width:deviceWidth/20, height:deviceWidth*28/19/20}} />
            </TouchableOpacity>
          </View>
           :
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{backgroundColor:'white', borderColor:'#888', borderWidth:1, borderRadius:5, flexDirection:'row', marginTop:deviceHeight/40}}>
              <View style={{width:deviceWidth*1.1/3}}>
                <Form>
                  <Picker
                    mode="dropdown"
                    placeholder="Select One"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange1.bind(this)}
                  >
                    <Item label="Main" value="1" />
                    <Item label="Work" value="2" />
                    <Item label="Mobile" value="3" />
                    <Item label="Home" value="4" />
                    <Item label="Fax" value="5" />
                    <Item label="Other" value="6" />
                  </Picker>
                </Form>
              </View>
              <View style={{backgroundColor:'#888', width:1}} />
              <View style={{width:deviceWidth*1.7/3}}>
                <Input placeholder='Phone number' keyboardType='numeric' value={this.state.phone} onChangeText={phone => this.changePhone(phone, this.props.index)} />
              </View>
            </View>
          </View>
        }
      </View>
    );
  }
} 


class Child_Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: "1",
      email: ''
    };
  }

  componentWillMount() {
    this.setState({selected1: this.props.itemData.option})
    this.setState({email: this.props.itemData.value})
  }

  textFunction(i) {
    this.props.selectItem_Email(i)
  }

  onValueChange2(value: string) {
    this.setState({selected1 : value})
    this.props.changeEmailType(value, this.props.index)
  }

  changeEmail(address, index) {
    this.setState({email: address})
    this.props.changeEmailAddress(address, index)
  }

  render() {
    return (
      <View>
        {this.props.index!=0 ?
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{backgroundColor:'white', borderColor:'#888', borderWidth:1, borderRadius:5, flexDirection:'row', marginTop:deviceHeight/40}}>
              <View style={{width:deviceWidth*1.1/3}}>
                <Form>
                  <Picker
                    mode="dropdown"
                    placeholder="Select One"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange2.bind(this)}
                  >
                    <Item label="Main" value="1" />
                    <Item label="Work" value="2" />
                    <Item label="Personal" value="3" />
                    <Item label="Other" value="4" />
                  </Picker>
                </Form>
              </View>
              <View style={{backgroundColor:'#888', width:1}} />
              <View style={{width:deviceWidth*1.2/3}}>
                <Input placeholder='Email address' keyboardType='email-address' value={this.state.email} onChangeText={email => this.changeEmail(email, this.props.index)} />
              </View>
            </View>
            <TouchableOpacity style={{marginLeft:deviceWidth/20}} onPress={() => this.textFunction(this.props.index)}>
              <Image source={binIcon} style={{width:deviceWidth/20, height:deviceWidth*28/19/20}} />
            </TouchableOpacity>
          </View>
           :
          <View style={{backgroundColor:'white', borderColor:'#888', borderWidth:1, borderRadius:5, flexDirection:'row', marginTop:deviceHeight/40}}>
            <View style={{width:deviceWidth*1.1/3}}>
              <Form>
                <Picker
                  mode="dropdown"
                  placeholder="Select One"
                  selectedValue={this.state.selected1}
                  onValueChange={this.onValueChange2.bind(this)}
                >
                  <Item label="Main" value="1" />
                  <Item label="Work" value="2" />
                  <Item label="Personal" value="3" />
                  <Item label="Other" value="4" />
                </Picker>
              </Form>
            </View>
            <View style={{backgroundColor:'#888', width:1}} />
            <View style={{width:deviceWidth*1.5/3}}>
              <Input placeholder='Email address' keyboardType='email-address' value={this.state.email} onChangeText={email => this.changeEmail(email, this.props.index)} />
            </View>
          </View>
        }
      </View>
    );
  }
}

class Child_country extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  testFunction(i) {
    this.props.selectCountry(i)
  }

  render() {
    return (
      <TouchableOpacity style={{marginLeft:deviceWidth/30, marginTop:deviceHeight/50, marginRight:deviceWidth/30}} onPress={() => this.testFunction(this.props.index)}>
        <Text style={{fontSize:16, fontWeight:'400', color:'#515151'}}>{this.props.itemData}</Text>
        <View style={{marginTop:deviceHeight/50, backgroundColor:'#acacac', height:1}} />
      </TouchableOpacity>
    );
  }
}