import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, ScrollView } from "react-native";
import { connect } from "react-redux";
import { URLclass } from '../lib/';
import { send_taskData, from_taskDetail_to_clientPage } from "../../actions/user";
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
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import mappinImage from '../../../images/mappin1.png'

const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const mappin = require("../../../images/mappin1.png");
const binIcon = require("../../../images/bin.png");
const completedIcon = require("../../../images/completed.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class TaskDetailPage extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      is_edit: false,
      is_complete: -1,
      repeat: 1,
      visible: false,

      title: '',
      description: '',
      started_date: moment(new Date()).format("YYYY-MM-DD"),
      ended_date: moment(new Date()).format("YYYY-MM-DD"),
      started_time: moment(new Date()).format("HH:mm"),
      ended_time: moment(new Date()).format("HH:mm"),
      is_anytime: 1,
      modalVisible_team: false,
      modalVisible_map: false,
      team_list: [],
      final_selectedTeam: [],
      selected_team: [],
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
    this.DoselectTeam=this.DoselectTeam.bind(this)
    this.DoselectTeam_delete=this.DoselectTeam_delete.bind(this)
    this.DoDelete_final_team=this.DoDelete_final_team.bind(this)
  }

  componentWillMount () {
    console.log('+++++++++++++++++', this.props.task_data)
    this.setState({title: this.props.task_data.title})
    this.setState({description: this.props.task_data.description})
    this.setState({started_date: this.props.task_data.started_date})
    this.setState({ended_date: this.props.task_data.ended_date})
    this.setState({started_time: this.props.task_data.started_time})
    this.setState({ended_time: this.props.task_data.ended_time})
    this.setState({is_anytime: this.props.task_data.is_anytime})
    this.setState({repeat: this.props.task_data.repeat})
    this.setState({final_selectedTeam: this.props.task_data.team_data})
    this.setState({selected_team: this.props.task_data.team_data})
    this.setState({is_complete: this.props.task_data.is_complete})

    var marker_location = {latitude: this.props.task_data.property_data.latitude, longitude:this.props.task_data.property_data.longitude}
    var map_location = {latitude: this.props.task_data.property_data.latitude, longitude:this.props.task_data.property_data.longitude, latitudeDelta: 0.0922, longitudeDelta:0.0421}
    this.setState({region: map_location})
    this.setState({markerRegion: marker_location})
  }

  setModalVisible_map(visible) {
    this.setState({modalVisible_map: visible})
  }

  clickMappinIcon() {
    this.setModalVisible_map(true)
  }

  setModalVisible_team(visible) {
    this.setState({modalVisible_team: visible})
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
      }
    }
    this.setState({selected_team:temp})
  }

   DoDelete_final_team(_counterFromChild) {
    var temp = this.state.final_selectedTeam;
    temp.splice(_counterFromChild, 1)
    this.setState({final_selectedTeam: temp})
  }

  click_completeButton() {
    if (this.state.is_complete == 1) {
      this.setState({visible:true})
        var temp=URLclass.url + 'task/complete'

        fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            task_id: this.props.task_data.task_id,
            started_date: this.state.started_date,
            ended_date: this.state.ended_date,
            is_complete: -1
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          this.setState({visible:false})
          this.props.send_taskData(responseData)
          this.setState({is_complete: -1})
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 500);            

        }
      })
    } else {
      this.setState({visible:true})
        var temp=URLclass.url + 'task/complete'

        fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            task_id: this.props.task_data.task_id,
            started_date: this.state.started_date,
            ended_date: this.state.ended_date,
            is_complete: 1
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          this.setState({visible:false})
          this.props.send_taskData(responseData)
          this.setState({is_complete: 1})
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

  click_Save_EditButton() {
    if (this.state.is_edit == false) {
      this.setState({is_edit: true})
    } else {
      if (this.state.title == '') {
        Alert.alert('Title is required')
      } else {
        this.setState({visible:true})
        var temp=URLclass.url + 'task/update'

        fetch(temp, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Token': this.props.login_data.token
          },
          body: JSON.stringify({
              task_id: this.props.task_data.task_id,
              started_date: this.state.started_date,
              ended_date: this.state.ended_date,
              started_time: this.state.started_time,
              ended_time: this.state.ended_time,
              is_anytime: this.state.is_anytime,
              is_complete: this.state.is_complete,
              job_id: this.props.task_data.job_data.job_id,
              title: this.state.title,
              description: this.state.description,
              team_data: this.state.final_selectedTeam
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success == true) {
            this.setState({visible:false})
            this.props.send_taskData(responseData)
            this.setState({is_edit: false})
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
  }

  click_Edit_Cancel() {
    this.setState({is_edit: false})
  }

  click_Edit_Btn() {
    this.setState({is_edit: true})
  }

  clickStartedDate(date) {
    this.setState({started_date: date})
  }

  clickEndedDate(date) {
    this.setState({ended_date: date})
  }

  clickStartedTime(date) {
    this.setState({started_time: date})
  }

  clickEndedTime(date) {
    this.setState({ended_time: date})
  }

  clickChecker() {
    if (this.state.is_anytime == -1) {
      this.setState({is_anytime: 1})
    } else {
      this.setState({is_anytime: -1})
    }
  }

  clickCancelBtn() {
    this.state.selected_team = [];
    this.setModalVisible_team(false)
  }

  clickContinueBtn() {
    this.setState({final_selectedTeam: this.state.selected_team})
    this.setModalVisible_team(false)
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
        }, 500);            

      }
    })
  }

  showInfo() {
    if (this.state.is_edit == true) {
      return (
        <View style={{margin:deviceWidth/30, marginTop:deviceHeight/30}}>
          <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Details</Text>
          <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, borderTopLeftRadius:5, borderTopRightRadius:5, alignSelf:'center', width:deviceWidth*28/30}}>
              <Input style={{paddingLeft:20}} placeholder='Title' value={this.state.title} onChangeText={title => this.setState({ title })} />
          </View>
          <View style={{borderColor:'#888', borderWidth:1, borderTopColor:'rgba(0,0,0,0)',borderBottomLeftRadius:5, borderBottomRightRadius:5, alignSelf:'center', width:deviceWidth*28/30, height:deviceHeight/6}}>
              <Input multiline={true} numberOfLines={10} style={{paddingLeft:20}} placeholder='Description' value={this.state.description} onChangeText={description => this.setState({ description })} />
          </View>

          <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/50}} />

          <Text style={{ marginTop:deviceHeight/40, color:'#515151', fontSize:17, fontWeight:'600'}}>Schedule</Text>
          
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30}}>
            <View>
              <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Started date</Text>
              <DatePicker
                style={{width: deviceWidth/2.2}}
                date={this.state.started_date}
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
                onDateChange={(date) => this.clickStartedDate(date)}
              />
            </View>
            <View>
              <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Ended date</Text>
              <DatePicker
                style={{width: deviceWidth/2.2}}
                date={this.state.ended_date}
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
                onDateChange={(date) => this.clickEndedDate(date)}
              />
            </View>
          </View>

          {this.state.is_anytime == -1 ? 
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30}}>
              <View>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Started time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.2}}
                  date={this.state.started_time}
                  mode="time"
                  placeholder="select time"
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
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Ended time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.2}}
                  date={this.state.ended_time}
                  mode="time"
                  placeholder="select time"
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
          : null
          }
          

          <View style={{marginTop:deviceHeight/30, marginLeft:deviceWidth/150, flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity onPress={() => this.clickChecker()}>
                {this.state.is_anytime == 1 ? 
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={checkBoxBtn} style={{width:deviceWidth/14, height:deviceWidth/14}} /> 
                    <Text style={{fontSize:17, fontWeight:'400', color:'#515151', marginLeft:deviceWidth/50}}>Anytime on day of task</Text>
                  </View>
                : <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={checkBoxBtn_not} style={{width:deviceWidth/14, height:deviceWidth/14}} />
                    <Text style={{fontSize:17, fontWeight:'400', color:'#515151', marginLeft:deviceWidth/50}}>Anytime on day of task</Text>
                  </View>
                }
            </TouchableOpacity>
          </View>

          <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/40}} />
        </View>
      );
    } else {
      return (
        <View style={{margin:deviceWidth/30}}>
          <Text style={{fontWeight:'600', fontSize:18, color:'#515151'}}>Details</Text>
          {this.props.task_data.description == null ?
            <Text style={{fontWeight:'400', fontSize:15, color:'#818181', marginTop:deviceHeight/50}}>There are no additional details for this task</Text>
          : <Text style={{fontWeight:'400', fontSize:16, color:'#818181', marginTop:deviceHeight/50}}>{this.props.task_data.description}</Text>
          }
          <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />          
        </View>
      );
    }
  }

  showJob() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:18, color:'#515151'}}>Job</Text>
        <Text style={{fontWeight:'400', fontSize:15, color:'#818181', marginTop:deviceHeight/50}}>Job #{this.props.task_data.job_data.job_id}</Text>
        <Text style={{fontWeight:'600', fontSize:16, color:'#818181'}}>{this.props.task_data.job_data.description}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceWidth/30, marginBottom:deviceWidth/30}} />          
      </View>
    );
  }

  showTeamTitle() {
    if (this.state.is_edit == true) {
       return (
        <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30, marginTop:deviceHeight/30}}>
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
  }

  showInfo_team() {
    if (this.state.is_edit == true) {
      var i=-1;
      return this.state.final_selectedTeam.map((data) => {
        i++;
        return (
          <Child_EditedTeam key={i} itemData={data} index={i} delete_team={this.DoDelete_final_team} />
        )
      })
    } else {
      if (this.props.task_data.team_data.length == 0) {
        return (
          <Text style={{fontWeight:'400', fontSize:15, color:'#818181', marginTop:deviceHeight/50, fontStyle: 'italic', marginLeft:deviceWidth/30}}>No users have been assigned to this task</Text>
        );
      } else {
        var i=-1;
        return this.props.task_data.team_data.map((data) => {
          i++;
          return (
            <Child_showedTeam key={i} itemData={data} index={i} />
          )
        })
      }
    }
  }

  go_clientPage() {
    this.setState({visible:true})

    var temp=URLclass.url + 'client/' + this.props.task_data.client_data.client_id + '/info'

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
        {this.props.from_taskDetail_to_clientPage(responseData)}
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

  showClient() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <Text style={{fontWeight:'600', fontSize:18, color:'#515151'}}>Client</Text>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100, alignItems:'center'}}>
          <View>
            <Text style={{color:'#828282', fontSize:15, fontWeight:'400'}}>{this.props.task_data.client_data.client_company}</Text>
            <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.task_data.client_data.client_firstName} {this.props.task_data.client_data.client_lastName}</Text>
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30, marginBottom:deviceHeight/50}} />

        <Text style={{fontWeight:'600', fontSize:18, color:'#515151'}}>Property</Text>
        
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100, alignItems:'center'}}>
          <View>
            {this.props.task_data.property_data.property_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'400'}}>{this.props.task_data.property_data.property_street1}</Text>
            : null
            }
            {this.props.task_data.property_data.property_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'400'}}>{this.props.task_data.property_data.property_street2}</Text>
            : null
            }
            {this.props.task_data.property_data.property_city == "" && this.props.task_data.property_data.property_state == "" && this.props.task_data.property_data.property_zip_code == "" ? null
            : <Text style={{color:'#828282', fontSize:16, fontWeight:'400'}}>{this.props.task_data.property_data.property_city}, {this.props.task_data.property_data.property_state} {this.props.task_data.property_data.property_zip_code}</Text>
            }
          </View>
          
        </View>

        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />

        {this.state.is_edit == true ? null
        : <Text style={{fontWeight:'600', fontSize:18, color:'#515151', marginTop:deviceWidth/30}}>Team</Text>
        }
        
      </View>
    );
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

  showCompletedBtn() {
    if (this.state.is_edit == false) {
      if (this.state.is_complete == -1) {
        return (
          <TouchableOpacity style={{width:deviceWidth*28/30, height:deviceHeight/15, backgroundColor:'#4e70ca', borderRadius:5, alignItems:'center', justifyContent:'center', marginTop:deviceHeight/30}} onPress={() => this.click_completeButton()}>
            <Text style={{fontWeight:'600', fontSize:17, color:'white'}}>Mark Complete</Text>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity style={{width:deviceWidth*28/30, height:deviceHeight/15, borderColor:'#4e70ca', borderRadius:5, borderWidth:1, backgroundColor:'white', alignItems:'center', justifyContent:'center', marginTop:deviceHeight/30, flexDirection:'row'}} onPress={() => this.click_completeButton()}>
            <Image source={require("../../../images/completed.png")} style={{width:deviceWidth/15, height:deviceWidth/15, marginRight:deviceWidth/50}} />
            <Text style={{fontWeight:'600', fontSize:17, color:'#4e70ca'}}>Completed</Text>
          </TouchableOpacity>
        )
      }
    }
  }

  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#4b6a96'}}>
          <Left style={{ flex: 1 }}>
            {this.state.is_edit == true ? <Button transparent onPress={() => this.click_Edit_Cancel()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
              </Button>
            : <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Back</Text>
              </Button>
            }
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Task</Text>
          </Body>

          <Right style={{ flex: 1 }}>
            {this.state.is_edit == true ? <Button transparent onPress={() => this.click_Save_EditButton()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
              </Button>
            : <Button transparent onPress={() => this.click_Edit_Btn()}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Edit</Text>
              </Button>
            }
          </Right>
        </Header>

        <Content>
          <View style={{marginLeft:deviceWidth/30, marginTop:deviceHeight/30}}>
            {this.props.task_data.is_anytime == 1 ?
              <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>{this.props.task_data.started_date} - {this.props.task_data.ended_date} , anytime</Text>
            : <Text style={{color:'#828282', fontSize:15, fontWeight:'400'}}>{this.props.task_data.started_date}, {this.props.task_data.started_time} - {this.props.task_data.ended_date}, {this.props.task_data.ended_time}</Text>
            }
          </View>
          <View style={{ marginTop:deviceHeight/100}}>
            <Text style={{color:'#515151', fontSize:18, fontWeight:'600', marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>{this.props.task_data.title}</Text>
            <Text style={{color:'#818181', fontSize:16, fontWeight:'400', marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>{this.props.task_data.client_data.client_company}</Text>

            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/100, alignItems:'center', marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
              <View>
                {this.props.task_data.property_data.property_street1 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.task_data.property_data.property_street1}</Text>
                : null
                }
                {this.props.task_data.property_data.property_street2 != "" ? <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.task_data.property_data.property_street2}</Text>
                : null
                }
                {this.props.task_data.property_data.property_city == "" && this.props.task_data.property_data.property_state == "" && this.props.task_data.property_data.property_zip_code == "" ? null
                : <Text style={{color:'#828282', fontSize:16, fontWeight:'500'}}>{this.props.task_data.property_data.property_city}, {this.props.task_data.property_data.property_state} {this.props.task_data.property_data.property_zip_code}</Text>
                }
              </View>
              {this.props.task_data.property_data.property_street1 == ""  && this.props.task_data.property_data.property_street2 == "" && this.props.task_data.property_data.property_city == "" && this.props.task_data.property_data.property_state == "" && this.props.task_data.property_data.property_zip_code == "" ? null
              : <TouchableOpacity onPress={() => this.clickMappinIcon()}>
                  <Image source={mappin} style={{width:deviceWidth*50/80/13, height:deviceWidth/13, marginRight:3}} />
                </TouchableOpacity>
              }
            </View>
            <View style={{marginLeft:deviceWidth/30}}>
              {this.showCompletedBtn()}
            </View>

            <View style={{backgroundColor:'white', marginTop:deviceHeight/30}}>
              {this.showInfo()}
              {this.showJob()}
              {this.showClient()}
              {this.showTeamTitle()}
              {this.showInfo_team()}
            </View>
            
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.modalVisible_team}
              onRequestClose={() => this.clickCancelBtn()}
            >
              <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

              <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Team</Text>
                <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.clickCancelBtn()}>
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

          </View>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />


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
    send_taskData: data => dispatch(send_taskData(data)),
    from_taskDetail_to_clientPage: data => dispatch(from_taskDetail_to_clientPage(data)),
  };
}

