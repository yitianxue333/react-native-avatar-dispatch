
const React = require('react-native');

const { StyleSheet, Dimensions, PixelRatio } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
  shadow: {
    marginTop: deviceHeight*10/1280,
    width: 451/2,
    height: 221/2,
    alignSelf: 'center'
  },
  bg: {
    flex: 1,
    marginTop: 80*deviceHeight / 1280,
  },
  input: {
    marginBottom: 20,
  },
  loginBtnStyle: {
    marginTop: deviceHeight / 10,
    marginLeft: deviceWidth/12,
    marginRight: deviceWidth/12,
    width: deviceWidth*5/6,
    height: deviceWidth*5*270/6/1740,
    alignSelf: 'center'
  },
  googleLoginBtnStyle: {
    marginLeft: deviceWidth/12,
    marginRight: deviceWidth/12,
    width: deviceWidth*5/6,
    height: deviceWidth*5*270/6/1740,
    alignSelf: 'center'
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  lineStyle: {
    backgroundColor: '#888888',
    width: deviceWidth/2.8,
    height: 1
  },
  orStyle: {
    flexDirection  : 'row',
    margin: deviceWidth/12,
    alignItems: 'center'
  }
};
