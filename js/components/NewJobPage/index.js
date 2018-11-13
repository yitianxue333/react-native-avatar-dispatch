import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import { send_jobData } from "../../actions/user";
import moment from 'moment';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-datepicker'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';
import { URLclass } from '../lib/';

const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const addLineItemBtn = require("../../../images/btn_add_line_item@3x.png");
const carImage = require("../../../images/ic_delivery@3x.png");
const binIcon = require("../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class NewJobPage extends Component {
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
      selectedStartDate: null,
      started_time:"15:00",
      ended_time:"15:30",

      description: "",
      visible: false,
      selected_client: null,
      selected_property: null,
      selected_team: [],
      modalVisible_property: false,
      modalVisible_client: false,
      modalVisible_team: false,
      modalVisible_description: false,
      modalVisible_service: false,
      client_list:[],
      property_list: [],
      description_list: [],
      team_list: [],
      final_selectedTeam: [],
      is_anytime: -1,
      service_list: [],
      is_lineItem: false,
      selected_services: [],
      billing_type: 1,
      visit_dates: [],
      subtotal_value: "0.00"
    };
    this.onDayPress = this.onDayPress.bind(this);
    this.DoselectClient=this.DoselectClient.bind(this)
    this.DoselectProperty=this.DoselectProperty.bind(this)
    this.DoselectDescription=this.DoselectDescription.bind(this)
    this.DoselectTeam=this.DoselectTeam.bind(this)
    this.DoselectTeam_delete=this.DoselectTeam_delete.bind(this)
    this.DoDelete_final_team=this.DoDelete_final_team.bind(this)
    this.DoChange_QTY=this.DoChange_QTY.bind(this)
    this.DoChange_Cost=this.DoChange_Cost.bind(this)
    this.DoChange_Name=this.DoChange_Name.bind(this)
    this.DoChange_Description=this.DoChange_Description.bind(this)
    this.DoselectJob=this.DoselectJob.bind(this)
    this.DoselectJob_delete=this.DoselectJob_delete.bind(this)
    this.DoDeleteVisit_date=this.DoDeleteVisit_date.bind(this)
  }

  componentWillMount() {
    if (this.props.from_client_to_NewJob == true) {
      var temp_name = this.props.client_data.first_name + ' ' + this.props.client_data.last_name;
      var temp_company = this.props.client_data.company;
      var temp_id = this.props.client_data.client_id;
      var temp = {name: temp_name, company: temp_company, client_id:temp_id}
      console.log('FROM CLIENT TO JOB', temp)
      this.setState({selected_client: temp})
      if (this.props.client_data.property[0].property_id != 0) {
        this.setState({selected_property: this.props.client_data.property[0]})
      }
    }
  }

  DoselectTeam(_counterFromChild) {
    var temp = this.state.selected_team;
    temp.push(this.state.team_list[_counterFromChild])
    this.setState({selected_team:temp})
  }

  DoselectTeam_delete(_counterFromChild) {
    var temp = this.state.selected_team
    for (var i=0; i<temp.length; i++) {
      if (temp[i].team_id == this.state.team_list[_counterFromChild].team_id) {
        temp.splice(i, 1);
        return;
      }
    }
    this.setState({selected_team:temp})
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

  DoDelete_final_team(_counterFromChild) {
    var temp = this.state.final_selectedTeam;
    temp.splice(_counterFromChild, 1)
    this.setState({final_selectedTeam: temp})
  }

  DoselectJob(_counterFromChild) {
    this.setModalVisible_service(false)
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

  DoDeleteVisit_date(_counterFromChild) {
    var temp_array = this.state.visit_dates
    temp_array.splice(_counterFromChild, 1)
    this.setState({visit_dates:temp_array})
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

  setModalVisible_team(visible) {
    this.setState({modalVisible_team: visible})
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

  setModalVisible_service(visible) {
    this.setState({modalVisible_service: visible})
  }

  clickStartedTime(date) {
    this.setState({started_time: date})
  }

  clickEndedTime(date) {
    this.setState({ended_time: date})
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    var temp = this.state.visit_dates;
    temp.push(day.dateString)
    this.setState({visit_dates: temp})
  }

  selectBillingType() {
    if (this.state.billing_type == -1) {
      this.setState({billing_type: 1})
    } else {
      this.setState({billing_type: -1})
    }
  }

  clickChecker() {
    if (this.state.is_anytime == -1) {
      this.setState({is_anytime: 1})
    } else {
      this.setState({is_anytime: -1})
    }
  }

  clickContinueBtn() {
    this.setState({final_selectedTeam: this.state.selected_team})
    this.setModalVisible_team(false)
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
        this.setState({visible:false})
        this.setState({client_list:responseData.clients})
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

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
        }, 300);            

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

  getTeam_data() {
    this.setState({modalVisible_team: true})
    this.setState({visible:true})

    var temp=URLclass.url + 'team/getall'

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
        this.setState({team_list:responseData.team_data})
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

      }
    })
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
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);            

      }
    })
  }

  clickSaveBtn() {
    if (this.state.description == "") {
      Alert.alert('Job description is required')
    } else if (this.state.selected_client == null) {
      Alert.alert('Client is required')
    } else if (this.state.selected_property == null) {
      Alert.alert('Property is required')
    } else {
      this.setState({visible:true})

      var temp=URLclass.url + 'job/add'
      var sss = {
        job_id: 0,
        description: this.state.description,
        property_id: this.state.selected_property.property_id,
        client_id: this.state.selected_client.client_id,
        service_data: this.state.selected_services,
        visit_data: {
          is_anytime: this.state.is_anytime,
          start_time: this.state.started_time,
          end_time: this.state.ended_time,
          visit_dates: this.state.visit_dates
        },
        team_data: this.state.final_selectedTeam,
        billing_type: this.state.billing_type
      }
      console.log('New Job Data=================', sss)

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
          job_id: 0,
          description: this.state.description,
          property_id: this.state.selected_property.property_id,
          client_id: this.state.selected_client.client_id,
          service_data: this.state.selected_services,
          visit_data: {
            is_anytime: this.state.is_anytime,
            start_time: this.state.started_time,
            end_time: this.state.ended_time,
            visit_dates: this.state.visit_dates
          },
          team_data: this.state.final_selectedTeam,
          billing_type: this.state.billing_type
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          console.log('666666666666---------', responseData)
          this.setState({visible:false})
          this.props.send_jobData(responseData)
          this.props.navigation.navigate("JobDetailPage")
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

  showDescriptions() {
    var i=-1;
    return this.state.description_list.map((data) => {
      i++;
      return (
        <Child_description key={i} itemData={data} index={i} selectDescription={this.DoselectDescription} />
      )
    })
  }

  showTeams() {
    var i=-1;
    return this.state.team_list.map((data) => {
      i++;
      return (
        <Child_team key={i} itemData={data} index={i} selectTeam={this.DoselectTeam} deleteTeam={this.DoselectTeam_delete} check_checker={this.state.final_selectedTeam} />
      )
    })
  }

  showServices() {
    var i=-1;
    return this.state.service_list.map((data) => {
      i++;
      return (
        <NewItem key={i} itemData={data} index={i} selectJob={this.DoselectJob} />
      )
    })
  }


  show_addedLineItems() {
    var i=-1;
    return this.state.selected_services.map((data) => {
      i++;
      return (
        <Child_service key={i} itemData={data} index={i} selectService={this.DoselectJob_delete} changeQTY={this.DoChange_QTY} changeCost={this.DoChange_Cost} changeName={this.DoChange_Name} changeDescription={this.DoChange_Description} />
      )
    })
  }

  showTeamTitle() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Team</Text>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          {this.state.final_selectedTeam.length == 0 ?
            <Text style={{fontStyle: 'italic', color:'#818181', fontSize:15, fontWeight:'400'}}>Tap the add button to select team</Text>
          : <View />
          }
          <TouchableOpacity onPress={() => this.getTeam_data()}>
            <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  showInfo_team() {
    var i=-1;
    return this.state.final_selectedTeam.map((data) => {
      i++;
      return (
        <Child_showedTeam key={i} itemData={data} index={i} delete_team={this.DoDelete_final_team} />
      )
    })
  }

  showInfo() {
    return (
      <View>
        <View style={{margin:deviceWidth/30, marginTop:deviceHeight/30}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Details</Text>
            <TouchableOpacity onPress={() => this.clickPlusBtn_description()}>
              <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:deviceHeight/100, alignSelf:'center', width:deviceWidth*28/30}}>
            {this.state.description == "" ? 
              <Text style={{fontSize:16, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginLeft:deviceWidth/100}}>Tap the add button to select a description</Text>
            : <Text style={{fontSize:16, fontWeight:'500', color:'#818181'}}>{this.state.description}</Text>
            }
          </View>

          <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/40}} />
        </View>
        
        <View style={{margin:deviceWidth/30, marginTop:deviceHeight/100, marginBottom:deviceHeight/20}}>
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
        </View>
      </View>
    );
  }

  showLineItem() {
    return (
      <View style={{margin:deviceWidth/30}}>
        {this.state.is_lineItem == false ? 
          <View style={{backgroundColor:'#f3f3f3', borderColor:'#888', borderWidth:1, borderRadius:5}}>
            <Text style={{fontSize:15, fontWeight:'normal', fontStyle: 'italic', color:'#515151', marginTop:deviceHeight/40, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/40, textAlign:'center'}}>Add a line item to select which services and products will be provided for this job</Text>
          </View>
          :
          <View>
            {this.show_addedLineItems()}
          </View>
        }

        <TouchableOpacity style={{marginTop:deviceHeight/40}} onPress={() => this.clickPlus_AddLineItemBtn(true)}>
            <Image source={addLineItemBtn} style={{width:deviceWidth*28/30, height:deviceWidth*28*222/1935/30}} />
        </TouchableOpacity>

        <View style={{backgroundColor:'#acacac', height:3, marginTop:deviceHeight/30, width:deviceWidth*28/30}} />

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100}}>
          <Text></Text>
          <Text style={{color:'#818181', fontSize:17, fontWeight:'600'}}>Subtotal</Text>
          <Text style={{color:'#818181', fontSize:17, fontWeight:'600'}}>${this.state.subtotal_value}</Text>
        </View>

      </View>
    );
  }

  showVisits_dates() {
    var i=-1;
    return this.state.visit_dates.map((data) => {
      i++;
      return (
        <Child_visitsDates key={i} itemData={data} index={i} selectDate={this.DoDeleteVisit_date} />
      )
    })
  }

  showVisits() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Schedule</Text>

        <View style={{marginTop:deviceHeight/30, borderWidth:1, borderColor:'#acacac'}}>
          <Calendar
            minDate={'2012-05-10'}
            maxDate={'2020-05-30'}
            onDayPress={this.onDayPress}
            monthFormat={'MMMM, yyyy'}
            hideExtraDays={true}
            hideDayNames={false}
            markedDates={{
              [this.state.selected]: {selected: true, selectedColor: '#4e70ca'}
            }}
            theme={{
              backgroundColor: '#fff',
              calendarBackground: '#f3f3f3',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              selectedDotColor: '#ffffff',
              arrowColor: '#4e70ca',
              monthTextColor: '#4050b5',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textMonthFontWeight: '600',
              textDayHeaderFontSize: 14
            }}
          />
        </View>

        <View style={{flexDirection:'row', marginTop: deviceHeight/50}}>
          <Image source={carImage} style={{width:deviceWidth/15, height:deviceWidth*129/159/15}} />
          <Text style={{color:'#818181', fontWeight:'400', fontSize:15, marginLeft:deviceWidth/30}}>{this.state.visit_dates.length} visits</Text>
        </View>

        {this.showVisits_dates()}

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />

        <Text style={{color:'#515151', fontSize:17, fontWeight:'600', marginTop:deviceHeight/30}}>Times</Text>
        {this.state.is_anytime == -1 ? 
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30}}>
            <View>
              <Text style={{fontSize:13, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Start time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.3}}
                  date={this.state.started_time}
                  mode="time"
                  placeholder="select date"
                  format="HH:mm"
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
                  onDateChange={(date) => this.clickStartedTime(date)}
                />
            </View>
            <View>
              <Text style={{fontSize:13, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>End time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.3}}
                  date={this.state.ended_time}
                  mode="time"
                  placeholder="select date"
                  format="HH:mm"
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
                  onDateChange={(date) => this.clickEndedTime(date)}
                />
            </View>          
          </View>
        : null}
        

        <View style={{marginTop:deviceHeight/30, marginLeft:deviceWidth/150, flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity onPress={() => this.clickChecker()}>
            {this.state.is_anytime == 1 ? 
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Image source={checkBoxBtn} style={{width:deviceWidth/14, height:deviceWidth/14}} /> 
                <Text style={{fontSize:17, fontWeight:'400', color:'#515151', marginLeft:deviceWidth/50}}>Anytime on day of visit</Text>
              </View>
            : <View style={{flexDirection:'row', alignItems:'center'}}>
                <Image source={checkBoxBtn_not} style={{width:deviceWidth/14, height:deviceWidth/14}} />
                <Text style={{fontSize:17, fontWeight:'400', color:'#515151', marginLeft:deviceWidth/50}}>Anytime on day of visit</Text>
              </View>
            }
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />

      </View>
    );
  }

  showBilling() {
    return (
      <View style={{margin:deviceWidth/30}}>
        <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Invoicing</Text>
        <View style={{flexDirection:'row', marginTop:deviceHeight/30}}>
          <View style={{width:deviceWidth/4}}>
            <Text style={{color:'#818181', fontWeight:'500', fontSize:16}}>Reminder frequency</Text>
          </View>
          <View style={{marginLeft:deviceWidth/30, width:deviceWidth*1.8/3}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.selectBillingType()}>
                {this.state.billing_type == 1 ? 
                  <View style={{flexDirection:'row', alignItems:'center', width:deviceWidth*1.8/3}}>
                    <Image source={checkBoxBtn} style={{width:deviceWidth/20, height:deviceWidth/20}} /> 
                    <Text style={{fontSize:16, fontWeight:'400', color:'#818181', marginLeft:deviceWidth/30}}>Once when the job is complete</Text>
                  </View>
                : <View style={{flexDirection:'row', alignItems:'center', width:deviceWidth*1.8/3}}>
                    <Image source={checkBoxBtn_not} style={{width:deviceWidth/20, height:deviceWidth/20}} />
                    <Text style={{fontSize:16, fontWeight:'400', color:'#818181', marginLeft:deviceWidth/30}}>Once when the job is complete</Text>
                  </View>
                }
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', marginTop:deviceHeight/50, alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.selectBillingType()}>
                {this.state.billing_type == 1 ?
                  <View style={{flexDirection:'row', alignItems:'center', width:deviceWidth*1.8/3}}>
                    <Image source={checkBoxBtn_not} style={{width:deviceWidth/20, height:deviceWidth/20}} /> 
                    <Text style={{fontSize:16, fontWeight:'400', color:'#818181', marginLeft:deviceWidth/30}}>Don't remind me to invoice</Text>
                  </View>
                : <View style={{flexDirection:'row', alignItems:'center', width:deviceWidth*1.8/3}}>
                    <Image source={checkBoxBtn} style={{width:deviceWidth/20, height:deviceWidth/20}} />
                    <Text style={{fontSize:16, fontWeight:'400', color:'#818181', marginLeft:deviceWidth/30}}>Don't remind me to invoice</Text>
                  </View>
                }
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#bbc522'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>New Job</Text>
          </Body>
          <Right style={{ flex: 1,}}>
            <Button transparent onPress={() => this.clickSaveBtn()}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
            </Button>
        </Right>
       </Header>

       <Content style={{backgroundColor:'#fff'}}>

        <View style={{margin:deviceHeight/50, height:deviceHeight/25, width:deviceWidth/6, backgroundColor:'#ecf3db', borderRadius:5, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'#7db000', fontSize:13, fontWeight:'500'}}>ACTIVE</Text>
        </View>
        {this.state.description != "" ? 
          <Text style={{color:'#515151', fontSize:25, fontWeight:'600', marginLeft:deviceHeight/30}}>{this.state.description}</Text>
        : null}
        

        
        <Tabs initialPage={0} style={{marginTop:deviceHeight/30}}>
          <Tab heading="Info">
            {this.showInfo()}
          </Tab>
          <Tab heading="Line Items">
            {this.showLineItem()}
          </Tab>
          <Tab heading="Visits">
            {this.showVisits()}
            {this.showTeamTitle()}
            {this.showInfo_team()}
          </Tab>
          <Tab heading="Billing">
            {this.showBilling()}
          </Tab>
        </Tabs>

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_team}
            onRequestClose={() => this.setModalVisible_team(false)}
            >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Team</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_team(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showTeams()}
            </ScrollView>

            <TouchableOpacity style={{backgroundColor:'#ecf3db', height:deviceHeight/12, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickContinueBtn()}>
              <Text style={{color:'#a5c860', fontWeight:'400', fontSize:20}}>Continue</Text>
            </TouchableOpacity>
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

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

        </Content>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_jobData: data => dispatch(send_jobData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  from_client_to_NewJob: state.user.from_client_to_NewJob
});

export default connect(mapStateToProps, bindAction)(NewJobPage);


class Child_team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click_flag: -1
    }
  }

  componentWillMount() {
    if (this.props.check_checker.length != 0) {
      for (var i=0; i<this.props.check_checker.length; i++) {
        if (this.props.check_checker[i].team_id == this.props.itemData.team_id) {
          this.setState({click_flag: 1})
        }
      }
    }
  }

  collectTeam(i) {
    if (this.state.click_flag == 1) {
      this.setState({click_flag: -1})
      this.props.deleteTeam(i)
    } else {
      this.setState({click_flag: 1})
      this.props.selectTeam(i)
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.collectTeam(this.props.index)}>
          {this.state.click_flag == 1 ? 
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={checkBoxBtn} style={{width:deviceWidth/14, height:deviceWidth/14}} /> 
              <Text style={{fontSize:17, fontWeight:'600', color:'#515151', marginLeft:deviceWidth/50}}>{this.props.itemData.team_name}</Text>
            </View>
          : <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={checkBoxBtn_not} style={{width:deviceWidth/14, height:deviceWidth/14}} />
              <Text style={{fontSize:17, fontWeight:'400', color:'#818181', marginLeft:deviceWidth/50}}>{this.props.itemData.team_name}</Text>
            </View>
          }
        </TouchableOpacity>
        <View style={{marginTop:deviceHeight/50, marginBottom:deviceHeight/50, height:1, backgroundColor:'#acacac', width:deviceWidth*28/30}} />
      </View>
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


class Child_showedTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  clickBinIcon(i) {
    this.props.delete_team(i)
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/7, marginBottom:deviceHeight/50}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{width:deviceWidth/15, height:deviceWidth/15, backgroundColor:'#93a1a9', borderRadius:deviceWidth/30, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontWeight:'400', fontSize:15, color:'white'}}>{this.props.itemData.team_name.charAt(0)}</Text>
          </View>
          <View style={{marginLeft:deviceWidth/30}}>
            <Text style={{fontWeight:'400', fontSize:16, color:'#515151'}}>{this.props.itemData.team_name}</Text>
          </View>
          <TouchableOpacity style={{marginLeft:deviceWidth/10}} onPress={() => this.clickBinIcon(this.props.index)}>
            <Image source={binIcon} style={{width:deviceWidth/25, height:deviceWidth*28/19/25}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Child_service extends Component {
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

class Child_visitsDates extends Component {
  constructor(props) {
      super(props);
  }

  clickBinIcon(i) {
    this.props.selectDate(i)
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/7, marginBottom:deviceHeight/50}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{marginLeft:deviceWidth/30}}>
            <Text style={{fontWeight:'400', fontSize:16, color:'#515151'}}>{this.props.itemData}</Text>
          </View>
          <TouchableOpacity style={{marginLeft:deviceWidth/10}} onPress={() => this.clickBinIcon(this.props.index)}>
            <Image source={binIcon} style={{width:deviceWidth/30, height:deviceWidth*28/19/30}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}