const mapStateToProps = state => ({
  task_data: state.user.task_data,
  login_data: state.user.login_data
});

export default connect(mapStateToProps, bindAction)(TaskDetailPage);


class Child_showedTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={{marginLeft:deviceWidth/7, marginBottom:deviceHeight/50}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{width:deviceWidth/15, height:deviceWidth/15, backgroundColor:'#93a1a9', borderRadius:deviceWidth/30, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontWeight:'400', fontSize:15, color:'white'}}>{this.props.itemData.team_name.charAt(0)}</Text>
          </View>
          <View style={{marginLeft:deviceWidth/30}}>
            <Text style={{fontWeight:'500', fontSize:16, color:'#515151'}}>{this.props.itemData.team_name}</Text>
          </View>
        </View>
      </View>
    );
  }
} 

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

class Child_EditedTeam extends Component {
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
            <Text style={{fontWeight:'500', fontSize:16, color:'#515151'}}>{this.props.itemData.team_name}</Text>
          </View>
          <TouchableOpacity style={{marginLeft:deviceWidth/10}} onPress={() => this.clickBinIcon(this.props.index)}>
            <Image source={binIcon} style={{width:deviceWidth/25, height:deviceWidth*28/19/25}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
} 


/*570 */
// {this.props.task_data.property_data.property_street1 == ""  && this.props.task_data.property_data.property_street2 == "" && this.props.task_data.property_data.property_city == "" && this.props.task_data.property_data.property_state == "" && this.props.task_data.property_data.property_zip_code == "" ? null
// : <Image source={require("../../../images/arrow.png")} style={{width:deviceWidth/40, height:deviceWidth*69/39/40, marginRight:5}} />
// }