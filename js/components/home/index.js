import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions, Image, Modal, Alert, ScrollView } from "react-native";
import { URLclass } from '../lib/';
import { connect } from "react-redux";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import {send_timesheetItem, timesheet, from_client_to_NewQuote, from_client_to_NewJob, from_home_clientPage, send_data_from_home_eventPage, send_data_from_home_visitPage, send_data_from_home_taskPage} from "../../actions/user"
import {
  Container,
  Header,
  Footer, FooterTab,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right, Item, Input
} from "native-base";
import ActionButton from 'react-native-action-button';
import { Grid, Row } from "react-native-easy-grid";
import CalendarStrip from "react-native-calendar-strip";
import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-datepicker'
import AnimatedModal from 'react-native-animated-modal'
import { setIndex } from "../../actions/list";
import { login } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const personImage = require("../../../images/person.png");
const switchImage = require("../../../images/switch.png");
const carImage = require("../../../images/ic_delivery@3x.png");
const eventImage = require("../../../images/event-icon.png");
const taskImage = require("../../../images/task-icon.png");
const actionClientBtn = require("../../../images/btn_clients_radio@3x.png");
const actionQuoteBtn = require("../../../images/btn_quote_radio@3x.png");
const actionTaskBtn = require("../../../images/btn_task_radio@3x.png");
const actionJobBtn = require("../../../images/jobIcon.png");
const scheduleTabIcon = require("../../../images/ic_chelude_1_active@3x.png");
const scheduleTabIcon_not = require("../../../images/ic_schedule_not_active@3x.png");
const timesheetTabIcon = require("../../../images/ic_timecheet_active@3x.png");
const timesheetTabIcon_not = require("../../../images/ic_time_not_active@3x.png");
const clientsTabIcon = require("../../../images/ic_clients_active@3x.png");
const clientsTabIcon_not = require("../../../images/ic_clients_not_active@3x.png");
const checkAgainBtn = require("../../../images/btn_check_again@3x.png");
const timerIcon = require("../../../images/ic_time_2@3x.png");
const clockinBtn = require("../../../images/btn_clock_in@3x.png");
const clockOutBtn = require("../../../images/clickOut.png");
const clockinBtn_not = require("../../../images/btn_clock_in@3x_not.png");
const searchBtn = require("../../../images/btn_search@3x.png");
const settingIcon = require("../../../images/ic_settings@3x.png");
const calendarIcon = require("../../../images/ic_calendar@3x.png");
const arrowIcon = require("../../../images/ic_arrow@3x.png");
const clockGif = require("../../../images/Clock.gif");

