import React, { Component } from 'react';
import { AppRegistry, Alert, Dimensions, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from "react-redux";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import Home from "../home";
import DrawBar from "../DrawBar";


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    height: deviceHeight,
    width: deviceWidth,
  }
});

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: '',
    image: require('../../../images/1.png'),
    imageStyle: styles.image,
    backgroundColor: '#001522',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: '',
    image: require('../../../images/2.png'),
    imageStyle: styles.image,
    backgroundColor: '#001522',
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: '',
    image: require('../../../images/3.png'),
    imageStyle: styles.image,
    backgroundColor: '#001522',
  },
  {
    key: 'somethun666',
    title: 'Rocket guy',
    text: '',
    image: require('../../../images/4.png'),
    imageStyle: styles.image,
    backgroundColor: '#001522',
  }
];

class IntroductPage extends Component {
    static navigationOptions = {
        header: null
    };
    _onDone = () => {
        this.props.navigation.navigate("Home")
    }
    render() {
        return (
            <AppIntroSlider
                slides={slides}
                dotColor='rgba(255, 255, 255, .2)'
                onDone={this._onDone}
            />
        );
    }
}

function bindAction(dispatch) {
  return {

  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindAction)(IntroductPage);
