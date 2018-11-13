import React, { Component } from "react";
import {URLclass} from '../lib/';
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Image, Dimensions, TouchableOpacity, Alert, TextInput } from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text
} from "native-base";

var start;

class Update_location extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      }
    };
  }
	start_location() {
		setInterval( () => {
	      navigator.geolocation.getCurrentPosition(
	        (position) => {

	          var chanage_location_url = URLclass.url + 'user/location/update'
	          fetch(chanage_location_url, {
	            method: 'POST',
	            headers: {
	                'Accept': 'application/json',
	                'Content-Type': 'application/json',
	                'Access-Token': this.props.login_data.token
	            },
	            body: JSON.stringify({
	                latitude: position.coords.latitude,
	                longitude: position.coords.longitude
	            })
	          })
	          .then((response) => response.json())
	          .then((responseData) => {
	            console.log('======Update location success =======')
	          })
	        },
	        (error) => console.log('======Update location error =======', error),
	        { enableHighAccuracy: true, timeout: 20000 },
	      );
	    }, 1000*60)
	}

	stop_location() {
		clearInterval(start)
	}

	showFunc() {
		if (this.props.is_start_stop_location != "") {
			if (this.props.is_start_stop_location == "start") {
				{this.start_location()}
			} else {
				{this.stop_location()}
			}
		}
	}

	render() {
		return (
			{this.showFunc()}
		)
	}
}


function bindAction(dispatch) {
  return {
  };
}

const mapStateToProps = state => ({
  login_data: state.user.login_data,
  is_start_stop_location: state.user.is_start_stop_location
});


export default connect(mapStateToProps, bindAction)(Update_location);