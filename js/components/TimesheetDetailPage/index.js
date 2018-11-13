import React, { Component } from "react";
import { Image, Dimensions, TouchableOpacity, Alert, TextInput } from "react-native";
import { URLclass } from '../lib/';
import { connect } from "react-redux";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text, Header, Body, Right, Left
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser, timesheet_change } from "../../actions/user";
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const logo = require("../../../images/logo.png");
const startNowBtn = require("../../../images/btn_startNow@3x.png");
const googleLoginBtn = require("../../../images/login/btn_login_goole@3x.png");
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class TimesheetDetailPage extends Component {
  static propTypes = {
    setUser: React.PropTypes.func
  };
  static navigationOptions = {
    header: {
      visible: false,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      started_time:"15:00",
      ended_time:"15:30",
      duration: "0h 0min",
      date: "2018-02-01",
      note: "",
      id: "0"
    };
  }

  componentWillMount() {
    this.setState({started_time:this.props.sendTimesheet_item.data.startedTime})
    this.setState({ended_time:this.props.sendTimesheet_item.data.endedTime})
    this.setState({duration: Math.floor(this.props.sendTimesheet_item.data.duration/60) + ' hr ' + (this.props.sendTimesheet_item.data.duration%60) + ' min'})
    this.setState({date:this.props.sendTimesheet_item.date})
    this.setState({note:this.props.sendTimesheet_item.data.note})
    this.setState({id:this.props.sendTimesheet_item.data.id})
  }

  setUser(name) {
    this.props.setUser(name);
  }
  
  clickStartedTime(date) {
    {this.setState({started_time: date})}

    var minuteDiff = moment(this.state.started_time, "HH:mm").diff(moment(this.state.ended_time, "HH:mm"),'minutes');
    var hourDuration = Math.floor(Math.abs(minuteDiff)/60);
    var minuteDuration = Math.abs(minuteDiff % 60);
    var duration= hourDuration + ' hr ' + minuteDuration + ' min'
    {this.setState({duration: duration})}

  }

  clickEndedTime(date) {
    {this.setState({ended_time: date})}  

    var minuteDiff = moment(this.state.started_time, "HH:mm").diff(moment(this.state.ended_time, "HH:mm"),'minutes');
    var hourDuration = Math.floor(Math.abs(minuteDiff)/60);
    var minuteDuration = Math.abs(minuteDiff % 60);
    var duration= hourDuration + 'hr ' + minuteDuration + 'min'
    {this.setState({duration: duration})}
  }
  
  clickSave() {
    this.setState({visible:true})

    var minuteDiff = Math.abs(moment(this.state.started_time, "HH:mm").diff(moment(this.state.ended_time, "HH:mm"),'minutes'));
    var timesheet_change_url = URLclass.url + 'timesheet/save'

    fetch(timesheet_change_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            date: this.state.date,
            id: this.state.id,
            startedTime: this.state.started_time,
            endedTime: this.state.ended_time,
            duration: minuteDiff,
            note: this.state.note,
        })
    })

    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success == true) {

        var temp_data={index:this.props.sendTimesheet_item.index, 
                        data:{id: this.state.id,
                              startedTime: this.state.started_time,
                              endedTime: this.state.ended_time,
                              duration: minuteDiff,
                              note: this.state.note,
                              address: this.props.sendTimesheet_item.data.address}}
        
        this.setState({visible:false})
        this.props.timesheet_change(temp_data)
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

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#3ead92'}}>
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Cancel</Text>
                </Button>
            </Left>
            <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20}}>Timesheet</Text>
            </Body>
            <Right style={{ flex: 1 }}>
                <Button transparent onPress={() => this.clickSave()}>
                    <Text style={{color:'white', fontWeight:'400', fontSize:15}}>Save</Text>
                </Button>
            </Right>
        </Header>

        <Content style={{backgroundColor:'#fff'}}>
          <View style={{width:deviceWidth, backgroundColor:'#f3f3f3', justifyContent:'space-between', }}>
            <Text style={{fontSize:15, fontWeight:'500', color:'#818181',  margin:deviceWidth/20}}>{this.state.date}, {this.state.started_time} - {this.state.ended_time}</Text>
            {this.props.sendTimesheet_item.data.address!="" ? 
              <Text style={{fontSize:18, fontWeight:'500', color:'#515151',  marginLeft:deviceWidth/20, marginBottom:deviceWidth/20}}>{this.props.sendTimesheet_item.data.address}</Text>
              : null
            }
          </View>

          <View style={{margin:deviceWidth/30}}>
            <Text style={{fontSize:16, fontWeight:'500', color:'#515151', }}>Recorded time</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/30}}>
              <View>
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Started</Text>
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
                <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginBottom:deviceHeight/150}}>Ended</Text>
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

            <Text style={{fontSize:15, fontWeight:'500', color:'#515151', marginTop:deviceHeight/30}}>Duration</Text>
            <Text style={{fontSize:15, fontWeight:'400', color:'#818181', marginTop:deviceHeight/150, marginLeft:deviceWidth/30}}>{this.state.duration}</Text>

            <View style={{height:1, backgroundColor:'#acacac', marginTop:deviceHeight/30}} />

            <Text style={{fontSize:16, fontWeight:'500', color:'#515151', marginTop:deviceHeight/30}}>Notes</Text>
            <View style={{marginTop:deviceHeight/40, backgroundColor:'white', borderRadius:5, borderColor:'#888', borderWidth:1, height:deviceHeight/6}}>
              <Input multiline={true} numberOfLines={10} style={{paddingLeft:20, marginTop:-50}} placeholder='Write a note...' value={this.state.note} onChangeText={note => this.setState({ note })} />
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
    setUser: name => dispatch(setUser(name)),
    timesheet_change: data => dispatch(timesheet_change(data))
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list,
  data: state.user.data,
  login_data: state.user.login_data,
  sendTimesheet_item: state.user.sendTimesheet_item
});

export default connect(mapStateToProps, bindAction)(TimesheetDetailPage);
