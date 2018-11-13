
const React = require('react-native');

const { StyleSheet, Dimensions, PixelRatio } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    backgroundColor: '#f3f3f3',
  },
  row: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  mt: {
    marginTop: 18,
  },
  personImageStyle: {
    width: deviceWidth/2.5,
    height: deviceWidth*222/885/2.5,
},
  switchStyle: {
    width:deviceWidth/12,
    height:deviceWidth*171/156/12,
    marginRight:deviceWidth/40
  }
};
