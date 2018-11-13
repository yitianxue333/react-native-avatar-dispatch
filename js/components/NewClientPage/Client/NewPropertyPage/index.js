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
// import CountryCodeList from 'react-native-country-code-list'
import Spinner from 'react-native-loading-spinner-overlay';
import { send_EditedpropertyData, add_NewProperty, update_property_from_newProperty_to_quotePage } from "../../../../actions/user";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class NewPropertyPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      property_street1: '',
      property_street2: '',
      property_city: '',
      property_state: '',
      property_zip_code: '',
      property_country: 'United States',
      property_id: 0,
      tax: '0.2',
      client_id: 0,
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
    this.DoSelectCountry=this.DoSelectCountry.bind(this)
  }

  componentWillMount() {
    console.log('++++++++++++++++', this.props.from_quote_to_editProperty)
    if (this.props.from_quote_to_editProperty == true) {
      this.setState({client_id: this.props.quote_data.client_data.client_id})
    } else {
      this.setState({client_id: this.props.client_data.client_id})
    }
    
    if (this.props.property_is_new == false) {
      this.setState({property_id: this.props.property_edited_data.property_id})
      this.setState({property_street1: this.props.property_edited_data.property_street1})
      this.setState({property_street2: this.props.property_edited_data.property_street2})
      this.setState({property_city: this.props.property_edited_data.property_city})
      this.setState({property_state: this.props.property_edited_data.property_state})
      this.setState({property_zip_code: this.props.property_edited_data.property_zip_code})
      this.setState({property_country: this.props.property_edited_data.property_country})
    }
  }

    
  onValueChange3(value: string) {
    this.setState({
      tax: value
    });
  }

  DoSelectCountry(_counterFromChild) {
    this.setState({property_country:this.state.countries[_counterFromChild]})  
    this.setModalVisible(false)
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

  setModalVisible(visible) {
      this.setState({modalVisible: visible});
  }

  clickSaveBtn() {
    this.setState({visible:true})
    var temp_url=URLclass.url + 'property/save'

    var temp;

    if (this.props.property_is_new == false) {
      temp = this.state.property_id;
    } else {
      temp = 0
    }

    fetch(temp_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
          property_id: temp,
          client_id: this.state.client_id,
          property_street1: this.state.property_street1,
          proeprty_street2: this.state.property_street2,
          property_city: this.state.property_city,
          property_state: this.state.property_state,
          property_zip_code: this.state.property_zip_code,
          property_country: this.state.property_country,
          tax: 0.2
        })
    })

    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        this.setState({visible:false})

        if (this.props.from_quote_to_editProperty == true) {
          console.log('RESPONSE============', responseData.property)
          this.props.update_property_from_newProperty_to_quotePage(responseData.property)
        } else {
          if (this.props.property_is_new == false) {
            {this.props.send_EditedpropertyData(responseData.property, this.props.property_edited_index, false)};
          } else {
            {this.props.add_NewProperty(responseData.property)};
          }
        }
        this.props.navigation.state.params.onNavigateBack(this.state.foo)
        this.props.navigation.goBack(null)
        
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })

  }

  clickPropertyCountry() {
    this.setModalVisible(true)
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
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:19}}>New Property</Text>
          </Body>
          <Right style={{ flex: 1, }}>
            <Button transparent onPress={() => this.clickSaveBtn()}>
                    <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <Content>

          <View style={{backgroundColor:'#ffffff', marginTop:deviceHeight/30}}>
            <View style={{margin:deviceHeight/50,}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100, marginTop:deviceHeight/30}}>Property address</Text>
              <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
                  <Input placeholder='street1' value={this.state.property_street1} onChangeText={property_street1 => this.setState({property_street1})} />
              </Item>
              <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
                  <Input placeholder='street2' value={this.state.property_street2} onChangeText={property_street2 => this.setState({property_street2})} />
              </Item>
              <Item regular style={{width:deviceWidth*46.2/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
                  <Input placeholder='city' value={this.state.property_city} onChangeText={property_city => this.setState({property_city})} />
              </Item>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Item regular style={{width:deviceWidth*21/50, backgroundColor:'white', marginTop:deviceHeight/50}}>
                    <Input placeholder='Province' autoCorrect={true}  autoCapitalize = 'words' value={this.state.property_state} onChangeText={property_state => this.setState({property_state})} />
                </Item>
                <Item regular style={{width:deviceWidth*22/50, backgroundColor:'white', marginTop:deviceHeight/50, marginRight:3}}>
                    <Input placeholder='Postal code' value={this.state.property_zip_code} onChangeText={property_zip_code => this.setState({property_zip_code})} />
                </Item>
              </View>

              <TouchableOpacity style={{borderWidth:1, borderColor:'#acacac', height:deviceHeight/11, marginTop:deviceHeight/50, justifyContent:'center', alignItems:'center'}} onPress={() => this.clickPropertyCountry()}>
                <Text style={{fontSize:17, fontWeight:'500', color:'#515151'}}>{this.state.property_country}</Text>
              </TouchableOpacity>
            </View>

            <View style={{margin:deviceHeight/50,}}>
              <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/50}} />
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100, marginTop:deviceHeight/30}}>Property information</Text>
              <View style={{borderWidth:1, borderColor:'#888', marginTop:deviceHeight/30}}>
                <Form style={{paddingLeft:deviceWidth/50, paddingRight:deviceWidth/50}}>
                  <Picker
                    mode="dropdown"
                    placeholder="Select One"
                    selectedValue={this.state.tax}
                    onValueChange={this.onValueChange3.bind(this)}
                  >
                    <Item label="tax1(0.2%) (Default)" value="0.2" />
                    <Item label="tax2(0.3%)" value="0.3" />
                    <Item label="tax3(0.5%)" value="0.5" />
                  </Picker>
                </Form>
              </View>
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
    send_EditedpropertyData: (data, index, flag) => dispatch(send_EditedpropertyData(data, index, flag)),
    add_NewProperty: data => dispatch(add_NewProperty(data)),
    update_property_from_newProperty_to_quotePage: data => dispatch(update_property_from_newProperty_to_quotePage(data)),
    
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  property_edited_data: state.user.property_edited_data,
  property_is_new: state.user.property_is_new,
  property_edited_index: state.user.property_edited_index,
  quote_data: state.user.quote_data,
  from_quote_to_editProperty: state.user.from_quote_to_editProperty
});

export default connect(mapStateToProps, bindAction)(NewPropertyPage);


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