class Home extends Component {
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
      is_calendar:true,
      is_schedule: 1,
      is_timesheet: 0,
      is_clients: 0,
      is_clickInButton:true,
      is_pressed_clickInButton:false,
      modalVisible: false,
      modal_switch_Visible: false,
      selectedStartDate: null,
      isModalVisible: false,
      todayDate: moment(new Date()).format("YYYY-MM-DD"),
      todayTime: moment(new Date()).format("HH:mm"),
      timesheetItems_array: [],
      clientsItems_array: [],
      schedulesItems_array: [],
      foo:'',
      last_startedTime:'',
      last_endedTime:'',
      selectedDate_vertical : moment(new Date()).format("YYYY-MM-DD"),
      started_headerDate: moment(new Date()).format("YYYY-MM-DD"),
      id: 0,
      member_name: ""
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.DoSelectItem=this.DoSelectItem.bind(this);
    this.Doselect_client = this.Doselect_client.bind(this);
    this.Doselect_schedule = this.Doselect_schedule.bind(this);
    this.DoselectMember = this.DoselectMember.bind(this);
  }

  componentWillMount() {
    this.setState({id: this.props.login_data.teamId})
    this.state.id = this.props.login_data.teamId
    this.setState({member_name: this.props.login_data.userName})
    {this.api_timesheet(moment(new Date()).format("YYYY-MM-DD"))}
    {this.api_temp(moment(new Date()).format("YYYY-MM-DD"))}
  }

  componentDidMount() {
  }

  handleOnNavigateBack = (foo) => {
    this.setState({
      foo
    })
  }

  api_temp (date) {
    var temp=URLclass.url + 'timesheet/getall/' + date
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
        this.props.timesheet(responseData)
        // if (this.state.is_clickInButton==true) {
          this.setState({timesheetItems_array:responseData.array})
        // }
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 500);

      }
    })
  }

  api_timesheet(date) {

    console.log('====Token====', this.props.login_data.token)

    this.setState({visible:true})

    if (this.state.is_timesheet == 1) {
      var temp=URLclass.url + 'timesheet/getall/' + date
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
          console.log('Timesheet Data============', responseData)
          this.setState({visible:false})
          this.props.timesheet(responseData)
          // if (this.state.is_clickInButton==true) {
            this.setState({timesheetItems_array:responseData.array})
          // }
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 500);

        }
      })
    } else if (this.state.is_clients == 1) {
      var temp=URLclass.url + 'client/' + date + '/getall'
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
          this.setState({clientsItems_array:responseData.clients})
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 500);

        }
      })
    } else {
      var temp=URLclass.url + 'schedule/' + date + '/getall/' + this.state.id
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
          console.log('Schedule=================', responseData.schedules)
          this.setState({visible:false})
          this.setState({schedulesItems_array:responseData.schedules})
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

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  showSwitchModalVisible(visible) {
      this.setState({modal_switch_Visible: visible});
  }

  clickCalendar() {
    if (this.state.is_calendar == true) {
      this.setState({is_calendar:true})
    } else {
      this.setState({is_calendar:true})
    }
  }

  select_schedule() {
    if (this.state.is_schedule == 0) {
      this.setState({is_schedule:1})
      this.setState({is_timesheet:0})
      this.setState({is_clients:0})
    }
    this.state.is_schedule = 1;
    this.state.is_timesheet = 0;
    this.state.is_clients = 0;
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }
  select_timesheet() {
    if (this.state.is_timesheet == 0) {
      this.setState({is_schedule:0})
      this.setState({is_timesheet:1})
      this.setState({is_clients:0})
    }
    this.state.is_timesheet = 1;
    this.state.is_schedule = 0;
    this.state.is_clients = 0;
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }
  select_clients() {
    if (this.state.is_clients == 0) {
      this.setState({is_schedule:0})
      this.setState({is_timesheet:0})
      this.setState({is_clients:1})
    }
    this.state.is_clients = 1;
    this.state.is_schedule = 0;
    this.state.is_timesheet = 0;
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }

  selectDate_header(day) {
    console.log('DATE============', day)
    var selectedDay=moment(day.toString()).format("YYYY-MM-DD")
    var currentDay=moment(new Date()).format("YYYY-MM-DD")

    if (selectedDay==currentDay) {
      this.setState({is_clickInButton:true})
    } else {
      this.setState({is_clickInButton:false})
    }

    this.setState({selectedDate_vertical : selectedDay})
    this.setState({started_headerDate : selectedDay})
    {this.api_timesheet(selectedDay)}
  }

  showCalendar() {
    if (this.state.is_calendar == true) {
      return (
        <CalendarStrip
          style={{width:deviceWidth, height:deviceHeight/8, backgroundColor:'#4f70ca', marginTop:-1}}
          calendarAnimation={{type: 'sequence', duration: 100}}
          daySelectionAnimation={{type: 'background', duration: 200, highlightColor:'rgba(256,256,256,1)'}}
          calendarHeaderStyle={{color: 'white'}}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          selectedDate = {this.state.selectedDate_vertical}
          onDateSelected = {(day) => this.selectDate_header(day)}
        />
      );
    } else {
      null
    }
  }

  clickRefreshBtn() {
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }

  showHeader() {
    if (this.state.is_calendar == false || this.state.is_schedule == 1) {
      return (
        <View style={{backgroundColor:'#f3f3f3', width:deviceWidth, height:deviceHeight/13, flexDirection:'row', alignItems:'center', justifyContent: 'space-between', borderBottomColor:'#757c85', borderBottomWidth:1}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={personImage} style={styles.personImageStyle} />
            <Text style={{color:'#757c85', fontSize:15, fontWeight:'600'}}>{this.state.member_name} 's schedule</Text>
          </View>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => this.clickRefreshBtn()}>
            <Text style={{color:'#4f70ca', fontSize:15, fontWeight:'600', marginRight:deviceWidth/40}}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  DoSelectItem(_counterFromChild) {
    if (this.state.is_clickInButton == true) {
      var today=moment(new Date()).format("YYYY-MM-DD")

      var temp={date:today, index:_counterFromChild, data:this.state.timesheetItems_array[_counterFromChild]}
      {this.props.send_timesheetItem(temp)}

      this.props.navigation.navigate('TimesheetDetailPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
    } else {
      var temp={date:this.props.timesheet_data.date, index:_counterFromChild, data:this.props.timesheet_data.array[_counterFromChild]}
      {this.props.send_timesheetItem(temp)}

      this.props.navigation.navigate('TimesheetDetailPage', {
        onNavigateBack: this.handleOnNavigateBack.bind(this)
      })
    }
  }

  Doselect_client(_counterFromChild) {
    this.setState({visible:true})
    var temp=URLclass.url + 'client/' + this.state.clientsItems_array[_counterFromChild].client_id + '/info'
    
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
        console.log('6666666------------', responseData)    
        this.setState({visible:false})
        this.props.from_home_clientPage(responseData)
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

  Doselect_schedule(_counterFromChild) {
    if (this.state.schedulesItems_array[_counterFromChild].schedule_type == 1) {
      this.setState({visible:true})
      var temp=URLclass.url + 'visit/' + this.state.schedulesItems_array[_counterFromChild].schedule_id + '/info'
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
          this.props.send_data_from_home_visitPage(responseData)
          this.props.navigation.navigate("VisitDetailPage")
        } else {
          var self=this
          self.setState({visible:false})

          setTimeout(function(){
            Alert.alert(responseData.errorMessage)
          }, 500);
        }
      })
    } else if (this.state.schedulesItems_array[_counterFromChild].schedule_type == 2) {

      this.setState({visible:true})
      var temp=URLclass.url + 'event/' + this.state.schedulesItems_array[_counterFromChild].schedule_id + '/info'
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
          this.props.send_data_from_home_eventPage(responseData)
          this.props.navigation.navigate("ItemDetailPage")
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
      var temp=URLclass.url + 'task/' + this.state.schedulesItems_array[_counterFromChild].schedule_id + '/info'
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
          this.props.send_data_from_home_taskPage(responseData)
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
//    this.props.navigation.navigate("ItemDetailPage")
  }

  DoselectMember(_counterFromChild) {
    this.setState({id: this.props.login_data.teamData.members[_counterFromChild].team_id})
    this.setState({member_name: this.props.login_data.teamData.members[_counterFromChild].team_name})
    this.showSwitchModalVisible(false)
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }

  clickCheckAgainBtn() {
    {this.api_timesheet(this.state.selectedDate_vertical)}
  }

  showSchedulePage() {
    if (this.state.is_schedule == 1) {
      if (this.state.schedulesItems_array.length == 0) {
        return (
          <View style={{alignItems:'center', height:deviceHeight/1.5}}>
            <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/7, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/3, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
              <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/15}}>No scheduled visits or tasks</Text>
              <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', marginTop:deviceHeight/100, marginLeft:deviceWidth/10, marginRight:deviceWidth/10, marginBottom:deviceHeight/20, textAlign:'center'}}>Looks like you don't have anything to do today</Text>
              <TouchableOpacity style={{alignItems:'center'}} onPress={() => this.clickCheckAgainBtn()}>
                <Image source={checkAgainBtn} style={{width:deviceWidth*2.5/4, height:deviceWidth*2.5*222/1374/4}} />
              </TouchableOpacity>
            </View>
            <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/3-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
              <Image source={scheduleTabIcon} style={{width:deviceWidth/12, height:deviceWidth*129/135/12}} />
            </View>
          </View>
        );
      } else {
        var i = -1;
        return this.state.schedulesItems_array.map((data) => {
          i++;
          return (
            <Child_schedule key={i} itemData={data} index={i} selectItem={this.Doselect_schedule} />
          )
        })
      }
    }
  }

  click_clockStart() {
    this.setState({visible:true})

    var timesheet_clock_url = URLclass.url + 'timesheet/start'

    fetch(timesheet_clock_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            date: moment(new Date()).format("YYYY-MM-DD"),
            startedTime: moment(new Date()).format("HH:mm"),
            endedTime: "",
            duration: 0,
            visit_id: 0
        })
    })

    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.success == true) {
        this.setState({visible:false})
        this.props.timesheet(responseData)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);

      }
    })
  }

  click_clockStop() {
    this.setState({visible:true})

    var end_currentTime = moment(new Date()).format("HH:mm")
    var index = this.props.timesheet_data.array.length-1;
    var minuteDiff = moment(this.props.timesheet_data.array[index].startedTime, "HH:mm").diff(moment(end_currentTime, "HH:mm"),'minutes');

    var timesheet_clock_url = URLclass.url + 'timesheet/stop'

    fetch(timesheet_clock_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Token': this.props.login_data.token
        },
        body: JSON.stringify({
            date: moment(new Date()).format("YYYY-MM-DD"),
            startedTime: this.props.timesheet_data.array[index].startedTime,
            endedTime: end_currentTime,
            duration: Math.abs(minuteDiff),
            visit_id: 0
        })
    })

    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.success == true) {
        this.setState({visible:false})
        this.props.timesheet(responseData)
      } else {
        var self=this
        self.setState({visible:false})

        setTimeout(function(){
          Alert.alert(responseData.errorMessage)
        }, 300);

      }
    })
  }


  // click_clockInButton() {

  //   this.setState({is_clickInButton:true})

  //   var currentDate=moment(new Date()).format("YYYY-MM-DD")

  //   if (this.state.is_pressed_clickInButton==false) {
  //     var first_currentTime=moment(new Date()).format("HH:mm")

  //     this.setState({is_pressed_clickInButton:true})
  //     this.setState({last_startedTime:first_currentTime})
  //     var addItem={startedTime: first_currentTime, endedTime:'', duration:'0', note:'', address:'', id:'1000000'}
  //     this.state.timesheetItems_array.push(addItem)
  //   } else {
  //     var end_currentTime=moment(new Date()).format("HH:mm")

  //     this.setState({visible:true})

  //     this.setState({is_pressed_clickInButton:false})
  //     this.setState({last_endedTime:end_currentTime})

  //     var duration=0;

  //     let markers = [ ...this.state.timesheetItems_array ];
  //     var index=this.state.timesheetItems_array.length-1;
  //     var minuteDiff = moment(this.state.timesheetItems_array[index].startedTime, "HH:mm").diff(moment(end_currentTime, "HH:mm"),'minutes');


  //     markers[index].endedTime = end_currentTime;
  //     markers[index].duration = Math.abs(minuteDiff);
  //     this.setState({ timesheetItems_array: markers });

  //     var timesheet_clock_url = URLclass.url + 'timesheet/clock'

  //     fetch(timesheet_clock_url, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json',
  //             'Access-Token': this.props.login_data.token
  //         },
  //         body: JSON.stringify({
  //             date: currentDate,
  //             startedTime: this.state.last_startedTime,
  //             endedTime: end_currentTime,
  //             duration: Math.abs(minuteDiff),
  //             visit_id: 0
  //         })
  //     })

  //     .then((response) => response.json())
  //     .then((responseData) => {

  //       if (responseData.success == true) {
  //         this.setState({visible:false})
  //         this.props.timesheet(responseData)
  //       } else {
  //         var self=this
  //         self.setState({visible:false})

  //         setTimeout(function(){
  //           Alert.alert(responseData.errorMessage)
  //         }, 500);

  //       }
  //     })
  //   }
  // }

  showTimesheetPage_title() {
    if (this.state.is_timesheet == 1) {
      return (
        <View>
          <Text style={{textAlign:'center', fontSize:18, fontWeight:'700', color:'#515151'}}>Time tracked for {this.state.selectedDate_vertical}</Text>
          <View style={{flexDirection:'row', alignSelf:'center', marginTop:deviceHeight/50}}>
            <Text style={{fontSize:25, fontWeight:'700', color:'#515151'}}>{Math.floor(this.props.timesheet_data.total_duration/60)} hr {this.props.timesheet_data.total_duration%60} min</Text>
          </View>
          <View style={{width:deviceWidth, height:1, backgroundColor:'#acacac', marginTop:deviceHeight/50}} />
        </View>
      );
    }
  }

  showTimesheetPage() {
    if (this.state.is_timesheet == 1) {
      var i=-1;
      return this.props.timesheet_data.array.map((data) => {
        i++;
        return (
          <Child_Timesheet key={i} itemData={data} index={i} selectItem={this.DoSelectItem} />
        )
      })
    }
  }

  showTimesheetPage_NoContent() {
    if (this.state.is_timesheet == 1) {
      if (this.props.timesheet_data.array.length == 0) {
        return (
          <View style={{alignItems:'center', height:deviceHeight/2}} >
            <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/10, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/3, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
              <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/13}}>Let's get your day started!</Text>
              <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', margin:deviceHeight/50, marginLeft:deviceWidth/10, marginRight:deviceWidth/10, marginBottom:deviceHeight/20, textAlign:'center'}}>Clock in will start a timer for your day, you can Clock Out at any time by returning to this time sheet. Your timesheet will also house all of your visit timer entries for the day.</Text>
            </View>
            <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/3-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
              <Image source={timerIcon} style={{width:deviceWidth/12, height:deviceWidth*144/132/12}} />
            </View>
          </View>
        );
      }
    }
  }

  showTimesheetPage_btn() {
    var currentDay=moment(new Date()).format("YYYY-MM-DD")

    if (this.state.is_timesheet == 1) {
      if (this.props.timesheet_data.date == currentDay) {
        if (this.props.timesheet_data.is_starting == 1) {
          return (
            <TouchableOpacity style={{alignItems:'center',  marginTop:deviceHeight/15, marginBottom:deviceHeight/30,}} onPress={() => this.click_clockStop()}>
              <Image source={clockOutBtn} style={{width:deviceWidth/2.5, height:deviceWidth*222/861/2.5}} />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity style={{alignItems:'center',  marginTop:deviceHeight/15, marginBottom:deviceHeight/30,}} onPress={() => this.click_clockStart()}>
              <Image source={clockinBtn} style={{width:deviceWidth/2.5, height:deviceWidth*222/861/2.5}} /> 
            </TouchableOpacity>
          );
        }
      } else {
        return (
          <View style={{alignItems:'center',  marginTop:deviceHeight/15, marginBottom:deviceHeight/30,}}>
            <Image source={clockinBtn_not} style={{width:deviceWidth/2.5, height:deviceWidth*222/861/2.5}} />
          </View>
        );
      }
    }
  }

  showClients_titlePage() {
    if (this.state.is_clients == 1) {
      return (
        <View>
          <View style={{alignSelf:'center', width:deviceWidth*47/50, marginTop:deviceHeight/50}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'#818181', fontSize:18, fontWeight:'400'}}>Scheduled clients</Text>
              <Text style={{color:'#515151', fontSize:18, fontWeight:'700'}}></Text>
            </View>
          </View>
          <View style={{backgroundColor:'#888', height:2, alignSelf:'center', width:deviceWidth*47/50, marginTop:deviceHeight/100, marginBottom:deviceHeight/50}} />
        </View>
      );
    }
  }

  showClientsPage() {
    if (this.state.is_clients == 1) {
      if (this.state.clientsItems_array.length == 0) {
        return (
          <View>
            <View style={{alignItems:'center', height:deviceHeight/2}}>
              <View style={{marginLeft:deviceWidth/20, marginRight:deviceWidth/20, marginTop:deviceHeight/10, borderRadius:15, borderWidth:1, borderColor:'#acacac', height:deviceHeight/4, width:deviceWidth*18/20, backgroundColor:'white', alignItems:'center'}}>
                <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginTop:deviceHeight/13}}>No scheduled clients for today</Text>
                <Text style={{fontSize:17, fontWeight:'normal', fontStyle: 'italic', color:'#515151', margin:deviceHeight/50, marginLeft:deviceWidth/100, marginRight:deviceWidth/100, marginBottom:deviceHeight/20, textAlign:'center'}}>Use search to find clients by first, lastm or company name</Text>
              </View>
              <View style={{width:deviceWidth/6, height:deviceWidth/6, borderRadius:deviceWidth/12, borderColor:'#acacac', borderWidth:1, alignItems:'center', justifyContent:'center', marginTop:-deviceHeight/4-deviceWidth/12, backgroundColor:'#f3f3f3'}}>
                <Image source={clientsTabIcon} style={{width:deviceWidth/12, height:deviceWidth*135/153/12}} />
              </View>
            </View>
          </View>
        );
      } else {
        var i = -1;
        return this.state.clientsItems_array.map((data) => {
          i++;
          return (
            <Child_client key={i} itemData={data} index={i} selectItem={this.Doselect_client} />
          )
        })
      }
    }
  }

  showTabbar() {
    if (this.state.is_calendar == true) {
      if (this.props.login_data.permission != 4) {
        return (
          <View>
            <View style={{backgroundColor:'#acacac', width:deviceWidth, height:1}} />
            <View style={{backgroundColor:'#fff', width:deviceWidth, height:deviceHeight/13, flexDirection:'row'}}>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50}} onPress= {() => this.select_schedule()}>
                {this.state.is_schedule==1 ? <Image source={scheduleTabIcon} style={{width:deviceWidth/15, height:deviceWidth*129/135/15}} /> : <Image source={scheduleTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth*135/141/15}} />}
                {this.state.is_schedule==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Schedule</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Schedule</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50}} onPress= {() => this.select_timesheet()}>
                {this.state.is_timesheet==1 ? <Image source={timesheetTabIcon} style={{width:deviceWidth/15, height:deviceWidth/15}} /> : <Image source={timesheetTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth/15}} />}
                {this.state.is_timesheet==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Timesheet</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Timesheet</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50}} onPress= {() => this.select_clients()}>
                {this.state.is_clients==1 ? <Image source={clientsTabIcon} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} /> : <Image source={clientsTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} />}
                {this.state.is_clients==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Clients</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Clients</Text>}
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <View>
            <View style={{backgroundColor:'#acacac', width:deviceWidth, height:1}} />
            <View style={{backgroundColor:'#fff', width:deviceWidth, height:deviceHeight/13, flexDirection:'row'}}>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50, width:deviceWidth/3}} onPress= {() => this.select_schedule()}>
                {this.state.is_schedule==1 ? <Image source={scheduleTabIcon} style={{width:deviceWidth/15, height:deviceWidth*129/135/15}} /> : <Image source={scheduleTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth*135/141/15}} />}
                {this.state.is_schedule==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Schedule</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Schedule</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50, width:deviceWidth/3}} onPress= {() => this.select_timesheet()}>
                {this.state.is_timesheet==1 ? <Image source={timesheetTabIcon} style={{width:deviceWidth/15, height:deviceWidth/15}} /> : <Image source={timesheetTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth/15}} />}
                {this.state.is_timesheet==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Timesheet</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Timesheet</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', margin:deviceWidth/50, width:deviceWidth/3}} onPress= {() => this.select_clients()}>
                {this.state.is_clients==1 ? <Image source={clientsTabIcon} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} /> : <Image source={clientsTabIcon_not} style={{width:deviceWidth/15, height:deviceWidth*135/153/15}} />}
                {this.state.is_clients==1 ? <Text style={{marginLeft:deviceWidth/100, color:'#4f70ca', fontSize:15, fontWeight:'600'}}>Clients</Text> : <Text style={{marginLeft:deviceWidth/100, color:'#515151', fontSize:15, fontWeight:'400'}}>Clients</Text>}
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    } else {
      return (
        null
      );
    }
  }

  clickQuoteAction() {
    this.props.from_client_to_NewQuote(false)
    this.props.navigation.navigate("NewQuotePage")
  }

  clickJobAction() {
    this.props.from_client_to_NewJob(false)
    this.props.navigation.navigate("NewJobPage")
  }


  showAnimatedPlusButton() {
    if (this.state.is_calendar == true) {
      if (this.props.login_data.permission == 3 || this.props.login_data.permission == 4) {
        null
      } else {
        if (this.props.login_data.permission == 5) {
          return (
            <ActionButton buttonColor="#4f70ca" offsetX={5} offsetY={20} bgColor='rgba(79, 112, 202, 0.6)'>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Client" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#3ead92'}} spaceBetween={5} onPress={() => this.props.navigation.navigate("NewClientPage")}>
                <Image source={actionClientBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Job" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#bbc522'}} spaceBetween={5} onPress={() => this.clickJobAction()}>
                <Image source={actionJobBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Task" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#4b6a96'}} spaceBetween={5} onPress={() => this.props.navigation.navigate("NewTaskPage")}>
                <Image source={actionTaskBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
            </ActionButton>
          );
        } else {
          return (
            <ActionButton buttonColor="#4f70ca" offsetX={5} offsetY={20} bgColor='rgba(79, 112, 202, 0.6)'>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Client" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#3ead92'}} spaceBetween={5} onPress={() => this.props.navigation.navigate("NewClientPage")}>
                <Image source={actionClientBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Quote" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#b36096'}} spaceBetween={5} onPress={() => this.clickQuoteAction()}>
                <Image source={actionQuoteBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Job" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#bbc522'}} spaceBetween={5} onPress={() => this.clickJobAction()}>
                <Image source={actionJobBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='rgba(0,0,0,0)' title="Task" textStyle={{color:'white', fontSize:15, fontWeight:'700'}} textContainerStyle={{backgroundColor:'#4b6a96'}} spaceBetween={5} onPress={() => this.props.navigation.navigate("NewTaskPage")}>
                <Image source={actionTaskBtn} style={{height:deviceWidth/7, width:deviceWidth/7}} />
              </ActionButton.Item>
            </ActionButton>
          );
        }
      }
    } else {
      null
    }
  }

  changeHeaderDate(date) {
    this.setState({started_headerDate: date})
    this.setState({selectedDate_vertical: date})
    {this.api_timesheet(date)}
  }

  showTeams() {
    var i=-1;
    return this.props.login_data.teamData.members.map((data) => {
      i++;
      return (
        <Child_team key={i} itemData={data} index={i} selectMember={this.DoselectMember} />
      )
    })
  }


  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#4f70ca'}}>
          <Left style={{ flex: 1,}}>
            <Button
              transparent
              light
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{color:'#ffffff', fontWeight:'700', fontSize:20, marginRight:10}}>{this.state.selectedDate_vertical}</Text>
              <Image source={arrowIcon} style={{width:deviceWidth/25, height:deviceWidth*39/69/25, marginLeft:10}} />

              <DatePicker
                style={{width: deviceWidth/2, marginLeft:-deviceWidth/2}}
                date={this.state.started_headerDate}
                mode="date"
                placeholder="select date"
                hideText={true}
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 100000,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 0
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => this.changeHeaderDate(date)}
              />

            </View>
          </Body>
          <Right style={{ flex: 1,}}>
            {this.state.is_schedule == 1 && this.props.login_data.permission !=3 && this.props.login_data.permission != 4 ? <Button
              transparent
              light
              onPress={() => this.showSwitchModalVisible(true)}
              >
                <Text style={{color:'white', fontSize:13, fontWeight:'600', marginTop:deviceHeight/50}}>Switch</Text>
            </Button>
            : null}
            
          </Right>
       </Header>

       <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
          >
          <View style={{width:deviceWidth, height:deviceHeight, backgroundColor:'rgba(0,0,0,0.7)', alignItems:'center'}}>
            <View style={{backgroundColor: '#FFF', marginTop: deviceHeight/7, width:deviceWidth/1.1, height:deviceHeight/1.5, borderWidth:2, borderColor:'#4f70ca', borderRadius:10}}>
              <View style={{marginTop:deviceHeight/30}}>
                <CalendarPicker
                  onDateChange={this.onDateChange}
                  selectedDayColor='#4f70ca'
                  todayBackgroundColor='#4f70ca'
                  initialDate='2018-01-10'
                  width={deviceWidth/1.05}
                />
              </View>

              <View style={{marginTop:deviceHeight/10, flexDirection:'row', justifyContent:'space-between', marginBottom:deviceHeight/30}}>
                  <TouchableOpacity style={{marginLeft:deviceWidth/6}} onPress={() => this.setModalVisible(false)}>
                      <Text style={{fontSize:17, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginRight:deviceWidth/6}} onPress={() => this.setModalVisible(false)}>
                      <Text style={{fontSize:17, fontWeight:'600', color:'#4f70ca'}}>OK</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modal_switch_Visible}
          onRequestClose={() => this.showSwitchModalVisible(false)}
          >
          <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>View team's schedule</Text>
            <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.showSwitchModalVisible(false)}>
                <Text style={{fontSize:17, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{width:deviceWidth, margin:deviceWidth/30}}>
            {this.showTeams()}
          </ScrollView>
        </Modal>


        {this.showCalendar()}
        {this.showHeader()}

        <Content>

          <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

          <View style={{marginTop:deviceHeight/30}}>
            {this.showSchedulePage()}
          </View>
          {this.showTimesheetPage_title()}
          {this.showTimesheetPage_NoContent()}
          {this.showTimesheetPage()}
          {this.showTimesheetPage_btn()}
          {this.showClients_titlePage()}
          {this.showClientsPage()}
        </Content>

        {this.props.login_data.permission == 3 ? null
        : <View>
            {this.showTabbar()}
          </View>
        }

        {this.showAnimatedPlusButton()}

        

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer()),
    send_timesheetItem: data => dispatch(send_timesheetItem(data)),
    timesheet: data => dispatch(timesheet(data)),
    from_client_to_NewQuote: flag => dispatch(from_client_to_NewQuote(flag)),
    from_client_to_NewJob: flag => dispatch(from_client_to_NewJob(flag)),
    from_home_clientPage: data => dispatch(from_home_clientPage(data)),
    send_data_from_home_eventPage: data => dispatch(send_data_from_home_eventPage(data)),
    send_data_from_home_visitPage: data => dispatch(send_data_from_home_visitPage(data)),
    send_data_from_home_taskPage: data => dispatch(send_data_from_home_taskPage(data)),
    
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list,
  login_data: state.user.login_data,
  timesheet_data: state.user.timesheet_data
});

