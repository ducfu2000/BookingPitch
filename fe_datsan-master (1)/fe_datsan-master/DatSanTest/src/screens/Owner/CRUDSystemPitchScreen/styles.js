import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  isPressed: {
    backgroundColor: COLORS.whiteColor,
    color: COLORS.primaryColor,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  center: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
  },
  cityStyle: {
    fontSize: 17,
    padding: 15,
  },
  empty: {},
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
    paddingHorizontal: 30,
    paddingVertical: 20,
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
  buttonDelete: {
    paddingHorizontal: 20,
    marginRight: 20,
    backgroundColor: COLORS.dangerColor,
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
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  unitPrices: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
    zIndex: 10,
  },
  addPrice: {
    alignItems: 'center',
  },
  addBtn: {
    width: '100%',
    marginTop: 20,
  },
  btn: {
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: COLORS.whiteColor,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 5,
  },
  address: {},
  timeInput: {
    color: COLORS.blackColor,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  actionSheetTitle: {
    fontSize: 20,
    color: COLORS.blackColor,
  },

  bottomBtn: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
});
export default styles;
