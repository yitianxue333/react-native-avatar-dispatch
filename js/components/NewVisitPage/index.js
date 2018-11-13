import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, View, Modal, Alert, ScrollView } from "react-native";
import { URLclass } from '../lib/';
import { connect } from "react-redux";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import { send_visitData } from "../../actions/user";
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
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

const checkBoxBtn = require("../../../images/check_box_checker@3x.png");
const checkBoxBtn_not = require("../../../images/check_box@3x.png");
const plusBtn = require("../../../images/btn_radio_button_active@3x.png");
const binIcon = require("../../../images/bin.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class NewVisitPage extends Component {
  static navigationOptions = {
    header: null
  };

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      unscheduled: -1,
      is_anytime: -1,
      started_time:"15:00",
      ended_time:"15:30",
      final_selectedTeam: [],
      selected_team: [],
      team_list: [],
      modalVisible_team: false,
      description: "",
      started_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    this.DoDelete_final_team=this.DoDelete_final_team.bind(this)
    this.DoselectTeam=this.DoselectTeam.bind(this)
    this.DoselectTeam_delete=this.DoselectTeam_delete.bind(this)
  }

  componentWillMount() {
  }

  clickSaveBtn() {
    this.setState({visible: true})
    var sss = {
        job_id: this.props.job_data.job_id,
        visit_id: 0,
        description: this.state.description,
        date: this.state.started_date,
        start_time: this.state.started_time,
        end_time: this.state.ended_time,
        is_anytime: this.state.is_anytime,
        team_data: this.state.final_selectedTeam,
        unscheduled: this.state.unscheduled
      }
    console.log('XXXXXXXXXXXXXX', sss)

    var temp=URLclass.url + 'visit/add'

    fetch(temp, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Token': this.props.login_data.token
      },
      body: JSON.stringify({
        job_id: this.props.job_data.job_id,
        visit_id: 0,
        description: this.state.description,
        date: this.state.started_date,
        start_time: this.state.started_time,
        end_time: this.state.ended_time,
        is_anytime: this.state.is_anytime,
        team_data: this.state.final_selectedTeam,
        unscheduled: this.state.unscheduled
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {
        console.log('Visit DATA+++++++++++++++', responseData)
        this.setState({visible:false})
        this.props.send_visitData(responseData)
        this.props.navigation.navigate("VisitDetailPage")
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);            

      }
    })
  }

  setModalVisible_team(visible) {
    this.setState({modalVisible_team: visible})
  }

  clickUnscheduledBtn() {
    if (this.state.unscheduled == 1) {
      this.setState({unscheduled: -1})
    } else {
      this.setState({unscheduled: 1})
    }
  }

  clickAnytimeBtn() {
    if (this.state.is_anytime == 1) {
      this.setState({is_anytime: -1})
    } else {
      this.setState({is_anytime: 1})
    }
  }

  clickStartDate(date) {
    this.setState({started_date: date})
  }

  clickStartedTime(date) {
    this.setState({started_time: date})
  }

  clickEndedTime(date) {
    this.setState({ended_time: date})
  }

  clickContinueBtn() {
    this.setState({final_selectedTeam: this.state.selected_team})
    this.setModalVisible_team(false)
  }

  DoDelete_final_team(_counterFromChild) {
    var temp = this.state.final_selectedTeam;
    temp.splice(_counterFromChild, 1)
    this.setState({final_selectedTeam: temp})
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

  showTeamTitle() {
    return (
      <View style={{marginTop:deviceHeight/30}}>
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

  showTeams() {
    var i=-1;
    return this.state.team_list.map((data) => {
      i++;
      return (
        <Child_team key={i} itemData={data} index={i} selectTeam={this.DoselectTeam} deleteTeam={this.DoselectTeam_delete} check_checker={this.state.final_selectedTeam} />
      )
    })
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

  show_start_endTime() {
    if (this.state.unscheduled == -1) {
      if (this.state.is_anytime == -1) {
        return (
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30}}>
            <View>
              <Text style={{fontSize:13, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Start time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.3}}
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
              <Text style={{fontSize:13, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>End time</Text>
                <DatePicker
                  style={{width: deviceWidth/2.3}}
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
        );
      }
    }
  }

    
  render() {
    return (
      <Container style={{backgroundColor:'#f3f3f3'}}>

        <Header style={{backgroundColor: '#99c146'}}>
          <Left style={{ flex: 1, }}>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Cancel</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#ffffff', fontWeight:'700', fontSize:19}}>New Visit</Text>
          </Body>
          <Right style={{ flex: 1, }}>
            <Button transparent onPress={() => this.clickSaveBtn()}>
                    <Text style={{color:'white', fontSize:15, fontWeight:'400'}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <Content>
          <View style={{margin:deviceWidth/30}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{fontSize:16, fontWeight:'600', color:'#515151'}}>Schedule</Text>
              <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={() => this.clickUnscheduledBtn()}>
                {this.state.unscheduled == 1 ? <Image source={checkBoxBtn} style={{width:deviceWidth/17, height:deviceWidth/17, marginRight:deviceWidth/50}} />
                : <Image source={checkBoxBtn_not} style={{width:deviceWidth/17, height:deviceWidth/17, marginRight:deviceWidth/50}} />}
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>Schedule later</Text>
              </TouchableOpacity>
            </View>

            {this.state.unscheduled == 1 ? null
            : <View style={{marginTop:deviceHeight/50}}>
                <Text style={{fontSize:13, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Start date</Text>
                  <DatePicker
                    style={{width: deviceWidth/2.3}}
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
                    onDateChange={(date) => this.clickStartDate(date)}
                  />
              </View>
            }

            {this.show_start_endTime()}

            {this.state.unscheduled == -1 ? <TouchableOpacity style={{marginTop:deviceHeight/50, flexDirection:'row', alignItems:'center'}} onPress={() => this.clickAnytimeBtn()}>
              {this.state.is_anytime == 1 ? <Image source={checkBoxBtn} style={{width:deviceWidth/17, height:deviceWidth/17, marginRight:deviceWidth/50}} />
              : <Image source={checkBoxBtn_not} style={{width:deviceWidth/17, height:deviceWidth/17, marginRight:deviceWidth/50}} />}
              <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}>Anytime on {this.state.started_date}</Text>
            </TouchableOpacity>
            : null}
            
            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />

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

            {this.showTeamTitle()}
            {this.showInfo_team()}

            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/30}} />

            <Text style={{color:'#515151', fontSize:16, fontWeight:'600', marginTop:deviceHeight/30}}>Visit details</Text>
            <View style={{marginTop:deviceHeight/100, borderColor:'#888', borderWidth:1, alignSelf:'center', width:deviceWidth*28/30}}>
                <Input style={{paddingLeft:10}} multiline={true} numberOfLines={10} placeholder='Job description' value={this.state.description} onChangeText={description => this.setState({ description })} />
            </View>

          </View>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_visitData: data => dispatch(send_visitData(data)),
  };
}

const mapStateToProps = state => ({
  data: state.user.data,
  login_data: state.user.login_data,
  client_data: state.user.client_data,
  job_data: state.user.job_data
});

export default connect(mapStateToProps, bindAction)(NewVisitPage);


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
      <View style={{marginLeft:deviceWidth/20, marginBottom:deviceHeight/50}}>
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