const HomeSwagger = connect(mapStateToProps, bindAction)(Home);
const DrawNav = DrawerNavigator(
  {
    Home: { screen: HomeSwagger }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
);
const DrawerNav = null;
DrawNav.navigationOptions = ({ navigation }) => {
  DrawerNav = navigation;
  return {
    header: null
  };
};
export default DrawNav;


class Child_Timesheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration:''
    };
  }

  componentDidMount() {
    var temp_hour = Math.floor(parseInt(this.props.itemData.duration)/60);
    var temp_min = parseInt(this.props.itemData.duration)%60;
    var temp = temp_hour + 'hr ' + temp_min + 'min'
    this.setState({duration:temp})
  }

  textFunction(i) {
    this.props.selectItem(i)
  }



  render() {
    return (
      <View style={{marginTop:deviceWidth/30, marginLeft:deviceWidth/30}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{marginRight:deviceWidth/18, backgroundColor:'#ffffff', width:deviceWidth/20, height:deviceWidth/20, borderRadius:deviceWidth/40, borderColor:'#888888', borderWidth:1.5}} />
          <Text style={{color:'#929292', fontWeight:'700', fontSize:15}}>{this.props.itemData.startedTime}</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {this.props.itemData.address=="" ? <View style={{width:1, backgroundColor:'#888', height:deviceWidth/7, marginLeft:deviceWidth/40}} /> : <View style={{width:1, backgroundColor:'#888', height:deviceWidth/4, marginLeft:deviceWidth/40}} />}


          {this.props.itemData.endedTime!='' ?
            <TouchableOpacity style={{borderColor:'#929292', borderWidth:1, borderRadius:5, flexDirection:'row', marginLeft:deviceWidth/13}} onPress={() => this.textFunction(this.props.index)}>
              <View style={{borderRadius:5, backgroundColor:'#fff', width:deviceWidth/1.25}}>
                {this.props.itemData.address!="" ? <Text style={{marginLeft:deviceWidth/30, marginTop:deviceWidth/30, fontSize:18, fontWeight:'600', color:'#515151'}}>{this.props.itemData.address}</Text> : null}
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{margin:deviceWidth/30, fontSize:16, fontWeight:'400', color:'#515151'}}>{Math.floor(this.props.itemData.duration/60)} hr {Math.abs(this.props.itemData.duration%60)} min</Text>
                  {this.props.itemData.note!="" ? <Text style={{fontSize:15, fontWeight:'400', color:'#818181'}}> - note</Text> : null}
                </View>
              </View>
            </TouchableOpacity>
            :
            <View style={{borderColor:'#929292', borderWidth:1, borderRadius:5, flexDirection:'row', marginLeft:deviceWidth/13}} onPress={() => this.textFunction(this.props.index)}>
              <View style={{borderRadius:5, backgroundColor:'#fff', width:deviceWidth/1.25}}>
                <Text style={{margin:deviceWidth/30, fontSize:16, fontWeight:'400', color:'#515151'}}>{this.props.itemData.duration}</Text>
              </View>
            </View>
          }

        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {this.props.itemData.endTime=='' ? null
            :
            <View style={{marginRight:deviceWidth/20, backgroundColor:'#ffffff', width:deviceWidth/20, height:deviceWidth/20, borderRadius:deviceWidth/40, borderColor:'#888888', borderWidth:1.5}} />
          }
          <Text style={{color:'#929292', fontWeight:'700', fontSize:15}}>{this.props.itemData.endedTime}</Text>
        </View>
      </View>

    );
  }
}

