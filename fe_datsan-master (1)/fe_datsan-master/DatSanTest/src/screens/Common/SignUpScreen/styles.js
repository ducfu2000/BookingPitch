import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingVertical: 44,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  left: {
    alignItems: 'flex-start',
  },
  pt5: {
    paddingTop: 5,
  },
  textRule: {
    width: '80%',
    fontWeight: 'bold',
  },
  textItalicAndBold: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  passwordContainer: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 20,
    padding: 14,
    position: 'absolute',
    right: 3,
    top: 5,
    color: COLORS.grayColor,
  },
  bottom: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.grayColor,
  },
  textStyle: {
    color: COLORS.whiteColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},
  rulesContainer: {
    width: '100%',
    height: 500,
    padding: 15,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    zIndex: 20,
    position: 'absolute',
    top: 100,
    bottom: 100,
  },
  btnClose: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 10,
  },
});

export default styles;
