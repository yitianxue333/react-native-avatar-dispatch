import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import { URLclass } from '../lib/';
import { send_taskData } from "../../actions/user";
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
import styles from "./styles";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker'

const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const binIcon = require("../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class NewTaskPage extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      is_anytime: -1,
      started_date: moment(new Date()).format("YYYY-MM-DD"),
      ended_date: moment(new Date()).format("YYYY-MM-DD"),
      started_time: moment(new Date()).format("HH:mm"),
      ended_time: moment(new Date()).format("HH:mm"),
      title: '',
      description: '',
      team_data: [],
      client_id: 0,
      property_id: 0,
      is_complete: -1,
      task_id: 0,
      visible: false,
      is_edit: false,

      selected_job: null,
      selected_team: [],
      modalVisible_job: false,
      modalVisible_team: false,
      job_list:[],
      team_list: [],
      final_selectedTeam: []
    };
    this.DoselectJob=this.DoselectJob.bind(this)
    this.DoselectTeam=this.DoselectTeam.bind(this)
    this.DoselectTeam_delete=this.DoselectTeam_delete.bind(this)
    this.DoDelete_final_team=this.DoDelete_final_team.bind(this)
  }

  setModalVisible_team(visible) {
    this.setState({modalVisible_team: visible})
  }

  setModalVisible_job(visible) {
    this.setState({modalVisible_job: visible})
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

  DoselectJob(_counterFromChild) {
    this.setState({modalVisible_job: false})
    this.setState({selected_job:this.state.job_list[_counterFromChild]})
  }

  DoDelete_final_team(_counterFromChild) {
    var temp = this.state.final_selectedTeam;
    temp.splice(_counterFromChild, 1)
    this.setState({final_selectedTeam: temp})
  }

  clickCancelBtn() {
    this.state.selected_team = [];
    this.setModalVisible_team(false)
  }

  clickContinueBtn() {
    this.setState({final_selectedTeam: this.state.selected_team})
    this.setModalVisible_team(false)
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

  showJobs() {
    var i=-1;
    return this.state.job_list.map((data) => {
      i++;
      return (
        <Child_job key={i} itemData={data} index={i} selectJob={this.DoselectJob} />
      )
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
        }, 500);            

      }
    })
  }

  clickPlusBtn_job() {
    this.setState({modalVisible_job:true})
    this.setState({visible:true})
    var temp=URLclass.url + 'job/getall'

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
        this.setState({job_list:responseData.jobs})
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
    if (this.state.title == '') {
      Alert.alert('Title is required')
    } else if (this.state.selected_job == null) {
      Alert.alert('Job is required')
    } else {
      this.setState({visible:true})

      var temp=URLclass.url + 'task/add'
      var sss = {            task_id: this.state.task_id,
            started_date: this.state.started_date,
            ended_date: this.state.ended_date,
            started_time: this.state.started_time,
            ended_time: this.state.ended_time,
            is_anytime: this.state.is_anytime,
            is_complete: this.state.is_complete,
            job_id: this.state.selected_job.job_id,
            title: this.state.title,
            description: this.state.description,
            team_data: this.state.final_selectedTeam
            }
      console.log('TASK===============', sss)

      fetch(temp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            task_id: this.state.task_id,
            started_date: this.state.started_date,
            ended_date: this.state.ended_date,
            started_time: this.state.started_time,
            ended_time: this.state.ended_time,
            is_anytime: this.state.is_anytime,
            is_complete: this.state.is_complete,
            job_id: this.state.selected_job.job_id,
            title: this.state.title,
            description: this.state.description,
            team_data: this.state.final_selectedTeam
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success == true) {
          console.log('TASK DATA================', responseData)
          this.setState({visible:false})
          this.props.send_taskData(responseData)
          this.props.navigation.navigate("TaskDetailPage")
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

  showInfo() {
    return (
      <View style={{margin:deviceWidth/30, marginTop:deviceHeight/30}}>
        <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Details</Text>
        <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, borderTopLeftRadius:5, borderTopRightRadius:5, alignSelf:'center', width:deviceWidth*28/30}}>
            <Input style={{paddingLeft:20}} placeholder='Title' value={this.state.title} onChangeText={title => this.setState({ title })} />
        </View>
        <View style={{borderColor:'#888', borderWidth:1, borderTopColor:'rgba(0,0,0,0)',borderBottomLeftRadius:5, borderBottomRightRadius:5, alignSelf:'center', width:deviceWidth*28/30, height:deviceHeight/6}}>
            <Input multiline={true} numberOfLines={10} style={{paddingLeft:20}} placeholder='Description' value={this.state.description} onChangeText={description => this.setState({ description })} />
        </View>

        <View style={{backgroundColor:'#979fa8', height:3, marginTop:deviceHeight/40}} />

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
  }

  showTeamTitle() {
    return (
      <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
          <Text style={{color:'#515151', fontSize:17, fontWeight:'600'}}>Team</Text>
          <TouchableOpacity onPress={() => this.getTeam_data()}>
            <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          {this.state.final_selectedTeam.length == 0 ?
            <Text style={{fontStyle: 'italic', color:'#818181', fontSize:15, fontWeight:'400', marginBottom:deviceHeight/30}}>Tap the add button to select team</Text>
          : <View />
          }
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

  showJob() {
    return (
      <View>
        <View style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/100}}>Job</Text>
            <TouchableOpacity onPress={() => this.clickPlusBtn_job()}>
              <Image source={plusBtn} style={{width:deviceWidth/10, height:deviceWidth/10}} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            {this.state.selected_job == null? 
              <Text style={{fontSize:16, fontWeight:'normal', fontStyle: 'italic', color:'#818181', marginBottom:deviceHeight/40, textAlign:'center'}}>Tap the add button to select a job</Text>
              :
              <View style={{}}>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginTop:deviceHeight/100}}>Job #{this.state.selected_job.job_id} - {this.state.selected_job.description}</Text>
                <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>{this.state.selected_job.client_company}</Text>
                <Text style={{fontSize:16, fontWeight:'600', color:'#515151'}}>{this.state.selected_job.client_name}</Text>
                <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>{this.state.selected_job.property_address}</Text>
              </View>
            }
            
            
          </View>
          <View style={{backgroundColor:'#acacac', height:3, marginTop:deviceHeight/50, marginBottom:deviceHeight/50}} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>
        <Header style={{backgroundColor: '#4b6a96'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>New Task</Text>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={() => this.clickSaveButton()}>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <Content>
          <View style={{margin:deviceHeight/30}}>
              <Text style={{color:'#828282', fontSize:16, fontWeight:'600'}}>Jan 4, 9:00 PM - 10:00 PM</Text>
          </View>
          <Text style={{color:'#515151', fontSize:25, fontWeight:'600', marginLeft:deviceHeight/30}}>{this.state.title}</Text>
          
          <View style={{backgroundColor:'white'}}>
            {this.showInfo()}
            {this.showJob()}
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

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible_job}
            onRequestClose={() => this.setModalVisible_job(false)}
          >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Jobs</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_job(false)}>
                  <Text style={{fontSize:15, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>

              {this.showJobs()}
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
    send_taskData: data => dispatch(send_taskData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
});

export default connect(mapStateToProps, bindAction)(NewTaskPage);

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

class Child_job extends Component {
  constructor(props) {
      super(props);
  }

  textFunction(i) {
    this.props.selectJob(i)
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.textFunction(this.props.index)}>
        <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginTop:deviceHeight/30}}>Job #{this.props.itemData.job_id} - {this.props.itemData.description}</Text>
        <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>{this.props.itemData.client_company}</Text>
        <Text style={{fontSize:16, fontWeight:'600', color:'#515151'}}>{this.props.itemData.client_name}</Text>
        <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>{this.props.itemData.property_address}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/80}} />
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