class Child_client extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  componentWillMount() {
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  render() {
    return (
      <TouchableOpacity style={{marginLeft:deviceWidth/30, marginRight:deviceWidth/30}} onPress={() => this.textFunction(this.props.index)}>
        <Text style={{fontWeight:'400', fontSize:15, color:'#818181'}}>{this.props.itemData.company}</Text>
        <Text style={{fontWeight:'600', fontSize:16, color:'#515151'}}>{this.props.itemData.first_name} {this.props.itemData.last_name}</Text>
        <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/100, marginBottom:deviceHeight/100}} />
      </TouchableOpacity>
    );
  }
}

class Child_schedule extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  componentWillMount() {
  }

  show_typeIcon() {
    if (this.props.itemData.schedule_type == 1) {
      return (
        <Image source={carImage} style={{width:deviceWidth/15, height:deviceWidth*129/159/15}} />
      );
    } else if (this.props.itemData.schedule_type == 2) {
      return (
        <Image source={eventImage} style={{width:deviceWidth/16, height:deviceWidth/16}} />
      );
    } else {
      return (
        <Image source={taskImage} style={{width:deviceWidth/16, height:deviceWidth/16}} />
      );
    }
  }

  textFunction(i) {
    this.props.selectItem(i)
  }

  render() {
    return (
      <View style={{marginTop:0, marginLeft:deviceWidth/30}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {this.props.itemData.is_complete == 1 
          ? <View style={{marginRight:deviceWidth/18, backgroundColor:'#4e70ca', width:deviceWidth/20, height:deviceWidth/20, borderRadius:deviceWidth/40, borderColor:'#4e70ca', borderWidth:1.5}} />
          : <View style={{marginRight:deviceWidth/18, backgroundColor:'#ffffff', width:deviceWidth/20, height:deviceWidth/20, borderRadius:deviceWidth/40, borderColor:'#888888', borderWidth:1.5}} />
          }
          
          <Text style={{color:'#929292', fontWeight:'700', fontSize:15}}>{this.props.itemData.start_time} - {this.props.itemData.end_time}</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{width:1, backgroundColor:'#888', height:deviceWidth/2.5, marginLeft:deviceWidth/40}} />
          <TouchableOpacity style={{borderColor:'#929292', borderWidth:1, borderRadius:5, flexDirection:'row', marginLeft:deviceWidth/13}} onPress={() => this.textFunction(this.props.index)}>
            <View style={{borderTopLeftRadius:5, borderBottomLeftRadius:5, backgroundColor:'#fff', width:deviceWidth/1.5}}>
              <Text style={{marginTop:deviceWidth/30, marginLeft:deviceWidth/30, fontSize:16, fontWeight:'700', color:'#515151'}}>{this.props.itemData.schedule_description}</Text>
              <Text style={{marginTop:deviceWidth/50, marginLeft:deviceWidth/30, fontSize:14, fontWeight:'400', color:'#515151'}}>{this.props.itemData.schedule_client_company}</Text>
              <Text style={{marginTop:deviceWidth/200, marginLeft:deviceWidth/30, fontSize:15, fontWeight:'400', color:'#515151'}}>{this.props.itemData.schedule_client_firstName} {this.props.itemData.schedule_client_lastName}</Text>
              <Text style={{marginTop:deviceWidth/50, marginLeft:deviceWidth/30, fontSize:16, fontWeight:'400', color:'#515151', marginBottom:deviceWidth/30}}>{this.props.itemData.schedule_property_address}</Text>
            </View>
            <View style={{borderTopRightRadius:5, borderBottomRightRadius:5, backgroundColor:'#dce2f4', width:deviceWidth/7, justifyContent:'center', alignItems:'center'}}>
              {this.show_typeIcon()}
            </View>
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
      };
  }

  componentWillMount() {
  }

  textFunction(i) {
    this.props.selectMember(i)
  }

  render() {
    return (
      <TouchableOpacity style={{width:deviceWidth*28/30}} onPress={() => this.textFunction(this.props.index)}>
        <Text style={{color:'#515151', fontSize:16, fontWeight:'500'}}>{this.props.itemData.team_name}</Text>
        <View style={{height:1, backgroundColor:'#acacac', width:deviceWidth*28/30, marginTop:deviceWidth/30, marginBottom:deviceWidth/30}} />
      </TouchableOpacity>
    );
  }
}