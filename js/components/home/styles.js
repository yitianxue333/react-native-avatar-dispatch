
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
    width: deviceWidth/10,
    height: deviceWidth/10,
    borderRadius: deviceWidth/20,
    marginRight: deviceWidth/50,
    marginLeft: deviceWidth/50
  },
  switchStyle: {
    width:deviceWidth/12,
    height:deviceWidth*171/156/12,
    marginRight:deviceWidth/40
  }
};
